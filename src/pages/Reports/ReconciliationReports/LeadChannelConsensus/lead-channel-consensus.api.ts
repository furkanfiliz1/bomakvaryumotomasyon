import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  LeadChannelConsensusItem,
  LeadChannelConsensusQueryParams,
  LeadChannelConsensusResponse,
  LeadChannelOption,
} from './lead-channel-consensus.types';

// Extended interface for lead channel consensus data with server-side query support
interface LeadChannelConsensusServerSideResult extends ServerSideQueryResult<LeadChannelConsensusItem> {
  // No additional totals needed for this report - matches legacy behavior
}

export const leadChannelConsensusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get lead channel consensus report data - using the exact legacy API endpoint
    getLeadChannelConsensusReport: build.query<LeadChannelConsensusServerSideResult, LeadChannelConsensusQueryParams>({
      query: (params) => {
        return {
          url: '/definitions/leadingChannels/report',
          method: 'GET',
          params: {
            ...params,
            // Ensure proper parameter format for legacy API
            LeadChannelId: params.LeadChannelId,
            StartDate: params.StartDate,
            EndDate: params.EndDate,
            Page: params.Page || 1,
            PageSize: params.PageSize || 25,
            isExport: params.isExport || false,
          },
        };
      },
      transformResponse: (response: LeadChannelConsensusResponse): LeadChannelConsensusServerSideResult => {
        return {
          Items: response.Items || [],
          TotalCount: response.TotalCount || 0,
          ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
        };
      },
    }),

    // Get lead channel list for dropdown - using the correct legacy API endpoint
    getLeadChannelList: build.query<LeadChannelOption[], void>({
      query: () => ({
        url: '/definitions/leadingChannels/consensus',
        method: 'GET',
      }),
      transformResponse: (
        response: Array<{ Id: number; Value: string; Rate: number; IsConsensus: boolean }>,
      ): LeadChannelOption[] => {
        return response.map((item) => ({
          Id: item.Id,
          Value: item.Value,
          Rate: item.Rate,
          IsConsensus: item.IsConsensus,
          value: item.Id,
          label: item.Value,
        }));
      },
    }),
  }),
});

export const {
  useGetLeadChannelConsensusReportQuery,
  useLazyGetLeadChannelConsensusReportQuery,
  useGetLeadChannelListQuery,
} = leadChannelConsensusApi;
