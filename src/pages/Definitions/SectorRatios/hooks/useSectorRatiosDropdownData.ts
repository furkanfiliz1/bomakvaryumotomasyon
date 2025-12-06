/**
 * Sector Ratios Dropdown Data Hook
 * Fetches sector list and ratio list for dropdowns
 * Follows OperationPricing pattern exactly
 */

import { useGetCompanySectorQuery } from 'src/pages/Companies/companies.api';
import { useGetSectorRatiosQuery } from '../sector-ratios.api';

export const useSectorRatiosDropdownData = () => {
  // Get company sectors for sector dropdown filter
  const { data: companySectorData, isLoading: isLoadingSectors, error: sectorsError } = useGetCompanySectorQuery();

  // Get ratio definitions for ratio dropdown in add/edit forms
  const { data: ratioList, isLoading: isLoadingRatios, error: ratiosError } = useGetSectorRatiosQuery();

  // Transform sector data to match expected format
  const companySectorList =
    companySectorData?.data?.map((sector) => ({
      id: sector.id,
      sectorName: sector.sectorName,
    })) || [];

  return {
    companySectorList,
    ratioList: ratioList || [],
    isLoading: isLoadingSectors || isLoadingRatios,
    error: sectorsError || ratiosError,
  };
};

export default useSectorRatiosDropdownData;
