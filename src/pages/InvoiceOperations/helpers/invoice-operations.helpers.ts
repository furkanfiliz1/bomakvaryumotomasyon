import { OperationCard } from '../invoice-operations.types';

/**
 * Configuration for all Invoice & Check Operations cards
 * Matches legacy 7-card structure exactly with descriptions and icons from old project
 */
export const getOperationCards = (): (OperationCard & { description: string; icon: string })[] => [
  {
    id: 'invoice-report',
    title: 'Fatura Raporu',
    description: 'Fatura Raporu ve Fatura Düzeneme',
    icon: 'file-02',
    route: '/invoice-operations/invoice-report',
    disabled: false,
  },
  {
    id: 'invoice-add',
    title: 'Fatura Ekle',
    description: 'Kobi Finansmanı Fatura Yükleme',
    icon: 'plus-circle',
    route: '/invoice-operations/invoice-add',
    disabled: false,
  },
  {
    id: 'invoice-transaction',
    title: 'Fatura Kesme İşlemleri',
    description: 'Fatura Kesme Detayları',
    icon: 'corner-up-left',
    route: '/invoice-operations/invoice-transaction',
    disabled: false,
  },
  {
    id: 'receivable-report',
    title: 'Alacak Raporu',
    description: 'Alacak Raporu ve Alacak Düzenleme',
    icon: 'file-05',
    route: '/invoice-operations/receivable-report',
    disabled: false,
  },
  {
    id: 'receivable-add',
    title: 'Alacak Ekle',
    description: 'Alacak Yükleme İşlemleri',
    icon: 'plus-square',
    route: '/invoice-operations/receivable-add',
    disabled: false,
  },
  {
    id: 'check-report',
    title: 'Çek Raporu',
    description: 'Çek Raporu ve Çek Düzenleme',
    icon: 'receipt',
    route: '/invoice-operations/check-report',
    disabled: false,
  },
];
