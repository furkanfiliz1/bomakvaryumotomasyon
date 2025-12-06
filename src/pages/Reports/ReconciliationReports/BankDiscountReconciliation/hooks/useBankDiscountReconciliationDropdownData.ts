import { useMemo } from 'react';
import {
  useGetCompaniesForBankDiscountReconciliationQuery,
  useLazySearchBanksByCompanyNameOrIdentifierQuery,
  useLazySearchBuyersByCompanyNameOrIdentifierQuery,
} from '../bank-discount-reconciliation.api';
import type { Company, MonthOption, YearOption } from '../bank-discount-reconciliation.types';
import { CompanyActivityType } from '../bank-discount-reconciliation.types';

/**
 * Custom hook for fetching dropdown data for Bank Discount Reconciliation filters
 * Following BankInvoiceReconciliation pattern exactly with async search for VKN fields
 */
export const useBankDiscountReconciliationDropdownData = () => {
  // Async search for buyers (Alıcı Şirketler)
  const [
    _searchBuyersByCompanyNameOrIdentifier,
    { data: buyersCompanySearchResults, isLoading: isBuyersSearchLoading },
  ] = useLazySearchBuyersByCompanyNameOrIdentifierQuery();

  // Async search for banks (Finans Şirketler)
  const [_searchBanksByCompanyNameOrIdentifier, { data: banksCompanySearchResults, isLoading: isBanksSearchLoading }] =
    useLazySearchBanksByCompanyNameOrIdentifierQuery();

  // Fetch banks (Type 2 = Finans Şirketler)
  const {
    data: banksResponse,
    isLoading: banksLoading,
    error: banksError,
  } = useGetCompaniesForBankDiscountReconciliationQuery({
    type: 2,
    sort: 'CompanyName',
    sortType: 'Asc',
    page: 1,
    pageSize: 100,
  });

  // Fetch buyers (Type 1 = Alıcı Şirketler)
  const {
    data: buyersResponse,
    isLoading: buyersLoading,
    error: buyersError,
  } = useGetCompaniesForBankDiscountReconciliationQuery({
    type: 1,
    sort: 'CompanyName',
    sortType: 'Asc',
    page: 1,
    pageSize: 100,
  });

  // Transform companies data to dropdown format
  const banks = useMemo(() => {
    if (!banksResponse?.Items) return [];
    return banksResponse.Items.map((bank: Company) => ({
      label: bank.CompanyName,
      value: bank.Identifier,
      id: bank.Id,
    }));
  }, [banksResponse?.Items]);

  const buyers = useMemo(() => {
    if (!buyersResponse?.Items) return [];
    return buyersResponse.Items.map((buyer: Company) => ({
      label: buyer.CompanyName,
      value: buyer.Identifier,
      id: buyer.Id,
    }));
  }, [buyersResponse?.Items]);

  // Month options with Turkish names (matching legacy exactly)
  const monthOptions: MonthOption[] = useMemo(
    () => [
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

  // Search function for buyers - following BankInvoiceReconciliation pattern
  const searchBuyersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchBuyersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.BUYER,
      }).unwrap();
    } catch (error) {
      console.error('Buyer search error:', error);
    }
  };

  // Search function for banks - following BankInvoiceReconciliation pattern
  const searchBanksByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchBanksByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.FINANCIER,
      }).unwrap();
    } catch (error) {
      console.error('Bank search error:', error);
    }
  };

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

    // Async search data
    buyersCompanySearchResults: buyersCompanySearchResults?.Items || [],
    banksCompanySearchResults: banksCompanySearchResults?.Items || [],

    // Async search functions
    searchBuyersByCompanyNameOrIdentifier,
    searchBanksByCompanyNameOrIdentifier,

    // Async search loading states
    isBuyersSearchLoading,
    isBanksSearchLoading,
  };
};
