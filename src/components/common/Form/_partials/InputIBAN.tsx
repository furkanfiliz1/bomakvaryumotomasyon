import { Controller } from 'react-hook-form';
import { IInput } from '../types';
import { IMaskInput } from 'react-imask';
import CustomInputLabel from './components/CustomInputLabel';
import CustomHelperText from './components/CustomHelperText';
import { useTheme } from '@mui/material';

export default function InputIBAN({ name, form }: IInput) {
  const theme = useTheme();
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <CustomInputLabel label="IBAN" />
          <IMaskInput
            className="ibanInput"
            mask="TR00 0000 0000 0000 0000 0000 00"
            name={name}
            value={`TR${value}`}
            onAccept={(value: string) => onChange({ target: { name, value } })}
            style={{
              border: '1px solid',
              backgroundColor: '#fff',
              borderColor: error ? theme.palette.error[500] : theme.palette.grey.A300,
            }}
          />
          <CustomHelperText error={error} id={`${name}Error`} />
        </>
      )}
    />
  );
}
