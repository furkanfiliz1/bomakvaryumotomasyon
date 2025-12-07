import { Autocomplete, Box, TextField, alpha, debounce, styled } from '@mui/material';
import { get } from 'lodash';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { IInputSelect, SelectOption } from '../types';
import CustomHelperText from './components/CustomHelperText';
import CustomInputLabel from './components/CustomInputLabel';
import { getPlaceholderTextStyles } from './shared/placeholder-styles';

export const CustomAutoComplete = styled(Autocomplete)(({ theme }) => {
  const placeholderStyles = getPlaceholderTextStyles(theme);

  return {
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    borderRadius: 8,
    '&:focus, &:hover ': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    'label + &': {
      marginTop: theme.spacing(-0.5),
    },
    '.MuiInputBase-root': {
      fontSize: 14,
      padding: '4px 12px',
      borderRadius: 8,
      '& input::placeholder': {
        ...placeholderStyles,
        opacity: 1,
      },
    },
  };
});

const InputAutoComplete: FC<IInputSelect> = (props) => {
  const { name, form, options, label, entries, disabled, selectInputValueChange, placeholder } = props;

  if (!options || !entries) throw Error('please provide options and entiries');

  const valueKey = entries[0];
  const labelKey = entries[1];

  const getValue = (option: SelectOption | null) => {
    return get(option, valueKey) || '';
  };

  const getLabel = (option: SelectOption | null) => {
    if (!option) return '-';

    if (typeof labelKey == 'string') {
      return get(option, labelKey) || '';
    }

    return labelKey(option) || '';
  };

  const getOptionBySelectedValue = (value: unknown) => {
    if (value !== null && value !== undefined && value !== '') {
      const found = options.find((option) => {
        const optionValue = getValue(option);
        const isMatch =
          optionValue === value || String(optionValue) === String(value) || Number(optionValue) === Number(value);
        return isMatch;
      });
      return found;
    }
    return undefined;
  };

  const handleOnChange = debounce((e) => {
    const value = e?.target?.value;
    if (selectInputValueChange && !!value) selectInputValueChange(value);
  }, 1000);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const selectedOption = getOptionBySelectedValue(value);

        return (
          <Box sx={{ width: '100%' }}>
            <CustomInputLabel label={label} />
            <CustomAutoComplete
              id={name}
              disabled={disabled}
              value={selectedOption || null}
              onChange={(_, option) => {
                const newValue = getValue(option as SelectOption | null);
                onChange(newValue);
              }}
              onInputChange={(e) => {
                handleOnChange(e);
              }}
              getOptionLabel={(option) => getLabel(option as SelectOption | null)}
              isOptionEqualToValue={(option, value) => {
                const optionValue = getValue(option as SelectOption);
                const valueValue = getValue(value as SelectOption);
                const isEqual =
                  optionValue === valueValue ||
                  String(optionValue) === String(valueValue) ||
                  Number(optionValue) === Number(valueValue);
                return isEqual;
              }}
              options={options}
              noOptionsText="Bulunamadı"
              renderInput={(params) => (
                <TextField {...params} placeholder={placeholder} inputRef={ref} error={!!error} />
              )}
            />
            <CustomHelperText id={`${name}Error`} error={error} />
          </Box>
        );
      }}
    />
  );
};

export default InputAutoComplete;
