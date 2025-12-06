import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import palette from 'src/theme/palette';

const HeaderTypography = styled(Typography)(() => ({
  textTransform: 'uppercase',
  lineHeight: 1.5,
  fontWeight: 500,
  fontSize: '12px',
  color: palette.neutral[600],
  wordWrap: 'break-word',
}));

export default HeaderTypography;
