import { Box, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

interface BadgeProps {
  desciprition: string;
  color: 'primary' | 'success' | 'error' | 'warning';
}
const Badge: FC<BadgeProps> = ({ desciprition, color }) => {
  const theme = useTheme();
  const getStatusColor = (color: 'primary' | 'success' | 'error' | 'warning') => {
    switch (color) {
      case 'primary':
        return theme.palette.primary[300];
      case 'success':
        return theme.palette.success[400];
      case 'error':
        return theme.palette.error[400];
      case 'warning':
        return theme.palette.warning[400];

      default:
        return theme.palette.primary[300];
    }
  };

  return (
    <Box
      role="button"
      sx={{
        bgcolor: getStatusColor(color),
        borderRadius: 1,
        px: 1.2,
        py: 0.3,
        width: 'fit-content',
        textAlign: 'center',
        cursor: 'pointer',
      }}>
      <Typography color="black" variant="caption">
        {desciprition}
      </Typography>
    </Box>
  );
};

export default Badge;
