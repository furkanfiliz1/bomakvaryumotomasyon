import React from 'react';
import { Box, Typography } from '@mui/material';
import { PageHeader } from '@components';

export const SectorRatiosPage: React.FC = () => {
  return (
    <>
      <PageHeader title="Sektör Rasyoları" subtitle="Tüm sektörlere göre rasyo tanımlamaları" />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Bu sayfa henüz geliştirilme aşamasındadır.
        </Typography>
      </Box>
    </>
  );
};
