import { useErrorListener } from '@hooks';
import { useMemo } from 'react';
import { useGetInvoiceBuyerAnalysisQuery } from '../company-invoice-buyer-tab.api';
import { formatInvoiceBuyerData } from '../helpers';

interface UseInvoiceBuyerDataProps {
  companyId: string;
}

/**
 * Custom hook for fetching and formatting invoice buyer analysis data
 * Follows OperationPricing pattern for data management
 */
export const useInvoiceBuyerData = ({ companyId }: UseInvoiceBuyerDataProps) => {
  // Fetch invoice buyer analysis data
  const { data, error, isLoading, isFetching } = useGetInvoiceBuyerAnalysisQuery({ identifier: companyId });

  // Error handling
  useErrorListener(error);

  // Format data for display
  const formattedData = useMemo(() => {
    if (!data?.Receivers) return [];
    return formatInvoiceBuyerData(data.Receivers);
  }, [data?.Receivers]);

  // Statistics for summary display
  const statistics = useMemo(
    () => ({
      totalReceivers: data?.Receivers?.length || 0,
      averageInvoiceAmount: data?.AverageInvoiceAmount || 0,
      minInvoiceScore: data?.MinInvoiceScore || 0,
      maxInvoiceScore: data?.MaxInvoiceScore || 0,
      averageInvoiceScore: data?.AverageInvoiceScore || 0,
    }),
    [data],
  );

  return {
    data: formattedData,
    statistics,
    error,
    isLoading,
    isFetching,
    rawData: data,
  };
};
