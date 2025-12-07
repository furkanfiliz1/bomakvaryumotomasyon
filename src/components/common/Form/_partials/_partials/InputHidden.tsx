import { Controller } from 'react-hook-form';
import { Input } from '@mui/material';
import { IInput } from '../types';

export default function InputHidden({ name, form }: IInput) {
  return (
    <Controller
      name={name}
      control={form.control}
      defaultValue=""
      render={({ field: { onChange, value } }) => (
        <Input name={name} type="hidden" value={value} onChange={onChange} hidden sx={{ display: 'none' }} />
      )}
    />
  );
}
