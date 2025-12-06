import React from 'react';
import { Chip, Button, Typography, Stack } from '@mui/material';
import { getTransferStatusBadgeProps, getRefundStatusBadgeProps } from '../helpers';
import type { InvoiceTransactionItem } from '../invoice-transaction.types';

interface InvoiceTransactionTableSlotsProps {
  row: InvoiceTransactionItem;
  column: { id: string };
  onReturnInvoiceClick: (item: InvoiceTransactionItem) => void;
}

/**
 * Table slots for Invoice Transaction table
 * Handles custom rendering for specific columns like status badges and actions
 */
export const InvoiceTransactionTableSlots: React.FC<InvoiceTransactionTableSlotsProps> = ({
  row,
  column,
  onReturnInvoiceClick,
}) => {
  const handleReturnClick = () => {
    onReturnInvoiceClick(row);
  };

  switch (column.id) {
    case 'ReceiverCompanyName': {
      const { color, label } = getRefundStatusBadgeProps(row.ReturnInvoiceNumber);
      return <Chip label={label} color={color} size="small" variant="outlined" />;
    }

    case 'Status': {
      const { color, label } = getRefundStatusBadgeProps(row.ReturnInvoiceNumber);
      return <Chip label={label} color={color} size="small" variant="outlined" />;
    }

    case 'TransferStatus': {
      const { color, label } = getTransferStatusBadgeProps(row.Status);
      return (
        <Stack spacing={1}>
          <Chip label={label} color={color} size="small" variant="outlined" />
          {row.Status === 3 && row.ErrorMessage && (
            <Typography
              variant="caption"
              color="error"
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => navigator.clipboard.writeText(row.ErrorMessage!)}
              title={row.ErrorMessage}>
              Hata Mesajı
            </Typography>
          )}
        </Stack>
      );
    }

    case 'actions': {
      return (
        <Button variant="outlined" color="primary" size="small" onClick={handleReturnClick}>
          İade
        </Button>
      );
    }

    default:
      return null;
  }
};
