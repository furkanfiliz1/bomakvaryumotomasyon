import { FeatureCardGrid, FeatureCardProps, Icon, PageHeader } from '@components';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();

  // Card configuration matching legacy implementation exactly
  const pricingCards: Omit<FeatureCardProps, 'key'>[] = [
    {
      title: 'İskonto ve Fatura Başına Ücretlendirme',
      description: 'Ürün ve Finansör Bazlı İşlem Ücreti Tanımlama',
      buttonText: 'Görüntüle',
      buttonId: 'per-invoice-pricing',
      onButtonClick: () => navigate('/pricing/operation-charge-list'),
      icon: <Icon icon="receipt" size={16} />,
    },
    {
      title: 'İşlem Ücreti İndirim Tanımlama',
      description: 'Birim ve Oran Bazlı İşlem Ücreti İndirimi Tanımlama',
      buttonText: 'Görüntüle',
      buttonId: 'transaction-fee-pricing',
      onButtonClick: () => navigate('/pricing/indirim-tanimlama'),
      icon: <Icon icon="percent-01" size={16} />,
    },
    {
      title: 'Web Sitesi İşlem Ücreti Baremleri',
      description: 'Web Sitesi İşlem Ücreti Baremi Ayarları',
      buttonText: 'Görüntüle',
      buttonId: 'transaction-fee-scales',
      onButtonClick: () => navigate('/pricing/islem-ucreti-baremleri'),
      icon: <Icon icon="bar-chart-01" size={16} />,
    },
    {
      title: 'Operasyon Ücretlendirme',
      description: 'İşlem Başı Ödenen ve İade Edilen İşlem Ücretleri',
      buttonText: 'Görüntüle',
      buttonId: 'operation-pricing',
      onButtonClick: () => navigate('/pricing/operasyon-ucretlendirme'),
      icon: <Icon icon="activity" size={16} />,
    },
    {
      title: 'Manuel İşlem Ücreti Ödemeleri Takibi',
      description: 'İşlem Ücreti Kredi/Banka Kartı ile Alınmayan İşlemlerin Takibi',
      buttonText: 'Görüntüle',
      buttonId: 'manual-transaction-tracking',
      onButtonClick: () => navigate('/pricing/manual-transaction-fee-tracking'),
      icon: <Icon icon="credit-card-01" size={16} />,
    },
  ];

  return (
    <>
      <PageHeader title="Ücretlendirme Metodları" subtitle="İskonto ve Kredi Talepleri İçin Ücretlendirme Ayarları" />
      <FeatureCardGrid cards={pricingCards} />
    </>
  );
};

export default PricingPage;
