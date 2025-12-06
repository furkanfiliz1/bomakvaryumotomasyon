import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { InvoiceSearchRequest } from '../invoice-report.types';

interface UseInvoiceReportQueryParamsReturn {
  searchParams: InvoiceSearchRequest;
  updateSearchParams: (newParams: Partial<InvoiceSearchRequest>) => void;
  resetSearchParams: () => void;
  apiParams: InvoiceSearchRequest;
}

/**
 * Hook for managing URL parameters for Invoice Report
 * Following CompaniesTable pattern with useSearchParams
 */
export const useInvoiceReportQueryParams = (): UseInvoiceReportQueryParamsReturn => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();

  // Convert URL params to search params object
  const searchParams = useMemo((): InvoiceSearchRequest => {
    const params: InvoiceSearchRequest = {
      page: parseInt(urlSearchParams.get('page') || '1', 10),
      pageSize: parseInt(urlSearchParams.get('pageSize') || '50', 10),
      sort: urlSearchParams.get('sort') || 'InsertDatetime',
      sortType: (urlSearchParams.get('sortType') || 'Desc') as 'Asc' | 'Desc',

      // Default values matching the original component
      notifyBuyer: urlSearchParams.get('notifyBuyer') !== null ? parseInt(urlSearchParams.get('notifyBuyer')!, 10) : 1,
      isDeleted: urlSearchParams.get('isDeleted') || '0',
      status: urlSearchParams.get('status') !== null ? parseInt(urlSearchParams.get('status')!, 10) : 1,
      currencyId: urlSearchParams.get('currencyId') !== null ? parseInt(urlSearchParams.get('currencyId')!, 10) : 1,

      // Optional filters
      startDate: urlSearchParams.get('startDate') || undefined,
      endDate: urlSearchParams.get('endDate') || undefined,
      senderIdentifier: urlSearchParams.get('senderIdentifier') || undefined,
      receiverIdentifier: urlSearchParams.get('receiverIdentifier') || undefined,
      invoiceNumber: urlSearchParams.get('invoiceNumber') || undefined,
      profileId: urlSearchParams.get('profileId') || undefined,
      serialNumber: urlSearchParams.get('serialNumber') || undefined,
      sequenceNumber: urlSearchParams.get('sequenceNumber') || undefined,
      type: urlSearchParams.get('type') || undefined,
      SourceType: urlSearchParams.get('SourceType') || undefined,
      availableType: urlSearchParams.get('availableType') || undefined,
    };

    return params;
  }, [urlSearchParams]);

  // Update URL parameters
  const updateSearchParams = (newParams: Partial<InvoiceSearchRequest>) => {
    const updatedParams = { ...searchParams, ...newParams, page: 1 }; // Reset to first page when searching

    // Create new URLSearchParams object
    const newUrlParams = new URLSearchParams();

    // Add parameters if they have values
    // Note: Keep 0 values for numeric fields like notifyBuyer, status, currencyId
    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newUrlParams.set(key, String(value));
      }
    });

    setUrlSearchParams(newUrlParams);
  };

  const resetSearchParams = () => {
    // Keep only the default parameters
    const defaultParams = new URLSearchParams();

    setUrlSearchParams(defaultParams);
  };

  // Transform to API parameters format - memoized to prevent infinite loops
  const apiParams = useMemo(() => {
    return searchParams;
  }, [searchParams]);

  return {
    searchParams,
    updateSearchParams,
    resetSearchParams,
    apiParams,
  };
};

export default useInvoiceReportQueryParams;
