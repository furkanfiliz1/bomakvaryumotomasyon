import { Checkbox } from '@components';
import { Box, FormControlLabel, Typography, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';
import { IInput } from '../types';

export default function InputCheckbox({ name, form, label, mb = 2, mt = 5, visible = true, disabled = false }: IInput) {
  const theme = useTheme();

  const text = { __html: label || '' };
  if (!visible) return null;
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        return (
          <FormControlLabel
            sx={{
              display: 'flex',
              alignItems: 'start',
              mb,
              mt,
              ml: 1,
            }}
            label={
              <Typography variant="caption" fontWeight={400} color={theme.palette.dark[800]} mt={0.55}>
                <div dangerouslySetInnerHTML={text} />
              </Typography>
            }
            control={
              <Controller
                name={name}
                render={() => {
                  return (
                    <Box>
                      <Checkbox
                        id={name}
                        checked={value}
                        onChange={onChange}
                        error={error?.message}
                        inputRef={ref}
                        disabled={disabled}
                      />
                    </Box>
                  );
                }}
                control={form.control}
              />
            }
          />
        );
      }}
    />
  );
}
