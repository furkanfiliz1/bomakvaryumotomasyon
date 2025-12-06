import { useMemo } from 'react';
import {
  useGetBuyersByActivityTypeQuery,
  useGetCurrenciesQuery,
  useGetInvoiceSourceTypesQuery,
  useLazySearchSellersForInvoiceQuery,
} from '../invoice-report.api';
import type { StatusOption, TypeOption } from '../invoice-report.types';

/**
 * Hook for fetching dropdown data used in InvoiceReport filters
 * Following OperationPricing useOperationPricingDropdownData pattern exactly
 */
export const useInvoiceReportDropdownData = () => {
  // Fetch dropdown data
  const { data: invoiceSourceTypesData, isLoading: isInvoiceSourceTypesLoading } = useGetInvoiceSourceTypesQuery();
  const { data: currenciesData, isLoading: isCurrenciesLoading } = useGetCurrenciesQuery();
  const { data: buyersData, isLoading: isBuyersLoading } = useGetBuyersByActivityTypeQuery({ page: 1 });

  // Transform data to match dropdown format - filter and sort like legacy implementation
  const invoiceSourceTypes = useMemo(() => {
    if (!invoiceSourceTypesData) return [];

    // Filter source types to include only specific values: ['1', '2', '3', '9']
    const filteredTypes = invoiceSourceTypesData.filter((source) => ['1', '2', '3', '9'].includes(source.Value));

    // Sort by Value and limit to 10 items (matching legacy behavior)
    return filteredTypes.sort((a, b) => (a.Value > b.Value ? 1 : -1)).slice(0, 10);
  }, [invoiceSourceTypesData]);

  const currencies = useMemo(() => currenciesData || [], [currenciesData]);

  const buyersList = useMemo(() => buyersData || [], [buyersData]);

  // Async search for sellers (for autocomplete) - uses dedicated seller endpoint
  const [
    _searchSellersByCompanyNameOrIdentifier,
    { data: sellersCompanySearchResults, isLoading: isSellersSearchLoading },
  ] = useLazySearchSellersForInvoiceQuery();

  const searchSellersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchSellersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier: CompanyNameOrIdentifier || '',
        CompanyActivityType: 2, // Seller activity type
      });
    } catch (error) {
      console.error('Error searching sellers:', error);
    }
  };

  // Static options that don't require API calls - matches legacy exactly
  const usingStatusOptions: StatusOption[] = useMemo(
    () => [
      { id: '1', name: 'Uygun' },
      { id: '0', name: 'Kullanılmış' },
    ],
    [],
  );

  const invoiceTypeOptions: TypeOption[] = useMemo(
    () => [
      { value: '1', label: 'E-Fatura' },
      { value: '2', label: 'Kağıt Fatura' },
    ],
    [],
  );

  const deleteStatusOptions: TypeOption[] = useMemo(
    () => [
      { value: '0', label: 'Hayır' },
      { value: '1', label: 'Evet' },
    ],
    [],
  );

  const notifyBuyerOptions: TypeOption[] = useMemo(
    () => [
      { value: '1', label: 'Bildirimli' },
      { value: '0', label: 'Bildirimsiz' },
    ],
    [],
  );

  const invoiceStatusOptions: TypeOption[] = useMemo(
    () => [
      { value: '0', label: 'Pasif' },
      { value: '1', label: 'Aktif' },
    ],
    [],
  );

  const profileIdOptions: TypeOption[] = useMemo(
    () => [
      { value: 'TICARIFATURA', label: 'Ticari E-Fatura' },
      { value: 'TEMELFATURA', label: 'Temel E-Fatura' },
      { value: 'EARSIVFATURA', label: 'E-Arşiv Fatura' },
      { value: 'EMUSTAHSIL', label: 'E-Müstahsil' },
    ],
    [],
  );

  const isLoading = isInvoiceSourceTypesLoading || isCurrenciesLoading || isBuyersLoading;

  return {
    // API-fetched data
    invoiceSourceTypes,
    currencies,
    buyersList,

    // Seller search functionality
    sellersCompanySearchResults: sellersCompanySearchResults?.Items || [],
    searchSellersByCompanyNameOrIdentifier,
    isSellersSearchLoading,

    // Static options
    usingStatusOptions,
    invoiceTypeOptions,
    deleteStatusOptions,
    notifyBuyerOptions,
    invoiceStatusOptions,
    profileIdOptions,

    // Loading states
    isLoading,
    isInvoiceSourceTypesLoading,
    isCurrenciesLoading,
    isBuyersLoading,
  };
};
