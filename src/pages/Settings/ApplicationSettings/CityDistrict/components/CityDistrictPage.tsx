import React from 'react';
import { Box, Typography } from '@mui/material';
import { PageHeader } from '@components';

export const CityDistrictPage: React.FC = () => {
  return (
    <>
      <PageHeader title="İl-İlçe Yönetimi" subtitle="İl ve ilçe bilgilerinin yönetimi" />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Bu sayfa henüz geliştirilme aşamasındadır.
        </Typography>
      </Box>
    </>
  );
};
