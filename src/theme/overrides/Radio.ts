import { Theme } from '@mui/material';

export default function Radio(theme: Theme) {
  return {
    MuiRadio: {
      color: theme.palette.secondary,
      styleOverrides: {
        color: theme.palette.neutral[500],
        root: {
          '&.Mui-checked': {},
        },
      },
    },
  };
}
