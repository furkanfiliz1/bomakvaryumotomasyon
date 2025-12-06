export const currencyFormatter = (value: number | null | undefined = 0, currency: string | null | undefined) => {
  const _formatter = new Intl.NumberFormat('tr-TR', {
    currency: currency || 'TRY',
    style: 'currency',
  });

  const currencyValue = _formatter.format(value || 0);

  return currencyValue;
};

export function getCurrencyPrefix(currency?: string) {
  if (currency === 'TRY') {
    return '₺';
  }
  if (currency === 'USD') {
    return '$';
  }
  if (currency === 'EUR') {
    return '€';
  }
  if (currency === 'GBP') {
    return '£';
  }
  return '₺';
}

export function numberFormatter(value: number | null | undefined = 0) {
  const _formatter = new Intl.NumberFormat('tr-TR');

  const numberValue = _formatter.format(value || 0);

  return numberValue;
}
