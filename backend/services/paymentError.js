const getPaymentErrorMessage = (error) => {
  const message = error?.message || error?.error?.description || error?.error?.error?.description;
  return typeof message === 'string' && message.trim()
    ? message.trim()
    : 'Unknown payment operation error.';
};

const getPaymentErrorStatus = (error) => (
  Number.isInteger(error?.statusCode) && error.statusCode >= 400 && error.statusCode <= 599
    ? error.statusCode
    : 500
);

module.exports = { getPaymentErrorMessage, getPaymentErrorStatus };
