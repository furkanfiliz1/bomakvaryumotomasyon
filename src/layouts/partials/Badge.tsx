import { Box, Typography, styled, useTheme } from '@mui/material';
import { FC } from 'react';

const StyledBadge = styled(Box)<{ color: string }>(({ color }) => ({
  backgroundColor: color,
  paddingInline: 10,
  paddingBlock: 8,
  height: 25,
  marginLeft: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
}));

const StyledBadgeText = styled(Typography)<{ color: string }>(({ color }) => ({
  color,
  fontWeight: 600,
  fontSize: 12,
  display: 'flex',
  alignItems: 'center',
  height: 25,
}));

const NewBadge: FC = () => {
  const theme = useTheme();

  return (
    <StyledBadge color={theme.palette.primary[700]}>
      <StyledBadgeText color={'#fff'}>Yeni</StyledBadgeText>
    </StyledBadge>
  );
};

const SoonBadge: FC = () => {
  return (
    <StyledBadge color={'#6D98F5'}>
      <StyledBadgeText color={'#07328F'}>Yakında</StyledBadgeText>
    </StyledBadge>
  );
};

const BetaBadge: FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* <NewBadge /> */}
      <StyledBadge color={'#9BD7BA'}>
        <StyledBadgeText color={'#07328F'}>Beta</StyledBadgeText>
      </StyledBadge>
    </Box>
  );
};

export { SoonBadge, NewBadge, BetaBadge };
