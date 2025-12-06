import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Bank Buyer Rates Table Configuration
 * Following BankDefinitions table pattern exactly
 */

export const getBankBuyerRatesTableHeaders = (): HeadCell[] => [
  {
    id: 'ReceiverCompanyId',
    label: 'Alıcı Şirket',
    width: 250,
    slot: true,
  },
  {
    id: 'FinancerCompanyId',
    label: 'Finansör Şirket',
    width: 250,
    slot: true,
  },
  {
    id: 'Rate',
    label: 'Gelir Oranı',
    width: 150,
    slot: true,
  },
  {
    id: 'Amount',
    label: 'Gelir Tutarı',
    width: 150,
    slot: true,
  },
  {
    id: 'IsConsensus',
    label: 'Mutabakat Yapılacak mı?',
    width: 200,
    slot: true,
  },
  {
    id: 'actions',
    label: '',
    width: 150,
    slot: true,
  },
];
