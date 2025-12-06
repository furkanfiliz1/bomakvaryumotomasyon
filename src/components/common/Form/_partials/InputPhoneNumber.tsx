import { Box, TextField, TextFieldProps, alpha, useTheme } from '@mui/material';
import { MuiPhoneNumberProps } from 'material-ui-phone-number';
import { FC } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import CustomHelperText from './components/CustomHelperText';
import CustomInputLabel from './components/CustomInputLabel';
import CustomSubText from './components/CustomSubText';

export interface PhoneNumberInputProps extends Omit<MuiPhoneNumberProps, 'onChange'> {
  value?: string;
  label: string;
  onChange?: (phoneNumber?: string) => void;
  form: UseFormReturn;
  name: string;
  mb?: number;
  country?: string;
  readonly?: boolean;
  disabled?: boolean;
  subText?: string;
}

const InputPhoneNumber: FC<PhoneNumberInputProps> = ({ label, form, name, mb, readonly, disabled, subText }) => {
  const theme = useTheme();

  // Normalize phone number: remove leading 0, spaces, parentheses
  const normalizePhoneNumber = (phone: string): string => {
    if (!phone) return '';

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Remove leading 0 if present (Turkish domestic format)
    return cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
  };

  const CurrencyInput = (props: TextFieldProps) => {
    return (
      <TextField
        {...props}
        sx={{
          width: '100%',
          'label + &': {
            marginTop: theme.spacing(-0.5),
          },
          '& fieldset': {
            display: 'none',
          },
          '& .MuiInputBase-input': {
            borderRadius: 1,
            position: 'relative',
            backgroundColor: '#fff',
            border: '1px solid',
            borderColor: props.error ? theme.palette.error[500] : theme.palette.grey.A300,
            color: theme.palette.neutral[800],

            fontSize: 14,
            width: '100%',
            padding: '10px 12px',
            transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
            '&:focus, &:hover ': {
              boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
              borderColor: theme.palette.primary.main,
            },
            '&:focus': {
              color: theme.palette.neutral[800],
            },
          },
        }}
      />
    );
  };

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value, ...rest }, fieldState: { error } }) => {
        const hasError = !!error;
        return (
          <Box sx={{ width: '100%', opacity: readonly || disabled ? 0.6 : 1 }}>
            <CustomInputLabel label={label} />
            <PatternFormat
              {...rest}
              id={name}
              format="(###) ### ## ##"
              allowEmptyFormatting
              mask="_"
              customInput={CurrencyInput}
              error={hasError}
              sx={{ mb: mb, width: '100%' }}
              size="medium"
              InputLabelProps={{ shrink: true }}
              style={{ direction: 'ltr' }}
              variant="outlined"
              value={normalizePhoneNumber(value)}
              onChange={(e) => {
                const normalizedValue = normalizePhoneNumber(e.target.value);
                onChange(normalizedValue);
              }}
              autoFocus={false}
              disabled={readonly || disabled}
            />
            <CustomSubText text={subText} id={`${name}SubText`} />

            <CustomHelperText id={`${name}Error`} error={error} />
          </Box>
        );
      }}
    />
  );
};

export default InputPhoneNumber;
