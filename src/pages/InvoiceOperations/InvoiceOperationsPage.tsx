import { FeatureCardGrid, FeatureCardProps, Icon, PageHeader } from '@components';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getOperationCards } from './helpers';

/**
 * Invoice Operations landing page
 * Uses standard FeatureCardGrid component to match other landing pages
 */
const InvoiceOperationsPage: React.FC = () => {
  const navigate = useNavigate();

  // Generate operation cards using consolidated helper function
  const operationCards: Omit<FeatureCardProps, 'key'>[] = getOperationCards().map((card) => ({
    title: card.title,
    description: card.description,
    buttonText: 'Görüntüle',
    buttonId: card.id,
    onButtonClick: () => navigate(card.route),
    icon: <Icon icon={card.icon as 'file-02'} size={16} />,
  }));

  return (
    <>
      <PageHeader title="Fatura & Çek İşlemleri" subtitle="Fatura, Çek ve Alacak Raporlarının Düzenlenmesi" />
      <FeatureCardGrid cards={operationCards} />
    </>
  );
};

export default InvoiceOperationsPage;
