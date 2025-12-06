import { Controller } from 'react-hook-form';
import { IInput } from '../types';
import { IMaskInput } from 'react-imask';
import CustomInputLabel from './components/CustomInputLabel';
import CustomHelperText from './components/CustomHelperText';

export default function InputNumericMask({ name, form, label, maxLength }: IInput) {
  const mask = maxLength ? '0'.repeat(maxLength) : '';

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <CustomInputLabel label={label} />
          <IMaskInput
            className="ibanInput"
            mask={mask}
            name={name}
            value={value}
            definitions={{
              '0': /[0-9]/,
            }}
            id={name}
            onAccept={(value: string) => onChange({ target: { name, value } })}
            unmask={true}
          />
          <CustomHelperText id={`${name}Error`} error={error} />
        </>
      )}
    />
  );
}
