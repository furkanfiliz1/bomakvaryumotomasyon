import { Icon } from '@components';
import {
  alpha,
  Box,
  Checkbox,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';
import { get } from 'lodash';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { IInputSelect, SelectOption } from '../types';
import CustomHelperText from './components/CustomHelperText';
import CustomInputLabel from './components/CustomInputLabel';
import { PLACEHOLDER_TEXT_STYLES } from './shared/placeholder-styles';

const CustomMultiSelect = styled(Select)(({ theme, error, size }) => ({
  'label + &': {
    marginTop: theme.spacing(-0.5),
  },
  '& .MuiInputBase-input': {
    borderRadius: 8,
    position: 'relative',
    border: '1px solid',
    backgroundColor: '#fff',
    borderColor: error ? theme.palette.error[500] : theme.palette.grey.A300,
    fontSize: 14,
    width: '100%',
    padding: size === 'small' ? '6px 8px' : '8.6px 12px',
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    '&:focus, &:hover': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
  '& fieldset': {
    border: 'none !important',
  },
  '& .MuiSelect-select': {
    borderRadius: '8px !important',
  },
}));

const InputMultiSelect: FC<IInputSelect> = (props) => {
  const { name, form, options, label, entries, defaultValue, size, disabled, tooltip, maxWidth, placeholder } = props;

  if (!options || !entries) throw Error('please provide options and entries');

  const valueKey = entries[0];
  const labelKey = entries[1];

  const getValue = (option: SelectOption | null) => {
    return get(option, valueKey) || '';
  };

  const getLabel = (option: SelectOption | null) => {
    if (!option) return '-';
    if (typeof labelKey == 'string') {
      return get(option, labelKey) || '--';
    }

    return labelKey(option) || '';
  };

  return (
    <Controller
      name={name}
      control={form.control}
      defaultValue={defaultValue || []}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const hasError = !!error;
        const selectedValues = Array.isArray(value) ? value : [];

        const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
          // Prevent the default select behavior since we handle clicks manually
          event.preventDefault();
        };

        return (
          <Box sx={{ width: '100%', opacity: disabled ? 0.6 : 1 }}>
            <Box sx={{ display: 'flex' }}>
              {tooltip && (
                <Tooltip title={tooltip} sx={{ display: 'inline-flex', mr: 0.5 }}>
                  <Box>
                    <Icon icon="info-circle" size={15} />
                  </Box>
                </Tooltip>
              )}
              <CustomInputLabel label={label} />
            </Box>
            <CustomMultiSelect
              style={{ marginTop: '-4px' }}
              id={name}
              inputRef={ref}
              size={size}
              sx={{ width: '100%' }}
              multiple
              displayEmpty
              value={selectedValues}
              onChange={handleSelectChange}
              error={hasError}
              disabled={disabled}
              IconComponent={(props) => <Icon icon="chevron-down" size={20} {...props} />}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                const selectedArray = Array.isArray(selected) ? selected : [];

                if (selectedArray.length === 0) {
                  return <Typography sx={PLACEHOLDER_TEXT_STYLES}>{placeholder || 'Seçiniz'}</Typography>;
                }
                const selectedLabels = selectedArray.map((selectedValue: string | number) => {
                  const option = options.find((opt) => {
                    return String(getValue(opt)) === String(selectedValue);
                  });
                  return getLabel(option || null);
                });

                return (
                  <Typography
                    variant="body1"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {selectedLabels.join(', ')}
                  </Typography>
                );
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  style: {
                    maxHeight: '300px',
                    width: 'auto',
                  },
                },
              }}>
              {options.map((option) => {
                const optionValue = String(getValue(option));
                const isSelected = selectedValues.some((val) => String(val) === optionValue);

                const handleItemClick = (event: React.MouseEvent) => {
                  event.preventDefault();
                  event.stopPropagation();

                  let newSelectedValues: (string | number)[];
                  if (isSelected) {
                    // Remove from selection
                    newSelectedValues = selectedValues.filter((val) => String(val) !== optionValue);
                  } else {
                    // Add to selection
                    newSelectedValues = [...selectedValues, optionValue];
                  }

                  onChange(newSelectedValues);
                };

                return (
                  <MenuItem
                    key={optionValue}
                    value={optionValue}
                    onClick={handleItemClick}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      '&.Mui-selected': { backgroundColor: 'transparent' },
                      '&.Mui-selected:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                    }}>
                    <Checkbox checked={isSelected} sx={{ mr: 1 }} size="small" />
                    <Typography
                      variant="body1"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: maxWidth || 'auto',
                      }}
                      title={getLabel(option)}>
                      {getLabel(option)}
                    </Typography>
                  </MenuItem>
                );
              })}
            </CustomMultiSelect>
            <CustomHelperText id={`${name}Error`} error={error} />
          </Box>
        );
      }}
    />
  );
};

export default InputMultiSelect;
