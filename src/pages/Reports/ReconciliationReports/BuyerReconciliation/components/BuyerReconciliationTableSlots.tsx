import { Box, Typography } from '@mui/material';
import React from 'react';
import { BuyerReconciliationItem } from '../buyer-reconciliation.types';
import { formatAllowanceDue } from '../helpers';

/**
 * Table slot components for Buyer Reconciliation Report
 * Following OperationPricing and TransactionFeeDiscount slot patterns
 * Only includes custom slots - table handles currency formatting automatically
 */

/**
 * Allowance info slot component - displays AllowanceId and PaymentRequestNumber
 */
export const AllowanceInfoSlot: React.FC<{ row: BuyerReconciliationItem }> = ({ row }) => {
  return (
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {row.AllowanceId}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {row.PaymentRequestNumber || '-'}
      </Typography>
    </Box>
  );
};

/**
 * Allowance due slot component - displays date and day count
 */
export const AllowanceDueSlot: React.FC<{ row: BuyerReconciliationItem }> = ({ row }) => {
  return <Typography variant="body2">{formatAllowanceDue(row.AllowanceDueDate, row.AvarageDueDayCount)}</Typography>;
};
