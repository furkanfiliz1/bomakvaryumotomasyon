import { FeatureCardGrid, Icon, PageHeader, type FeatureCardProps } from '@components';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Definitions Landing Page Component
 * Following OperationPricing pattern and Settings implementation
 * Shows all definitions cards in the exact same order as legacy Definitions component
 */
const DefinitionsPage: React.FC = () => {
  const navigate = useNavigate();

  // All definitions cards matching old project exactly (18 cards)
  const definitionsCards: Omit<FeatureCardProps, 'key'>[] = [
    {
      title: 'Müşteri Geliş Kanalı',
      description: 'Müşteri Geliş Kanalları Detayları',
      buttonText: 'Görüntüle',
      buttonId: 'leadingChannelDetail',
      onButtonClick: () => navigate('/definitions/customer-arrival-channels'),
      icon: <Icon icon="users-plus" size={16} />,
    },
    {
      title: 'Entegratör Mutabakat Baremleri',
      description: 'Entegratör Mutabakat Baremi tanımlama',
      buttonText: 'Görüntüle',
      buttonId: 'definingIntegrator',
      onButtonClick: () => navigate('/definitions/integrator-reconciliation-charts'),
      icon: <Icon icon="bar-chart-11" size={16} />,
    },
    {
      title: 'Pozisyonlar',
      description: 'Pozisyon Detayları',
      buttonText: 'Görüntüle',
      buttonId: 'positionDetails',
      onButtonClick: () => navigate('/definitions/user-positions'),
      icon: <Icon icon="users-01" size={16} />,
    },
    {
      title: 'Hedef Tipleri',
      description: 'Hedef Tipleri Detayları',
      buttonText: 'Görüntüle',
      buttonId: 'targetTypesDetails',
      onButtonClick: () => navigate('/definitions/target-types'),
      icon: <Icon icon="target-04" size={16} />,
    },
    {
      title: 'Müşteri Temsilcisi Hedef Girişi',
      description: 'Aylık Bazlı Müşteri Temsilcisi Hedef Girişi',
      buttonText: 'Görüntüle',
      buttonId: 'customerTargetInfo',
      onButtonClick: () => navigate('/definitions/representative-target-entry'),
      icon: <Icon icon="edit-03" size={16} />,
    },
    {
      title: 'Banka Tanımlamaları',
      description: 'Banka Tanımlamaları Detayları',
      buttonText: 'Görüntüle',
      buttonId: 'bankDefinitionDetails',
      onButtonClick: () => navigate('/definitions/bank-definitions'),
      icon: <Icon icon="building-07" size={16} />,
    },
    {
      title: 'Banka-Alıcı Gelir Oranı',
      description: 'Banka-Alıcı Gelir Oranı',
      buttonText: 'Görüntüle',
      buttonId: 'bankIncomeRatio',
      onButtonClick: () => navigate('/definitions/bank-buyer-rates'),
      icon: <Icon icon="percent-02" size={16} />,
    },
    {
      title: 'Fatura - Mali Skor',
      description: 'Fatura - Mali Skor',
      buttonText: 'Görüntüle',
      buttonId: 'invoiceFinancialScore',
      onButtonClick: () => navigate('/definitions/invoice-financial-score'),
      icon: <Icon icon="file-04" size={16} />,
    },
    {
      title: 'Fatura Skor Rasyoları',
      description: 'Fatura Skor Rasyoları',
      buttonText: 'Görüntüle',
      buttonId: 'invoiceScoreRatios',
      onButtonClick: () => navigate('/definitions/invoice-score-ratios'),
      icon: <Icon icon="calculator" size={16} />,
    },
    {
      title: 'Sektör Rasyoları',
      description: 'Sektör Rasyoları',
      buttonText: 'Görüntüle',
      buttonId: 'sectorRatios',
      onButtonClick: () => navigate('/definitions/sector-ratios'),
      icon: <Icon icon="pie-chart-01" size={16} />,
    },
    {
      title: 'Müşteri Temsilcisi',
      description: 'Müşteri Temsilcisi',
      buttonText: 'Görüntüle',
      buttonId: 'customerManagerSetting',
      onButtonClick: () => navigate('/definitions/company-representative-settings'),
      icon: <Icon icon="briefcase-01" size={16} />,
    },
    {
      title: 'Entegratörler',
      description: 'Entegratörler',
      buttonText: 'Görüntüle',
      buttonId: 'integrators',
      onButtonClick: () => navigate('/definitions/integrators'),
      icon: <Icon icon="link-03" size={16} />,
    },
    {
      title: 'Banka-Figo Rebate',
      description: 'Banka-Figo Rebate',
      buttonText: 'Görüntüle',
      buttonId: 'bankFigoRebate',
      onButtonClick: () => navigate('/definitions/bank-figo-rebate'),
      icon: <Icon icon="coins-01" size={16} />,
    },
    {
      title: 'Müşteri Kazanım Ekibi',
      description: 'Müşteri Kazanım Ekibi Üyesi',
      buttonText: 'Görüntüle',
      buttonId: 'customerAcquisitionTeam',
      onButtonClick: () => navigate('/definitions/customer-acquisition-team'),
      icon: <Icon icon="users-03" size={16} />,
    },
    {
      title: 'Başvuru Kanalı',
      description: 'Başvuru Kanalı Listesi ve Detayları',
      buttonText: 'Görüntüle',
      buttonId: 'referralChannel',
      onButtonClick: () => navigate('/definitions/application-channel'),
      icon: <Icon icon="phone-01" size={16} />,
    },
    {
      title: 'Alt Kanal',
      description: 'Alt Kanal Listesi ve Detayları',
      buttonText: 'Görüntüle',
      buttonId: 'subChannel',
      onButtonClick: () => navigate('/definitions/sub-channel'),
      icon: <Icon icon="git-branch-01" size={16} />,
    },
    {
      title: 'Kampanya İndirim Tanımlama',
      description: 'Kampanya Özelinde İndirim Detayları',
      buttonText: 'Görüntüle',
      buttonId: 'campaignDiscountDef',
      onButtonClick: () => navigate('/definitions/campaign-discount-definition'),
      icon: <Icon icon="tag-01" size={16} />,
    },
    {
      title: 'İş Bankası Döviz Kuru',
      description: 'İş Bankası Döviz Kuru Oran Tanımlama',
      buttonText: 'Görüntüle',
      buttonId: 'isBankRates',
      onButtonClick: () => navigate('/definitions/is-bank-rates'),
      icon: <Icon icon="bank" size={16} />,
    },
    {
      title: 'Banka Adı - Banka Şubesi Ekle',
      description: 'Banka Şubesi Tanımlama',
      buttonText: 'Görüntüle',
      buttonId: 'bankBranchDefinitionsBulkUpload',
      onButtonClick: () => navigate('/definitions/bank-branch-definitions-bulk-upload'),
      icon: <Icon icon="bank" size={16} />,
    },
  ];

  return (
    <>
      <PageHeader title="Tanımlamalar" subtitle="Tanımlama sayfası detayları" />

      <FeatureCardGrid cards={definitionsCards} />
    </>
  );
};

export default DefinitionsPage;
