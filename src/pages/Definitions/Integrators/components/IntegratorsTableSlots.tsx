/**
 * Integrators Table Slots
 * Custom cell renderers for integrators table
 */

import { Chip } from '@mui/material';
import React from 'react';

interface BooleanSlotProps {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

/**
 * Active status slot - shows Aktif/Pasif chip
 */
export const ActiveStatusSlot: React.FC<BooleanSlotProps> = ({ value, trueLabel = 'Aktif', falseLabel = 'Pasif' }) => {
  return (
    <Chip
      label={value ? trueLabel : falseLabel}
      color={value ? 'success' : 'default'}
      size="small"
      variant="outlined"
    />
  );
};

/**
 * Boolean slot - shows Evet/Hayır chip
 */
export const BooleanSlot: React.FC<BooleanSlotProps> = ({ value, trueLabel = 'Evet', falseLabel = 'Hayır' }) => {
  return (
    <Chip label={value ? trueLabel : falseLabel} color={value ? 'info' : 'default'} size="small" variant="outlined" />
  );
};
