import { useMemo } from 'react';
import {
  useGetCompensationProtocolTypesQuery,
  useGetCompensationStateTypesQuery,
  useGetGuarantorRatesQuery,
  useGetIntegratorsPairsQuery,
  useGetLawFirmsQuery,
  useGetRiskyCalculationsQuery,
} from '../limit-operations.api';

/**
 * Hook to fetch all dropdown data needed for Update Compensation form
 * Based on useLegalProceedingsDropdownData pattern
 */
export const useUpdateCompensationDropdownData = () => {
  // Fetch risky calculations for multi-select
  const {
    data: riskyCalculations = [],
    isLoading: isLoadingRiskyCalculations,
    error: riskyCalculationsError,
  } = useGetRiskyCalculationsQuery();

  // Fetch guarantor rates
  const {
    data: guarantorRates = [],
    isLoading: isLoadingGuarantorRates,
    error: guarantorRatesError,
  } = useGetGuarantorRatesQuery();

  // Fetch law firms
  const { data: lawFirms = [], isLoading: isLoadingLawFirms, error: lawFirmsError } = useGetLawFirmsQuery();

  // Fetch compensation protocol types
  const {
    data: compensationProtocolTypes = [],
    isLoading: isLoadingCompensationProtocols,
    error: compensationProtocolsError,
  } = useGetCompensationProtocolTypesQuery();

  // Fetch compensation state types
  const {
    data: compensationStateTypes = [],
    isLoading: isLoadingCompensationStates,
    error: compensationStatesError,
  } = useGetCompensationStateTypesQuery();

  // Fetch integrators for financer dropdown
  const {
    data: integratorsResponse,
    isLoading: isLoadingIntegrators,
    error: integratorsError,
  } = useGetIntegratorsPairsQuery({ IsActive: true });

  // Transform data for form usage
  const dropdownData = useMemo(() => {
    const integrators = integratorsResponse || [];

    return {
      riskyCalculations: riskyCalculations.map((item) => ({
        label: item.Name,
        value: item.Id,
      })),
      guarantorRates: guarantorRates.map((item) => ({
        label: item.Description,
        value: item.Value,
      })),
      lawFirms: lawFirms.map((item) => ({
        label: item.Name,
        value: item.Id,
      })),
      protocols: compensationProtocolTypes.map((item) => ({
        label: item.Description,
        value: item.Value,
      })),
      states: compensationStateTypes.map((item) => ({
        label: item.Description,
        value: item.Value,
      })),
      financers: integrators.map((item) => ({
        label: item.Name || '',
        value: item.Id,
      })),
      // Hard-coded product types based on reference (filtered to 3 and 4)
      productTypes: [
        { label: 'Çek', value: 4 },
        { label: 'Fatura', value: 3 },
      ],
      // Hard-coded document states based on common values
      documentStates: [
        { label: 'Beklemede', value: 1 },
        { label: 'Onaylandı', value: 2 },
        { label: 'Reddedildi', value: 3 },
      ],
    };
  }, [
    riskyCalculations,
    guarantorRates,
    lawFirms,
    compensationProtocolTypes,
    compensationStateTypes,
    integratorsResponse,
  ]);

  // Collect all loading states
  const isLoading =
    isLoadingRiskyCalculations ||
    isLoadingGuarantorRates ||
    isLoadingLawFirms ||
    isLoadingCompensationProtocols ||
    isLoadingCompensationStates ||
    isLoadingIntegrators;

  // Collect all errors
  const error =
    riskyCalculationsError ||
    guarantorRatesError ||
    lawFirmsError ||
    compensationProtocolsError ||
    compensationStatesError ||
    integratorsError;

  return {
    ...dropdownData,
    isLoading,
    error,
  };
};
