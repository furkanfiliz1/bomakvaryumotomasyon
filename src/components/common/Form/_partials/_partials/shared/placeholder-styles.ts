import { Theme } from '@mui/material/styles';

export const getPlaceholderTextStyles = (theme: Theme) => ({
  fontSize: '14px',
  color: theme.palette.text.disabled,
  fontWeight: 400,
  lineHeight: 1.5,
});

export const PLACEHOLDER_TEXT_STYLES = {
  fontSize: '14px',
  color: 'text.disabled',
  fontWeight: 400,
  lineHeight: 1.5,
} as const;
