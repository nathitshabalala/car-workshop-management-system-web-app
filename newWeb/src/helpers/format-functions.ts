export const currencyFormat = (
  amount: number | bigint,
  options: Intl.NumberFormatOptions = {},
): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'zar',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    useGrouping: true,
    notation: 'standard',
    ...options,
  }).format(amount);
};