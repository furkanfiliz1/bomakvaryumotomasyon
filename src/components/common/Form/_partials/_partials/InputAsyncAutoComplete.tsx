import { Autocomplete, Box, CircularProgress, TextField, alpha, styled } from '@mui/material';
import { debounce, get } from 'lodash';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { IInputAsyncAutoComplete, SelectOption } from '../types';
import CustomHelperText from './components/CustomHelperText';
import CustomInputLabel from './components/CustomInputLabel';

export const CustomAsyncAutoComplete = styled(Autocomplete)(({ theme }) => ({
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
    padding: '2.5px 12px',
    borderRadius: 8,
  },
}));

const InputAsyncAutoComplete: FC<IInputAsyncAutoComplete> = (props) => {
  const {
    name,
    form,
    options,
    label,
    entries,
    defaultValue,
    disabled,
    placeholder,
    onSearch,
    isLoading = false,
    minSearchLength = 3,
  } = props;
  const [inputValue, setInputValue] = useState('');

  const [open, setOpen] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  if (!options || !entries) throw new Error('please provide options and entries');

  const valueKey = entries[0];
  const labelKey = entries[1];

  const getValue = useMemo(() => {
    return (option: SelectOption | null) => {
      return get(option, valueKey) || '';
    };
  }, [valueKey]);

  const getLabel = useMemo(() => {
    return (option: SelectOption | null) => {
      if (!option) return '-';

      if (typeof labelKey == 'string') {
        return get(option, labelKey) || '';
      }

      return labelKey(option) || '';
    };
  }, [labelKey]);

  const getOptionBySelectedValue = useMemo(() => {
    return (value: unknown) => {
      if (!value) return undefined;

      // Handle case where value is an object (e.g., {Identifier: "123", CompanyName: "Company Name"})
      let searchValue: unknown = value;
      if (typeof value === 'object' && value !== null) {
        // First check if it has the valueKey property directly (full object from form.reset)
        if (valueKey in value) {
          // If value is already a full object with the valueKey, we can use it directly
          // This handles the case where form.reset sets the full object
          const matchFromOptions = options.find(
            (option: SelectOption) => getValue(option) === (value as Record<string, unknown>)[valueKey],
          );
          // If found in options, return that; otherwise return the value itself as a valid option
          return matchFromOptions || (value as SelectOption);
        }
        // Legacy support: check for 'value' property
        else if ('value' in value) {
          searchValue = (value as { value: unknown }).value;
        }
      }

      return options.find((option: SelectOption) => getValue(option) === searchValue);
    };
  }, [options, getValue, valueKey]);

  // Enhanced search function with abort controller and loading state
  const performSearch = useMemo(
    () =>
      debounce(async (searchValue: string) => {
        if (!onSearch || searchValue.length < minSearchLength) {
          setInternalLoading(false);
          return;
        }

        // Abort previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        try {
          setInternalLoading(true);
          await onSearch(searchValue);
        } catch (error) {
          // Only log error if it's not an abort error
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Search error:', error);
          }
        } finally {
          setInternalLoading(false);
          abortControllerRef.current = null;
        }
      }, 500),
    [onSearch, minSearchLength],
  );

  const handleInputChange = (_: React.SyntheticEvent, newInputValue: string, reason: string) => {
    setInputValue(newInputValue);

    if (reason === 'input') {
      setIsUserTyping(true);
      setHasUserInteracted(true);
      performSearch(newInputValue);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    // Only trigger search on open if user has previously interacted and input has enough characters
    // This prevents initial load from triggering search, but allows re-focus to work
    if (hasUserInteracted && inputValue.length >= minSearchLength) {
      performSearch(inputValue);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Sync inputValue with form value changes (for reset/clear functionality)
  // Only sync when form value changes and user is not actively typing
  useEffect(() => {
    if (isUserTyping) return; // Don't override user input while typing

    const currentValue = form.getValues(name);
    const selectedOption = getOptionBySelectedValue(currentValue);

    if (selectedOption) {
      setInputValue(getLabel(selectedOption));
    } else if (currentValue === undefined || currentValue === null || currentValue === '') {
      // Only clear input if form value is actually cleared/reset
      setInputValue('');
    }
  }, [form, name, getLabel, getOptionBySelectedValue, isUserTyping]); // Added isUserTyping dependency

  // Cleanup: abort any pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <Controller
      name={name}
      control={form.control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const selectedOption = getOptionBySelectedValue(value);

        const showLoading = isLoading || internalLoading;

        return (
          <Box sx={{ width: '100%' }}>
            <CustomInputLabel label={label} />
            <CustomAsyncAutoComplete
              id={name}
              disabled={disabled}
              value={selectedOption || null}
              inputValue={inputValue}
              open={open}
              onOpen={handleOpen}
              onClose={handleClose}
              onInputChange={handleInputChange}
              onChange={(_, option) => {
                const newValue = getValue(option as SelectOption | null);
                onChange(newValue);
                setIsUserTyping(false);

                // Update input value to show selected label
                if (option) {
                  setInputValue(getLabel(option as SelectOption));
                } else {
                  setInputValue('');
                }
              }}
              getOptionLabel={(option) => getLabel(option as SelectOption | null)}
              options={options}
              loading={showLoading}
              noOptionsText={
                inputValue.length < minSearchLength ? `En az ${minSearchLength} karakter giriniz` : 'Bulunamadı'
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={placeholder}
                  inputRef={ref}
                  error={!!error}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {showLoading && <CircularProgress color="primary" size={20} sx={{ mr: 1 }} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              filterOptions={(x: unknown[]) => x} // Disable client-side filtering since we do server-side
            />
            <CustomHelperText id={`${name}Error`} error={error} />
          </Box>
        );
      }}
    />
  );
};

export default InputAsyncAutoComplete;
