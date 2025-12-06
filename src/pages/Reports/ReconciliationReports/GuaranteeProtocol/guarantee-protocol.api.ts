import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type { CompanySearchResponse } from '../shared.types';
import type {
  GuaranteeProtocolDownloadParams,
  GuaranteeProtocolItem,
  GuaranteeProtocolQueryParams,
  GuaranteeProtocolResponse,
  GuaranteeProtocolTableRow,
} from './guarantee-protocol.types';

// Extended interface for guarantee protocol data with server-side query support
interface GuaranteeProtocolServerSideResult extends ServerSideQueryResult<GuaranteeProtocolTableRow> {
  // No additional totals needed for this report
}

/**
 * Transform nested API response to flat table rows
 * Each detail becomes a separate row for table display
 */
const transformToTableRows = (items: GuaranteeProtocolItem[]): GuaranteeProtocolTableRow[] => {
  const rows: GuaranteeProtocolTableRow[] = [];

  items.forEach((item) => {
    // Sort details by date descending (newest first) - matching legacy behavior
    const sortedDetails = [...item.Details].sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

    sortedDetails.forEach((detail) => {
      rows.push({
        SenderCompanyName: item.SenderCompanyName,
        SenderIdentifier: item.SenderIdentifier,
        FinancerCompanyName: item.FinancerCompanyName,
        FinancerIdentifier: item.FinancerIdentifier,
        Date: detail.Date,
        FormattedDate: new Date(detail.Date).toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        TotalInvoiceCount: detail.TotalInvoiceCount,
        TotalSystemAmount: detail.TotalSystemAmount,
      });
    });
  });

  return rows;
};

export const guaranteeProtocolApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get guarantee protocol report data - using the exact legacy API endpoint
    getGuaranteeProtocolReport: build.query<GuaranteeProtocolServerSideResult, GuaranteeProtocolQueryParams>({
      query: (params) => {
        // Don't make request if required fields are not provided - return empty result
        if (!params.FinancerIdentifier || !params.StartDate || !params.EndDate) {
          return '';
        }

        return {
          url: '/reports/guarantorprotocol',
          method: 'GET',
          params: {
            ...params,
            // Ensure proper parameter format for legacy API
            FinancerIdentifier: params.FinancerIdentifier,
            SenderIdentifier: params.SenderIdentifier || undefined, // Optional field
            StartDate: params.StartDate,
            EndDate: params.EndDate,
          },
        };
      },
      transformResponse: (response: GuaranteeProtocolResponse): GuaranteeProtocolServerSideResult => {
        const transformedRows = transformToTableRows(response.Items || []);

        return {
          Items: transformedRows,
          TotalCount: transformedRows.length, // Use transformed row count
          ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
        };
      },
    }),

    // Download guarantee protocol PDF - matching legacy downloadConsensusFile functionality
    downloadGuaranteeProtocolFile: build.mutation<ArrayBuffer, GuaranteeProtocolDownloadParams>({
      query: (params) => ({
        url: '/reports/guarantorprotocol/download',
        method: 'GET',
        params: {
          Date: params.Date,
          FinancerIdentifier: params.FinancerIdentifier,
          SenderIdentifier: params.SenderIdentifier,
        },
        responseHandler: async (response) => {
          const arrayBuffer = await response.arrayBuffer();
          return arrayBuffer;
        },
      }),
    }),

    // Company search endpoint for async autocomplete fields
    searchByCompanyNameOrIdentifier: build.query<
      CompanySearchResponse,
      {
        CompanyNameOrIdentifier?: string;
        CompanyActivityType: number;
      }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useGetGuaranteeProtocolReportQuery,
  useLazyGetGuaranteeProtocolReportQuery,
  useDownloadGuaranteeProtocolFileMutation,
  useLazySearchByCompanyNameOrIdentifierQuery,
} = guaranteeProtocolApi;
