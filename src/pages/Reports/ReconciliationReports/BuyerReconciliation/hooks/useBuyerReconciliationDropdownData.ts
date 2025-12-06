import { useMemo } from 'react';
import { CompanyActivityType } from '../../shared.types';
import { useLazySearchBuyersByCompanyNameOrIdentifierQuery } from '../buyer-reconciliation.api';
import { MonthOption, YearOption } from '../buyer-reconciliation.types';
import { getMonthOptions, getYearOptions } from '../helpers';

/**
 * Custom hook for fetching dropdown data used in Buyer Reconciliation filters
 * Follows OperationPricing pattern for dropdown data management
 * Enhanced with async search for VKN fields
 */
export const useBuyerReconciliationDropdownData = () => {
  // Async search for buyers (Alıcı Şirketler)
  const [
    _searchBuyersByCompanyNameOrIdentifier,
    { data: buyersCompanySearchResults, isLoading: isBuyersSearchLoading },
  ] = useLazySearchBuyersByCompanyNameOrIdentifierQuery();

  // Month options - static data matching legacy implementation
  const monthOptions: MonthOption[] = useMemo(() => getMonthOptions(), []);

  // Year options - dynamic data matching legacy renderDynamicYearList
  const yearOptions: YearOption[] = useMemo(() => getYearOptions(), []);

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

  return {
    // Month/Year dropdown data (static)
    monthOptions,
    yearOptions,

    // Async search data - following BankInvoiceReconciliation pattern
    buyersCompanySearchResults: buyersCompanySearchResults?.Items || [],

    // Async search functions
    searchBuyersByCompanyNameOrIdentifier,

    // Async search loading states
    isBuyersSearchLoading,
  };
};
