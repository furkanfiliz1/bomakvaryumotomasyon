import { useMemo } from 'react';
import { useGetLeadChannelListQuery } from '../lead-channel-consensus.api';

/**
 * Hook to fetch and manage lead channel dropdown data
 * Following IntegratorConsensus pattern exactly
 */
export const useLeadChannelConsensusDropdownData = () => {
  // Fetch lead channel list data
  const { data: leadChannelData, isLoading: isLeadChannelLoading } = useGetLeadChannelListQuery();

  // Transform data into dropdown options
  const leadChannelOptions = useMemo(() => {
    if (!leadChannelData) return [];

    // Filter only consensus channels and map to dropdown format
    return leadChannelData
      .filter((channel) => channel.IsConsensus)
      .map((channel) => ({
        value: channel.Id,
        label: channel.Value,
      }));
  }, [leadChannelData]);

  return {
    leadChannelOptions,
    isLoading: isLeadChannelLoading,
  };
};
