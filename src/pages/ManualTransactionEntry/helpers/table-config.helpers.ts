export const getTableHeaders = () => [
  {
    id: 'BillingIdentifier',
    label: 'Fatura Kesilen VKN',
    isSortDisabled: false,
  },
  {
    id: 'FinancialRecordProcessName',
    label: 'İlgili Süreç',
    isSortDisabled: false,
  },
  {
    id: 'IssueDate',
    label: 'İşlem Tarihi',
    isSortDisabled: false,
    type: 'date',
  },
  {
    id: 'TaxFreeAmount',
    label: 'Fatura Tutarı',
    isSortDisabled: false,
    type: 'currency',
  },
  {
    id: 'TotalPaidAmount',
    label: 'Ödenen Fatura Tutarı',
    isSortDisabled: true,
    type: 'currency',
  },
  {
    id: 'CurrencyName',
    label: 'Para Birimi',
    isSortDisabled: true,
  },
  {
    id: 'FinancerName', // Added missing column from legacy
    label: 'Finansör',
    isSortDisabled: false,
  },
  {
    id: 'ReferenceNumber', // Added missing column from legacy
    label: 'İskonto/Kredi No',
    isSortDisabled: false,
    width: 150,
    slot: true,
  },
  {
    id: 'SenderName', // Added missing column from legacy
    label: 'Tedarikçi',
    isSortDisabled: false,
  },
  {
    id: 'SenderIdentifier',
    label: 'Tedarikçi VKN',
    isSortDisabled: false,
  },
  {
    id: 'SenderCustomerManagers',
    label: 'Tedarikçi Müşteri Temsilcisi',
    isSortDisabled: true,
  },
];

export const getExportFilename = (prefix: string) => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  return `${prefix}_${dateStr}.xls`;
};
