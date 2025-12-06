/**
 * Table Configuration Helpers
 * Following OperationPricing pattern for table configuration
 * Matches legacy table structures exactly
 */

import type { HeadCell } from 'src/components/common/Table/types';
import type { FindeksData } from '../company-document-data-tab.types';

/**
 * Financial Data Table Configuration
 * Matches legacy renderFinancialData table structure
 */
export const getFinancialDataTableHeaders = (): HeadCell[] => [
  {
    id: 'typeDescription',
    label: 'Belge Türü',
    width: 200,
  },
  {
    id: 'monthDisplay',
    label: 'Ay',
    width: 100,
  },
  {
    id: 'quarterDisplay',
    label: 'Dönem',
    width: 100,
  },
  {
    id: 'yearDisplay',
    label: 'Yıl',
    width: 100,
  },
  {
    id: 'actions',
    label: 'İşlemler',
    width: 120,
    slot: true,
  },
];

/**
 * Findeks Report Table Configuration for Limit/Risk section
 * Matches legacy renderFindeksData table structure exactly
 */
export const getFindeksLimitRiskTableHeaders = (): HeadCell[] => [
  {
    id: 'category',
    label: 'Kategori',
    width: 150,
  },
  {
    id: 'limit',
    label: 'Limit(TL)',
    width: 150,
    type: 'currency',
  },
  {
    id: 'category2',
    label: 'Kategori',
    width: 150,
  },
  {
    id: 'risk',
    label: 'Risk(TL)',
    width: 150,
    type: 'currency',
  },
];

/**
 * Findeks Report Table Configuration for Faktoring section
 * Matches legacy renderFindeksData faktoring table structure
 */
export const getFindeksFaktoringTableHeaders = (): HeadCell[] => [
  {
    id: 'category',
    label: 'Kategori',
    width: 200,
  },
  {
    id: 'value',
    label: 'Değer',
    width: 150,
  },
];

/**
 * Findeks Report Table Configuration for Additional Info section
 * Matches legacy renderFindeksData additional info table structure
 */
export const getFindeksAdditionalInfoTableHeaders = (): HeadCell[] => [
  {
    id: 'category',
    label: 'Bilgi',
    width: 250,
  },
  {
    id: 'value',
    label: 'Değer',
    width: 150,
  },
];

/**
 * Gets formatted table data for Findeks Limit/Risk section
 * Matches legacy table row structure exactly
 */
export const getFindeksLimitRiskTableData = (findeksData: FindeksData | null) => {
  if (!findeksData) return [];
  return [
    {
      id: 1,
      category: 'Grup',
      limit: findeksData.LimitGroup || '-',
      category2: 'Grup',
      risk: findeksData.RiskGroup || '-',
    },
    {
      id: 2,
      category: 'Nakdi',
      limit: findeksData.LimitCash || '-',
      category2: 'Nakdi',
      risk: findeksData.RiskCash || '-',
    },
    {
      id: 3,
      category: 'Gayri Nakdi',
      limit: findeksData.LimitNonCash || '-',
      category2: 'Gayri Nakdi',
      risk: findeksData.RiskNonCash || '-',
    },
    {
      id: 4,
      category: 'Toplam',
      limit: findeksData.LimitTotal || '-',
      category2: 'Diğer',
      risk: findeksData.RiskOther || '-',
    },
    {
      id: 5,
      category: 'Genel Revize Vadesi',
      limit: findeksData.LimitGeneralRevisionDueDate || '-',
      category2: 'Gecikmeli Borç Toplamı',
      risk: findeksData.CreditBalancesOfFollowUpC2TK || '-',
    },
    {
      id: 6,
      category: 'Gecikmede Hesap Sayısı',
      limit: findeksData.NumberOfAccountsInDelayA4 || '-',
      category2: 'Toplam',
      risk: findeksData.RiskTotal || '-',
    },
  ];
};

/**
 * Gets formatted table data for Findeks Faktoring section
 */
export const getFindeksFaktoringTableData = (findeksData: FindeksData | null) => {
  if (!findeksData) return [];
  return [
    {
      id: 1,
      category: 'Bildirim Dönemi',
      value: findeksData.FaktoringNotificationPeriod || '-',
    },
    {
      id: 2,
      category: 'Kredi Limiti',
      value: findeksData.FaktoringCreditLimit || '-',
    },
    {
      id: 3,
      category: '01-12 Ay Vadeli',
      value: findeksData.Faktoring0112MonthsTerm || '-',
    },
    {
      id: 4,
      category: '12-24 Ay Vadeli',
      value: findeksData.Faktoring1224MonthsTerm || '-',
    },
    {
      id: 5,
      category: '24+ Ay Vadeli',
      value: findeksData.FaktoringMoreThan24MonthsTerm || '-',
    },
    {
      id: 6,
      category: 'Faiz Reeskont + Komisyon',
      value: findeksData.FaktoringInterestRediscountAndCommission || '-',
    },
    {
      id: 7,
      category: 'Faiz Tahakkuku + Komisyon',
      value: findeksData.FaktoringInterestAccrualAndCommission || '-',
    },
    {
      id: 8,
      category: 'Bildirimde Bulunan Kuruluşlar',
      value: findeksData.FaktoringReportingOrganizations || '-',
    },
    {
      id: 9,
      category: 'Limit Doluluk Oranı(01-12 Ay Vadeli + 12 - 24 Ay Vadeli + 24+ ay Vadeli) / Kredi Limiti',
      value: findeksData.FaktoringLimitOccupancyRate || '-',
    },
  ];
};

/**
 * Gets formatted table data for Findeks Additional Info section
 */
export const getFindeksAdditionalInfoTableData = (findeksData: FindeksData | null) => {
  if (!findeksData) return [];
  return [
    {
      id: 1,
      category: 'İlk Kredi Kullanım Tarihi',
      value: findeksData.FirstCreditUsageDateA2 || '-',
    },
    {
      id: 2,
      category: 'Son Kredi Kullanım Tarihi',
      value: findeksData.LastCreditUsageDateA3 || '-',
    },
    {
      id: 3,
      category: 'En Güncel Limit Tahsis Tarihi',
      value: findeksData.LimitAllocationDateA5 || '-',
    },
    {
      id: 4,
      category: 'Takibe Alındığı Tarihteki Kredi Bakiyeleri',
      value: findeksData.CreditBalancesOfFollowUpC2TK || '-',
    },
    {
      id: 5,
      category: 'Varlık Yönetim Şirketlerine Devredilen Ticari Borç Toplamı',
      value: findeksData.TotalTransferredCommercialDebt || '-',
    },
    {
      id: 6,
      category: 'Limit Doluluk Oranı (Risk Nakdi / Limit Nakdi)',
      value: findeksData.LimitOccupancyRate || '-',
    },
    {
      id: 7,
      category: 'Toplam Gecikmeli Borç',
      value: findeksData.TotalDebtInDelayA6 || '-',
    },
  ];
};

/**
 * Empty state configuration for sections
 * Matches legacy empty state messages
 */
export const getEmptyStateConfig = () => ({
  findeks: {
    title: 'Findeks Raporu Bulunamadı',
    message: 'Bu şirket için Findeks raporu bulunmamaktadır.',
  },
  financialData: {
    title: 'Finansal Veri Bulunamadı',
    message: 'Bu şirket için işlenen finansal veri bulunmamaktadır.',
  },
  integrator: {
    title: 'Bilgi Bulunamadı',
    message: 'Entegratör bilgileri yüklenirken bir hata oluştu.',
  },
});
