import { useErrorListener } from '@hooks';
import { Box, Button, Card, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/shared';
import { CompanyStatusUpdateRequest } from '../../Companies/companies.types';
import { CompanyStatusUpdateModal } from '../../Companies/components/CompanyStatusUpdateModal';
import { EInvoiceTransferHistoryPage } from '../../Score/EInvoiceTransferHistory';
import { BuyerLimitsTabPage } from '../CompanyBuyerLimitsTab';
import { CompanyLimitTabPage } from '../CompanyLimitTab';
import {
  useGetCompanyDetailQuery,
  useGetLimitAvailableOnboardingStatusQuery,
  useGetLimitCompanySettingsQuery,
  useUpdateLimitCompanyOnboardingStatusMutation,
} from '../limit-operations.api';
import {
  CompanyDocumentDataTab,
  CompanyEInvoicesTab,
  CompanyGeneralTab,
  CompanyHistoryTab,
  CompanyScoreRulesTab,
  CompanyScoreTab,
  InvoiceBuyerTab,
} from './';

const tabs = [
  {
    id: 'genel',
    title: 'Genel Bilgiler',
    component: CompanyGeneralTab,
  },
  {
    id: 'skor',
    title: 'Skor Bilgileri',
    component: CompanyScoreTab,
  },
  {
    id: 'fatura-skor',
    title: 'Fatura Skor',
    component: InvoiceBuyerTab,
  },
  {
    id: 'e-faturalar',
    title: 'E-Faturalar',
    component: CompanyEInvoicesTab,
  },
  {
    id: 'dokuman',
    title: 'İşlenen Veriler',
    component: CompanyDocumentDataTab,
  },
  {
    id: 'kural',
    title: 'Kural',
    component: CompanyScoreRulesTab,
  },
  {
    id: 'limit',
    title: 'Limit',
    component: CompanyLimitTabPage,
  },
  {
    id: 'alici-bazli-skor',
    title: 'Alıcı Bazlı Skor',
    component: BuyerLimitsTabPage,
  },
  {
    id: 'tarihce',
    title: 'Tarihçe',
    component: CompanyHistoryTab,
  },
  {
    id: 'gecmis',
    title: 'E-Fatura Geçmişi',
    component: 'EInvoiceTransferHistory', // Will be handled in switch case
    hide: true,
  },
];

const LimitCompanyDetailPage = () => {
  const navigate = useNavigate();
  const { companyId, activeTab } = useParams<{ companyId: string; activeTab?: string }>();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const {
    data: companyDetailResponse,
    isLoading: loading,
    error,
    refetch: refetchCompany,
  } = useGetCompanyDetailQuery({ companyId: Number.parseInt(companyId || '0') }, { skip: !companyId });

  // Get company settings to show current onboarding status
  const {
    data: companySettings,
    isLoading: isSettingsLoading,
    refetch: refetchSettings,
  } = useGetLimitCompanySettingsQuery({ companyId: Number.parseInt(companyId || '0') }, { skip: !companyId });

  // Get available onboarding statuses for the modal
  const { data: availableStatuses = [] } = useGetLimitAvailableOnboardingStatusQuery(
    { companyId: companyId! },
    { skip: !companyId || !isStatusModalOpen },
  );

  // Update company onboarding status mutation
  const [updateCompanyStatus, { isLoading: isUpdating, error: updateError, isSuccess }] =
    useUpdateLimitCompanyOnboardingStatusMutation();

  useErrorListener([error, updateError]);

  useEffect(() => {
    if (isSuccess) {
      refetchCompany();
      refetchSettings();
    }
  }, [isSuccess, refetchCompany, refetchSettings]);

  // Determine initial tab based on URL parameter
  const initialTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const initialTabIndex = tabs.findIndex((t) => t.id === initialTab.id);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(initialTabIndex);

  // Redirect to default tab if no activeTab is specified
  if (!activeTab) {
    navigate(`/limit-operations/companies/${companyId}/${tabs[0].id}`, { replace: true });
  }

  const onTabChange = (_: React.SyntheticEvent, index: number) => {
    setActiveTabIndex(index);
    const tab = tabs[index];
    navigate(`/limit-operations/companies/${companyId}/${tab.id}`);
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
      refetchSettings();
    } catch (error) {
      console.error('Şirket durumu güncellenirken bir hata oluştu!', error);
    }
  };

  const getCurrentComponent = () => {
    const currentTab = tabs[activeTabIndex];

    // Render specific component based on tab ID
    switch (currentTab?.id) {
      case 'genel':
        return <CompanyGeneralTab companyId={companyId || ''} />;
      case 'skor':
        return <CompanyScoreTab companyId={companyId || ''} />;
      case 'fatura-skor':
        return <InvoiceBuyerTab companyId={companyId || ''} />;
      case 'e-faturalar':
        return <CompanyEInvoicesTab companyId={companyId || ''} />;
      case 'dokuman':
        return (
          <CompanyDocumentDataTab companyId={companyId || ''} identifier={companyDetailResponse?.Identifier || ''} />
        );
      case 'kural':
        return <CompanyScoreRulesTab companyId={companyId || ''} />;
      case 'limit':
        return <CompanyLimitTabPage companyId={companyId || ''} />;
      case 'alici-bazli-skor':
        return <BuyerLimitsTabPage companyId={companyId || ''} />;
      case 'tarihce':
        return <CompanyHistoryTab companyId={companyId || ''} />;
      case 'gecmis':
        return <EInvoiceTransferHistoryPage />;
      default:
        return <CompanyGeneralTab companyId={companyId || ''} />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
        <CircularProgress size={40} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Şirket bilgileri yükleniyor...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <div>Hata: Detay sayfası yüklenirken bir sorun oluştu.</div>;
  }

  // Extract company info from the response (no data wrapper)
  const companyDetail = companyDetailResponse;
  const companyName = companyDetail?.CompanyName || 'Şirket';
  const identifier = companyDetail?.Identifier;

  // Create right content for PageHeader
  const renderPageHeaderRightContent = () => {
    if (isSettingsLoading || loading) {
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
        title={`${companyName} - Skor Bilgileri`}
        subtitle={identifier ? `VKN: ${identifier}` : 'Şirket detay bilgileri'}
        rightContent={renderPageHeaderRightContent()}
      />
      <Card sx={{ mx: 2, mb: 2, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, p: 0 }}>
        <Tabs
          value={activeTabIndex}
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="company detail tabs">
          {tabs.map((tab) => {
            if (tab.hide) return null;
            return <Tab id={tab.title} label={tab.title} key={tab.id} />;
          })}
        </Tabs>
      </Card>
      <Box mx={2}>
        <Card sx={{ p: 2 }}>
          <Box sx={{ pt: 3 }}>{getCurrentComponent()}</Box>
        </Card>
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
    </>
  );
};

export default LimitCompanyDetailPage;
