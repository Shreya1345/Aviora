const test = require('node:test');
const assert = require('node:assert/strict');
const { getPaymentErrorMessage, getPaymentErrorStatus } = require('./paymentError');

test('extracts Razorpay SDK error descriptions from its plain-object shape', () => {
  const error = {
    statusCode: 400,
    error: {
      code: 'BAD_REQUEST_ERROR',
      description: 'The currency is not supported.'
    }
  };

  assert.equal(getPaymentErrorStatus(error), 400);
  assert.equal(getPaymentErrorMessage(error), 'The currency is not supported.');
});

test('uses standard Error messages and safely defaults invalid status codes', () => {
  assert.equal(getPaymentErrorMessage(new Error('Payment provider unavailable.')), 'Payment provider unavailable.');
  assert.equal(getPaymentErrorStatus({ statusCode: 700 }), 500);
  assert.equal(getPaymentErrorMessage({}), 'Unknown payment operation error.');
});
