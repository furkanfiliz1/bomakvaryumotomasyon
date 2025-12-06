import { Theme } from '@mui/material/styles';

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: '#fff',
            '&:disabled': {
              color: '#fff',
            },
          },
        },
        {
          props: { color: 'primary', variant: 'contained' },
          style: {
            backgroundColor: theme.palette.primary[700],
            '&:disabled': {
              borderColor: theme.palette.primary[400],
              backgroundColor: theme.palette.primary[400],
              color: '#fff',
            },
          },
        },
        {
          props: { color: 'error', variant: 'contained' },
          style: {
            backgroundColor: theme.palette.error[700],
            color: '#fff',
            '&:disabled': {
              borderColor: theme.palette.error[400],
              backgroundColor: theme.palette.error[400],
              color: '#fff',
            },
          },
        },
        {
          props: { color: 'warning', variant: 'contained' },
          style: {
            backgroundColor: theme.palette.warning[700],
            color: '#fff !important',
            '&:disabled': {
              borderColor: theme.palette.warning[400],
              backgroundColor: theme.palette.warning[400],
              color: '#fff !important',
            },
          },
        },
        {
          props: { color: 'success', variant: 'contained' },
          style: {
            backgroundColor: theme.palette.success[700],
            color: '#fff',
            '&:disabled': {
              borderColor: theme.palette.success[400],
              backgroundColor: theme.palette.success[400],
              color: '#fff',
            },
          },
        },
        {
          props: { color: 'secondary', variant: 'contained' },
          style: {
            backgroundColor: theme.palette.dark[800],
            color: '#fff',
            '&:disabled': {
              borderColor: theme.palette.dark[300],
              backgroundColor: theme.palette.dark[300],
              color: '#fff',
            },
            '&:hover': {
              borderColor: theme.palette.dark[800],
              backgroundColor: theme.palette.dark[800],
            },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {},
        },
        {
          props: { color: 'primary', variant: 'outlined' },
          style: {
            borderColor: theme.palette.primary[700],
            color: theme.palette.primary[700],
            '&:disabled': {
              borderColor: theme.palette.primary[400],
              color: theme.palette.primary[400],
            },
            '&:hover': {
              borderColor: theme.palette.primary[800],
              color: theme.palette.primary[800],
            },
          },
        },
        {
          props: { variant: 'outlinedWhite' },
          style: {
            border: `1px solid #fff`,
            backgroundColor: '#fff',
            color: theme.palette.primary[700],
            '&:disabled': {
              borderColor: '#fff',
              color: '#fff',
            },
            '&:hover': {
              borderColor: 'transparent',
              backgroundColor: '#fff',
              color: theme.palette.primary[700],
            },
          },
        },
        {
          props: { color: 'error', variant: 'outlined' },
          style: {
            borderColor: theme.palette.error[700],
            color: theme.palette.error[700],
            '&:disabled': {
              borderColor: theme.palette.error[400],
              color: theme.palette.error[400],
            },
            '&:hover': {
              borderColor: theme.palette.error[800],
              color: theme.palette.error[800],
            },
          },
        },
        {
          props: { color: 'warning', variant: 'outlined' },
          style: {
            borderColor: theme.palette.warning[700],
            color: theme.palette.warning[700],
            '&:disabled': {
              borderColor: theme.palette.warning[400],
              color: theme.palette.warning[400],
            },
            '&:hover': {
              borderColor: theme.palette.warning[700],
              color: theme.palette.warning[700],
            },
          },
        },
        {
          props: { color: 'success', variant: 'outlined' },
          style: {
            borderColor: theme.palette.success[700],
            color: theme.palette.success[700],
            '&:disabled': {
              borderColor: theme.palette.success[400],
              color: theme.palette.success[400],
            },
            '&:hover': {
              borderColor: theme.palette.success[900],
              color: theme.palette.success[900],
            },
          },
        },
        {
          props: { color: 'secondary', variant: 'outlined' },
          style: {
            borderColor: theme.palette.dark[800],
            color: theme.palette.dark[800],
            '&:disabled': {
              borderColor: theme.palette.dark[300],
              color: theme.palette.dark[300],
            },
            '&:hover': {
              borderColor: theme.palette.dark[900],
              color: theme.palette.dark[900],
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            ':hover': {
              backgroundColor: 'transparent',
            },
          },
        },
        {
          props: { variant: 'text', color: 'primary' },
          style: {
            color: theme.palette.primary[700],
            ':disabled': {
              color: theme.palette.primary[400],
            },
            ':hover': {
              color: theme.palette.primary[800],
            },
          },
        },
        {
          props: { variant: 'text', color: 'error' },
          style: {
            color: theme.palette.error[700],
            ':disabled': {
              color: theme.palette.error[400],
            },
            ':hover': {
              color: theme.palette.error[800],
            },
          },
        },
        {
          props: { variant: 'text', color: 'warning' },
          style: {
            color: theme.palette.warning[700],
            ':disabled': {
              color: theme.palette.warning[400],
            },
            ':hover': {
              color: theme.palette.warning[800],
            },
          },
        },
        {
          props: { variant: 'text', color: 'success' },
          style: {
            color: theme.palette.success[700],
            ':disabled': {
              color: theme.palette.success[400],
            },
            ':hover': {
              color: theme.palette.success[800],
            },
          },
        },
        {
          props: { variant: 'text', color: 'secondary' },
          style: {
            color: theme.palette.dark[800],
            ':disabled': {
              color: theme.palette.dark[300],
            },
            ':hover': {
              color: theme.palette.dark[900],
            },
          },
        },
        {
          props: { variant: 'opac' },
          style: {
            backgroundColor: theme.palette.primary[300],
            color: theme.palette.primary[700],
            '&:hover': {
              backgroundColor: theme.palette.primary[400],
            },
          },
        },
        {
          props: { variant: 'icon' },
          style: {
            backgroundColor: '#fff',
            textTransform: 'none',
            minHeight: '36px !important',
            minWidth: '36px !important',
            padding: '0 !important',
            border: `1px solid ${theme.palette.neutral[400]}`,
            color: theme.palette.neutral[500],
            '& svg': {
              height: 16,
              width: 16,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:hover': {
            boxShadow: 'none',
          },
          '&:disabled': {
            cursor: 'not-allowed',
          },
        },
        sizeLarge: {
          minHeight: 40,
        },
        containedInherit: {
          borderRadius: 10,
          color: theme.palette.neutral[800],
          boxShadow: theme.customShadows.z8,
          '&:hover': {
            backgroundColor: theme.palette.neutral[400],
          },
        },
        containedSecondary: {
          boxShadow: theme.customShadows.secondary,
        },
        containedSuccess: {
          color: 'white',
          backgroundColor: theme.palette.success[600],
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  };
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    icon: true;
    opac: true;
    outlinedWhite: true;
  }
}
