import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Query = 'up' | 'down' | 'only';

export default function useResponsive(query: Query, key: number | Breakpoint) {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(key));

  const mediaDown = useMediaQuery(theme.breakpoints.down(key));

  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  return null;
}
