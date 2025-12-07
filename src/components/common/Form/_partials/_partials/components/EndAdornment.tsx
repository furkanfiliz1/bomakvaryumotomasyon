import { Box, useTheme } from '@mui/material';
import { FC } from 'react';

export const EndAdornment: FC<{ endAdornmentText?: string }> = (props) => {
  const { endAdornmentText } = props;
  const theme = useTheme();

  if (!endAdornmentText) return null;
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.neutral[100],
        width: '40px',
        position: 'absolute',
        top: '2px',
        right: '2px',
        bottom: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 55,
        fontSize: 16,
        fontWeight: 800,
      }}>
      {endAdornmentText}
    </Box>
  );
};
