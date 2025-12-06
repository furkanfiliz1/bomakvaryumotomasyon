import { FormControlLabel, useTheme } from '@mui/material';
import Switch from '@mui/material/Switch';
import { Controller } from 'react-hook-form';
import { IInput } from '../types';

export default function InputSwitch({
  name,
  form,
  label,
  mb = 2,
  fieldType,
  spaceBetween = true,
  labelPlacement = 'start',
}: IInput & {
  fieldType?: string;
  spaceBetween?: boolean;
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
}) {
  const theme = useTheme();
  const isNumeric = fieldType === 'number';

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value, ref } }) => {
        // Determine if switch is checked based on value type
        const isChecked = isNumeric ? value === 1 : value === 'yes' || value === true || !!value;

        // Determine what value to set on change
        const handleChange = (checked: boolean) => {
          if (isNumeric) {
            onChange(checked ? 1 : 0);
          } else if (typeof value === 'boolean' || value === true || value === false) {
            onChange(checked);
          } else {
            onChange(checked ? 'yes' : 'no');
          }
        };

        return (
          <FormControlLabel
            label={label}
            labelPlacement={labelPlacement}
            style={{
              display: 'inline-flex',
              width: spaceBetween ? '100%' : 'auto',
              justifyContent: spaceBetween ? 'space-between' : 'flex-start',
              alignItems: labelPlacement === 'start' ? 'center' : 'flex-start',
            }}
            sx={{
              mb,
              ml: 0,
              '& .MuiFormControlLabel-label': {
                color: theme.palette.neutral[800],
                fontWeight: 500,
                fontSize: theme.typography.body2.fontSize,
              },
            }}
            control={
              <Switch id={name} inputRef={ref} checked={isChecked} onChange={(e) => handleChange(e.target.checked)} />
            }
          />
        );
      }}
    />
  );
}
