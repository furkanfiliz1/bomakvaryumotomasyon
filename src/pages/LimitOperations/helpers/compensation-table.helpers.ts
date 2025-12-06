import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Table configuration helpers for Compensation Details Table
 * Following OperationPricing table helpers pattern exactly
 */

/**
 * Generate table headers for compensation details table
 * Headers are dynamic based on whether it's a cheque or invoice
 */
export const getCompensationDetailsTableHeaders = (isCheque: boolean): HeadCell[] => [
  {
    id: 'documentNumber',
    label: isCheque ? 'Çek No' : 'Fatura No',
    width: 150,
    slot: true, // Custom slot for document number
  },
  {
    id: 'AllowanceId',
    label: 'İskonto No',
    width: 120,
  },
  {
    id: 'AllowanceAmount',
    label: isCheque ? 'Çek Tutarı' : 'Fatura Tutarı',
    width: 140,
    type: 'currency',
  },
  {
    id: 'AllowanceDate',
    label: 'İskonto Tarihi',
    width: 130,
    type: 'date',
  },
  {
    id: 'AllowanceDueDate',
    label: isCheque ? 'Çek Vade Tarihi' : 'Fatura Vade Tarihi',
    width: 150,
    type: 'date',
  },
  {
    id: 'CompensationAmount',
    label: 'Tazmin Tutarı',
    width: 180,
    slot: true, // Custom slot for editable amount field
  },
];
