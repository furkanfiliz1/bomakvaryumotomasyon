/**
 * Company Representative Table Slots
 * Custom cell renderers for editable table cells
 * Following OperationPricing table slots patterns
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
import Icon from '../../../../components/common/Icon/index';

import dayjs from 'dayjs';
import React from 'react';
import type {
  CompanyCustomerManagerItem,
  CustomerManagerOption,
  FinancerOption,
  ProductTypeOption,
} from '../company-representative-settings.types';
import {
  formatCompanyDisplay,
  getBuyerCompanyNameById,
  getFinancerNameById,
  getManagerNameById,
  getProductTypeDescription,
  isBuyerDisabled,
  isFinancerDisabled,
} from '../helpers/company-representative-settings.helpers';
import type { BuyerCompanyOption } from '../hooks/useCompanyRepresentativeDropdownData';

interface BaseSlotProps {
  row: CompanyCustomerManagerItem;
}

// Calendar icon component for DatePicker
const CalendarIcon = () => <Icon icon="calendar" size={20} />;

// Company display slot - matches legacy format exactly
export const CompanyDisplaySlot: React.FC<BaseSlotProps> = ({ row }) => {
  const { primary, secondary } = formatCompanyDisplay(row);

  return (
    <Box
      sx={{
        width: '200px',
      }}>
      <Typography variant="body2" fontWeight="medium">
        {primary}
      </Typography>
      <Tooltip title={secondary || ''} placement="top">
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          {secondary}
        </Typography>
      </Tooltip>
    </Box>
  );
};

// Editable Customer Manager dropdown slot
export const CustomerManagerSlot: React.FC<{
  row: CompanyCustomerManagerItem;
  options: CustomerManagerOption[];
  onChange?: (value: number) => void;
}> = ({ row, options, onChange }) => {
  // Use row value directly (it will have changes applied from parent)
  const value = row.ManagerUserId;

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    event.stopPropagation(); // Prevent event bubbling to checkbox

    const newValue = Number(event.target.value);

    // Notify parent component of the change
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Select
      value={value || ''}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()} // Also prevent click bubbling
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
};

// Editable Product Type dropdown slot
export const ProductTypeSlot: React.FC<{
  row: CompanyCustomerManagerItem;
  options: ProductTypeOption[];
  onChange?: (value: string) => void;
}> = ({ row, options, onChange }) => {
  // Use row value directly (it will have changes applied from parent)
  const value = row.ProductType || '';

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    event.stopPropagation(); // Prevent event bubbling to checkbox

    const newValue = String(event.target.value);

    // Notify parent component of the change
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Select
      value={value || ''}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()} // Also prevent click bubbling
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
};

// Editable Financer dropdown slot
export const FinancerSlot: React.FC<{
  row: CompanyCustomerManagerItem;
  options: FinancerOption[];
  onChange?: (value: number | null) => void;
}> = ({ row, options, onChange }) => {
  // Use row value directly (it will have changes applied from parent)
  const value = row.FinancerCompanyId || '';
  const disabled = isFinancerDisabled(row.ProductType);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    event.stopPropagation(); // Prevent event bubbling to checkbox

    const newValue = event.target.value ? Number(event.target.value) : null;

    // Notify parent component of the change
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Select
      value={disabled ? '' : value || ''}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()} // Also prevent click bubbling
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
};

// Custom DatePicker styled component (from your InputDatePicker)
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

// Editable Start Date slot
export const StartDateSlot: React.FC<{
  row: CompanyCustomerManagerItem;
  onChange?: (value: string) => void;
}> = ({ row, onChange }) => {
  // Use row value directly (it will have changes applied from parent)
  const value = row.StartDate || '';

  const handleDateChange = (newValue: unknown) => {
    const formattedValue = newValue ? dayjs(newValue as string).format(RESPONSE_DATE) : '';

    // Notify parent component of the change
    if (onChange) {
      onChange(formattedValue);
    }
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
};

// Editable Buyer Company dropdown slot
export const BuyerCompanySlot: React.FC<{
  row: CompanyCustomerManagerItem;
  options: BuyerCompanyOption[];
  onChange?: (value: number | null) => void;
}> = ({ row, options, onChange }) => {
  // Use row value directly (it will have changes applied from parent)
  const value = row.BuyerCompanyId || '';
  const disabled = isBuyerDisabled(row.ProductType);

  const handleBuyerChange = (event: SelectChangeEvent<unknown>) => {
    event.stopPropagation(); // Prevent event bubbling to checkbox

    const selectedValue = event.target.value;
    const buyerCompanyId = selectedValue ? Number(selectedValue) : null;

    // Notify parent component of the change
    onChange?.(buyerCompanyId);
  };

  return (
    <Select
      value={value || ''}
      onChange={handleBuyerChange}
      onClick={(e) => e.stopPropagation()} // Also prevent click bubbling
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
};

// Actions slot with refresh and history buttons
export const ActionsSlot: React.FC<{
  row: CompanyCustomerManagerItem;
  onRefresh: (row: CompanyCustomerManagerItem) => void;
  onHistory: (row: CompanyCustomerManagerItem) => void;
}> = ({ row, onRefresh, onHistory }) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
      <Tooltip title="Güncelle">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRefresh(row);
          }}
          sx={{
            bgcolor: 'grey.100',
            '&:hover': { bgcolor: 'grey.200' },
          }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Geçmiş">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onHistory(row);
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
};

// Export all slots as named exports following OperationPricing pattern
export const CompanyRepresentativeTableSlots = {
  CompanyDisplaySlot,
  CustomerManagerSlot,
  ProductTypeSlot,
  FinancerSlot,
  BuyerCompanySlot,
  StartDateSlot,
  ActionsSlot,
};
