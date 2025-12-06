import { FeatureCardGrid, FeatureCardProps, Icon, PageHeader } from '@components';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReportsPage = () => {
  const navigate = useNavigate();

  // Operation Reports Cards - Following legacy Operasyon Raporları section
  const operationReportsCards: Omit<FeatureCardProps, 'key'>[] = [
    {
      title: 'Entegrasyon Raporları',
      description: 'Entegrasyon İşlemleri İçin Raporlar',
      buttonText: 'Görüntüle',
      buttonId: 'integrationReportsInfo',
      onButtonClick: () => navigate('/reports/integration-reports'),
      icon: <Icon icon="link-03" size={16} />,
    },
    {
      title: 'Tedarikçi Raporları',
      description: 'Tedarikçi Raporlar',
      buttonText: 'Görüntüle',
      buttonId: 'supplierReportsInfo',
      onButtonClick: () => navigate('/reports/supplier-reports'),
      icon: <Icon icon="truck-01" size={16} />,
    },
    {
      title: 'Skor Çekim Raporları',
      description: 'Skor Çekim Raporları',
      buttonText: 'Görüntüle',
      buttonId: 'scoreReportsInfo',
      onButtonClick: () => navigate('/reports/score-invoice-reports'),
      icon: <Icon icon="trend-up-01" size={16} />,
    },
    {
      title: 'Skor Fatura Aktarım Raporları',
      description: 'Skor Fatura Aktarım Raporları',
      buttonText: 'Görüntüle',
      buttonId: 'scoreInvoiceTransferReportsInfo',
      onButtonClick: () => navigate('/reports/score-invoice-transfer-reports'),
      icon: <Icon icon="file-04" size={16} />,
    },
    {
      title: 'Alıcı Limit Raporları',
      description: 'Alıcı Limit Raporları',
      buttonText: 'Görüntüle',
      buttonId: 'buyerLimitReportsInfo',
      onButtonClick: () => navigate('/reports/buyer-limit-reports'),
      icon: <Icon icon="bar-chart-square-02" size={16} />,
    },
    {
      title: 'EUS Takip Raporu',
      description: 'Erken uyarı sistemi kapsamında ay bazlı bloke/uyarı alan firma listesi',
      buttonText: 'Görüntüle',
      buttonId: 'eusTrackingReportsInfo',
      onButtonClick: () => navigate('/reports/eus-tracking-reports'),
      icon: <Icon icon="search-sm" size={16} />,
    },
  ];

  // Reconciliation Reports Cards - Following legacy Mutabakat Raporları section
  const reconciliationReportsCards: Omit<FeatureCardProps, 'key'>[] = [
    {
      title: 'Alıcı-Banka Fatura Mutabakat Raporu',
      description: 'Fatura Mutabakat Raporu',
      buttonText: 'Görüntüle',
      buttonId: 'buyerBankReportInfo',
      onButtonClick: () => navigate('/reports/bank-invoice-reconciliation'),
      icon: <Icon icon="building-01" size={16} />,
    },
    {
      title: 'Alıcı Mutabakat Raporu',
      description: 'Fatura Mutabakat Raporu',
      buttonText: 'Görüntüle',
      buttonId: 'buyerReconciliationReportInfo',
      onButtonClick: () => navigate('/reports/buyer-reconciliation'),
      icon: <Icon icon="users-01" size={16} />,
    },
    {
      title: 'Alıcı-Banka İskonto Mutabakat Raporu',
      description: 'İskonto Mutabakat Raporu',
      buttonText: 'Görüntüle',
      buttonId: 'buyerBankDiscountReportInfo',
      onButtonClick: () => navigate('/reports/bank-discount-reconciliation'),
      icon: <Icon icon="percent-01" size={16} />,
    },
    {
      title: 'Figoskor Garantörlük Protokolü',
      description: 'Garantörlük Protokolü',
      buttonText: 'Görüntüle',
      buttonId: 'figoScoreProtocolInfo',
      onButtonClick: () => navigate('/reports/guarantee-protocol'),
      icon: <Icon icon="shield-tick" size={16} />,
    },
    {
      title: 'Figoskor Entegratör Mutabakatı',
      description: 'Entegratör Bazında Mutabakatı',
      buttonText: 'Görüntüle',
      buttonId: 'figoscoreIntegratorConsensusInfo',
      onButtonClick: () => navigate('/reports/integrator-consensus'),
      icon: <Icon icon="settings-01" size={16} />,
    },
    {
      title: 'Figoskor Lead Kanalı Mutabakatı',
      description: 'Figoskor Lead Kanalı Mutabakatı Raporları',
      buttonText: 'Görüntüle',
      buttonId: 'figoScoreLeadChannelConsensusInfo',
      onButtonClick: () => navigate('/reports/lead-channel-consensus'),
      icon: <Icon icon="target-01" size={16} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Raporlar"
        subtitle="Operasyonel olarak ihtiyacınız olan tüm raporlara bu bölümden erişebilirsiniz."
      />

      {/* Operation Reports Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 3,
            px: 2,
          }}>
          Operasyon Raporları
        </Typography>
        <FeatureCardGrid cards={operationReportsCards} />
      </Box>

      {/* Reconciliation Reports Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 3,
            px: 2,
          }}>
          Mutabakat Raporları
        </Typography>
        <FeatureCardGrid cards={reconciliationReportsCards} />
      </Box>
    </>
  );
};

export default ReportsPage;
