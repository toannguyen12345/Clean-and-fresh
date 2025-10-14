export const formatCurrency = (
  amount: number,
  locale = 'vi-VN',
  currency = 'VND',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (value: number, locale = 'vi-VN'): string => {
  return value.toLocaleString(locale);
};
