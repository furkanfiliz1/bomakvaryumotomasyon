import { Icon } from '@components';
import { Box, MenuItem, Select, Tooltip, Typography, alpha, styled } from '@mui/material';
import get from 'lodash/get';
import { Controller } from 'react-hook-form';
import { IInputSelect, SelectOption } from '../types';
import CustomHelperText from './components/CustomHelperText';
import CustomInputLabel from './components/CustomInputLabel';
import { PLACEHOLDER_TEXT_STYLES } from './shared/placeholder-styles';

const PLACEHOLDER_VALUE = '__select_placeholder__';

export const CustomSelect = styled(Select)(({ theme, error, size }) => ({
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

export default function InputSelect(props: IInputSelect) {
  const {
    name,
    form,
    options,
    label,
    entries,
    defaultValue,
    size,
    disabled,
    readonly,
    tooltip,
    maxWidth,
    showSelectOption,
    showSelectOptionText = 'Seçiniz',
  } = props;

  if (!options || !entries) throw Error('please provide options and entiries');

  const valueKey = entries[0];
  const labelKey = entries[1];

  const getValue = (option: SelectOption | null) => {
    const value = get(option, valueKey);
    return value !== undefined && value !== null ? value : '';
  };

  const getLabel = (option: SelectOption | null) => {
    if (!option) return '-';

    if (typeof labelKey == 'string') {
      return get(option, labelKey) || '';
    }

    return labelKey(option) || '';
  };

  return (
    <Controller
      name={name}
      control={form.control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const hasError = !!error;
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
            <CustomSelect
              style={{ marginTop: '-4px' }}
              id={name}
              inputRef={ref}
              size={size}
              sx={{ width: '100%' }}
              onChange={(event) => {
                const newValue = event.target.value;
                onChange(newValue === PLACEHOLDER_VALUE ? null : newValue);
              }}
              value={
                value !== null && value !== undefined && value !== ''
                  ? value
                  : showSelectOption
                    ? PLACEHOLDER_VALUE
                    : ''
              }
              error={hasError}
              displayEmpty={showSelectOption}
              renderValue={(selected) => {
                if (
                  showSelectOption &&
                  (selected === PLACEHOLDER_VALUE || selected === null || selected === undefined || selected === '')
                ) {
                  return (
                    <Typography component="span" sx={PLACEHOLDER_TEXT_STYLES}>
                      {showSelectOptionText}
                    </Typography>
                  );
                }
                // Find the selected option and return its label
                const selectedOption = options.find((option) => {
                  const optionValue = getValue(option);
                  // Handle type coercion for proper comparison
                  return String(optionValue) === String(selected);
                });
                return selectedOption ? getLabel(selectedOption) : selected;
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
                style: {
                  maxHeight: '435px',
                },
              }}
              disabled={disabled || readonly}
              inputProps={{ readOnly: readonly }}
              variant="outlined">
              {showSelectOption && (
                <MenuItem
                  title={showSelectOptionText}
                  id="select-placeholder"
                  key="select-placeholder"
                  value={PLACEHOLDER_VALUE}>
                  <Box
                    component="div"
                    sx={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      ...PLACEHOLDER_TEXT_STYLES,
                    }}>
                    {showSelectOptionText}
                  </Box>
                </MenuItem>
              )}
              {options.map((option) => (
                <MenuItem
                  style={{ maxWidth }}
                  title={getLabel(option)}
                  id={getValue(option)}
                  key={getValue(option)}
                  value={getValue(option)}>
                  <Box
                    component="div"
                    sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {getLabel(option)}
                  </Box>
                </MenuItem>
              ))}
            </CustomSelect>
            <CustomHelperText id={`${name}Error`} error={error} />
          </Box>
        );
      }}
    />
  );
}
