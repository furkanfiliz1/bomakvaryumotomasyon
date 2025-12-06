/**
 * Company Score Tab Data Hook
 * Following OperationPricing pattern for data management
 */

import { useErrorListener } from '@hooks';
import { useCallback, useEffect, useMemo } from 'react';

import {
  useGetLoanDecisionTypesQuery,
  useLazyGetCompanyFigoScoreQuery,
  useLazyGetFinancialAnalysisQuery,
} from '../company-score-tab.api';
import type { UseCompanyScoreTabDataReturn } from '../company-score-tab.types';

/**
 * Main data hook for Company Score Tab
 * Manages all API calls and loading states
 */
export const useCompanyScoreTabData = (companyId: string): UseCompanyScoreTabDataReturn => {
  // RTK Query hooks
  const [getFigoScore, figoScoreQuery] = useLazyGetCompanyFigoScoreQuery();
  const [getFinancialAnalysis, financialAnalysisQuery] = useLazyGetFinancialAnalysisQuery();

  // Loan decision types can be loaded eagerly as they're static
  const loanDecisionTypesQuery = useGetLoanDecisionTypesQuery();

  // Extract data and states - APIs return data directly without wrapper
  const figoScoreData = figoScoreQuery.data;
  const financialAnalysisData = financialAnalysisQuery.data;

  // Loading states
  const figoScoreLoading = figoScoreQuery.isLoading;
  const financialAnalysisLoading = financialAnalysisQuery.isLoading;
  const loanDecisionTypesLoading = loanDecisionTypesQuery.isLoading;

  // Error states
  const figoScoreError = figoScoreQuery.error;
  const financialAnalysisError = financialAnalysisQuery.error;
  const loanDecisionTypesError = loanDecisionTypesQuery.error;

  // Combined states
  const isLoading = figoScoreLoading || financialAnalysisLoading || loanDecisionTypesLoading;
  const hasError = !!(figoScoreError || financialAnalysisError || loanDecisionTypesError);

  // Refetch functions with useCallback for stable references
  const refetchFigoScore = useCallback(() => {
    if (companyId) {
      getFigoScore({ companyId });
    }
  }, [companyId, getFigoScore]);

  const refetchFinancialAnalysis = useCallback(() => {
    if (figoScoreData?.Identifier) {
      getFinancialAnalysis({ identifier: figoScoreData.Identifier });
    }
  }, [figoScoreData?.Identifier, getFinancialAnalysis]);

  const refetchLoanDecisionTypes = useCallback(() => {
    loanDecisionTypesQuery.refetch();
  }, [loanDecisionTypesQuery]);

  // Initial data loading
  useEffect(() => {
    if (companyId) {
      getFigoScore({ companyId });
    }
  }, [companyId, getFigoScore]);

  // Load financial analysis when we have the company identifier
  useEffect(() => {
    if (figoScoreData?.Identifier) {
      getFinancialAnalysis({ identifier: figoScoreData.Identifier });
    }
  }, [figoScoreData?.Identifier, getFinancialAnalysis]);

  // Memoized values
  const loanDecisionTypes = useMemo(() => loanDecisionTypesQuery.data || [], [loanDecisionTypesQuery.data]);

  const refetchAll = useCallback(() => {
    refetchFigoScore();
    refetchFinancialAnalysis();
    refetchLoanDecisionTypes();
  }, [refetchFigoScore, refetchFinancialAnalysis, refetchLoanDecisionTypes]);

  // Error handling for all API calls
  useErrorListener([figoScoreError, financialAnalysisError, loanDecisionTypesError]);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // Company Figo Score Data
      figoScoreData,
      figoScoreLoading,
      figoScoreError,

      // Financial Analysis Data
      financialAnalysisData,
      financialAnalysisLoading,
      financialAnalysisError,

      // Loan Decision Types
      loanDecisionTypes,
      loanDecisionTypesLoading,
      loanDecisionTypesError,

      // Combined states
      isLoading,
      hasError,

      // Refetch functions
      refetchFigoScore,
      refetchFinancialAnalysis,
      refetchLoanDecisionTypes,
      refetchAll,
    }),
    [
      figoScoreData,
      figoScoreLoading,
      figoScoreError,
      financialAnalysisData,
      financialAnalysisLoading,
      financialAnalysisError,
      loanDecisionTypes,
      loanDecisionTypesLoading,
      loanDecisionTypesError,
      isLoading,
      hasError,
      refetchFigoScore,
      refetchFinancialAnalysis,
      refetchLoanDecisionTypes,
      refetchAll,
    ],
  );
};
