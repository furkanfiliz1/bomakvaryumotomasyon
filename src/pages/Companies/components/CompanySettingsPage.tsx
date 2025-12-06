import { useErrorListener } from '@hooks';
import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/shared';
import { useGetCompanyByIdQuery } from '../companies.api';
import { CompanyLimitSettings, CompanySettingsSidebar, CompanySystemSettings } from './index';

const CompanySettingsPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [activeSettingsSection, setActiveSettingsSection] = useState('system-settings');

  const {
    data: companyData,
    error,
    isLoading,
  } = useGetCompanyByIdQuery(
    { companyId: companyId! },
    {
      skip: !companyId,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  useErrorListener(error ? [error as Error] : []);

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Typography>Yükleniyor...</Typography>
      </Container>
    );
  }

  if (!companyData) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Typography>Şirket bulunamadı.</Typography>
      </Container>
    );
  }

  // Ayarlar sekmesi içinde aktif section'a göre içerik render fonksiyonu
  const renderSettingsSectionContent = () => {
    const companyIdNum = parseInt(companyId || '0');

    switch (activeSettingsSection) {
      case 'system-settings':
        return <CompanySystemSettings companyId={companyIdNum} companyData={companyData} />;
      case 'limit-settings':
        return <CompanyLimitSettings companyId={companyIdNum} companyData={companyData} />;
      default:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Ayar Seçiniz
            </Typography>
            <Typography>Lütfen sol menüden bir ayar kategorisi seçiniz.</Typography>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <PageHeader
        title={`${companyData.CompanyName} - Şirket Ayarları`}
        subtitle={`VKN/TCKN: ${companyData.Identifier}`}
      />

      {/* Content with sidebar layout */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <CompanySettingsSidebar activeSection={activeSettingsSection} onSectionChange={setActiveSettingsSection} />
          </Grid>
          <Grid item xs={12} md={9}>
            <Card>
              <CardContent>{renderSettingsSectionContent()}</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CompanySettingsPage;
