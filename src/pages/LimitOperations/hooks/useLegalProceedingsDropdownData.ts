import { useMemo } from 'react';
import {
  useGetCompensationProtocolTypesQuery,
  useGetCompensationStateTypesQuery,
  useGetCustomerManagerListQuery,
  useGetGuarantorRatesQuery,
  useGetIntegratorsPairsQuery,
  useGetIntegratorStatusTypesQuery,
  useGetLawFirmsQuery,
  useGetRiskyCalculationsQuery,
} from '../limit-operations.api';

/**
 * Hook to fetch all dropdown data needed for Legal Proceedings filters
 */
export const useLegalProceedingsDropdownData = () => {
  // Fetch risky calculations for multi-select
  const {
    data: riskyCalculations = [],
    isLoading: isLoadingRiskyCalculations,
    error: riskyCalculationsError,
  } = useGetRiskyCalculationsQuery();

  // Fetch compensation state types
  const {
    data: compensationStateTypes = [],
    isLoading: isLoadingCompensationStates,
    error: compensationStatesError,
  } = useGetCompensationStateTypesQuery();

  // Fetch compensation protocol types
  const {
    data: compensationProtocolTypes = [],
    isLoading: isLoadingCompensationProtocols,
    error: compensationProtocolsError,
  } = useGetCompensationProtocolTypesQuery();

  // Fetch integrator status types
  const {
    data: integratorStatusTypes = [],
    isLoading: isLoadingIntegratorStatus,
    error: integratorStatusError,
  } = useGetIntegratorStatusTypesQuery();

  // Fetch guarantor rates
  const {
    data: guarantorRates = [],
    isLoading: isLoadingGuarantorRates,
    error: guarantorRatesError,
  } = useGetGuarantorRatesQuery();

  // Fetch law firms
  const { data: lawFirms = [], isLoading: isLoadingLawFirms, error: lawFirmsError } = useGetLawFirmsQuery();

  // Fetch integrators for financer dropdown
  const {
    data: integratorsResponse,
    isLoading: isLoadingIntegrators,
    error: integratorsError,
  } = useGetIntegratorsPairsQuery({ IsActive: true });

  // Fetch customer managers
  const {
    data: customerManagersResponse,
    isLoading: isLoadingCustomerManagers,
    error: customerManagersError,
  } = useGetCustomerManagerListQuery();

  // Transform data for form usage
  const dropdownData = useMemo(() => {
    const integrators = integratorsResponse || [];
    const customerManagers = customerManagersResponse?.Items || [];

    return {
      riskyCalculations: riskyCalculations.map((item) => ({
        label: item.Name,
        value: item.Id,
      })),
      compensationStateTypes: compensationStateTypes.map((item) => ({
        label: item.Description,
        value: item.Value,
      })),
      compensationProtocolTypes: compensationProtocolTypes.map((item) => ({
        label: item.Description,
        value: item.Value,
      })),
      integratorStatusTypes: integratorStatusTypes.map((item) => ({
        label: item.Description,
        value: item.Value,
      })),
      guarantorRates: guarantorRates.map((item) => ({
        label: item.Description,
        value: item.Value,
      })),
      lawFirms: lawFirms.map((item) => ({
        label: item.Name,
        value: item.Id,
      })),
      integrators: integrators.map((item) => ({
        label: item.Name || '',
        value: item.Id || 0,
      })),
      customerManagers: customerManagers.map((item) => ({
        label: item.FullName || '',
        value: item.Id || 0,
      })),
    };
  }, [
    riskyCalculations,
    compensationStateTypes,
    compensationProtocolTypes,
    integratorStatusTypes,
    guarantorRates,
    lawFirms,
    integratorsResponse,
    customerManagersResponse,
  ]);

  // Combined loading state
  const isLoading =
    isLoadingRiskyCalculations ||
    isLoadingCompensationStates ||
    isLoadingCompensationProtocols ||
    isLoadingIntegratorStatus ||
    isLoadingGuarantorRates ||
    isLoadingLawFirms ||
    isLoadingIntegrators ||
    isLoadingCustomerManagers;

  // Combined error state
  const error =
    riskyCalculationsError ||
    compensationStatesError ||
    compensationProtocolsError ||
    integratorStatusError ||
    guarantorRatesError ||
    lawFirmsError ||
    integratorsError ||
    customerManagersError;

  return {
    dropdownData,
    isLoading,
    error,
  };
};
