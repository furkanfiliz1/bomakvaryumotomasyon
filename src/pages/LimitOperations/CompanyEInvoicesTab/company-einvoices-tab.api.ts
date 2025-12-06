import { baseApi, scoreBaseURL } from '@api';
import type { CompanyEInvoicesParams, CompanyEInvoicesResponse } from './company-einvoices-tab.types';

/**
 * Company E-Invoices Tab API
 * Following OperationPricing pattern for API definitions
 * Matches legacy _getScoreInvoices function exactly
 */
export const companyEInvoicesTabApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get company e-invoices data by company identifier
    // Matches legacy API call: _getScoreInvoices({ companyIdentifier })
    getCompanyEInvoices: builder.query<CompanyEInvoicesResponse, CompanyEInvoicesParams>({
      query: ({ companyIdentifier }) => ({
        url: `${scoreBaseURL}/invoices/report`,
        method: 'GET',
        params: { companyIdentifier },
      }),
      // Transform response to ensure consistent structure
      transformResponse: (response: CompanyEInvoicesResponse): CompanyEInvoicesResponse => ({
        currencies: response?.currencies || [],
      }),
      // Keep data fresh for 5 minutes to match legacy caching behavior
      keepUnusedDataFor: 300,
    }),
  }),
});

// Export hooks for components
export const { useGetCompanyEInvoicesQuery, useLazyGetCompanyEInvoicesQuery } = companyEInvoicesTabApi;
