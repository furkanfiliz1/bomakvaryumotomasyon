import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { Button, Tooltip, Typography } from '@mui/material';
import React from 'react';
import type { CheckReportItem } from '../check-report.types';
import { formatCurrency, formatDate, getDisplayValue } from '../helpers';

interface ActionsSlotProps {
  item: CheckReportItem;
  onDetailClick: () => void;
}

/**
 * Actions slot for check report table rows
 * Matches legacy system "Detay" button exactly
 */
const ActionsSlot: React.FC<ActionsSlotProps> = ({ onDetailClick }) => (
  <Button variant="contained" size="small" color="info" onClick={onDetailClick} startIcon={<VisibilityIcon />}>
    Detay
  </Button>
);

/**
 * Currency slot for check amount display
 * Matches legacy system currency formatting
 */
interface CurrencySlotProps {
  amount: number;
  currency: string;
}

const CurrencySlot: React.FC<CurrencySlotProps> = ({ amount, currency }) => (
  <span>{formatCurrency(amount, currency)}</span>
);

/**
 * Date slot for date display
 * Matches legacy system date formatting (DD.MM.YYYY)
 */
interface DateSlotProps {
  dateString?: string;
}

const DateSlot: React.FC<DateSlotProps> = ({ dateString }) => <span>{formatDate(dateString)}</span>;

/**
 * Text slot for text display with null handling
 * Matches legacy system dash for empty values
 */
interface TextSlotProps {
  value?: string | number | null;
}

const TextSlot: React.FC<TextSlotProps> = ({ value }) => <span>{getDisplayValue(value)}</span>;

/**
 * Bank Name slot with truncation and tooltip
 * Following OperationPricing pattern for text truncation
 */
interface BankNameSlotProps {
  row: CheckReportItem;
}

const BankNameSlot: React.FC<BankNameSlotProps> = ({ row }) => {
  const bankName = row.BankName || '-';

  return (
    <Tooltip title={bankName} arrow>
      <Typography
        variant="body2"
        sx={{
          maxWidth: '150px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        }}>
        {bankName}
      </Typography>
    </Tooltip>
  );
};

/**
 * Bank EFT Code slot with truncation and tooltip
 * Following OperationPricing pattern for text truncation
 */
interface BankEftCodeSlotProps {
  row: CheckReportItem;
}

const BankEftCodeSlot: React.FC<BankEftCodeSlotProps> = ({ row }) => {
  const bankEftCode = row.BankEftCode || '-';

  return (
    <Tooltip title={bankEftCode} arrow>
      <Typography
        variant="body2"
        sx={{
          maxWidth: '120px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        }}>
        {bankEftCode}
      </Typography>
    </Tooltip>
  );
};

export const CheckReportTableSlots = {
  ActionsSlot,
  CurrencySlot,
  DateSlot,
  TextSlot,
  BankNameSlot,
  BankEftCodeSlot,
};
