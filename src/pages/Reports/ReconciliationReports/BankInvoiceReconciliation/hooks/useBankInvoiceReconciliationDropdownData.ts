import { useMemo } from 'react';
import {
  useGetBuyersByActivityTypeQuery,
  useGetCompaniesForBankInvoiceReconciliationQuery,
} from '../bank-invoice-reconciliation.api';
import type { Company, MonthOption, YearOption } from '../bank-invoice-reconciliation.types';

/**
 * Custom hook for fetching dropdown data for Bank Invoice Reconciliation filters
 * Following OperationPricing pattern for dropdown data management
 */
export const useBankInvoiceReconciliationDropdownData = () => {
  // Fetch buyers using companies/activityType/1 endpoint
  const { data: buyersResponse, isLoading: buyersLoading, error: buyersError } = useGetBuyersByActivityTypeQuery();

  // Fetch banks (Type 2 = Finans Şirketler)
  const {
    data: banksResponse,
    isLoading: banksLoading,
    error: banksError,
  } = useGetCompaniesForBankInvoiceReconciliationQuery({
    type: 2,
    sort: 'CompanyName',
    sortType: 'Asc',
    page: 1,
    pageSize: 100,
  });

  // Transform banks data to dropdown format with Identifier - CompanyName format
  const banks = useMemo(() => {
    if (!banksResponse?.Items) return [];
    return banksResponse.Items.map((bank: Company) => ({
      label: `${bank.Identifier} - ${bank.CompanyName}`,
      value: bank.Identifier,
      id: bank.Id,
    }));
  }, [banksResponse?.Items]);

  // Transform buyers data to dropdown format with Identifier - CompanyName format
  const buyers = useMemo(() => {
    if (!buyersResponse) return [];
    return buyersResponse.map((buyer: { Id: number; Identifier: string; CompanyName: string }) => ({
      label: `${buyer.Identifier} - ${buyer.CompanyName}`,
      value: buyer.Identifier,
      id: buyer.Id,
    }));
  }, [buyersResponse]);

  // Month options with Turkish names (matching legacy exactly)
  const monthOptions = useMemo(
    (): MonthOption[] => [
      { value: 1, label: 'Ocak' },
      { value: 2, label: 'Şubat' },
      { value: 3, label: 'Mart' },
      { value: 4, label: 'Nisan' },
      { value: 5, label: 'Mayıs' },
      { value: 6, label: 'Haziran' },
      { value: 7, label: 'Temmuz' },
      { value: 8, label: 'Ağustos' },
      { value: 9, label: 'Eylül' },
      { value: 10, label: 'Ekim' },
      { value: 11, label: 'Kasım' },
      { value: 12, label: 'Aralık' },
    ],
    [],
  );

  // Year options (current year ±5 years, matching legacy)
  const yearOptions = useMemo((): YearOption[] => {
    const currentYear = new Date().getFullYear();
    const years: YearOption[] = [];

    for (let i = -5; i < 5; i++) {
      const year = currentYear + i;
      years.push({ value: year, label: year.toString() });
    }

    return years;
  }, []);

  // Get default bank (first bank from the list, matching legacy behavior)
  const defaultBank = useMemo(() => {
    return banks.length > 0 ? banks[0] : null;
  }, [banks]);

  return {
    // Static dropdown data
    banks,
    buyers,
    monthOptions,
    yearOptions,
    defaultBank,

    // Loading states
    isLoading: banksLoading || buyersLoading,
    banksLoading,
    buyersLoading,

    // Error states
    error: banksError || buyersError,
    banksError,
    buyersError,

    // Raw data for advanced use cases
    banksResponse,
    buyersResponse,
  };
};
