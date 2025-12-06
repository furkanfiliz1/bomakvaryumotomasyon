import {
  useGetCompanyStatusQuery,
  useGetCustomerManagerListQuery,
  useGetEarlyWarningStatusTypesQuery,
  useGetIntegratorsPairsQuery,
  useGetLeadingChannelListQuery,
} from '../limit-operations.api';
import type { FibabankaGuaranteeRate } from '../limit-operations.types';

export const useCompaniesDropdownData = () => {
  // Static guarantee rate options
  const fibabankaGuaranteeRates: FibabankaGuaranteeRate[] = [
    { id: 1, Description: '0%', Value: '0' },
    { id: 2, Description: '50%', Value: '50' },
    { id: 3, Description: '100%', Value: '100' },
  ];

  // API queries
  const {
    data: integratorsData,
    isLoading: integratorsLoading,
    error: integratorsError,
  } = useGetIntegratorsPairsQuery({ IsActive: true, Type: 1 });

  const {
    data: companyStatusData,
    isLoading: companyStatusLoading,
    error: companyStatusError,
  } = useGetCompanyStatusQuery();

  const {
    data: customerManagersData,
    isLoading: customerManagersLoading,
    error: customerManagersError,
  } = useGetCustomerManagerListQuery();

  const {
    data: earlyWarningStatusData,
    isLoading: earlyWarningStatusLoading,
    error: earlyWarningStatusError,
  } = useGetEarlyWarningStatusTypesQuery();

  const {
    data: leadingChannelsData,
    isLoading: leadingChannelsLoading,
    error: leadingChannelsError,
  } = useGetLeadingChannelListQuery();

  // Process data for dropdown consumption
  const dropdownData = {
    integrators: integratorsData || [],
    companyStatuses: companyStatusData || [],
    customerManagers: customerManagersData?.Items || [],
    earlyWarningStatuses: earlyWarningStatusData || [],
    leadingChannels: leadingChannelsData || [],
    fibabankaGuaranteeRates,
    // Standard options
    limitStatuses: [
      { value: '1', label: 'Aktif' },
      { value: '0', label: 'Pasif' },
      { value: '-1', label: 'Tanımlanmamış' },
    ],
    riskStatuses: [
      { value: 'true', label: 'Donduruldu' },
      { value: 'false', label: 'Aktif' },
    ],
    invoiceTransferStatuses: [
      { value: 'true', label: 'Aktif' },
      { value: 'false', label: 'Pasif' },
    ],
  };

  const isLoading =
    integratorsLoading ||
    companyStatusLoading ||
    customerManagersLoading ||
    earlyWarningStatusLoading ||
    leadingChannelsLoading;

  const error =
    integratorsError || companyStatusError || customerManagersError || earlyWarningStatusError || leadingChannelsError;

  return {
    dropdownData,
    isLoading,
    error,
  };
};
