import { alpha } from '@mui/material/styles';

// SETUP COLORS
const PRIMARY = {
  main: '#0c54ee',
  900: '#07328F',
  800: '#0A43BE',
  700: '#0c54ee',
  600: '#4945FF',
  500: '#6d98f5',
  400: '#AFC6FA',
  300: '#DBE5FD',
  200: '#F0F5FE',
  100: '#F9FBFF',
};

const NEUTRAL = {
  900: '#161C24',
  800: '#334156',
  600: '#65758B',
  700: '#65758B',
  500: '#94A3B8',
  400: '#A5A5BA',
  300: '#f3f3f3',
  200: '#F1F5F9',
  100: '#F8FAFC',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

const DARK = {
  900: '#130F26',
  800: '#423f51',
  700: '#716F7D',
  600: alpha('#716F7D', 0.6),
  500: alpha('#716F7D', 0.5),
  400: alpha('#716F7D', 0.4),
  300: alpha('#716F7D', 0.3),
  200: alpha('#716F7D', 0.2),
  100: alpha('#716F7D', 0.1),
};

const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#023047',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
};

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#8ECAE6',
  dark: '#207eae',
  darker: '#04297A',
  contrastText: '#fff',
};

const SUCCESS = {
  900: '#469670',
  800: '#66CA9A',
  700: '#58BC8C',
  600: '#69C397',
  500: '#9BD7BA',
  400: '#9BD7BA',
  300: '#CDEBDD',
  200: '#eef8f3',
  100: '#EEF8F4',
  background100: 'linear-gradient(0deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.90) 100%), #58BC8C',
};

const WARNING = {
  900: '#C28933',
  800: '#DA9A3A',
  700: '#F2AB40',
  601: '#F6C479',
  600: '#F9D59F',
  500: '#F9D59F',
  400: '#F9D59F',
  300: '#f7ddb2',
  200: '#FEF7EC',
  100: '#FEF7EC',
};

const ERROR = {
  900: '#A43931',
  800: '#C8453B',
  700: '#EB5146',
  600: '#F39790',
  500: '#f0c3bf',
  400: '#FAD4D1',
  300: '#f7e2e0',
  100: '#FDEEEC',
  200: '#FDEEEC',
  A100: '#FAD3D1',
};

const GREY = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#f4f6f8',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#f5f5f5',
  A200: '#eeeeee',
  A300: '#E1E6EF',
  A400: '#bdbdbd',
  A700: '#616161',
};

const COMMON = {
  black: '#000',
  white: '#fff',
  white9: 'rgba(255, 255, 255, 0.9)',
  white8: 'rgba(255, 255, 255, 0.8)',
  white7: 'rgba(255, 255, 255, 0.7)',
  white6: 'rgba(255, 255, 255, 0.6)',
  white5: 'rgba(255, 255, 255, 0.5)',
  white4: 'rgba(255, 255, 255, 0.4)',
  white3: 'rgba(255, 255, 255, 0.3)',
  white2: 'rgba(255, 255, 255, 0.2)',
  white1: 'rgba(255, 255, 255, 0.1)',
};

const ORANGE = {
  100: '#FAD3D1',
  200: '#FADDB3',
  500: '#DA9A3A',
  600: '#C28933',
};

const SMALL_LOGO = {
  main: '#FF5A5A',
};

export const palette = {
  common: { ...COMMON },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  dark: { ...DARK },
  error: { ...ERROR },
  neutral: NEUTRAL,
  grey: GREY,
  smallLogo: { ...SMALL_LOGO },
  orange: { ...ORANGE },
};

export default palette;
