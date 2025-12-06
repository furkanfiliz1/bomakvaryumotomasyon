import React from 'react';
import { Box, Typography } from '@mui/material';
import { PageHeader } from '@components';

export const SystemHolidaysPage: React.FC = () => {
  return (
    <>
      <PageHeader title="Sistem Tatil Günleri" subtitle="Tatil gün tanımlamaları" />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Bu sayfa henüz geliştirilme aşamasındadır.
        </Typography>
      </Box>
    </>
  );
};
