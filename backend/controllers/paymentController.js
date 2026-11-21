const Stripe = require('stripe');
const Razorpay = require('razorpay');
const { createHmac, randomInt, timingSafeEqual } = require('crypto');
const Order = require('../models/Order');
const PaymentAttempt = require('../models/PaymentAttempt');
const { createCartQuote } = require('../services/cartPricing');
const { getLatestUsdToInrRate, convertUsdToInrMinorUnits } = require('../services/currencyConversion');
const { getPaymentErrorMessage, getPaymentErrorStatus } = require('../services/paymentError');

const CURRENCY = 'USD';
const STRIPE_API_VERSION = '2026-11-18.endive';
const INTEGRATION_IDENTIFIER = 'custom_embedded_web_0001';

const normalizeAddress = (address) => {
  const fields = ['fullName', 'email', 'street', 'city', 'state', 'postalCode', 'country', 'phone'];
  const normalized = {};
  for (const field of fields) {
    normalized[field] = typeof address?.[field] === 'string' ? address[field].trim() : '';
  }
  if (Object.values(normalized).some((value) => !value)) {
    const error = new Error('Complete the shipping address before placing your order.');
    error.statusCode = 400;
    throw error;
  }
  return normalized;
};

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error('Stripe is not configured.');
    error.statusCode = 503;
    throw error;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION });
};

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error('Razorpay is not configured.');
    error.statusCode = 503;
    error.publicMessage = 'Razorpay is not configured. Set its key ID and secret in backend/.env, then restart the backend.';
    throw error;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

const getExpectedRazorpayPayment = (attempt) => ({
  amount: attempt.paymentAmountMinor ?? Math.round(attempt.totalAmount * 100),
  currency: attempt.paymentCurrency || attempt.currency
});

const createIntegrationIdentifier = () => {
  const suffix = Array.from({ length: 8 }, () => String.fromCharCode(97 + randomInt(26))).join('');
  return `${INTEGRATION_IDENTIFIER}${suffix}`;
};

const savePaidOrder = async ({ attempt, paymentId, provider }) => {
  const existingOrder = await Order.findOne({ paymentId });
  if (existingOrder) {
    attempt.status = 'completed';
    attempt.orderId = existingOrder._id;
    await attempt.save();
    return existingOrder;
  }

  let order;
  try {
    order = await Order.create({
      userId: attempt.userId,
      items: attempt.items,
      totalAmount: attempt.totalAmount,
      currency: attempt.currency,
      paymentAmountMinor: attempt.paymentAmountMinor,
      paymentCurrency: attempt.paymentCurrency,
      exchangeRate: attempt.exchangeRate,
      exchangeRateDate: attempt.exchangeRateDate,
      address: attempt.address,
      paymentId,
      paymentProvider: provider
    });
  } catch (error) {
    if (error.code !== 11000) throw error;
    order = await Order.findOne({ paymentId });
    if (!order) throw error;
  }
  attempt.status = 'completed';
  attempt.orderId = order._id;
  await attempt.save();
  return order;
};

const sendError = (res, error, fallbackMessage) => {
  const statusCode = getPaymentErrorStatus(error);
  const errorMessage = getPaymentErrorMessage(error);
  console.error(`Payment operation failed: ${errorMessage}`);
  return res.status(statusCode).json({
    message: error.publicMessage || (
      statusCode < 500 ? errorMessage : fallbackMessage
    )
  });
};

