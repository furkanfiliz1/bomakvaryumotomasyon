import { useErrorListener } from '@hooks';
import { Box, Button, Card, CardContent, Container, Grid, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '../../../components/shared';
import {
  useGetAvailableOnboardingStatusQuery,
  useGetCompanyByIdQuery,
  useGetCompanySettingsQuery,
  useUpdateCompanyOnboardingStatusMutation,
} from '../companies.api';
import { CompanyStatusUpdateRequest } from '../companies.types';
import {
  CompanyCodesTab,
  CompanyCommentsPage,
  CompanyCustomerAcquisition,
  CompanyCustomerRepresentative,
  CompanyDetailInfo,
  CompanyDetailInfoSidebar,
  CompanyDocuments,
  CompanyGeneralTab,
  CompanyGroup,
  CompanyLeadingChannel,
  CompanyLimitSettings,
  CompanyRoles,
  CompanyServiceProvider,
  CompanySettingsSidebar,
  CompanyStatusUpdateModal,
  CompanySystemSettings,
  CompanyTransactionHistory,
  CompanyUserDetailPage,
  CompanyUsersList,
  CompanyWallet,
  FinancialSettingsTab,
} from './index';

const tabList = [
  { id: 'genel', label: 'Genel' },
  { id: 'detay', label: 'Detay' },
  { id: 'dokuman', label: 'Doküman' },
  { id: 'roller', label: 'Roller' },
  { id: 'kullanici', label: 'Kullanıcı' },
  { id: 'kullanici-edit', label: 'Kullanıcı Düzenle', hidden: true }, // Gizli tab - sadece routing için
  { id: 'sirket-kodlari', label: 'Şirket Kodu Tanımlama', hideForSeller: true }, // Only for Buyer & Financier
  { id: 'servis-saglayici', label: 'Servis Sağlayıcı' },
  { id: 'ayarlar', label: 'Ayarlar' },
  { id: 'tarihce', label: 'Tarihçe' },
  { id: 'finansal-ayarlar', label: 'Finansal Ayarlar', onlyForFinancier: true }, // Only for Financier
];

const CompanyDetailPage: React.FC = () => {
  const { companyId, activeTab, userId } = useParams<{
    companyId: string;
    activeTab?: string;
    userId?: string;
  }>();
  const navigate = useNavigate();
  const [activeDetailSection, setActiveDetailSection] = useState('detail-info');
  const [activeSettingsSection, setActiveSettingsSection] = useState('system-settings');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Eğer userId varsa, activeTab'ı kullanici-edit olarak set et
  const currentTab = userId ? 'kullanici-edit' : activeTab || 'genel';

  const {
    data: companyData,
    error,
    isLoading,
    refetch: refetchCompany,
  } = useGetCompanyByIdQuery(
    { companyId: companyId! },
    {
      skip: !companyId,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Get company settings to show current onboarding status
  const {
    data: companySettings,
    isLoading: isSettingsLoading,
    refetch: refetchSettings,
  } = useGetCompanySettingsQuery(
    { companyId: parseInt(companyId || '0') },
    {
      skip: !companyId,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Get available onboarding statuses for the modal
  const { data: availableStatuses = [] } = useGetAvailableOnboardingStatusQuery(
    { companyId: companyId! },
    { skip: !companyId || !isStatusModalOpen },
  );

  // Update company onboarding status mutation
  const [updateCompanyStatus, { isLoading: isUpdating, error: updateError, isSuccess }] =
    useUpdateCompanyOnboardingStatusMutation();

  useErrorListener([error, updateError]);

  useEffect(() => {
    if (isSuccess) {
      refetchCompany();
      refetchSettings();
    }
  }, [isSuccess, refetchCompany, refetchSettings]);

  // Tab değişikliklerinde verileri yenile
  useEffect(() => {
    if (companyId) {
      refetchCompany();
      refetchSettings();
    }
  }, [currentTab, companyId, refetchCompany, refetchSettings]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(`/companies/${companyId}/${newValue}`);
  };

  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  const handleStatusUpdate = async (data: CompanyStatusUpdateRequest) => {
    try {
      await updateCompanyStatus({
        companyId: companyId!,
        data,
      }).unwrap();

      setIsStatusModalOpen(false);

      // Refetch company and settings data to get updated status
      refetchCompany();
    } catch (error) {
      console.error('Şirket durumu güncellenirken bir hata oluştu!', error);
    }
  };

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

  const renderTabContent = () => {
    switch (currentTab) {
      case 'genel':
        return <CompanyGeneralTab companyData={companyData} />;
      case 'detay':
        return null; // Detay sekmesi özel layout kullanacak
      case 'dokuman':
        return <CompanyDocuments companyId={parseInt(companyId || '0')} />;
      case 'roller':
        return <CompanyRoles companyId={parseInt(companyId || '0')} />;
      case 'kullanici':
        return <CompanyUsersList companyId={parseInt(companyId || '0')} />;
      case 'kullanici-edit':
        return <CompanyUserDetailPage companyIdentifier={companyData?.Identifier} />; // Kullanıcı edit komponenti
      case 'sirket-kodlari':
        return <CompanyCodesTab />;
      case 'servis-saglayici':
        return (
          <CompanyServiceProvider
            companyId={Number.parseInt(companyId || '0', 10)}
            companyIdentifier={companyData?.Identifier || ''}
          />
        );
      case 'finansal-ayarlar':
        return <FinancialSettingsTab companyId={Number.parseInt(companyId || '0', 10)} />;
      case 'ayarlar':
        return null; // Ayarlar sekmesi özel layout kullanacak
      case 'tarihce':
        return <CompanyCommentsPage companyId={Number.parseInt(companyId || '0', 10)} />;
      default:
        return <CompanyGeneralTab companyData={companyData} />;
    }
  };

  // Detay sekmesi içinde aktif section'a göre içerik render fonksiyonu
  const renderDetailSectionContent = () => {
    const companyIdNum = parseInt(companyId || '0');
    switch (activeDetailSection) {
      case 'detail-info':
        return <CompanyDetailInfo companyId={companyIdNum} />;
      case 'leading-channel':
        return <CompanyLeadingChannel companyId={companyIdNum} />;
      case 'customer-representative':
        return <CompanyCustomerRepresentative companyId={companyIdNum} companyIdentifier={companyData?.Identifier} />;
      case 'customer-acquisition':
        return <CompanyCustomerAcquisition companyId={companyIdNum} />;
      case 'group-company':
        return (
          <CompanyGroup
            companyId={companyIdNum}
            CompanyGroupStatus={companyData?.CompanyGroupStatus || 0}
            refetchCompanies={refetchCompany}
          />
        );
      case 'transaction-history':
        return <CompanyTransactionHistory companyId={companyIdNum} activityType={companyData?.ActivityType} />;
      case 'wallet':
        return <CompanyWallet companyId={companyIdNum} />;
      default:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Bölüm Seçiniz
            </Typography>
            <Typography>Lütfen sol menüden bir bölüm seçiniz.</Typography>
          </Box>
        );
    }
  };

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

  // Create right content for PageHeader
  const renderPageHeaderRightContent = () => {
    if (isSettingsLoading || isLoading) {
      return null;
    }
    return (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
          Şirket Durumu : {companySettings?.OnboardingStatusName || '-'}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleOpenStatusModal}
          disabled={isUpdating}>
          Durumu Güncelle
        </Button>
      </Box>
    );
  };

  return (
    <>
      <PageHeader
        title={companyData.CompanyName}
        subtitle={`VKN/TCKN: ${companyData.Identifier}`}
        rightContent={renderPageHeaderRightContent()}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', margin: '0 16px', background: 'white', borderRadius: '8px' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="company detail tabs">
          {tabList
            .filter((tab) => {
              // Hide tabs marked as hidden
              if (tab.hidden) return false;
              // Hide "Şirket Kodları" tab for Seller companies (ActivityType === 2)
              if (tab.hideForSeller && companyData.ActivityType === 2) return false;
              // Hide "Finansal Ayarlar" tab for non-Financier companies (Type !== 2)
              if (tab.onlyForFinancier && companyData.Type !== 2) return false;
              return true;
            })
            .map((tab) => (
              <Tab key={tab.id} label={tab.label} value={tab.id} />
            ))}
        </Tabs>
      </Box>
      <Box sx={{ paddingInline: 2 }}>
        {/* Tabs */}

        {/* Content */}
        <Box sx={{ mt: 3 }}>
          {currentTab === 'detay' ? (
            // Detay sekmesi: sidebar layout
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <CompanyDetailInfoSidebar
                  activeSection={activeDetailSection}
                  onSectionChange={setActiveDetailSection}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <Card>
                  <CardContent>{renderDetailSectionContent()}</CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : currentTab === 'ayarlar' ? (
            // Ayarlar sekmesi: sidebar layout
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <CompanySettingsSidebar
                  activeSection={activeSettingsSection}
                  onSectionChange={setActiveSettingsSection}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <Card>
                  <CardContent>{renderSettingsSectionContent()}</CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : currentTab === 'kullanici-edit' || currentTab === 'tarihce' ? (
            // Kullanıcı edit & tarihçe: full width layout (card olmadan)
            renderTabContent()
          ) : currentTab === 'finansal-ayarlar' ? (
            // Finansal Ayarlar sekmesi: custom layout with save button
            renderTabContent()
          ) : (
            // Diğer sekmeler: normal layout
            <Card>
              <CardContent>{renderTabContent()}</CardContent>
            </Card>
          )}
        </Box>

        {/* Company Status Update Modal */}
        <CompanyStatusUpdateModal
          open={isStatusModalOpen}
          onClose={handleCloseStatusModal}
          onSubmit={handleStatusUpdate}
          availableStatuses={availableStatuses}
          currentStatus={companySettings?.OnboardingStatusType?.toString()}
          isLoading={isUpdating}
        />
      </Box>
    </>
  );
};

export default CompanyDetailPage;
