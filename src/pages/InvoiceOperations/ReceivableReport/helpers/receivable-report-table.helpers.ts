import type { HeadCell } from 'src/components/common/Table/types';
import type { ReceivableReportItem } from '../receivable-report.types';

// Table column headers configuration
export const receivableReportTableHeaders: HeadCell[] = [
  {
    id: 'OrderNo',
    label: 'Alacak No',
  },
  {
    id: 'ReceiverName',
    label: 'Alıcı',
    slot: true,
  },
  {
    id: 'SenderName',
    label: 'Tedarikçi',
    slot: true,
  },
  {
    id: 'PayableAmount',
    label: 'Alacak Tutar',
    type: 'currency',
  },
  {
    id: 'CreatedAt',
    label: 'Yüklenme Tarihi',
    type: 'date',
  },
  {
    id: 'IssueDate',
    label: 'Oluşturma Tarihi',
    type: 'date',
  },
  {
    id: 'PaymentDueDate',
    label: 'Vade Tarihi',
    type: 'date',
  },
  {
    id: 'FinancerCompanyName',
    label: 'Finansör',
  },

  {
    id: 'Actions',
    label: 'İşlemler',
    slot: true,
  },
];

// Helper function to get status chip color
export const getStatusChipColor = (status: number | null): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 1:
      return 'success'; // Suitable
    case 0:
      return 'warning'; // Used
    default:
      return 'default';
  }
};

// Helper function to format currency (simple format for now)
export const formatCurrencyAmount = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Helper function to format date (simple format for now)
export const formatDateValue = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  } catch {
    return '-';
  }
};

// Helper function to format receivable data for display
export const formatReceivableReportData = (item: ReceivableReportItem) => ({
  ...item,
  // Format currency amounts
  formattedPayableAmount: formatCurrencyAmount(item.PayableAmount),
  formattedApprovedPayableAmount: formatCurrencyAmount(item.ApprovedPayableAmount),

  // Format dates
  formattedPaymentDueDate: formatDateValue(item.PaymentDueDate),
  formattedIssueDate: formatDateValue(item.IssueDate),
  formattedCreatedAt: formatDateValue(item.CreatedAt),

  // Status description or default
  statusDisplay: item.AllowanceStatusDesc || '-',
});

// Export helper function
export const downloadReceivableReportExcel = (base64Data: string) => {
  const fileInitial = 'alacak_raporlari';
  const fileDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const fileName = `${fileInitial}_${fileDate}.xls`;

  // Create blob and download
  const blob = new Blob([atob(base64Data)], { type: 'application/vnd.ms-excel' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};
