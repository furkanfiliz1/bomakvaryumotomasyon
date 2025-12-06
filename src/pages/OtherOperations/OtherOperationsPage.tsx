import { useNavigate } from 'react-router-dom';
import { FeatureCardGrid, FeatureCardProps, PageHeader, Icon } from '@components';

const OtherOperationsPage = () => {
  const navigate = useNavigate();

  // Card configuration matching the original Bulk Operations pattern
  const operationCards: Omit<FeatureCardProps, 'key'>[] = [
    {
      title: 'Limitleri Pasife Al',
      description: 'Limitleri topluca vkn ile pasife alabilirsiniz',
      buttonText: 'Görüntüle',
      buttonId: 'limits-to-passive',
      onButtonClick: () => navigate('/other-operations/limitleri-pasife-al'),
      icon: <Icon icon="pause-circle" size={16} />,
    },
    {
      title: 'TTK Limit Sorgulama',
      description: 'Taksitli Ticari Kredi limitlerini sorgulayabilirsiniz.',
      buttonText: 'Görüntüle',
      buttonId: 'ttk-limit-query',
      onButtonClick: () => navigate('/other-operations/ttk-limit-sorgulama'),
      icon: <Icon icon="search-lg" size={16} />,
    },
    {
      title: 'Alıcıya Tanımlı Tedarikçi Sorgusu',
      description: "Alıcı Koduna Göre İş Bankası'nda Tanımlı Tedarikçileri sorgulayabilirsiniz",
      buttonText: 'Görüntüle',
      buttonId: 'supplier-query',
      onButtonClick: () => navigate('/other-operations/supplier-query'),
      icon: <Icon icon="users-01" size={16} />,
    },
    {
      title: 'Faturalı Spot Kredi Limit Sorgulama',
      description: 'Faturalı Spot Kredi limitlerini sorgulayabilirsiniz.',
      buttonText: 'Görüntüle',
      buttonId: 'spot-loan-limits',
      onButtonClick: () => navigate('/other-operations/spot-loan-limits'),
      icon: <Icon icon="trend-up-01" size={16} />,
    },
    {
      title: 'Rotatif Kredi Limit Sorgulama',
      description: 'Rotatif Kredi limitlerini sorgulayabilirsiniz.',
      buttonText: 'Görüntüle',
      buttonId: 'revolving-loan-limits',
      onButtonClick: () => navigate('/other-operations/revolving-loan-limits'),
      icon: <Icon icon="refresh-cw-01" size={16} />,
    },
  ];

  return (
    <>
      <PageHeader title="Diğer İşlemler" subtitle="Diğer İşlem içerikleri" />
      <FeatureCardGrid cards={operationCards} />
    </>
  );
};

export default OtherOperationsPage;
