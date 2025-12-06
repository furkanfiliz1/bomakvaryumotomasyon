export const invoiceOperationsNavConfig = [
  {
    title: 'Fatura & Çek İşlemleri',
    breadcrumbTitle: 'Fatura & Çek İşlemleri',
    path: '/invoice-operations',
    icon: 'file-02',
  },
  {
    title: 'Alacak Raporu',
    breadcrumbTitle: 'Alacak Raporu',
    path: '/invoice-operations/receivable-report',
    icon: 'file-text',
    hidden: true,
  },
  {
    title: 'Alacak Detayı',
    breadcrumbTitle: 'Alacak Detayı',
    path: '/invoice-operations/receivable-report/:id',
    icon: 'eye',
    hidden: true,
  },
];
