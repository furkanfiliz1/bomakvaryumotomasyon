import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers for Company Codes
 * Follows OperationPricing pattern with proper type definitions
 */
export function getCompanyCodesTableHeaders(isBuyer: boolean, isFinancier: boolean): HeadCell[] {
  const baseHeaders: HeadCell[] = [
    { id: 'SenderCompanyName', label: 'Firma Ünvan', width: 200 },
    { id: 'ReceiverIdentifier', label: 'Tanımlayan VKN', width: 150 },
    { id: 'SenderIdentifier', label: 'Firma VKN', width: 150 },
    { id: 'Code', label: 'Kod', width: 120 },
  ];

  if (isBuyer) {
    baseHeaders.push({ id: 'FinancerCompanyName', label: 'Finansör Şirket', width: 180 });
  }

  if (isFinancier) {
    baseHeaders.push({ id: 'CurrencyCode', label: 'Para Birimi', width: 120 });
  }

  baseHeaders.push({ id: 'actions', label: 'İşlemler', width: 120, slot: true, isSortDisabled: true });

  return baseHeaders;
}
