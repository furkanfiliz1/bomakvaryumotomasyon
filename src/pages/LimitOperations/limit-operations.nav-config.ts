export const limitOperationsNavConfig = [
  {
    title: 'Limit İşlemleri',
    breadcrumbTitle: 'Limit İşlemleri',
    path: '/limit-operations',
    icon: 'credit-card-01',
    children: [
      {
        path: '/limit-operations/companies',
        icon: 'building-01',
        title: 'Şirketler',
        breadcrumbTitle: 'Şirketler',
        hidden: true,
      },
      {
        path: '/limit-operations/companies/:companyId/:activeTab?',
        icon: 'building-01',
        title: 'Şirket Detay',
        breadcrumbTitle: 'Şirket Detay',
        hidden: true,
      },
      {
        path: '/limit-operations/dashboard',
        icon: 'bar-chart-01',
        title: 'Dashboard',
        breadcrumbTitle: 'Dashboard',
        hidden: true,
      },
      {
        path: '/limit-operations/legal-proceedings',
        icon: 'scales-01',
        title: 'Kanuni Takip',
        breadcrumbTitle: 'Kanuni Takip',
        hidden: true,
        children: [
          {
            path: '/limit-operations/legal-proceedings/compensation-transactions',
            icon: 'receipt',
            title: 'Muhasebe İşlemleri',
            breadcrumbTitle: 'Muhasebe İşlemleri',
            hidden: true,
          },
        ],
      },
    ],
  },
];