const createStripeCheckoutSession = async (req, res) => {
  try {
    const quote = await createCartQuote(req.body.items, CURRENCY);
    if (quote.totalAmount <= 0) {
      const error = new Error('Stripe cannot process a zero-value order.');
      error.statusCode = 400;
      throw error;
    }

    const address = normalizeAddress(req.body.address);
    const stripe = getStripeClient();
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      submit_type: 'auto',
      integration_identifier: createIntegrationIdentifier(),
      line_items: [{
        price_data: {
          currency: CURRENCY.toLowerCase(),
          product_data: { name: 'Aviora order' },
          unit_amount: Math.round(quote.totalAmount * 100)
        },
        quantity: 1
      }],
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout?payment=cancelled`,
      client_reference_id: String(req.user._id),
      ...(req.user.email ? { customer_email: req.user.email } : {}),
      metadata: { userId: String(req.user._id) }
    });

    if (!session.id || !session.url) {
      throw new Error('Stripe did not return a Checkout Session URL.');
    }

    await PaymentAttempt.create({
      userId: req.user._id,
      provider: 'stripe',
      providerOrderId: session.id,
      items: quote.items,
      totalAmount: quote.totalAmount,
      currency: CURRENCY,
      address
    });

    return res.status(201).json({ url: session.url });
  } catch (error) {
    return sendError(res, error, 'Unable to initialize Stripe Checkout.');
  }
};

const createCodOrder = async (req, res) => {
  try {
    const quote = await createCartQuote(req.body.items, CURRENCY);
    const order = await Order.create({
      userId: req.user._id,
      items: quote.items,
      totalAmount: quote.totalAmount,
      currency: quote.currency,
      address: normalizeAddress(req.body.address),
      paymentProvider: 'cod'
    });

    return res.status(201).json({
      message: 'Order placed. Please pay cash on delivery.',
      order
    });
  } catch (error) {
    console.error(`COD order creation failed: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode && error.statusCode < 500
        ? error.message
        : 'Unable to place your COD order.'
    });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const quote = await createCartQuote(req.body.items, CURRENCY);
    if (quote.totalAmount <= 0) {
      const error = new Error('Razorpay cannot process a zero-value order.');
      error.statusCode = 400;
      throw error;
    }

    const address = normalizeAddress(req.body.address);
    const razorpay = getRazorpayClient();
    const exchange = await getLatestUsdToInrRate();
    const paymentAmountMinor = convertUsdToInrMinorUnits(quote.totalAmount, exchange.rate);
    if (paymentAmountMinor < 100) {
      const error = new Error('The converted Razorpay amount must be at least INR 1.00.');
      error.statusCode = 400;
      throw error;
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: paymentAmountMinor,
      currency: 'INR',
      receipt: `avio_${Date.now()}_${randomInt(1000000)}`,
      notes: { userId: String(req.user._id) }
    });

    await PaymentAttempt.create({
      userId: req.user._id,
      provider: 'razorpay',
      providerOrderId: razorpayOrder.id,
      items: quote.items,
      totalAmount: quote.totalAmount,
      currency: quote.currency,
      paymentAmountMinor,
      paymentCurrency: 'INR',
      exchangeRate: exchange.rate,
      exchangeRateDate: exchange.date,
      address
    });

    return res.status(201).json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      exchangeRate: exchange.rate,
      exchangeRateDate: exchange.date
    });
  } catch (error) {
    return sendError(res, error, 'Unable to initialize Razorpay Checkout.');
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
    if (
      typeof orderId !== 'string'
      || orderId.length > 255
      || typeof paymentId !== 'string'
      || paymentId.length > 255
      || typeof signature !== 'string'
      || !/^[a-f0-9]{64}$/i.test(signature)
    ) {
      return res.status(400).json({ message: 'Invalid Razorpay payment details.' });
    }

    const attempt = await PaymentAttempt.findOne({
      provider: 'razorpay',
      providerOrderId: orderId,
      userId: req.user._id
    });
    if (!attempt) return res.status(404).json({ message: 'Payment attempt not found.' });
    if (attempt.status === 'completed') {
      const order = await Order.findById(attempt.orderId);
      if (!order) throw new Error('Completed payment has no associated order.');
      return res.json(order);
    }

    const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest();
    if (!timingSafeEqual(expectedSignature, Buffer.from(signature, 'hex'))) {
      return res.status(400).json({ message: 'Razorpay payment signature is invalid.' });
    }

    const razorpay = getRazorpayClient();
    const expectedPayment = getExpectedRazorpayPayment(attempt);
    let payment = await razorpay.payments.fetch(paymentId);
    if (
      payment.order_id !== orderId
      || payment.amount !== expectedPayment.amount
      || payment.currency !== expectedPayment.currency
    ) {
      return res.status(400).json({ message: 'Razorpay payment does not match the order.' });
    }
    if (payment.status === 'authorized') {
      payment = await razorpay.payments.capture(paymentId, payment.amount, payment.currency);
    }
    if (payment.status !== 'captured') {
      return res.status(400).json({ message: 'Razorpay payment has not been captured.' });
    }

    const order = await savePaidOrder({ attempt, paymentId, provider: 'razorpay' });
    return res.status(201).json(order);
  } catch (error) {
    return sendError(res, error, 'Unable to verify Razorpay payment.');
  }
};

const verifyStripeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (typeof sessionId !== 'string' || !/^cs_(test|live)_/.test(sessionId) || sessionId.length > 255) {
      return res.status(400).json({ message: 'Invalid Stripe Checkout session ID.' });
    }

    const attempt = await PaymentAttempt.findOne({
      provider: 'stripe',
      providerOrderId: sessionId,
      userId: req.user._id
    });
    if (!attempt) return res.status(404).json({ message: 'Payment attempt not found.' });
    if (attempt.status === 'completed') {
      const order = await Order.findById(attempt.orderId);
      if (!order) throw new Error('Completed payment has no associated order.');
      return res.json(order);
    }

    const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
    if (
      session.id !== sessionId
      || session.mode !== 'payment'
      || session.status !== 'complete'
      || session.payment_status !== 'paid'
      || session.client_reference_id !== String(req.user._id)
      || session.metadata?.userId !== String(req.user._id)
      || session.currency !== CURRENCY.toLowerCase()
      || session.amount_total !== Math.round(attempt.totalAmount * 100)
    ) {
      return res.status(400).json({ message: 'Stripe payment is not completed or does not match the order.' });
    }

    const paymentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;
    if (!paymentId) {
      return res.status(400).json({ message: 'Stripe payment intent was not found.' });
    }

    const order = await savePaidOrder({ attempt, paymentId, provider: 'stripe' });
    return res.status(201).json(order);
  } catch (error) {
    return sendError(res, error, 'Unable to verify Stripe payment.');
  }
};

const verifyWebhookSignature = (rawBody, signature, secret) => {
  if (!secret || !Buffer.isBuffer(rawBody) || typeof signature !== 'string') return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest();
  const actual = Buffer.from(signature, 'hex');
  return actual.length === expected.length && timingSafeEqual(expected, actual);
};

const handleStripeWebhook = async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return res.sendStatus(503);

  let event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`Stripe webhook signature verification failed: ${error.message}`);
    return res.sendStatus(error.statusCode === 503 ? 503 : 400);
  }

  try {
    if (
      event.type === 'checkout.session.completed'
      || event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object;
      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId;
        if (!userId || session.client_reference_id !== userId) {
          throw new Error('Stripe webhook session has no valid user reference.');
        }
        const attempt = await PaymentAttempt.findOne({
          provider: 'stripe',
          providerOrderId: session.id,
          userId
        });
        if (!attempt) throw new Error('Stripe payment attempt was not found for the completed session.');

        const paymentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;
        if (
          !paymentId
          || session.client_reference_id !== String(attempt.userId)
          || session.currency !== attempt.currency.toLowerCase()
          || session.amount_total !== Math.round(attempt.totalAmount * 100)
        ) {
          throw new Error('Stripe webhook payment does not match its payment attempt.');
        }
        await savePaidOrder({ attempt, paymentId, provider: 'stripe' });
      }
    } else if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (!userId || session.client_reference_id !== userId) {
        throw new Error('Stripe webhook session has no valid user reference.');
      }
      const attempt = await PaymentAttempt.findOne({
        provider: 'stripe',
        providerOrderId: session.id,
        userId
      });
      if (!attempt) throw new Error('Stripe payment attempt was not found for the failed session.');
      if (attempt.status !== 'completed') {
        attempt.status = 'failed';
        await attempt.save();
      }
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error(`Stripe webhook processing failed: ${error.message}`);
    return res.sendStatus(500);
  }
};

const handleRazorpayWebhook = async (req, res) => {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return res.sendStatus(503);

  if (!verifyWebhookSignature(
    req.body,
    req.headers['x-razorpay-signature'],
    process.env.RAZORPAY_WEBHOOK_SECRET
  )) {
    return res.sendStatus(400);
  }

  let event;
  try {
    event = JSON.parse(req.body.toString('utf8'));
  } catch (error) {
    console.error(`Razorpay webhook payload was invalid: ${error.message}`);
    return res.sendStatus(400);
  }

  try {
    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      const attempt = await PaymentAttempt.findOne({
        provider: 'razorpay',
        providerOrderId: payment?.order_id
      });
      if (!attempt) throw new Error('Razorpay payment attempt was not found for the captured payment.');
      const expectedPayment = getExpectedRazorpayPayment(attempt);
      if (
        payment.status !== 'captured'
        || payment.amount !== expectedPayment.amount
        || payment.currency !== expectedPayment.currency
      ) {
        throw new Error('Razorpay webhook payment does not match its payment attempt.');
      }
      await savePaidOrder({ attempt, paymentId: payment.id, provider: 'razorpay' });
    } else if (event.event === 'payment.failed') {
      const payment = event.payload?.payment?.entity;
      const attempt = await PaymentAttempt.findOne({
        provider: 'razorpay',
        providerOrderId: payment?.order_id
      });
      if (!attempt) throw new Error('Razorpay payment attempt was not found for the failed payment.');
      if (attempt.status !== 'completed') {
        attempt.status = 'failed';
        await attempt.save();
      }
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error(`Razorpay webhook processing failed: ${error.message}`);
    return res.sendStatus(500);
  }
};

module.exports = {
  createStripeCheckoutSession,
  createCodOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  verifyStripeSession,
  handleStripeWebhook,
  handleRazorpayWebhook
};
