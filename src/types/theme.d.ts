import palette from 'src/theme/palette';
import { customShadows } from 'src/theme/shadows';
import typography from 'src/theme/typography';
import { Palette } from '@mui/material/styles/createPalette';
import { Typography } from '@mui/material/styles/createTypography';

type ExtendedPalette = typeof palette & Palette;
 type ExtendedTypography = typeof typography & Typography;
type CustomShadows = typeof customShadows;

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
    palette: ExtendedPalette;
    typography: ExtendedTypography;
  }

  interface ThemeOptions {
    customShadows: CustomShadows;
    palette: ExtendedPalette;
    typography: ExtendedTypography;
  }

  interface TypographyVariants {
    cell: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    cell?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    cell: true;
  }
}
