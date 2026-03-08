//src/utils/formatCurrency
export const formatCurrency = (amount, currency = 'PKR') =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency }).format(amount)
