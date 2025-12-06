import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { IntegrationReportsFilters } from '../integration-reports.types';

interface UseIntegrationReportsQueryParamsProps {
  additionalFilters: Partial<IntegrationReportsFilters>;
}

export const useIntegrationReportsQueryParams = ({ additionalFilters }: UseIntegrationReportsQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      StartDate: additionalFilters.StartDate
        ? dayjs(additionalFilters.StartDate).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      EndDate: additionalFilters.EndDate
        ? dayjs(additionalFilters.EndDate).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      ...additionalFilters,

      // Remove empty fields matching legacy emptyOrNullRemoveQuery behavior
      ...(additionalFilters.AllowanceId && { AllowanceId: additionalFilters.AllowanceId }),
      ...(additionalFilters.CompanyIdentifier && { CompanyIdentifier: additionalFilters.CompanyIdentifier }),
      ...(additionalFilters.SenderIdentifier && { SenderIdentifier: additionalFilters.SenderIdentifier }),
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};
