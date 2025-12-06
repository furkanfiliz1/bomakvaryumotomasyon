import { Icon } from '@components';
import { isDev } from '@helpers';
import { useNavigate } from 'react-router-dom';
import { FeatureCardGrid, PageHeader } from '../../../components/shared';

const companyModules = [
  {
    title: 'Şirketler',
    text: 'Üye Olan Şirket Detayları',
    link: 'all',
    linkId: 'companiesListView',
  },
  {
    title: 'Yeni Müşteri Takip Sayfası',
    text: 'Yeni Müşterilerin Takibi',
    link: 'customer-tracking',
    linkId: 'customerTrackingView',
  },
  ...(isDev
    ? [
        {
          title: 'Müşteri Adayları (Lead)',
          text: 'Potansiyel Müşteri Takip ve Yönetim',
          link: 'leads',
          linkId: 'leadManagementView',
        },
      ]
    : []),

  {
    title: 'Fırsatlar',
    text: 'Satış Fırsatlarının Takip ve Yönetimi',
    link: 'opportunities',
    linkId: 'opportunityManagementView',
  },
];

const CompaniesDashboardPage = () => {
  const navigate = useNavigate();

  const handleNavigateToModule = (module: { link: string }) => {
    navigate(`/companies/${module.link}`);
  };

  const getIconForModule = (link: string) => {
    switch (link) {
      case 'all':
        return <Icon icon="building-01" size={16} />;
      case 'customer-tracking':
        return <Icon icon="user-plus-01" size={16} />;
      case 'leads':
        return <Icon icon="users-01" size={16} />;
      default:
        return <Icon icon="activity" size={16} />;
    }
  };

  const cards = companyModules.map((module) => ({
    title: module.title,
    description: module.text,
    buttonText: 'Görüntüle',
    onButtonClick: () => handleNavigateToModule(module),
    buttonId: module.linkId,
    icon: getIconForModule(module.link),
  }));

  return (
    <>
      <PageHeader title="Şirketler" subtitle="Üye Olan Şirketlerin Listesi" />
      <FeatureCardGrid cards={cards} />
    </>
  );
};

export default CompaniesDashboardPage;
