import { Theme } from '@mui/material';

export default function Card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.palette.grey.A300}`,
          borderRadius: 8,
          position: 'relative',
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2' },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
  };
}
