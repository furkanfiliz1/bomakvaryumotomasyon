import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';

interface CurrencyOption {
  value: number;
  label: string;
}

interface CurrencySelectorProps {
  options: CurrencyOption[];
  selectedCurrencies: number[];
  onChange: (selected: number[]) => void;
  label?: string;
}

/**
 * Currency Selector Component
 * Following reference project Currency.js pattern with MUI components
 */
const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  options,
  selectedCurrencies,
  onChange,
  label = 'Para Birimi',
}) => {
  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    onChange(typeof value === 'string' ? value.split(',').map(Number) : value);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="currency-selector-label">{label}</InputLabel>
      <Select
        labelId="currency-selector-label"
        id="currency-selector"
        multiple
        value={selectedCurrencies}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => {
              const currency = options.find((c) => c.value === value);
              return <Chip key={value} label={currency?.label || value} size="small" />;
            })}
          </Box>
        )}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={selectedCurrencies.includes(option.value)} />
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CurrencySelector;
