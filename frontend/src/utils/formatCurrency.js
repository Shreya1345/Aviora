export const formatCurrency = (amount, currency = 'USD') => (
  new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency
  }).format(amount)
);
