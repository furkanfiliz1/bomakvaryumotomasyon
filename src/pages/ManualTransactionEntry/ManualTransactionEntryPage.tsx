import { Icon } from '@components';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeatureCardGrid, PageHeader } from '../../components/shared';
import { ChequeAllowanceModal } from './components';

const ManualTransactionEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [chequeModalOpen, setChequeModalOpen] = useState(false);

  const handleNavigateToFinancialRecords = () => {
    navigate('/manual-transaction-entry/financial-records');
  };

  const handleNavigateToDifferenceEntry = () => {
    navigate('/manual-transaction-entry/difference-entry');
  };

  const handleOpenChequeModal = () => {
    setChequeModalOpen(true);
  };

  const handleCloseChequeModal = () => {
    setChequeModalOpen(false);
  };

  const featureCards = [
    {
      title: 'Gelir Gider Girişi',
      description: 'Gelir Gider Girişi Detayları',
      buttonText: 'Görüntüle',
      onButtonClick: handleNavigateToFinancialRecords,
      icon: <Icon icon="coins-01" size={16} />,
    },
    {
      title: 'Farklılık Girişi',
      description: 'Farklılık Girişi Detayları',
      buttonText: 'Görüntüle',
      onButtonClick: handleNavigateToDifferenceEntry,
      icon: <Icon icon="calculator" size={16} />,
    },
    {
      title: 'Figo Finans Manuel Çek Girişi',
      description: 'Manuel Çek Girişi',
      buttonText: 'Teklif Oluştur',
      onButtonClick: handleOpenChequeModal,
      icon: <Icon icon="edit-01" size={16} />,
    },
  ];

  return (
    <>
      <PageHeader title="Manuel İşlem Girişi" subtitle="Gelir Gider Girişi ve Farklılık Girişi" />

      <FeatureCardGrid cards={featureCards} />

      {/* Cheque Allowance Modal */}
      <ChequeAllowanceModal open={chequeModalOpen} onClose={handleCloseChequeModal} />
    </>
  );
};

export default ManualTransactionEntryPage;
