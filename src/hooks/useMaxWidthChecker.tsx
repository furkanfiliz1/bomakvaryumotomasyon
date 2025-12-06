import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Breakpoint } from '@mui/system';

export default function useMaxWidthChecker(key: Breakpoint, difference: number) {
  const theme = useTheme();

  const targetWidth = theme.breakpoints.values[key] + difference;

  const isExactMatch = useMediaQuery(
    `(min-width: ${theme.breakpoints.values[key]}px) and (max-width: ${targetWidth}px)`,
  );

  return isExactMatch;
}
