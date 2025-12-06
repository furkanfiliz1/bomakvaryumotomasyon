import { useMemo } from 'react';
import { useGetFinancersQuery } from '../../../discount-operations.api';

// Environment-based Figo Finans configuration
const isQa = process.env.REACT_APP_ENV_NAME === 'qa';
const isProduction = process.env.REACT_APP_ENV_NAME === 'production';

// Default Figo Finans ID based on environment
let figoFinansId = 25163; // Test environment default
if (isQa) {
  figoFinansId = 11000;
} else if (isProduction) {
  figoFinansId = 30399;
}

export const initialFinancerFigoFinans = {
  label: 'FİGO FİNANS FAKTORİNG ANONİM ŞİRKETİ  (7450380576)',
  value: '7450380576',
  id: figoFinansId,
};

/**
 * Custom hook to fetch financer company data from the API
 * Fetches companies with type=2 (financers) and transforms them for use in form dropdowns
 */
export function useFinancerData() {
  const {
    data: financersData,
    isLoading,
    error,
  } = useGetFinancersQuery({
    sort: 'CompanyName',
    sortType: 'Asc',
    type: 2,
    page: 1,
    pageSize: 999,
  });

  const financiers = useMemo(() => {
    if (!financersData?.Items) return [];

    const options = financersData.Items.map((financer) => ({
      value: financer.Identifier,
      label: `${financer.CompanyName} (${financer.Identifier})`,
    }));

    // Add initial Figo Finans option if not already present and set as default
    const figoFinansExists = options.some((option) => option.value === initialFinancerFigoFinans.value);
    if (!figoFinansExists) {
      options.unshift({
        value: initialFinancerFigoFinans.value,
        label: initialFinancerFigoFinans.label,
      });
    }

    return options;
  }, [financersData]);

  return {
    financiers,
    isLoading,
    error,
    hasData: !!financersData?.Items?.length,
  };
}
