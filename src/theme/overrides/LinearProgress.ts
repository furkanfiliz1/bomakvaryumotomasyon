import { Theme } from '@mui/material';

export default function LinearProgress(theme: Theme) {
  return {
    MuiLinearProgress: {
      variants: [
        {
          props: { color: 'success' },
          style: {
            '.MuiLinearProgress-bar': {
              backgroundColor: theme.palette.success[700],
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary[300],
          '.MuiLinearProgress-bar': {
            backgroundColor: '#6D98F5',
            styleOverrides: {
              root: {},
            },
          },
        },
      },
    },
  };
}
