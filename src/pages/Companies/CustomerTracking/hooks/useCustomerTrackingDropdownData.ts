import { useMemo } from 'react';
import {
  useGetCallResultTypesQuery,
  useGetLeadStatusTypesQuery,
  useGetLeadingChannelsQuery,
  useGetTrackingTeamListQuery,
} from '../customer-tracking.api';

export const useCustomerTrackingDropdownData = () => {
  // Fetch dropdown data from APIs
  const { data: leadingChannels = [], isLoading: leadingChannelsLoading } = useGetLeadingChannelsQuery();
  const { data: trackingTeam = [], isLoading: trackingTeamLoading } = useGetTrackingTeamListQuery();
  const { data: callResultTypes = [], isLoading: callResultLoading } = useGetCallResultTypesQuery();
  const { data: leadStatusTypes = [], isLoading: leadStatusLoading } = useGetLeadStatusTypesQuery();

  // Transform data for dropdown usage
  const leadingChannelOptions = useMemo(() => {
    return leadingChannels.map((channel) => ({
      value: channel.Id.toString(),
      label: channel.Value,
    }));
  }, [leadingChannels]);

  const trackingTeamOptions = useMemo(() => {
    return trackingTeam.map((member) => ({
      value: member.Id.toString(),
      label: member.Name,
    }));
  }, [trackingTeam]);

  const callResultOptions = useMemo(() => {
    return callResultTypes.map((type) => ({
      value: type.Value,
      label: type.Description,
    }));
  }, [callResultTypes]);

  const leadStatusOptions = useMemo(() => {
    return leadStatusTypes.map((type) => ({
      value: type.Value,
      label: type.Description,
    }));
  }, [leadStatusTypes]);

  // Company status options - matches legacy setCompanyStatus
  const statusOptions = useMemo(() => {
    return [
      { value: '1', label: 'Aktif' },
      { value: '0', label: 'Pasif' },
    ];
  }, []);

  const isLoading = leadingChannelsLoading || trackingTeamLoading || callResultLoading || leadStatusLoading;

  return {
    leadingChannelOptions,
    trackingTeamOptions,
    callResultOptions,
    leadStatusOptions,
    statusOptions,
    isLoading,
  };
};
