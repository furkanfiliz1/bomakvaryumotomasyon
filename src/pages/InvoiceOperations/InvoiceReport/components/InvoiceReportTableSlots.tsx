import { Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import {
  formatCurrency,
  formatDate,
  getInvoiceStatusDisplay,
  getInvoiceTypeDisplay,
  getProfileTypeDisplay,
  getUsageStatusDisplay,
  safeDisplay,
} from '../helpers/invoice-report.helpers';
import type { InvoiceItem } from '../invoice-report.types';

/**
 * Table slot components for InvoiceReport
 * Following OperationPricing TableSlots pattern exactly
 */

// Date formatting slots
export const InsertedDateSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => (
  <span>{formatDate(row.InsertedDate)}</span>
);

export const IssueDateSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => <span>{formatDate(row.IssueDate)}</span>;

export const PaymentDueDateSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => (
  <span>{formatDate(row.PaymentDueDate)}</span>
);

// Currency formatting slots
export const PayableAmountSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => (
  <span style={{ textAlign: 'right', display: 'block' }}>
    {formatCurrency(row.PayableAmount, row.PayableAmountCurrency)}
  </span>
);

export const RemainingAmountSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => (
  <span style={{ textAlign: 'right', display: 'block' }}>
    {formatCurrency(row.RemainingAmount, row.PayableAmountCurrency)}
  </span>
);

// Status and type display slots
export const TypeSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => <span>{getInvoiceTypeDisplay(row.Type)}</span>;

export const ProfileIdSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => (
  <span>{getProfileTypeDisplay(row.ProfileId)}</span>
);

export const StatusSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => {
  const { text, color } = getInvoiceStatusDisplay(row.Status);
  return <Chip label={text} color={color} size="small" variant="outlined" />;
};

export const UsageStatusSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => {
  const { text, color } = getUsageStatusDisplay(row.RemainingAmount, row.PayableAmount);
  return <Chip label={text} color={color} size="small" variant="outlined" />;
};

// Actions slot
interface ActionsSlotProps {
  row: InvoiceItem;
  onView?: (invoice: InvoiceItem) => void;
  onDelete?: (invoice: InvoiceItem) => void;
  userDeleteAuth?: boolean;
}

export const ActionsSlot: React.FC<ActionsSlotProps> = ({ row, onView, onDelete, userDeleteAuth = false }) => {
  return (
    <Box display="flex" gap={1}>
      <Tooltip title="Detay Görüntüle">
        <IconButton size="small" onClick={() => onView?.(row)} color="primary">
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {userDeleteAuth && row.Status === 1 && !row.IsDeleted && (
        <Tooltip title="Sil">
          <IconButton size="small" onClick={() => onDelete?.(row)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

// Sender and Receiver display slots with safe handling
export const SenderNameSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => (
  <Box>
    <Typography variant="body2" fontWeight={500}>
      {safeDisplay(row.SenderName)}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {safeDisplay(row.SenderIdentifier)}
    </Typography>
  </Box>
);

export const ReceiverNameSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => (
  <Box>
    <Typography variant="body2" fontWeight={500}>
      {safeDisplay(row.ReceiverName)}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {safeDisplay(row.ReceiverIdentifier)}
    </Typography>
  </Box>
);

// Allowance status slot for additional info
export const AllowanceStatusSlot: React.FC<{ row: InvoiceItem }> = ({ row }) => {
  if (!row.AllowanceStatusDescription) return <span>-</span>;

  return <Chip label={row.AllowanceStatusDescription} size="small" variant="outlined" color="info" />;
};

// Namespace export for organized slot access following OperationPricing pattern
export const InvoiceReportTableSlots = {
  InsertedDateSlot,
  IssueDateSlot,
  PaymentDueDateSlot,
  PayableAmountSlot,
  RemainingAmountSlot,
  TypeSlot,
  ProfileIdSlot,
  StatusSlot,
  UsageStatusSlot,
  ActionsSlot,
  SenderNameSlot,
  ReceiverNameSlot,
  AllowanceStatusSlot,
};
