import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useLazyGetDiscountAutoFillItemsQuery } from '../operation-charge.api';
import type { NewOperationChargeAmountFormData, OperationChargeFormData } from '../operation-charge.types';

interface UseAutoFillAmountsProps {
  senderIdentifier?: string;
  productType?: string;
  form: UseFormReturn<NewOperationChargeAmountFormData>;
  isScoreFieldsDisabled: boolean;
  parentForm?: UseFormReturn<OperationChargeFormData>; // Parent form for setting main OperationChargeDefinitionType
}

/**
 * Hook to auto-fill operation charge amounts based on discount settings
 * Matches legacy getDiscountAutoFillItems behavior from OperationChargeDetail.js
 */
export const useAutoFillAmounts = ({
  senderIdentifier,
  productType,
  form,
  isScoreFieldsDisabled,
  parentForm,
}: UseAutoFillAmountsProps) => {
  const [trigger, { data: autoFillData, isLoading, isError }] = useLazyGetDiscountAutoFillItemsQuery();
  useEffect(() => {
    // Only fetch if both senderIdentifier and productType are provided
    if (senderIdentifier && productType) {
      trigger({
        Identifier: senderIdentifier,
        ProductType: productType,
      });
    }
  }, [senderIdentifier, productType, trigger]);

  useEffect(() => {
    // Auto-fill form when data is received
    // Matching legacy getDiscountAutoFillItems behavior from OperationChargeDetail.js
    if (autoFillData && !isError) {
      // Use setTimeout to ensure form is fully mounted and ready
      setTimeout(() => {
        // Set amountType in amounts form AND OperationChargeDefinitionType in parent form
        // autoFillData.OperationChargeDefinitionType is used for both:
        // 1. Ücretlendirme Tipi (1=Birim, 2=Yüzde) in amounts form
        // 2. Entegratör Durumu (1=Entegratörlü, 2=Entegratörsüz) in main form
        if (autoFillData.OperationChargeDefinitionType !== undefined) {
          // Set in parentForm (main form) as OperationChargeDefinitionType (Entegratör Durumu)
          // Matching legacy behavior: chargeList.OperationChargeDefinitionType is set with the same value
          if (parentForm) {
            parentForm.setValue('OperationChargeDefinitionType', String(autoFillData.OperationChargeDefinitionType), {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }
        }

        // Set Score fields only if not disabled (matching legacy logic)
        if (!isScoreFieldsDisabled) {
          if (autoFillData.MinScore !== undefined) {
            form.setValue('MinScore', autoFillData.MinScore, { shouldValidate: true });
          }
          if (autoFillData.MaxScore !== undefined) {
            form.setValue('MaxScore', autoFillData.MaxScore, { shouldValidate: true });
          }
        }

        // Set Amount fields with maxAmountHelper validation
        if (autoFillData.MinAmount !== undefined) {
          const minAmount = Math.min(autoFillData.MinAmount, 99999999999.99);
          form.setValue('MinAmount', minAmount, { shouldValidate: true });
        }
        if (autoFillData.MaxAmount !== undefined) {
          const maxAmount = Math.min(autoFillData.MaxAmount, 99999999999.99);
          form.setValue('MaxAmount', maxAmount, { shouldValidate: true });
        }
      }, 100);
    }
  }, [autoFillData, isError, form, parentForm, isScoreFieldsDisabled]);

  return {
    autoFillData,
    isLoadingAutoFill: isLoading,
    isAutoFillError: isError,
  };
};
