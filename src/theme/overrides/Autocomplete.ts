import { Theme } from '@mui/material/styles';

export default function Autocomplete(theme: Theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.z20,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          input: {
            '&::placeholder': {
              opacity: 1,
              color: theme.palette.text.disabled,
            },
            '&.MuiSelect-select': {
              paddingRight: '24px !important',
            },
          },
        },
      },
    },
  };
}
