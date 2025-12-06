import React from 'react';
import { Box, Typography } from '@mui/material';
import { PageHeader } from '@components';

export const StatusGroupsPage: React.FC = () => {
  return (
    <>
      <PageHeader title="Statü Grupları" subtitle="Tüm statü gruplarının tanımlamaları" />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Bu sayfa henüz geliştirilme aşamasındadır.
        </Typography>
      </Box>
    </>
  );
};
