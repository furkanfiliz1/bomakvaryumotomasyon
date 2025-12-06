/**
 * Company Limit Table Helpers
 * Table configuration and column definitions for Company Limit Tab
 * Following OperationPricing table pattern
 */

import type { HeadCell } from '../../../../components/common/Table/types';

/**
 * Roof Limit table headers
 * Used in RoofLimit component table
 */
export const getRoofLimitTableHeaders = (): HeadCell[] => [
  { id: 'ProductTypeName', label: 'Ürün Tipi', width: 200 },
  { id: 'Amount', label: 'Tavan Limit', width: 180, type: 'currency' },
  { id: 'UsedLimit', label: 'Kullanılan', width: 150, type: 'currency' },
  { id: 'RemainingLimit', label: 'Kalan', width: 150, type: 'currency' },
  { id: 'actions', label: 'İşlemler', width: 120, slot: true },
];

/**
 * Guarantor Limit List table headers
 * Used in GuarantorLimitList component table
 */
export const getGuarantorLimitTableHeaders = (): HeadCell[] => [
  { id: 'FinancerName', label: 'Finansör', width: 200 },
  { id: 'Ratio', label: 'Garanti Oranı', width: 120 },
  { id: 'TotalLimit', label: 'Tanımlanan Limit', width: 180, type: 'currency' },
  { id: 'UsedLimit', label: 'Risk', width: 150, type: 'currency' },
  { id: 'RemainingLimit', label: 'Kalan Limit', width: 150, type: 'currency' },
  { id: 'IsHold', label: 'Bloke', width: 100, slot: true },
  { id: 'actions', label: 'İşlemler', width: 120, slot: true },
];

/**
 * Non-Guarantor Limit List table headers
 * Used in NonGuarantorLimitList component table
 */
export const getNonGuarantorLimitTableHeaders = (): HeadCell[] => [
  { id: 'FinancerName', label: 'Finansör', width: 200 },
  { id: 'ProductTypeName', label: 'Ürün Tipi', width: 150 },
  { id: 'TotalLimit', label: 'Toplam Limit', width: 150, type: 'currency' },
  { id: 'AvailableLimit', label: 'Kullanılabilir Limit', width: 180, type: 'currency' },
  { id: 'UsedLimit', label: 'Kullanılan Limit', width: 150, type: 'currency' },
  { id: 'Hold', label: 'Bloke Durumu', width: 120, slot: true },
  { id: 'IsSuccess', label: 'Durum', width: 100, slot: true },
  { id: 'actions', label: 'İşlemler', width: 120, slot: true },
];

/**
 * Dashboard statistics card configuration
 * Used in LimitDashboard component
 */
export interface DashboardCardConfig {
  title: string;
  totalAmount: number;
  usedAmount: number;
  remainingAmount: number;
  progressPercentage: number;
}

/**
 * Process dashboard data for cards
 * Matches legacy LimitDashboard component logic
 */
export const processDashboardData = (
  dashboardData: Array<{
    ProductType?: number;
    ProductTypeName?: string;
    Amount?: number;
    UsedLimit?: number;
    RemainingLimit?: number;
  }>,
): DashboardCardConfig[] => {
  return dashboardData.map((item) => {
    const totalAmount = item.Amount || 0;
    const usedAmount = item.UsedLimit || 0;
    const remainingAmount = item.RemainingLimit || 0;

    // Calculate progress percentage for progress bar
    const progressPercentage = totalAmount > 0 ? (remainingAmount / totalAmount) * 100 : 0;

    return {
      title: item.ProductTypeName ? `${item.ProductTypeName} Limiti` : 'Limit',
      totalAmount,
      usedAmount,
      remainingAmount,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
    };
  });
};

/**
 * Get row styling based on conditions
 * Matches legacy conditional styling
 */
export const getRowStyling = (item: {
  UsedLimit?: number;
  IsSuccess?: boolean;
  ErrorMessage?: string | null;
}): {
  backgroundColor?: string;
  color?: string;
  fontWeight?: string;
} => {
  // Error styling for failed operations
  if (item.ErrorMessage) {
    return {
      backgroundColor: '#ffebee',
      color: '#c62828',
    };
  }

  // Warning styling for used limits
  if (item.UsedLimit && item.UsedLimit > 0) {
    return {
      color: '#d32f2f',
      fontWeight: '600',
    };
  }

  // Success styling
  if (item.IsSuccess === true) {
    return {
      backgroundColor: '#e8f5e8',
    };
  }

  return {};
};

/**
 * Sort function for guarantee ratio column
 * Handles null values appropriately
 */
export const sortByRatio = (
  a: { Ratio?: number | null },
  b: { Ratio?: number | null },
  direction: 'asc' | 'desc' = 'asc',
): number => {
  const aValue = a.Ratio || 0;
  const bValue = b.Ratio || 0;

  if (direction === 'desc') {
    return bValue - aValue;
  }

  return aValue - bValue;
};

/**
 * Filter function for table data
 * Used in component filtering logic
 */
export const filterTableData = <T extends Record<string, unknown>>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
): T[] => {
  if (!searchTerm) return data;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return data.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchTerm);
      }
      if (typeof value === 'number') {
        return value.toString().includes(lowerSearchTerm);
      }
      return false;
    }),
  );
};

/**
 * Table configuration for empty states
 * Matches legacy empty list displays
 */
export const getEmptyStateConfig = (type: 'roof' | 'guarantor' | 'nonguarantor') => {
  const configs = {
    roof: {
      title: 'Tavan limit tanımı bulunamadı',
      subTitle: 'Henüz tavan limit tanımı yapılmamış',
      buttonTitle: 'Tavan Limit Ekle',
    },
    guarantor: {
      title: 'Garantörlü limit bulunamadı',
      subTitle: 'Henüz garantörlü limit tanımı yapılmamış',
      buttonTitle: 'Garantörlü Limit Ekle',
    },
    nonguarantor: {
      title: 'Garantörsüz limit bulunamadı',
      subTitle: 'Henüz garantörsüz limit tanımı yapılmamış',
      buttonTitle: 'Limit Sorgula',
    },
  };

  return configs[type];
};

/**
 * Validate table row data
 * Used before table operations
 */
export const validateTableRowData = (
  rowData: Record<string, unknown>,
  requiredFields: string[],
): {
  isValid: boolean;
  missingFields: string[];
} => {
  const missingFields = requiredFields.filter(
    (field) => !rowData[field] || (typeof rowData[field] === 'string' && !rowData[field]?.toString().trim()),
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};
