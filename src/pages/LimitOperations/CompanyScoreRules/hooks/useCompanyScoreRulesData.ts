// Company Score Rules Data Hook - Following OperationPricing dropdown data pattern exactly

import { useErrorListener } from '@hooks';
import { useEffect, useState } from 'react';
import { useGetCompanyDetailQuery } from '../../limit-operations.api';
import {
  useGetCompanyRulesQuery,
  useGetFinanceCompaniesQuery,
  useLazyGetCompanyRuleDetailsQuery,
} from '../company-score-rules.api';
import type { CompanyScoreRule, FinanceCompany, ProductType } from '../company-score-rules.types';
import { createDefaultRule, mergeFinanceCompaniesWithSelected } from '../helpers';

interface UseCompanyScoreRulesDataProps {
  companyId: string;
  selectedProductType: ProductType;
}

/**
 * Hook for fetching company score rules data
 * Follows OperationPricing data fetching patterns with proper loading/error handling
 */
export const useCompanyScoreRulesData = ({ companyId, selectedProductType }: UseCompanyScoreRulesDataProps) => {
  const [financeList, setFinanceList] = useState<FinanceCompany[]>([]);

  // Get company details to get the identifier
  const { data: companyDetail, error: companyDetailError } = useGetCompanyDetailQuery(
    { companyId: Number.parseInt(companyId) },
    { skip: !companyId },
  );

  // Get current rule for selected product type
  const {
    data: rulesData,
    isLoading: rulesLoading,
    error: rulesError,
    refetch: refetchRules,
  } = useGetCompanyRulesQuery(
    {
      companyId: Number.parseInt(companyId),
      notifyBuyer: 0,
      senderCompanyId: Number.parseInt(companyId),
      productType: selectedProductType,
    },
    { skip: !companyId },
  );

  // Get finance companies list
  const {
    data: financeCompanies,
    isLoading: financeCompaniesLoading,
    error: financeCompaniesError,
  } = useGetFinanceCompaniesQuery();

  // Lazy query for rule details (selected financers)
  const [getRuleDetails, { data: ruleDetailsData, isLoading: ruleDetailsLoading, error: ruleDetailsError }] =
    useLazyGetCompanyRuleDetailsQuery();

  // Current rule (first from array or default)
  const currentRule: CompanyScoreRule | null = rulesData?.[0] || null;

  // Get rule details when rule changes
  useEffect(() => {
    if (currentRule?.Id && companyId) {
      getRuleDetails({
        companyId: Number.parseInt(companyId),
        ruleId: currentRule.Id,
      });
    }
  }, [currentRule?.Id, companyId, getRuleDetails]);

  // Reset finance list when product type changes (matches legacy componentDidUpdate)
  useEffect(() => {
    // If there's no rule for the current product type, keep finance list empty
    if (!currentRule?.Id) {
      setFinanceList([]);
    } else if (financeCompanies) {
      setFinanceList(financeCompanies.map((f: FinanceCompany) => ({ ...f, selected: false })));
    }
  }, [selectedProductType, financeCompanies, currentRule?.Id]);

  // Merge finance companies with selected state when data changes
  useEffect(() => {
    if (financeCompanies && ruleDetailsData && currentRule?.Id) {
      const mergedFinanceList = mergeFinanceCompaniesWithSelected(financeCompanies, ruleDetailsData);
      setFinanceList(mergedFinanceList);
    } else if (financeCompanies && currentRule?.Id) {
      // Rule exists but no details yet, show all finance companies as unselected
      setFinanceList(financeCompanies.map((f: FinanceCompany) => ({ ...f, selected: false })));
    } else {
      // No rule exists, keep finance list empty
      setFinanceList([]);
    }
  }, [financeCompanies, ruleDetailsData, currentRule?.Id]);

  // Create default rule for display when no rule exists
  const displayRule =
    currentRule || createDefaultRule(selectedProductType, companyDetail?.Identifier || '', Number.parseInt(companyId));

  const isLoading = rulesLoading || financeCompaniesLoading || ruleDetailsLoading;
  const error = rulesError || financeCompaniesError;

  // Error handling for all API calls
  useErrorListener([companyDetailError, rulesError, financeCompaniesError, ruleDetailsError]);

  return {
    // Company data
    companyDetail,

    // Rule data
    currentRule,
    displayRule,
    rulesData,

    // Finance companies
    financeList,
    setFinanceList,

    // Loading states
    isLoading,
    rulesLoading,
    financeCompaniesLoading,
    ruleDetailsLoading,

    // Errors
    error,

    // Actions
    refetchRules,
  };
};
