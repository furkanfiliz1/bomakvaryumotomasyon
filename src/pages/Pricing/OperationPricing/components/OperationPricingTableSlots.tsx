import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, Chip, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { getStatusBadgeProps } from '../helpers';
import type { OperationPricingItem } from '../operation-pricing.types';

/**
 * Table slot components for Operation Pricing table
 * Following DiscountOperations slot pattern
 */

interface StatusSlotProps {
  status: number;
  statusDescription?: string;
  refundTypeDescription?: string; // For Status 6 refund cases
  paymentTypeDescription?: string; // For showing payment method like "Kredi Kartı"
}

export const StatusSlot: React.FC<StatusSlotProps> = ({
  status,
  statusDescription,
  refundTypeDescription,
  paymentTypeDescription,
}) => {
  // For Status 6 (refund), combine refund label with refund type description like legacy system
  let finalStatusDescription = statusDescription;
  if (status === 6 && refundTypeDescription) {
    finalStatusDescription = `İade - ${refundTypeDescription}`;
  } else if (status === 6 && paymentTypeDescription) {
    // For paid status, show "Ödendi - Payment Method"
    finalStatusDescription = `İade - ${paymentTypeDescription}`;
  } else if (status === 1 && paymentTypeDescription) {
    // For paid status, show "Ödendi - Payment Method"
    finalStatusDescription = `Ödendi - ${paymentTypeDescription}`;
  }

  const badgeProps = getStatusBadgeProps(status, finalStatusDescription);

  return <Chip label={badgeProps.label} color={badgeProps.color} size="small" variant={badgeProps.variant} />;
};

interface ActionsSlotProps {
  item: OperationPricingItem;
  onRefundClick: () => void;
}

export const ActionsSlot: React.FC<ActionsSlotProps> = ({ item, onRefundClick }) => {
  // Following legacy OperationChargeReport logic:
  // - For PaymentProvider === 2 (Craftgate): Show refund when Status === 1 (Paid)
  // - For other providers: Show refund when Status === 1 (Paid)
  // This matches the legacy system behavior exactly
  const canRefund = item.Status === 1; // 1 = Paid status, matching legacy logic

  return (
    <Button variant="outlined" size="small" color="error" onClick={onRefundClick} disabled={!canRefund} sx={{ ml: 1 }}>
      İade
    </Button>
  );
};

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
 */
export const OperationPricingTableSlots = {
  StatusSlot,
  ActionsSlot,
  CollapseToggleSlot,
};
