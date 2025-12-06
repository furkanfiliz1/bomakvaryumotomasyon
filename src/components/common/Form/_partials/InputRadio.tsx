import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, alpha, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';
import { IInputRadio } from '../types';
import CustomHelperText from './components/CustomHelperText';

export default function InputRadio({ form, name, defaultValue, radios }: IInputRadio) {
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const hasError = !!error;
        return (
          <FormControl error={hasError} sx={{ width: '100%' }}>
            <RadioGroup
              name={name}
              defaultValue={defaultValue}
              aria-labelledby="customized-radios"
              value={value}
              onChange={(e) => onChange(e)}
              sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                {radios &&
                  radios.map((radio) => {
                    const isSelected = radio.value === value;
                    return (
                      <Grid key={radio.value} item lg={6} md={6} sm={6} xs={12}>
                        <FormControlLabel
                          checked={isSelected}
                          key={radio.value}
                          value={radio.value}
                          control={
                            <Radio
                              inputRef={ref}
                              sx={{
                                display: 'none', // Hide the default radio button
                              }}
                              // Keep accessibility features
                              inputProps={{
                                'aria-label': radio.label,
                              }}
                            />
                          }
                          label={radio.label}
                          sx={{
                            width: '100%',
                            margin: 0,
                            flex: 1,
                            justifyContent: 'center',
                            backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.08) : '#fff',
                            border: `1px solid ${
                              hasError
                                ? theme.palette.error.main
                                : isSelected
                                  ? theme.palette.primary.main
                                  : theme.palette.grey.A300
                            }`,
                            padding: '12px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
                            '&:hover': {
                              backgroundColor: isSelected
                                ? alpha(theme.palette.primary.main, 0.12)
                                : alpha(theme.palette.primary.main, 0.04),
                              borderColor: hasError ? theme.palette.error.main : theme.palette.primary.main,
                            },
                            '&:focus-within': {
                              boxShadow: `${alpha(
                                hasError ? theme.palette.error.main : theme.palette.primary.main,
                                0.25,
                              )} 0 0 0 0.2rem`,
                              borderColor: hasError ? theme.palette.error.main : theme.palette.primary.main,
                            },
                            '& .MuiFormControlLabel-label': {
                              fontSize: '14px',
                              fontWeight: isSelected ? 500 : 400,
                              color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                              transition: theme.transitions.create(['color', 'font-weight']),
                            },
                          }}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </RadioGroup>
            <CustomHelperText id={`${name}Error`} error={error} />
          </FormControl>
        );
      }}
    />
  );
}
