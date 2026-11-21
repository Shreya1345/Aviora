const test = require('node:test');
const assert = require('node:assert/strict');
const { convertUsdToInrMinorUnits } = require('./currencyConversion');

test('converts the USD subtotal into INR paise using the captured rate', () => {
  assert.equal(convertUsdToInrMinorUnits(10.99, 92.68), 101855);
});

test('rejects invalid amounts or exchange rates instead of guessing', () => {
  assert.throws(() => convertUsdToInrMinorUnits(0, 92.68), /positive USD amount/);
  assert.throws(() => convertUsdToInrMinorUnits(10, Number.NaN), /positive USD amount/);
});
