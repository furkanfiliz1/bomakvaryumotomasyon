import { ConsensusOption } from '../customer-arrival-channels.types';

/**
 * Hook to provide dropdown data for isConsensus field
 * Follows OperationPricing pattern for dropdown data hooks
 */
export const useCustomerArrivalChannelsDropdownData = () => {
  // IsConsensus options matching legacy exactly (Evet/Hayır)
  const consensusOptions: ConsensusOption[] = [
    { label: 'Evet', value: 'true' },
    { label: 'Hayır', value: 'false' },
  ];

  return {
    consensusOptions,
  };
};
