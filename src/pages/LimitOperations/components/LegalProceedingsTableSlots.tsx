import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

/**
 * Table slot components for Legal Proceedings table
 * Following OperationPricing slot pattern
 */

interface CollapseToggleSlotProps {
  isCollapseOpen?: boolean;
  toggleCollapse?: () => void;
}

export const CollapseToggleSlot: React.FC<CollapseToggleSlotProps> = ({ isCollapseOpen, toggleCollapse }) => {
  return (
    <Tooltip title={isCollapseOpen ? 'Detayları Gizle' : 'Detayları Göster'}>
      <IconButton size="small" onClick={toggleCollapse} color="primary">
        {isCollapseOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

/**
 * Namespace export for organized slot access
 * Following OperationPricing pattern
 */
export const LegalProceedingsTableSlots = {
  CollapseToggleSlot,
};
