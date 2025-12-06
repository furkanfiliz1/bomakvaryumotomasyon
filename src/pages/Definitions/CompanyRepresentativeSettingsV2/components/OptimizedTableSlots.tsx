/**
 * Optimized Table Slots V2
 * Performance-optimized cell renderers - always editable (like V1)
 * but with memoization for better performance
 *
 * KEY OPTIMIZATION: Memoized components prevent unnecessary re-renders
 */

import { HUMAN_READABLE_DATE, RESPONSE_DATE } from '@constant';
import { History as HistoryIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { LocalizationProvider, trTR } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { memo } from 'react';
import Icon from 'src/components/common/Icon';
import {
  getBuyerCompanyNameById,
  getFinancerNameById,
  getManagerNameById,
  getProductTypeDescription,
  isBuyerDisabled,
  isFinancerDisabled,
} from '../../CompanyRepresentativeSettings/helpers/company-representative-settings.helpers';
import type { CompanyCustomerManagerItem } from '../company-representative-settings.types';

// ============================================
// STYLED COMPONENTS
// ============================================

const SecondaryText = styled(Typography)({
  fontSize: '0.75rem',
  color: 'text.secondary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const ReadOnlyText = styled(Typography)({
  fontSize: '0.875rem',
  lineHeight: 1.5,
  padding: '8px 0',
});

// Calendar icon component for DatePicker
const CalendarIcon = () => <Icon icon="calendar" size={20} />;

// Custom DatePicker styled component
const CustomDatePicker = styled(MUIDatePicker)(({ theme }) => ({
  transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
  borderRadius: 8,
  backgroundColor: '#fff',
  border: '1px solid',
  borderColor: theme.palette.grey.A300,
  width: '100%',
  'label + &': {
    marginTop: theme.spacing(-0.5),
  },
  '& fieldset': {
    borderRadius: 8,
    border: '1px solid',
    borderColor: '#E0E3E7',
  },
  '&:focus, &:hover': {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
  '& .MuiInputBase-root': {
    '&:hover': {
      fieldset: {
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      },
    },
  },
  input: {
    fontSize: 14,
    padding: '11.5px 12px',
  },
}));

// ============================================
// COMPANY DISPLAY SLOT (Always read-only)
// ============================================

interface CompanyDisplaySlotProps {
  row: CompanyCustomerManagerItem;
}

export const CompanyDisplaySlot = memo<CompanyDisplaySlotProps>(({ row }) => {
  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <ReadOnlyText fontWeight="medium">{row.CompanyIdentifier}</ReadOnlyText>
      <Tooltip title={row.CompanyName || ''} placement="top">
        <SecondaryText>{row.CompanyName}</SecondaryText>
      </Tooltip>
    </Box>
  );
});

CompanyDisplaySlot.displayName = 'CompanyDisplaySlot';

// ============================================
// CUSTOMER MANAGER SLOT
// ============================================

interface CustomerManagerSlotProps {
  row: CompanyCustomerManagerItem;
  options: Array<{ Id: number; FullName: string }>;
  onChange?: (value: number) => void;
}

export const CustomerManagerSlot = memo<CustomerManagerSlotProps>(({ row, options, onChange }) => {
  const value = row.ManagerUserId;

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    event.stopPropagation();
    onChange?.(Number(event.target.value));
  };

  return (
    <Select
      value={value || ''}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      size="small"
      fullWidth
      displayEmpty
      renderValue={(selected) => {
        if (!selected) return 'Temsilci Seçiniz';
        return getManagerNameById(Number(selected), options);
      }}>
      <MenuItem value="">Temsilci Seçiniz</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.Id} value={option.Id}>
          {option.FullName}
        </MenuItem>
      ))}
    </Select>
  );
});

CustomerManagerSlot.displayName = 'CustomerManagerSlot';

// ============================================
// PRODUCT TYPE SLOT
// ============================================

interface ProductTypeSlotProps {
  row: CompanyCustomerManagerItem;
  options: Array<{ Value: string; Description: string }>;
  onChange?: (value: string) => void;
}

export const ProductTypeSlot = memo<ProductTypeSlotProps>(({ row, options, onChange }) => {
  const value = row.ProductType;

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    event.stopPropagation();
    onChange?.(String(event.target.value));
  };

  return (
    <Select
      value={value || ''}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      size="small"
      fullWidth
      displayEmpty
      renderValue={(selected) => {
        if (!selected) return 'Ürün Seçiniz';
        return getProductTypeDescription(String(selected), options);
      }}>
      <MenuItem value="">Ürün Seçiniz</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.Value} value={option.Value}>
          {option.Description}
        </MenuItem>
      ))}
    </Select>
  );
});

