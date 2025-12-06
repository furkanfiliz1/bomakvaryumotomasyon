import { Theme } from '@mui/material/styles';

export default function Input(theme: Theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.disabled },
          },
        },
        input: {
          '&::placeholder': {
            color: theme.palette.text.disabled,
          },
          '&.MuiSelect-select': {
            backgroundColor: 'red !important',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          '&::placeholder': {
            color: theme.palette.text.disabled,
          },
          '&.MuiSelect-select': {},
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.neutral[500_56],
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.neutral[500_12],
          '&:hover': {
            backgroundColor: theme.palette.neutral[500_16],
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.focus,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.neutral[500_56],
          },
        },
      },
    },
  };
}
