import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React from 'react';
import type { CompensationTransactionItem } from '../compensation-transactions.types';

interface CompensationTransactionsTableSlotsProps {
  row: CompensationTransactionItem;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

/**
 * Actions slot component for compensation transactions table
 * Following the OperationPricing table slots pattern
 */
export const ActionsSlot: React.FC<CompensationTransactionsTableSlotsProps> = ({ row, onEdit, onDelete }) => {
  return (
    <Box display="flex" gap={1}>
      <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => onEdit?.(row.Id)}>
        Düzenle
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => {
          console.log('row.www', row.Id);
          onDelete?.(row.Id);
        }}>
        Sil
      </Button>
    </Box>
  );
};

/**
 * Namespace export for organized slot access following OperationPricing pattern
 */
export const CompensationTransactionsTableSlots = {
  ActionsSlot,
};
