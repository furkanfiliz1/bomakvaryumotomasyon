import type { HeadCell } from 'src/components/common/Table/types';
import type { EusTrackingItem } from '../eus-tracking-reports.types';

/**
 * Table configuration helpers for EUS Tracking Reports
 * Following OperationPricing patterns for table setup
 */

/**
 * Generate table headers matching legacy implementation exactly
 * NOTE: All columns use custom slots, so slot: true is required for all
 */
export const getEusTrackingTableHeaders = (): HeadCell[] => [
  {
    id: 'supplier',
    label: 'Tedarikçi',
    isSortDisabled: true,
    slot: true, // Custom slot for company name + identifier
  },
  {
    id: 'totalPaymentMonthlyDecreaseRatio',
    label: 'Toplam Fatura Tutarında Düşüş',
    isSortDisabled: true,
    slot: true, // Custom slot for status-colored values
  },
  {
    id: 'totalPaymentThreeMonthlyDecreaseRatio',
    label: 'Son Dönem Fatura Tutarındaki Düşüş',
    isSortDisabled: true,
    slot: true, // Custom slot for status-colored values
  },
  {
    id: 'invoiceMonthlyIncreaseRatio',
    label: 'Fatura Tutar Büyüklüğünde Artış',
    isSortDisabled: true,
    slot: true, // Custom slot for status-colored values
  },
  {
    id: 'invoiceThreeMonthlyIncreaseRatio',
    label: 'Son Dönem Fatura Tutar Büyüklüğünde Artış',
    isSortDisabled: true,
    slot: true, // Custom slot for status-colored values
  },
  {
    id: 'senderAndReceiverRelation',
    label: 'Karşılıklı Ticaret Oranı',
    isSortDisabled: true,
    slot: true, // Custom slot for status-colored values
  },
  {
    id: 'senderAndReceiverReturnedAllowance',
    label: 'İskonto Edilen Faturanın İadesi',
    isSortDisabled: true,
    slot: true, // Custom slot for returned allowance formatting
  },
  {
    id: 'companyIntegratorCount',
    label: 'Entegratör Kesintisi',
    isSortDisabled: true,
    slot: true, // Custom slot for integrator count formatting
  },
];

/**
 * Extract display data for table rows - helper for consistent data formatting
 */
export const extractTableRowData = (item: EusTrackingItem) => ({
  // Company info
  companyName: item.companyName || '-',
  companyIdentifier: item.companyIdentifier || '-',

  // Ratio values with their status colors
  ratioData: [
    {
      value: item.totalPaymentMonthlyDecreaseRatio,
      status: item.totalPaymentMonthlyDecreaseStatus,
      field: 'totalPaymentMonthlyDecrease',
    },
    {
      value: item.totalPaymentThreeMonthlyDecreaseRatio,
      status: item.totalPaymentThreeMonthlyDecreaseStatus,
      field: 'totalPaymentThreeMonthlyDecrease',
    },
    {
      value: item.invoiceMonthlyIncreaseRatio,
      status: item.invoiceMonthlyIncreaseStatus,
      field: 'invoiceMonthlyIncrease',
    },
    {
      value: item.invoiceThreeMonthlyIncreaseRatio,
      status: item.invoiceThreeMonthlyIncreaseStatus,
      field: 'invoiceThreeMonthlyIncrease',
    },
    {
      value: item.senderAndReceiverRelation,
      status: item.senderAndReceiverRelationStatus,
      field: 'senderAndReceiverRelation',
    },
  ],

  // Special display fields
  returnedAllowance: {
    value: item.senderAndReceiverReturnedAllowance,
    status: item.senderAndReceiverReturnedAllowanceStatus,
  },

  integratorConnection: {
    count: item.companyIntegratorCount,
    status: item.companyIntegratorConnectionStatus,
  },
});

/**
 * Generate table configuration following OperationPricing patterns
 */
export const getEusTrackingTableConfig = () => ({
  rowId: 'companyIdentifier' as keyof EusTrackingItem,
  headers: getEusTrackingTableHeaders(),
  disableSorting: true, // Legacy doesn't support sorting
  pagingConfig: {
    defaultPageSize: 50,
    pageSizeOptions: [50], // Legacy only supports 50 items per page
  },
});
