export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const rateFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export const energyFormatter = new Intl.NumberFormat('en-Us', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});
