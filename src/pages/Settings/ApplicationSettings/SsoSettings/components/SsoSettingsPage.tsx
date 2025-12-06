import React from 'react';
import { Box, Typography } from '@mui/material';
import { PageHeader } from '@components';

export const SsoSettingsPage: React.FC = () => {
  return (
    <>
      <PageHeader title="Tekli Oturum Açma" subtitle="SSO ayarları ve konfigürasyonu" />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Bu sayfa henüz geliştirilme aşamasındadır.
        </Typography>
      </Box>
    </>
  );
};
