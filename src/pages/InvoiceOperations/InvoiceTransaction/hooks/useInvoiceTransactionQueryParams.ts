import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { InvoiceTransactionFilters } from '../invoice-transaction.types';
import { transformFiltersToParams } from '../helpers';

interface UseInvoiceTransactionQueryParamsReturn {
  searchParams: InvoiceTransactionFilters;
  updateSearchParams: (newParams: Partial<InvoiceTransactionFilters>) => void;
  apiParams: Record<string, unknown>;
}

function useInvoiceTransactionQueryParams(): UseInvoiceTransactionQueryParamsReturn {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();

  // Extract current search parameters from URL
  const searchParams: InvoiceTransactionFilters = useMemo(() => {
    const params: InvoiceTransactionFilters = {
      page: parseInt(urlSearchParams.get('page') || '1', 10),
      pageSize: parseInt(urlSearchParams.get('pageSize') || '50', 10),
    };

    // Extract string parameters
    const orderNumber = urlSearchParams.get('OrderNumber');
    if (orderNumber) params.OrderNumber = orderNumber;

    const invoiceNumber = urlSearchParams.get('InvoiceNumber');
    if (invoiceNumber) params.InvoiceNumber = invoiceNumber;

    const referenceId = urlSearchParams.get('ReferenceId');
    if (referenceId) params.ReferenceId = referenceId;

    const receiverIdentifier = urlSearchParams.get('ReceiverIdentifier');
    if (receiverIdentifier) params.ReceiverIdentifier = receiverIdentifier;

    const startDate = urlSearchParams.get('StartDate');
    if (startDate) params.StartDate = startDate;

    const endDate = urlSearchParams.get('EndDate');
    if (endDate) params.EndDate = endDate;

    return params;
  }, [urlSearchParams]);

  // Update URL parameters
  const updateSearchParams = (newParams: Partial<InvoiceTransactionFilters>) => {
    const updatedParams = { ...searchParams, ...newParams };

    // Create new URLSearchParams object
    const newUrlParams = new URLSearchParams();

    // Add parameters if they have values
    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newUrlParams.set(key, String(value));
      }
    });

    setUrlSearchParams(newUrlParams);
  };

  // Transform to API parameters format - memoized to prevent infinite loops
  const apiParams = useMemo(() => {
    return transformFiltersToParams(searchParams);
  }, [searchParams]);

  return {
    searchParams,
    updateSearchParams,
    apiParams,
  };
}

export default useInvoiceTransactionQueryParams;
