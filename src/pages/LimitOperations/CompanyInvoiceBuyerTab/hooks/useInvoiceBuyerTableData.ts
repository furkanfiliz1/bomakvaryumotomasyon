import { useMemo } from 'react';
import type { InvoiceBuyerAnalysisReceiver } from '../company-invoice-buyer-tab.types';
import { getInvoiceBuyerTableHeaders } from '../helpers';

interface UseInvoiceBuyerTableDataProps {
  data: InvoiceBuyerAnalysisReceiver[];
}

/**
 * Custom hook for table-related data and configuration
 * Follows OperationPricing pattern for table management
 */
export const useInvoiceBuyerTableData = ({ data }: UseInvoiceBuyerTableDataProps) => {
  // Table headers configuration
  const tableHeaders = useMemo(() => getInvoiceBuyerTableHeaders(), []);

  // Table data with proper formatting
  const tableData = useMemo(() => data || [], [data]);

  // Table statistics
  const tableStats = useMemo(
    () => ({
      totalRows: tableData.length,
      totalWithMetrics: tableData.filter((row) => row.Metrics && row.Metrics.length > 0).length,
    }),
    [tableData],
  );

  return {
    tableHeaders,
    tableData,
    tableStats,
  };
};