ProductTypeSlot.displayName = 'ProductTypeSlot';

// ============================================
// FINANCER SLOT
// ============================================

interface FinancerSlotProps {
  row: CompanyCustomerManagerItem;
  options: Array<{ Id: number; CompanyName: string }>;
  onChange?: (value: number | null) => void;
}

export const FinancerSlot = memo<FinancerSlotProps>(({ row, options, onChange }) => {
  const value = row.FinancerCompanyId;
  const disabled = isFinancerDisabled(row.ProductType);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    event.stopPropagation();
    const newValue = event.target.value ? Number(event.target.value) : null;
    onChange?.(newValue);
  };

  return (
    <Select
      value={disabled ? '' : value || ''}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      size="small"
      fullWidth
      disabled={disabled}
      displayEmpty
      renderValue={(selected) => {
        if (disabled || !selected) return 'Finansör Seçiniz';
        return getFinancerNameById(Number(selected), options);
      }}>
      <MenuItem value="">Finansör Seçiniz</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.Id} value={option.Id}>
          {option.CompanyName}
        </MenuItem>
      ))}
    </Select>
  );
});

FinancerSlot.displayName = 'FinancerSlot';

// ============================================
// BUYER COMPANY SLOT
// ============================================

interface BuyerCompanySlotProps {
  row: CompanyCustomerManagerItem;
  options: Array<{ Id: number; CompanyName: string }>;
  onChange?: (value: number | null) => void;
}

export const BuyerCompanySlot = memo<BuyerCompanySlotProps>(({ row, options, onChange }) => {
  const value = row.BuyerCompanyId;
  const disabled = isBuyerDisabled(row.ProductType);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    event.stopPropagation();
    const newValue = event.target.value ? Number(event.target.value) : null;
    onChange?.(newValue);
  };

  return (
    <Select
      value={value || ''}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      size="small"
      fullWidth
      disabled={disabled}
      displayEmpty
      renderValue={(selected) => {
        if (!selected) return 'Alıcı Seçiniz';
        return getBuyerCompanyNameById(Number(selected), options);
      }}>
      <MenuItem value="">Alıcı Seçiniz</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.Id} value={option.Id}>
          {option.CompanyName}
        </MenuItem>
      ))}
    </Select>
  );
});

BuyerCompanySlot.displayName = 'BuyerCompanySlot';

// ============================================
// START DATE SLOT
// ============================================

interface StartDateSlotProps {
  row: CompanyCustomerManagerItem;
  onChange?: (value: string) => void;
}

export const StartDateSlot = memo<StartDateSlotProps>(({ row, onChange }) => {
  const value = row.StartDate;

  const handleDateChange = (newValue: unknown) => {
    const formattedValue = newValue ? dayjs(newValue as string).format(RESPONSE_DATE) : '';
    onChange?.(formattedValue);
  };

  return (
    <Box sx={{ minWidth: 180 }} onClick={(e) => e.stopPropagation()}>
      <LocalizationProvider
        adapterLocale="TR-tr"
        dateAdapter={AdapterDayjs}
        localeText={trTR.components.MuiLocalizationProvider.defaultProps.localeText}>
        <CustomDatePicker
          value={value ? dayjs(new Date(value)) : null}
          onChange={handleDateChange}
          format={HUMAN_READABLE_DATE}
          slotProps={{
            textField: {
              size: 'small',
              onClick: (e) => e.stopPropagation(),
            },
            actionBar: {
              actions: ['clear'],
            },
          }}
          slots={{
            openPickerIcon: CalendarIcon,
          }}
        />
      </LocalizationProvider>
    </Box>
  );
});

StartDateSlot.displayName = 'StartDateSlot';

// ============================================
// ACTIONS SLOT V2 - With Edit Toggle
// ============================================

interface ActionsSlotProps {
  onRefresh: () => void;
  onHistory: () => void;
  isSaving?: boolean;
}

export const ActionsSlot = memo<ActionsSlotProps>(({ onRefresh, onHistory, isSaving }) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
      <Tooltip title="Güncelle">
        <span>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            disabled={isSaving}
            sx={{
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' },
            }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Geçmiş">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onHistory();
          }}
          sx={{
            bgcolor: 'grey.100',
            '&:hover': { bgcolor: 'grey.200' },
          }}>
          <HistoryIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
});

ActionsSlot.displayName = 'ActionsSlot';

// ============================================
// EXPORT ALL SLOTS
// ============================================

export const CompanyRepresentativeTableSlotsV2 = {
  CompanyDisplaySlot,
  CustomerManagerSlot,
  ProductTypeSlot,
  FinancerSlot,
  BuyerCompanySlot,
  StartDateSlot,
  ActionsSlot,
};
