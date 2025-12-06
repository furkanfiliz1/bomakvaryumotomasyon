import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type { SupplierReportItem, SupplierReportsFilters } from './supplier-reports.types';

// Extended interface for supplier reports data with server-side query support
interface SupplierReportsServerSideResult extends ServerSideQueryResult<SupplierReportItem> {
  // Legacy API response structure - no additional summary data
}

// Supplier Reports API endpoints
// Exact match with legacy API endpoints
export const supplierReportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Main supplier reports query - exact legacy endpoint
    getSupplierReports: build.query<SupplierReportsServerSideResult, SupplierReportsFilters>({
      query: (params) => ({
        url: '/reports/receiversSenders',
        method: 'GET',
        params,
      }),
    }),
  }),
});

// Export only the main query hook - legacy system has no other functionality
export const { useLazyGetSupplierReportsQuery } = supplierReportsApi;
