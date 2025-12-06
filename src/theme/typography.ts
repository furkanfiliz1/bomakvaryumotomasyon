import { TypographyOptions } from '@mui/material/styles/createTypography';
import palette from './palette';

function pxToRem(value: number) {
  return `${value / 16}rem`;
}

// function responsiveFontSizes({ sm, md, lg, xs }: { sm: number; md: number; lg: number; xs?: number }) {
//   return {
//     '@media (min-width:200px)': {
//       fontSize: pxToRem(xs || 12),
//     },
//     '@media (min-width:600px)': {
//       fontSize: pxToRem(sm),
//     },
//     '@media (min-width:900px)': {
//       fontSize: pxToRem(md),
//     },
//     '@media (min-width:1200px)': {
//       fontSize: pxToRem(lg),
//     },
//   };
// }

const FONT_PRIMARY = 'Inter, sans-serif';

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  color: palette.neutral[800],
  h1: {
    fontWeight: 700,
    lineHeight: 80 / 64,
    fontSize: pxToRem(40),
    // ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 600,
    lineHeight: 64 / 48,
    fontSize: pxToRem(24),
    color: palette.neutral[800],
    // ...responsiveFontSizes({ xs: 20, sm: 20, md: 22, lg: 24 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(24),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    // ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    // ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 18,
    fontSize: pxToRem(17),
    // ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  h7: {
    fontWeight: 600,
    lineHeight: 26 / 18,
    fontSize: pxToRem(20),
    color: palette.neutral[800],
    // ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  h8: {
    fontWeight: 600,
    lineHeight: 24 / 18,
    fontSize: pxToRem(18),
    color: palette.neutral[800],
    // ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 500,
    color: palette.neutral[800],
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  subtitle3: {
    fontWeight: 400,
    lineHeight: '18px',
    fontSize: pxToRem(12),
  },
  subtitle4: {
    fontWeight: 500,
    lineHeight: '16px',
    fontSize: pxToRem(10),
  },
  cell: {},
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body4: {
    lineHeight: 20 / 12,
    fontSize: 14,
    fontWeight: 600,
    color: palette.neutral[800],
  },
  body5: {
    lineHeight: 20 / 12,
    fontSize: pxToRem(14),
    fontWeight: 500,
    color: palette.neutral[600],
  },
  caption: {
    lineHeight: 1.5,
    fontWeight: 500,
    fontSize: '12px',
    color: palette.neutral[600],
    wordWrap: 'break-word',
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  button: {
    fontWeight: 600,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'capitalize',
  },
} as TypographyOptions;

export default typography;
