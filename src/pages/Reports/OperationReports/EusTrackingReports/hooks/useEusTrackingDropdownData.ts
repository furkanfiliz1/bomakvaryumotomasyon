import { MONTH_OPTIONS, YEAR_OPTIONS } from '../constants';
import { useGetEusFormulaTypesQuery, useGetEusStatusTypesQuery } from '../eus-tracking-reports.api';
import type { EusFormulaType, EusStatusType, MonthYearOption } from '../eus-tracking-reports.types';

/**
 * Hook for fetching dropdown data for EUS Tracking filters
 * Follows OperationPricing useOperationPricingDropdownData pattern
 */
export const useEusTrackingDropdownData = () => {
  // Fetch EUS formula types
  const { data: eusFormulaTypes = [], isLoading: isLoadingFormulaTypes } = useGetEusFormulaTypesQuery();

  // Fetch EUS status types
  const { data: eusStatusTypes = [], isLoading: isLoadingStatusTypes } = useGetEusStatusTypesQuery();

  // Static month and year options (from constants)
  const monthOptions: MonthYearOption[] = MONTH_OPTIONS;
  const yearOptions: MonthYearOption[] = YEAR_OPTIONS;

  return {
    // Dropdown data
    eusFormulaTypes: eusFormulaTypes as EusFormulaType[],
    eusStatusTypes: eusStatusTypes as EusStatusType[],
    monthOptions,
    yearOptions,

    // Loading states
    isLoadingDropdownData: isLoadingFormulaTypes || isLoadingStatusTypes,
  };
};
