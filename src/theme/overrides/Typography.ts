import { Theme } from '@mui/material/styles';

export default function Typography(theme: Theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
  };
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h7: true;
    body3: true;
    body4: true;
    body5: true;
    body6: true;
    subtitle3: true;
    subtitle4: true;
  }
}
