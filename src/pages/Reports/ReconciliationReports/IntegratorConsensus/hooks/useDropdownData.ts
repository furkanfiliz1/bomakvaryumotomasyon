import { useMemo } from 'react';
import { useGetIntegratorListQuery } from '../integrator-consensus.api';
import type { IntegratorOption } from '../integrator-consensus.types';

/**
 * Custom hook for fetching dropdown data used in Integrator Consensus filters
 * Following OperationPricing pattern for dropdown data management
 */

export const useIntegratorConsensusDropdownData = () => {
  // Fetch integrator list for dropdown
  const { data: integratorListData = [], isLoading: isIntegratorListLoading } = useGetIntegratorListQuery();

  const dropdownData = useMemo(
    () => ({
      // Integrator options for dropdown
      integratorOptions: integratorListData as IntegratorOption[],
    }),
    [integratorListData],
  );

  const loadingStates = useMemo(
    () => ({
      isIntegratorListLoading,
    }),
    [isIntegratorListLoading],
  );

  return {
    ...dropdownData,
    ...loadingStates,
  };
};
