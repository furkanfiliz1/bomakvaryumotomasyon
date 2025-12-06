import React from 'react';
import { Box, Typography } from '@mui/material';
import { PageHeader } from '@components';

export const SystemPermissionsPage: React.FC = () => {
  return (
    <>
      <PageHeader title="Sistem Yetkileri" subtitle="Sistem yetkileri ve izinleri" />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Bu sayfa henüz geliştirilme aşamasındadır.
        </Typography>
      </Box>
    </>
  );
};
