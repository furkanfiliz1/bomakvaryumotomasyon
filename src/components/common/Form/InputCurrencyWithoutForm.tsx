import { InputBaseProps, useTheme } from '@mui/material';
import { getCurrencyPrefix } from '@utils';
import { CSSProperties, FC, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { CustomTextInput } from '../Form/_partials/components/CustomTextInput';

interface InputCurrencyWithoutFormProps {
  value: string | number | undefined;
  max?: number;
  onChange: (value: string | number) => void;
  currency: string;
  name: string;
  id: string;
  maxLength: number;
  style?: CSSProperties;
  disabled?: boolean;
}

const InputCurrencyWithoutForm: FC<InputCurrencyWithoutFormProps> = (props) => {
  const { value, max, onChange, currency, maxLength, name, id, style = {}, disabled } = props;

  const theme = useTheme();
  const currencyName = getCurrencyPrefix(currency || '');

  const CurrencyInput = useCallback(
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

  return (
    <NumericFormat
      max={max}
      name={name}
      id={id}
      disabled={disabled}
      value={value}
      style={{ color: theme.palette.neutral[500], ...style }}
      onValueChange={(event) => {
        if (event.floatValue) {
          onChange(Number(event.floatValue));
        } else {
          onChange(0);
        }
      }}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      valueIsNumericString
      placeholder="0"
      allowNegative={false}
      customInput={CurrencyInput}
      inputProps={{ maxLength: maxLength }}
    />
  );
};

export default InputCurrencyWithoutForm;
