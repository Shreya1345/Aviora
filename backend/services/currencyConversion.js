const RATE_URL = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR';
const RATE_TIMEOUT_MS = 5000;

const getLatestUsdToInrRate = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RATE_TIMEOUT_MS);

  try {
    const response = await fetch(RATE_URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Exchange-rate service returned HTTP ${response.status}.`);
    }

    const data = await response.json();
    const rate = data?.rates?.INR;
    if (
      data?.base !== 'USD'
      || !/^\d{4}-\d{2}-\d{2}$/.test(data.date || '')
      || !Number.isFinite(rate)
      || rate <= 0
    ) {
      throw new Error('Exchange-rate service returned an invalid USD-to-INR rate.');
    }

    return { rate, date: data.date };
  } catch (error) {
    const rateError = new Error(`Unable to retrieve the latest USD-to-INR rate: ${error.message}`);
    rateError.statusCode = 503;
    rateError.publicMessage = 'The current USD-to-INR rate is unavailable. Please try again shortly.';
    throw rateError;
  } finally {
    clearTimeout(timeout);
  }
};

const convertUsdToInrMinorUnits = (usdAmount, rate) => {
  if (!Number.isFinite(usdAmount) || usdAmount <= 0 || !Number.isFinite(rate) || rate <= 0) {
    throw new Error('A positive USD amount and exchange rate are required.');
  }

  const usdMinorUnits = Math.round((usdAmount + Number.EPSILON) * 100);
  const inrMinorUnits = Math.round(usdMinorUnits * rate);
  if (!Number.isSafeInteger(inrMinorUnits)) {
    throw new Error('The converted INR amount is outside the supported range.');
  }
  return inrMinorUnits;
};

module.exports = { getLatestUsdToInrRate, convertUsdToInrMinorUnits };
