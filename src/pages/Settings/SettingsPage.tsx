import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, PageHeader, FeatureCardGrid, type FeatureCardProps } from '@components';

/**
 * Settings Landing Page Component
 * Following OperationPricing pattern and Reports implementation
 * Shows all settings cards in the exact same order as legacy Settings.js
 */
const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  // All settings cards in the exact same order as the legacy project
  const settingsCards: Omit<FeatureCardProps, 'key'>[] = [
    {
      title: 'Sistem Tatil Günleri',
      description: 'Sistem tatil günlerini görüntüleyin ve yönetin.',
      buttonText: 'Görüntüle',
      buttonId: 'systemHolidaysInfo',
      onButtonClick: () => navigate('/settings/system-holidays'),
      icon: <Icon icon="calendar-date" size={16} />,
    },
    {
      title: 'Statü Grupları',
      description: 'Statü gruplarını görüntüleyin ve yönetin.',
      buttonText: 'Görüntüle',
      buttonId: 'statusGroupsInfo',
      onButtonClick: () => navigate('/settings/status-groups'),
      icon: <Icon icon="users-01" size={16} />,
    },
    {
      title: 'Dil Seçenekleri',
      description: 'Dil seçeneklerini görüntüleyin ve yönetin.',
      buttonText: 'Görüntüle',
      buttonId: 'languageOptionsInfo',
      onButtonClick: () => navigate('/settings/language-options'),
      icon: <Icon icon="globe-05" size={16} />,
    },
    {
      title: 'Dil Çevirileri',
      description: 'Dil çevirilerini görüntüleyin ve yönetin.',
      buttonText: 'Görüntüle',
      buttonId: 'languageTranslatesInfo',
      onButtonClick: () => navigate('/settings/language-translations'),
      icon: <Icon icon="translate-01" size={16} />,
    },
    {
      title: 'Sistem Yetkileri',
      description: 'Sistem yetkilerini görüntüleyin ve yönetin.',
      buttonText: 'Görüntüle',
      buttonId: 'systemInformation',
      onButtonClick: () => navigate('/settings/system-permissions'),
      icon: <Icon icon="shield-01" size={16} />,
    },
    {
      title: 'Design Guide',
      description: 'Tasarım kılavuzunu görüntüleyin.',
      buttonText: 'Görüntüle',
      buttonId: 'designGuide',
      onButtonClick: () => navigate('/settings/design-guide'),
      icon: <Icon icon="palette" size={16} />,
    },
    {
      title: 'SSO',
      description: 'SSO ayarlarını görüntüleyin ve yönetin.',
      buttonText: 'Görüntüle',
      buttonId: 'ssoInfo',
      onButtonClick: () => navigate('/settings/sso'),
      icon: <Icon icon="key-01" size={16} />,
    },
    {
      title: 'Arama Değeri',
      description: 'Arama değerlerini görüntüleyin ve yönetin.',
      buttonText: 'Görüntüle',
      buttonId: 'searchValue',
      onButtonClick: () => navigate('/settings/search-values'),
      icon: <Icon icon="search-sm" size={16} />,
    },
    {
      title: 'İl İlçe Ekleme',
      description: 'İl ve ilçe bilgilerini yönetin.',
      buttonText: 'Görüntüle',
      buttonId: 'cityDistrict',
      onButtonClick: () => navigate('/settings/city-district'),
      icon: <Icon icon="marker-pin-01" size={16} />,
    },
    {
      title: 'Duyurular',
      description: 'Duyuruları görüntüleyin ve yönetin.',
      buttonText: 'Görüntüle',
      buttonId: 'announcement',
      onButtonClick: () => navigate('/settings/announcements'),
      icon: <Icon icon="announcement-01" size={16} />,
    },
  ];

  return (
    <>
      <PageHeader title="Ayarlar" subtitle="Sistem ayarları tanımlanabilir/değiştirilebilir" />

      <FeatureCardGrid cards={settingsCards} />
    </>
  );
};

export default SettingsPage;
