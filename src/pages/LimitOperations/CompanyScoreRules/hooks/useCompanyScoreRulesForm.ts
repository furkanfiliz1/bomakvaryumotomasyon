// Company Score Rules Form Hook - Following OperationPricing form pattern exactly

import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  useCreateCompanyRuleMutation,
  useUpdateCompanyRuleMutation,
  useUpdateRuleFinancersMutation,
} from '../company-score-rules.api';
import type { CompanyScoreRule, CompanyScoreRulesFormData, FinanceCompany } from '../company-score-rules.types';
import { transformFinanceCompaniesToRequest } from '../helpers';

interface UseCompanyScoreRulesFormProps {
  companyId: string;
  currentRule: CompanyScoreRule | null;
  displayRule: CompanyScoreRule;
  financeList: FinanceCompany[];
  onRuleSaved: () => void;
}

/**
 * Hook for managing company score rules form state
 * Follows OperationPricing form management patterns
 */
export const useCompanyScoreRulesForm = ({
  companyId,
  currentRule,
  displayRule,
  financeList,
  onRuleSaved,
}: UseCompanyScoreRulesFormProps) => {
  const notice = useNotice();

  // Form state
  const form = useForm<CompanyScoreRulesFormData>({
    defaultValues: {
      IsBidViewable: false,
      PartialAllowance: 0,
      SenderCancel: 0,
      ProductType: displayRule.ProductType,
    },
    mode: 'onChange',
  });

  // API mutations
  const [createRule, { isLoading: isCreating, error: createError }] = useCreateCompanyRuleMutation();
  const [updateRule, { isLoading: isUpdating, error: updateError }] = useUpdateCompanyRuleMutation();
  const [updateFinancers, { isLoading: isUpdatingFinancers, error: updateFinancersError }] =
    useUpdateRuleFinancersMutation();

  // Update form when display rule changes - ensure form is reactive to product type changes
  useEffect(() => {
    const formValues = {
      IsBidViewable: displayRule.IsBidViewable,
      PartialAllowance: displayRule.PartialAllowance,
      SenderCancel: displayRule.SenderCancel,
      ProductType: displayRule.ProductType,
    };

    // Always reset form to ensure it reflects the current displayRule
    form.reset(formValues, { keepDefaultValues: false });
  }, [
    displayRule.ProductType,
    displayRule.IsBidViewable,
    displayRule.PartialAllowance,
    displayRule.SenderCancel,
    form,
  ]);

  // Save rules handler - matches legacy onSaveRules exactly
  const handleSaveRules = useCallback(async () => {
    const formData = form.getValues();

    try {
      if (currentRule?.Id) {
        // Update existing rule
        await updateRule({
          companyId: Number.parseInt(companyId),
          ruleId: currentRule.Id,
          Id: currentRule.Id,
          IsBidViewable: formData.IsBidViewable,
          PartialAllowance: formData.PartialAllowance,
          SenderCancel: formData.SenderCancel,
          notifyBuyer: 0,
          SenderIdentifier: displayRule.SenderIdentifier,
          ProductType: formData.ProductType,
        }).unwrap();
      } else {
        // Create new rule
        await createRule({
          companyId: Number.parseInt(companyId),
          IsBidViewable: formData.IsBidViewable,
          PartialAllowance: formData.PartialAllowance,
          SenderCancel: formData.SenderCancel,
          notifyBuyer: 0,
          SenderIdentifier: displayRule.SenderIdentifier,
          ProductType: formData.ProductType,
        }).unwrap();
      }

      await notice({
        title: 'Başarılı',
        message: currentRule?.Id
          ? 'Şirket kuralları başarıyla güncellendi.'
          : 'Şirket kuralları başarıyla oluşturuldu.',
      });
      onRuleSaved();
    } catch (error) {
      // Error will be handled by global error handler
      console.error('Failed to save rules:', error);
    }
  }, [form, currentRule, companyId, displayRule.SenderIdentifier, updateRule, createRule, onRuleSaved, notice]);

  // Save finance companies handler - matches legacy onSaveFinanceList exactly
  const handleSaveFinanceCompanies = useCallback(async () => {
    if (!currentRule?.Id) {
      await notice({
        title: 'Uyarı',
        message: 'Önce şirket kurallarını kaydetmelisiniz.',
      });
      return;
    }

    try {
      const financerRequests = transformFinanceCompaniesToRequest(financeList, currentRule.Id);

      await updateFinancers({
        companyId: Number.parseInt(companyId),
        definitionId: currentRule.Id, // Use definitionId to match legacy endpoint
        financers: financerRequests,
      }).unwrap();

      await notice({
        title: 'Başarılı',
        message: 'Finansör şirketleri başarıyla güncellendi.',
      });
    } catch (error) {
      // Error will be handled by global error handler
      console.error('Failed to save finance companies:', error);
    }
  }, [currentRule?.Id, financeList, updateFinancers, companyId, notice]);

  // Form field update handlers matching legacy setState patterns
  const updateRuleField = useCallback(
    (field: keyof CompanyScoreRulesFormData, value: boolean | number) => {
      form.setValue(field, value, { shouldValidate: true });
    },
    [form],
  );

  // Error handling for all mutation errors
  useErrorListener([createError, updateError, updateFinancersError]);

  return {
    // Form state
    form,

    // Loading states
    isLoading: isCreating || isUpdating || isUpdatingFinancers,
    isCreating,
    isUpdating,
    isUpdatingFinancers,

    // Actions
    handleSaveRules,
    handleSaveFinanceCompanies,
    updateRuleField,
  };
};
