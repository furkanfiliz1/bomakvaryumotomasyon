import { Button, Chip } from '@mui/material';
import React from 'react';
import type { ScoreReportCompany } from '../score-reports.types';

/**
 * Table slot components for Score Reports table
 * Following OperationPricing slot pattern with legacy parity
 */

// Integrator Status Slot (IsActive column)
interface IntegratorStatusSlotProps {
  isActive: boolean;
}

export const IntegratorStatusSlot: React.FC<IntegratorStatusSlotProps> = ({ isActive }) => {
  return (
    <Chip label={isActive ? 'Aktif' : 'Pasif'} color={isActive ? 'success' : 'error'} size="small" variant="outlined" />
  );
};

// Transfer Status Slot (Config.IsActive column)
interface StatusSlotProps {
  status: number;
  statusDescription?: string;
}

export const StatusSlot: React.FC<StatusSlotProps> = ({ status, statusDescription }) => {
  // Status color mapping matching legacy behavior
  const getStatusColor = (
    status: number,
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 1:
        return 'success'; // Active/Success
      case 2:
        return 'warning'; // Pending
      case 3:
        return 'error'; // Error/Failed
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={statusDescription ?? `Status ${status}`}
      color={getStatusColor(status)}
      size="small"
      variant="outlined"
    />
  );
};

// Actions Slot (Details/History button)
interface ActionsSlotProps {
  item: ScoreReportCompany;
  onDownload: (item: ScoreReportCompany) => void;
}

export const ActionsSlot: React.FC<ActionsSlotProps> = ({ item, onDownload }) => {
  return (
    <Button size="small" onClick={() => onDownload(item)} variant="outlined" color="primary">
      Geçmiş
    </Button>
  );
};
