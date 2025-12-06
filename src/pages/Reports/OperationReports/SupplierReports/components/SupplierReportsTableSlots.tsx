import { Chip } from '@mui/material';
import React from 'react';

/**
 * Table slot components for Supplier Reports table
 * Matching legacy Tedarikçi Raporları functionality exactly
 */

interface IsActiveSlotProps {
  isActive: boolean;
}

export const IsActiveSlot: React.FC<IsActiveSlotProps> = ({ isActive }) => {
  return (
    <Chip
      label={isActive ? 'Aktif' : 'Pasif'}
      color={isActive ? 'success' : 'default'}
      size="small"
      variant="outlined"
    />
  );
};

/**
 * Namespace export for organized slot access
 */
export const SupplierReportsTableSlots = {
  IsActiveSlot,
};
