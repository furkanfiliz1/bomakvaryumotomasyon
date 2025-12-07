import { Box, SxProps, TextFieldVariants, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';
import { IInput } from '../types';

import CustomHelperText from './components/CustomHelperText';
import CustomInputLabel from './components/CustomInputLabel';
import CustomSubText from './components/CustomSubText';
import { CustomTextInput } from './components/CustomTextInput';
import { EndAdornment } from './components/EndAdornment';

export interface IInputText extends IInput {
  format?: 'currency';
  endAdornmentText?: string;
  placeholder?: string;
  variant?: TextFieldVariants;
  sx?: SxProps;
}

const formattedValue = (value: string | number, format?: 'currency') => {
  switch (format) {
    case 'currency':
      if (typeof value === 'number') {
        return value?.toFixed(2);
      } else return value;
    default:
      return value;
  }
};

export default function InputText(props: IInputText) {
  const theme = useTheme();

  const {
    name,
    form,
    type = 'text',
    format,
    readonly = false,
    disabled = false,
    size = 'medium',
    mb = 2,
    minRows = 3,
    maxRows = 6,
    visible = true,
    maxLength,
    inputType = 'string',
    autoFocus = false,
    endAdornmentText,
    placeholder,
    label,
    trim,
    sx = {},
    tooltipText,
    subText,
  } = props;

  if (!visible) return null;

  return (
    <Controller
      name={name}
      control={form.control}
      render={(params) => {
        const {
          field: { onChange, value, ref },
          fieldState: { error },
        } = params;

        return (
          <Box sx={{ width: '100%', opacity: readonly || disabled ? 0.8 : 1 }}>
            <CustomInputLabel label={label} tooltipText={tooltipText} />
            <CustomTextInput
              id={name}
              onWheel={(e) => (e.target as HTMLElement).blur()}
              disabled={readonly || disabled}
              minRows={minRows}
              autoFocus={autoFocus}
              size={size}
              maxRows={maxRows}
              name={name}
              multiline={type === 'textarea'}
              type={inputType || type || 'text'}
              error={!!error}
              placeholder={placeholder}
              onChange={(e) => {
                let newValue = e.target.value;
                if (inputType === 'number' && maxLength) {
                  newValue = e.target.value.toString().slice(0, maxLength);
                }
                if (trim) newValue = newValue.trim();
                onChange(newValue);
              }}
              value={formattedValue(value, format) ?? ''}
              endAdornment={<EndAdornment endAdornmentText={endAdornmentText} />}
              inputProps={{
                maxLength: maxLength,
                ref,
              }}
              sx={{
                mb,
                width: '100%',
                position: 'relative',
                ...(endAdornmentText && {
                  '& input': {
                    height: 20,
                  },
                  '&:after': {
                    content: `"${endAdornmentText}"`,
                    minWidth: 55,
                    padding: '0 10px',
                    fontSize: 14,
                    fontWeight: 500,
                    position: 'absolute',
                    top: 1.5,
                    right: 2,
                    bottom: 2,
                    backgroundColor: theme.palette.neutral[200],
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                }),
                ...sx,
              }}
            />
            <CustomSubText text={subText} id={`${name}SubText`} />
            <CustomHelperText id={`${name}Error`} error={error} />
          </Box>
        );
      }}
    />
  );
}
