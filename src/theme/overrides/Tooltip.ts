import { Theme } from '@mui/material';

export default function Tooltip(theme: Theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey.A300,
          color: theme.palette.neutral[800],
        },
        arrow: {
          color: theme.palette.grey.A300,
        },
      },
    },
  };
}
