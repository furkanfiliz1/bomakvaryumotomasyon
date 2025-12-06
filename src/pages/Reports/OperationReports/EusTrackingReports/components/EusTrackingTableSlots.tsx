import { Icon } from '@components';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import type { EusTrackingItem } from '../eus-tracking-reports.types';
import {
  formatCompanyName,
  formatIntegratorCount,
  formatPercentageValue,
  formatReturnedAllowance,
  getStatusColor,
} from '../helpers';

/**
 * Table slot components for EUS Tracking Reports
 * Following OperationPricing OperationPricingTableSlots pattern
 */

interface SupplierSlotProps {
  item: EusTrackingItem;
}

export const SupplierSlot: React.FC<SupplierSlotProps> = ({ item }) => (
  <Box>
    <Typography variant="body2" fontWeight="medium">
      {formatCompanyName(item.companyName)}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {item.companyIdentifier}
    </Typography>
  </Box>
);

interface StatusValueSlotProps {
  value: number;
  status: number;
  showPercentage?: boolean;
}

export const StatusValueSlot: React.FC<StatusValueSlotProps> = ({ value, status, showPercentage = true }) => (
  <Typography variant="body2" sx={{ color: getStatusColor(status) }}>
    {showPercentage ? '%' : ''}
    {formatPercentageValue(value)}
  </Typography>
);

interface ReturnedAllowanceSlotProps {
  item: EusTrackingItem;
}

export const ReturnedAllowanceSlot: React.FC<ReturnedAllowanceSlotProps> = ({ item }) => (
  <Typography variant="body2" sx={{ color: getStatusColor(item.senderAndReceiverReturnedAllowanceStatus) }}>
    {formatReturnedAllowance(item.senderAndReceiverReturnedAllowance)}
  </Typography>
);

interface IntegratorSlotProps {
  item: EusTrackingItem;
}

export const IntegratorSlot: React.FC<IntegratorSlotProps> = ({ item }) => (
  <Typography variant="body2" sx={{ color: getStatusColor(item.companyIntegratorConnectionStatus) }}>
    {formatIntegratorCount(item.companyIntegratorCount)}
  </Typography>
);

interface DetailButtonSlotProps {
  item: EusTrackingItem;
  onDetailClick: (item: EusTrackingItem) => void;
}

export const DetailButtonSlot: React.FC<DetailButtonSlotProps> = ({ item, onDetailClick }) => (
  <Button variant="outlined" size="small" startIcon={<Icon icon="eye" size={16} />} onClick={() => onDetailClick(item)}>
    Detay
  </Button>
);

// Main table slots export object following OperationPricing pattern
export const EusTrackingTableSlots = {
  SupplierSlot,
  StatusValueSlot,
  ReturnedAllowanceSlot,
  IntegratorSlot,
  DetailButtonSlot,
};
