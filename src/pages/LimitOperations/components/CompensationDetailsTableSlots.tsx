import { TextField } from '@mui/material';
import React from 'react';
import { formatCurrency } from '../helpers';
import type { CompensationDetail } from '../limit-operations.types';

/**
 * Table slot components for Compensation Details table
 * Following OperationPricing slot pattern
 */

interface DocumentNumberSlotProps {
  row: CompensationDetail;
  isCheque: boolean;
}

interface CompensationAmountSlotProps {
  row: CompensationDetail;
  onAmountChange: (itemId: number, newAmount: string) => void;
}

/**
 * Document Number Slot - Shows either BillNumber (for cheques) or InvoiceNumber (for invoices)
 */
export const DocumentNumberSlot: React.FC<DocumentNumberSlotProps> = ({ row, isCheque }) => {
  const documentNumber = isCheque ? row.BillNumber : row.InvoiceNumber;
  return <span>{documentNumber || '-'}</span>;
};

/**
 * Compensation Amount Slot - Editable TextField for compensation amount
 */
export const CompensationAmountSlot: React.FC<CompensationAmountSlotProps> = ({ row, onAmountChange }) => {
  return (
    <TextField
      size="small"
      value={formatCurrency(row.CompensationAmount || 0)}
      onChange={(e) => onAmountChange(row.Id, e.target.value)}
      variant="outlined"
      sx={{ minWidth: 180 }}
      inputProps={{
        style: { textAlign: 'right' },
      }}
    />
  );
};

/**
 * Namespace export for organized slot access following OperationPricing pattern
 */
export const CompensationDetailsTableSlots = {
  DocumentNumberSlot,
  CompensationAmountSlot,
};
