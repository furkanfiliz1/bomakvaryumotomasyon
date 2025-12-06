export const companiesNavConfig = [
  {
    title: 'Şirketler',
    breadcrumbTitle: 'Şirketler',
    path: '/companies',
    icon: 'building-01',
    children: [
      {
        path: '/companies/all',
        icon: 'building-01',
        title: 'Tüm Şirketler',
        breadcrumbTitle: 'Tüm Şirketler',
        hidden: true,
      },

      {
        path: '/companies/customer-tracking',
        icon: 'user-plus-01',
        title: 'Yeni Müşteri Takip Sayfası',
        breadcrumbTitle: 'Yeni Müşteri Takip Sayfası',
        hidden: true,
      },

      {
        path: '/companies/leads',
        icon: 'users-01',
        title: 'Müşteri Adayları (Lead)',
        breadcrumbTitle: 'Müşteri Adayları',
        hidden: true,
      },

      {
        path: '/companies/opportunities',
        icon: 'target-04',
        title: 'Fırsatlar',
        breadcrumbTitle: 'Fırsatlar',
        hidden: true,
      },

      {
        path: '/companies/opportunities/add',
        icon: 'plus-circle',
        title: 'Yeni Fırsat',
        breadcrumbTitle: 'Yeni Fırsat',
        hidden: true,
      },

      {
        path: '/companies/opportunities/:opportunityId',
        icon: 'target-04',
        title: 'Fırsat Detay',
        breadcrumbTitle: 'Fırsat Detay',
        hidden: true,
      },

      {
        path: '/companies/new',
        icon: 'plus-circle',
        title: 'Yeni Şirket',
        breadcrumbTitle: 'Yeni Şirket',
        hidden: true,
      },

      {
        path: '/companies/:companyId/:activeTab',
        icon: 'building-01',
        title: 'Şirket Detay',
        breadcrumbTitle: 'Şirket Detay',
        hidden: true,
        children: [
          {
            path: '/companies/:companyId/kullanici/:userId',
            icon: 'user-01',
            title: 'Kullanıcı Detay',
            breadcrumbTitle: 'Kullanıcı Detay',
            hidden: true,
            getBreadcrumbTitle: (params: Record<string, string>) => {
              if (params?.userId === 'yeni') {
                return 'Yeni Kullanıcı';
              }
              return 'Kullanıcı Detay';
            },
          },
        ],
      },

      // Backward compatibility için eski route
      {
        path: '/sirketler/sirket-listesi/:companyId',
        icon: 'building-01',
        title: 'Şirket Detay',
        breadcrumbTitle: 'Şirket Detay',
        hidden: true,
        children: [
          {
            path: '/sirketler/sirket-listesi/:companyId/kullanici/:userId',
            icon: 'user-01',
            title: 'Kullanıcı Detay',
            breadcrumbTitle: 'Kullanıcı Detay',
            hidden: true,
            getBreadcrumbTitle: (params: Record<string, string>) => {
              if (params?.userId === 'yeni') {
                return 'Yeni Kullanıcı';
              }
              return 'Kullanıcı Detay';
            },
          },
        ],
      },
    ],
  },
];
