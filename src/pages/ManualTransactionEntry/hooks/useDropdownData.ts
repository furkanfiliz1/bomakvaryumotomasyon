import {
  useGetBankListManuelQuery,
  useGetBuyerListForManualTransactionsQuery,
  useGetCurrenciesQuery,
  useGetCustomerManagersQuery,
  useGetFinancialActivityTypesQuery,
  useGetFinancialRecordProcessTypesQuery,
  useGetFinancialRecordTypesQuery,
  useGetInvoicePartyTypesQuery,
  useLazySearchByCompanyNameOrIdentifierQuery,
} from '../manual-transaction-entry.api';
import { CompanyActivityType } from '../manual-transaction-entry.types';

export const useDropdownData = () => {
  const { data: currencies = [], isLoading: currenciesLoading } = useGetCurrenciesQuery();
  const { data: financialRecordTypes = [], isLoading: financialRecordTypesLoading } = useGetFinancialRecordTypesQuery();
  const { data: financialActivityTypes = [], isLoading: financialActivityTypesLoading } =
    useGetFinancialActivityTypesQuery();
  const { data: processTypes = [], isLoading: processTypesLoading } = useGetFinancialRecordProcessTypesQuery();
  const { data: invoiceParty = [], isLoading: invoicePartyLoading } = useGetInvoicePartyTypesQuery();
  const { data: bankListResponse, isLoading: bankListLoading } = useGetBankListManuelQuery({});
  const { data: buyerList = [], isLoading: buyerListLoading } = useGetBuyerListForManualTransactionsQuery({ status: 1 });
  const { data: customerManagersResponse, isLoading: customerManagersLoading } = useGetCustomerManagersQuery();

  // Async search for buyers (for autocomplete)
  const [
    _searchBuyersByCompanyNameOrIdentifier,
    { data: buyersCompanySearchResults, isLoading: isBuyersSearchLoading },
  ] = useLazySearchByCompanyNameOrIdentifierQuery();

  // Async search for sellers (for autocomplete)
  const [
    _searchSellersByCompanyNameOrIdentifier,
    { data: sellersCompanySearchResults, isLoading: isSellersSearchLoading },
  ] = useLazySearchByCompanyNameOrIdentifierQuery();

  const searchBuyersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchBuyersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier: CompanyNameOrIdentifier || '',
        ActivityType: CompanyActivityType.BUYER,
        Status: 1,
      }).unwrap();
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const searchSellersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      const result = await _searchSellersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier: CompanyNameOrIdentifier || '',
        ActivityType: CompanyActivityType.SELLER,
        Status: 1,
      }).unwrap();
      console.log('Sellers search result:', result);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const bankList = bankListResponse?.Items || [];
  const customerManagerList = customerManagersResponse?.Items || [];

  const isLoading =
    currenciesLoading ||
    financialRecordTypesLoading ||
    financialActivityTypesLoading ||
    processTypesLoading ||
    invoicePartyLoading ||
    bankListLoading ||
    buyerListLoading ||
    customerManagersLoading;

  return {
    currencies,
    financialRecordTypes,
    financialActivityTypes,
    processTypes,
    invoiceParty,
    bankList,
    buyerList,
    customerManagerList,
    buyersCompanySearchResults: buyersCompanySearchResults?.Items || [],
    sellersCompanySearchResults: sellersCompanySearchResults?.Items || [],
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
    isLoading,
  };
};
