import React from 'react';
import { Box, Typography } from '@mui/material';
import { PageHeader } from '@components';

export const DesignGuidePage: React.FC = () => {
  return (
    <>
      <PageHeader title="Tasarım Kılavuzu" subtitle="UI/UX tasarım standardları" />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Bu sayfa henüz geliştirilme aşamasındadır.
        </Typography>
      </Box>
    </>
  );
};
