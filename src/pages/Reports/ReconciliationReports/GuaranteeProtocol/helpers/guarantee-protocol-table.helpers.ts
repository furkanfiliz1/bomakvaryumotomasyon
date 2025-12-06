import { HeadCell } from 'src/components/common/Table/types';

/**
 * Table configuration for Guarantee Protocol report
 * Following OperationPricing patterns exactly
 * Columns ordered exactly as in legacy project: Tedarikçi Ünvan, Tedarikçi VKN, Alıcı Ünvan, Alıcı VKN, Tarih, Fatura Sayısı, Azami Garanti Tutarı, Döküman İndir
 */
export const getGuaranteeProtocolTableColumns = (): HeadCell[] => [
  {
    id: 'SenderCompanyName',
    label: 'Tedarikçi Ünvan',
    width: 200,
  },
  {
    id: 'SenderIdentifier',
    label: 'Tedarikçi VKN',
    width: 140,
  },
  {
    id: 'FinancerCompanyName',
    label: 'Alıcı Ünvan',
    width: 200,
  },
  {
    id: 'FinancerIdentifier',
    label: 'Alıcı VKN',
    width: 140,
  },
  {
    id: 'FormattedDate',
    label: 'Tarih',
    width: 120,
  },
  {
    id: 'TotalInvoiceCount',
    label: 'Fatura Sayısı',
    width: 120,
  },
  {
    id: 'TotalSystemAmount',
    label: 'Azami Garanti Tutarı',
    width: 160,
    type: 'currency',
  },
  {
    id: 'downloadAction',
    label: 'Döküman İndir',
    width: 140,
    slot: true,
    isSortDisabled: true,
  },
];

/**
 * Format date for display
 * Matches legacy moment formatting: DD-MM-YYYY
 */
export const formatDisplayDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString; // Fallback to original string if parsing fails
  }
};

/**
 * Format date for API requests
 * Matches legacy moment formatting: YYYY-MM-DD
 */
export const formatApiDate = (date: Date): string => {
  try {
    return date.toISOString().split('T')[0];
  } catch {
    return ''; // Return empty string if date is invalid
  }
};

/**
 * Generate filename for PDF download
 * Following legacy pattern: {SenderIdentifier}_{FinancerIdentifier}_{Date}.pdf
 */
export const generatePdfFilename = (senderIdentifier: string, financerIdentifier: string, date: string): string => {
  const formattedDate = formatApiDate(new Date(date));
  return `${senderIdentifier}_${financerIdentifier}_${formattedDate}.pdf`;
};
