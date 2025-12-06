import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  IntegratorConsensusItem,
  IntegratorConsensusQueryParams,
  IntegratorConsensusResponse,
  IntegratorOption,
} from './integrator-consensus.types';

// Extended interface for integrator consensus data with server-side query support
interface IntegratorConsensusServerSideResult extends ServerSideQueryResult<IntegratorConsensusItem> {
  // No additional totals needed for this report - matches legacy behavior
}

export const integratorConsensusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get integrator consensus report data - using the exact legacy API endpoint
    getIntegratorConsensusReport: build.query<IntegratorConsensusServerSideResult, IntegratorConsensusQueryParams>({
      query: (params) => {
        // Don't make request if required fields are not provided - return empty result
        if (!params.IntegratorId || !params.StartDate || !params.EndDate) {
          return '';
        }

        return {
          url: '/integrators/commission/getreport',
          method: 'GET',
          params: {
            ...params,
            // Ensure proper parameter format for legacy API
            IntegratorId: params.IntegratorId,
            StartDate: params.StartDate,
            EndDate: params.EndDate,
            Page: params.Page || 1,
            PageSize: params.PageSize || 25,
            isExport: params.isExport || false,
          },
        };
      },
      transformResponse: (response: IntegratorConsensusResponse): IntegratorConsensusServerSideResult => {
        return {
          Items: response.Items || [],
          TotalCount: response.TotalCount || 0,
          ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
        };
      },
    }),

    // Get integrator list for dropdown - using the correct legacy API endpoint
    getIntegratorList: build.query<IntegratorOption[], void>({
      query: () => ({
        url: '/integrators/pairs',
        method: 'GET',
        params: {
          IsActive: true,
          Type: 1,
        },
      }),
      transformResponse: (response: Array<{ Id: number; Name: string }>): IntegratorOption[] => {
        return response.map((item) => ({
          Id: item.Id,
          Name: item.Name,
          value: item.Id,
          label: item.Name,
        }));
      },
    }),
  }),
});

export const {
  useGetIntegratorConsensusReportQuery,
  useLazyGetIntegratorConsensusReportQuery,
  useGetIntegratorListQuery,
} = integratorConsensusApi;
