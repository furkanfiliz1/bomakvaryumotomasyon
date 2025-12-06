import { Box, InputBaseProps, useTheme } from '@mui/material';
import { getCurrencyPrefix } from '@utils';
import { FocusEventHandler, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { IInput } from '../types';
import CustomHelperText from './components/CustomHelperText';
import CustomInputLabel from './components/CustomInputLabel';
import { CustomTextInput } from './components/CustomTextInput';

export interface IInputTextCurrency extends IInput {
  format?: 'currency';
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
}

export default function InputCurrency(props: IInputTextCurrency) {
  const { name, form, readonly = false, visible = true, currency, label, maxLength, onBlur } = props;
  const currencyName = getCurrencyPrefix(currency || '');
  const theme = useTheme();

  const CurrencyTextInput = useCallback(
    (props: InputBaseProps) => (
      <CustomTextInput
        {...props}
        sx={{
          position: 'relative',
          width: '100%',
          '& input': {
            cursor: 'text',
            height: 20,
            color: 'black',
          },
          '&:after': {
            content: '"' + currencyName + '"' || '"TRY"',
            width: 40,
            position: 'absolute',
            top: 1,
            right: 2,
            bottom: 1,
            backgroundColor: theme.palette.neutral[200],
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid #dedede',
          },
        }}
      />
    ),
    [currencyName, theme.palette.neutral],
  );

  if (!visible) return null;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        return (
          <>
            <Box sx={{ width: '100%' }}>
              <CustomInputLabel label={label} />
              <NumericFormat
                style={{ color: theme.palette.neutral[500] }}
                id={name}
                error={!!error}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                maxLength={maxLength}
                allowNegative={false}
                onBlur={onBlur}
                value={value}
                onValueChange={(event) => {
                  console.log(event.floatValue);
                  // Handle 0 value correctly - don't convert to empty string
                  const value = event.floatValue !== undefined ? event.floatValue : '';
                  onChange(value);
                }}
                disabled={readonly}
                customInput={CurrencyTextInput}
                inputProps={{
                  ref,
                  maxLength,
                }}
              />
              <CustomHelperText id={`${name}Error`} error={error} />
            </Box>
          </>
        );
      }}></Controller>
  );
}
