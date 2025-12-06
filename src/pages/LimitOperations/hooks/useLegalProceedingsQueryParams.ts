import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { transformRiskyFinancialSituations } from '../helpers';
import { LegalProceedingsQueryParams } from '../limit-operations.types';

/**
 * Hook to manage URL query parameters for Legal Proceedings
 */
export const useLegalProceedingsQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert URLSearchParams to our query parameters type
  const queryParams = useMemo((): LegalProceedingsQueryParams => {
    const params: LegalProceedingsQueryParams = {
      // Company search
      Identifier: searchParams.get('Identifier') || undefined,

      // Date ranges
      startCompensationDate: searchParams.get('startCompensationDate') || undefined,
      endCompensationDate: searchParams.get('endCompensationDate') || undefined,
      startCollectionDate: searchParams.get('startCollectionDate') || undefined,
      endCollectionDate: searchParams.get('endCollectionDate') || undefined,

      // Enum selections
      compensationState: searchParams.get('compensationState')
        ? Number(searchParams.get('compensationState'))
        : undefined,
      lawFirmId: searchParams.get('lawFirmId') ? Number(searchParams.get('lawFirmId')) : undefined,
      compensationProtocol: searchParams.get('compensationProtocol')
        ? Number(searchParams.get('compensationProtocol'))
        : undefined,
      integratorStatus: searchParams.get('integratorStatus') ? Number(searchParams.get('integratorStatus')) : undefined,
      ProductType: searchParams.get('ProductType') ? Number(searchParams.get('ProductType')) : undefined,
      guarantorRate: searchParams.get('guarantorRate') ? Number(searchParams.get('guarantorRate')) : undefined,

      // Entity selections
      financerId: searchParams.get('financerId') ? Number(searchParams.get('financerId')) : undefined,
      customerManagerId: searchParams.get('customerManagerId')
        ? Number(searchParams.get('customerManagerId'))
        : undefined,

      // Special fields
      Id: searchParams.get('Id') ? Number(searchParams.get('Id')) : undefined,
      RiskyFinancialSituations: transformRiskyFinancialSituations(searchParams.get('RiskyFinancialSituations')),

      // Table controls
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 50,
      sort: searchParams.get('sort') || 'Id',
      sortType: (searchParams.get('sortType') as 'Asc' | 'Desc') || 'Asc',
      isExport: searchParams.get('isExport') === 'true',
    };

    return params;
  }, [searchParams]);

  // Update URL parameters
  const updateParams = (newParams: Partial<LegalProceedingsQueryParams>) => {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        updatedParams.delete(key);
      } else if (Array.isArray(value)) {
        updatedParams.delete(key);
        value.forEach((item) => {
          updatedParams.append(key, String(item));
        });
      } else {
        updatedParams.set(key, String(value));
      }
    });

    setSearchParams(updatedParams);
  };

  // Reset all parameters
  const resetParams = () => {
    setSearchParams({});
  };

  // Clear specific parameter
  const clearParam = (paramName: keyof LegalProceedingsQueryParams) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete(paramName);
    setSearchParams(updatedParams);
  };

  // Check if any filters are applied
  const hasFilters = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, pageSize, sort, sortType, isExport, ...filters } = queryParams;
    return Object.values(filters).some(
      (value) => value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0),
    );
  }, [queryParams]);

  return {
    queryParams,
    updateParams,
    resetParams,
    clearParam,
    hasFilters,
    searchParams,
  };
};
