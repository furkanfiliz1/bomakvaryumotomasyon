import { useLazyGetCompaniesScoringQuery } from '../limit-operations.api';
import type { CompanyScoring } from '../limit-operations.types';
import { useEffect } from 'react';

interface UseCompanyDetailDataReturn {
  companyDetail: CompanyScoring | undefined;
  loading: boolean;
  error: string | undefined;
  refetch: () => void;
}

export const useCompanyDetailData = (companyId: string): UseCompanyDetailDataReturn => {
  const [getCompaniesScoring, { data: companiesScoringResponse, isLoading, error }] = useLazyGetCompaniesScoringQuery();

  useEffect(() => {
    if (companyId) {
      // Get the specific company from the companies list
      getCompaniesScoring({
        page: 1,
        pageSize: 1000, // Large number to ensure we get the company
      });
    }
  }, [companyId, getCompaniesScoring]);

  const getErrorMessage = (error: unknown): string | undefined => {
    if (!error) return undefined;

    if (typeof error === 'string') return error;

    if (typeof error === 'object' && error !== null) {
      const errorObj = error as Record<string, unknown>;
      if (errorObj.data && typeof errorObj.data === 'object' && errorObj.data !== null) {
        const dataObj = errorObj.data as Record<string, unknown>;
        if (typeof dataObj.message === 'string') return dataObj.message;
      }
      if (typeof errorObj.message === 'string') return errorObj.message;
      if (typeof errorObj.status === 'number') {
        const statusText = typeof errorObj.statusText === 'string' ? errorObj.statusText : 'Unknown error';
        return `HTTP ${errorObj.status}: ${statusText}`;
      }
    }

    return 'Bir hata oluştu';
  };

  // Find the specific company by ID
  const companyDetail = companiesScoringResponse?.Items?.find((company) => company.CompanyId?.toString() === companyId);

  const refetch = () => {
    if (companyId) {
      getCompaniesScoring({
        page: 1,
        pageSize: 1000,
      });
    }
  };

  return {
    companyDetail,
    loading: isLoading,
    error: getErrorMessage(error),
    refetch,
  };
};
