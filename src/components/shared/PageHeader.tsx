import { Box, Typography } from '@mui/material';
import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, rightContent }) => (
  <Box
    sx={{
      background: 'linear-gradient(135deg, #EB5146 0%, #EB5146 100%)',
      color: 'white',
      py: 2,
      px: 2,
      mb: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.9 }}>
        {subtitle}
      </Typography>
    </Box>
    {rightContent && <Box sx={{ textAlign: 'right' }}>{rightContent}</Box>}
  </Box>
);
