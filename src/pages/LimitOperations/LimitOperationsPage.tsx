import { Icon } from '@components';
import { useNavigate } from 'react-router-dom';
import { FeatureCardGrid, PageHeader } from '../../components/shared';

const limitOperationTypes = [
  {
    title: 'Fatura Finansman Şirketler',
    text: 'Fatura Finansman Şirket Detayları',
    link: 'companies',
    linkId: 'limitCompaniesView',
  },
  {
    title: 'Fatura Finansman Statü Takibi',
    text: 'Fatura Finansman Statü Bazlı Dashboard',
    link: 'dashboard',
    linkId: 'limitDashboardView',
  },
  {
    title: 'Kanuni Takip',
    text: 'Tazmin Edilen İşlemler İçin Kanuni Takip Süreci',
    link: 'legal-proceedings',
    linkId: 'limitLegalProceedingsView',
  },
];

const LimitOperationsPage = () => {
  const navigate = useNavigate();

  const handleNavigateToLimitType = (limitType: { link: string }) => {
    navigate(`/limit-operations/${limitType.link}`);
  };

  const getIconForLimitType = (link: string) => {
    switch (link) {
      case 'companies':
        return <Icon icon="building-01" size={16} />;
      case 'dashboard':
        return <Icon icon="bar-chart-01" size={16} />;
      case 'legal-proceedings':
        return <Icon icon="scales-01" size={16} />;
      default:
        return <Icon icon="activity" size={16} />;
    }
  };

  const cards = limitOperationTypes.map((limitType) => ({
    title: limitType.title,
    description: limitType.text,
    buttonText: 'Görüntüle',
    onButtonClick: () => handleNavigateToLimitType(limitType),
    buttonId: limitType.linkId,
    icon: getIconForLimitType(limitType.link),
  }));

  return (
    <>
      <PageHeader title="Limit İşlemleri" subtitle="Şirketlerin Limit ve Skor İşlemlerinin Takibi" />
      <FeatureCardGrid cards={cards} />
    </>
  );
};

export default LimitOperationsPage;
