import { PropsWithChildren } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { trTR, enUS } from '@mui/material/locale';
import palette from './palette';
import typography from './typography';
import { componentsOverrides } from './overrides';
import shadows, { customShadows } from './shadows';

export default function ThemeProvider({ children }: PropsWithChildren) {
  const language = 'tr';

  const theme = createTheme({ palette, typography, shadows, customShadows }, language === 'tr' ? trTR : enUS);

  theme.components = componentsOverrides(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
