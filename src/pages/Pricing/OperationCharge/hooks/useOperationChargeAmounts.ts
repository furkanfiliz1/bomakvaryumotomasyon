import { useNotice } from '@components';
import { useCallback, useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { DEFAULT_NEW_OPERATION_CHARGE_AMOUNT, ProductTypesList } from '../constants';
import { isScoreDisabled, maxAmountHelper } from '../helpers';
import { useCreateOperationChargeAmountMutation } from '../operation-charge.api';
import type {
  NewOperationChargeAmountFormData,
  OperationChargeAmount,
  OperationChargeFormData,
} from '../operation-charge.types';
import { useAutoFillAmounts } from './useAutoFillAmounts';

interface UseOperationChargeAmountsProps {
  initialAmounts?: OperationChargeAmount[];
  productType?: string;
  transactionType?: string;
  onAmountsChange?: (amounts: OperationChargeAmount[]) => void;
  // API call props
  senderIdentifier?: string;
  receiverIdentifiers?: string[];
  financerIdentifiers?: string[];
  paymentType?: number;
  chargeCompanyType?: number;
  isDaily?: boolean;
  onSave?: (data: unknown) => void;
  // Parent form reference for setting OperationChargeDefinitionType in Genel Bilgiler form
  parentForm?: UseFormReturn<OperationChargeFormData>;
  // Operation charge ID for edit mode API calls
  operationChargeId?: number;
}

/**
 * Hook for managing operation charge amounts table
 * Matches legacy OperationChargeDetail amounts management
 */
export const useOperationChargeAmounts = ({
  initialAmounts = [],
  productType = '',
  transactionType = '2',
  onAmountsChange,
  senderIdentifier = '',
  receiverIdentifiers = [],
  financerIdentifiers = [],
  paymentType = 1,
  chargeCompanyType = 1,
  isDaily = false,
  onSave,
  parentForm,
  operationChargeId,
}: UseOperationChargeAmountsProps) => {
  const [amounts, setAmounts] = useState<OperationChargeAmount[]>(initialAmounts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [createOperationChargeAmount] = useCreateOperationChargeAmountMutation();
  const notice = useNotice();

  // Sync internal state with prop changes (critical for edit mode)
  useEffect(() => {
    setAmounts(initialAmounts);
  }, [initialAmounts]);

  const isScoreFieldsDisabled = isScoreDisabled(productType);
  const isAmountType = transactionType === '2';
  const isDayType = transactionType === '3';

  const newAmountForm = useForm<NewOperationChargeAmountFormData>({
    defaultValues: DEFAULT_NEW_OPERATION_CHARGE_AMOUNT,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const editAmountForm = useForm<NewOperationChargeAmountFormData>({
    defaultValues: DEFAULT_NEW_OPERATION_CHARGE_AMOUNT,
    mode: 'onBlur',
  });

  // Auto-fill amounts based on discount settings (matching legacy getDiscountAutoFillItems)
  // The hook manages its own effects to auto-populate form fields
  useAutoFillAmounts({
    senderIdentifier,
    productType,
    form: newAmountForm,
    isScoreFieldsDisabled,
    parentForm,
  });

  const handleAddAmount = useCallback(
    async (data: NewOperationChargeAmountFormData) => {
      try {
        // Manual validation matching addNewCharge logic
        const isFinancingProduct =
          Number(productType) === ProductTypesList.SUPPLIER_FINANCING ||
          Number(productType) === ProductTypesList.RECEIVER_FINANCING;

        // Check required fields with manual alerts (matching addNewCharge validation)
        if (!receiverIdentifiers?.[0] && isFinancingProduct) {
          notice({
            variant: 'error',
            title: 'Hata',
            message: 'Alıcı VKN/Ünvan alanı zorunludur.',
            buttonTitle: 'Tamam',
          });
          return;
        }

        if (!financerIdentifiers?.[0] && !isFinancingProduct) {
          notice({
            variant: 'error',
            title: 'Hata',
            message: 'Finansör alanı zorunludur.',
            buttonTitle: 'Tamam',
          });
          return;
        }

        if (!productType) {
          notice({
            variant: 'error',
            title: 'Hata',
            message: 'Ürün alanı zorunludur.',
            buttonTitle: 'Tamam',
          });
          return;
        }

        // Get OperationChargeDefinitionType from parent form (Entegratör Durumu)
        // 1 = Entegratörlü (with integrator), 2 = Entegratörsüz (without integrator)
        const operationChargeDefinitionType = parentForm
          ? Number(parentForm.getValues('OperationChargeDefinitionType'))
          : 1;

        // Use auto-filled amount type if available, otherwise use form data (matching legacy addNewCharge logic)
        // amountType: 1 = Birim (Unit), 2 = Yüzde (Percentage)
        const effectiveAmountType = data.amountType ?? 2;

        // Helper function to handle undefined/null values while preserving 0 as valid value
        const normalizeValue = (value: number | undefined | null): number | null => {
          return value ?? null;
        };

        // Check if supplier financing is selected
        const isSupplierFinancing = Number(productType) === ProductTypesList.SUPPLIER_FINANCING;

        // Determine which fee fields to include based on effectiveAmountType
        // 1 = Birim (Unit) -> Include only TransactionFee
        // 2 = Yüzde (Percentage) -> Include only PercentFee
        const isUnitType = effectiveAmountType === 1;
        const isPercentType = effectiveAmountType === 2;

        // Form field validation is handled by React Hook Form schema
        // If we have operationChargeId, call the create API directly
        if (operationChargeId) {
          // Prepare API request body - using numbers for TypeScript compatibility
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const apiBody: Record<string, any> = {
            ...(isAmountType
              ? {
                  MinAmount: normalizeValue(data.MinAmount),
                  MaxAmount: normalizeValue(data.MaxAmount),
                }
              : {
                  MinDueDay: normalizeValue(data.MinDueDay),
                  MaxDueDay: normalizeValue(data.MaxDueDay),
                }),
            // Only include the relevant fee field based on effectiveAmountType
            ...(isUnitType && { TransactionFee: normalizeValue(data.TransactionFee) }),
            ...(isPercentType && { PercentFee: normalizeValue(data.PercentFee) }),
            ProrationDays: normalizeValue(data.ProrationDays),
          };

          // Conditionally add fields based on supplier financing status (matching old project logic)
          if (!isSupplierFinancing) {
            apiBody.MinScore = isScoreFieldsDisabled ? null : normalizeValue(data.MinScore);
            apiBody.MaxScore = isScoreFieldsDisabled ? null : normalizeValue(data.MaxScore);
            apiBody.OperationChargeDefinitionType = operationChargeDefinitionType;
          }

          // Call the create API directly
          // Type assertion needed because we conditionally exclude fields for supplier financing
          await createOperationChargeAmount({
            id: operationChargeId,
            body: apiBody as typeof apiBody & { OperationChargeDefinitionType: number },
          }).unwrap();

          // Show success notification
          notice({
            variant: 'success',
            title: 'Başarılı',
            message: 'Ücret tanımı başarıyla eklendi.',
            buttonTitle: 'Tamam',
          });

          // Trigger parent to refetch data (this will update the amounts list)
          if (onAmountsChange) {
            // For now, just trigger a re-fetch by calling onAmountsChange with current amounts
            // The parent component should handle refetching the operation charge data
            onAmountsChange([...amounts]);
          }
        } else {
          // Fallback to onSave callback for create mode
          const apiBody = {
            SenderIdentifier: senderIdentifier,
            TransactionType: transactionType,
            OperationChargeAmounts: [
              {
                ...(isAmountType
                  ? {
                      MinAmount: normalizeValue(data.MinAmount),
                      MaxAmount: normalizeValue(data.MaxAmount),
                    }
                  : {
                      MinDueDay: normalizeValue(data.MinDueDay),
                      MaxDueDay: normalizeValue(data.MaxDueDay),
                    }),
                // Only include the relevant fee field based on effectiveAmountType
                ...(isUnitType && { TransactionFee: normalizeValue(data.TransactionFee) }),
                ...(isPercentType && { PercentFee: normalizeValue(data.PercentFee) }),
                // Exclude MinScore, MaxScore, and OperationChargeDefinitionType for supplier financing (matching old project)
                ...(isSupplierFinancing
                  ? {}
                  : {
                      MinScore: isScoreFieldsDisabled ? null : normalizeValue(data.MinScore),
                      MaxScore: isScoreFieldsDisabled ? null : normalizeValue(data.MaxScore),
                      OperationChargeDefinitionType: operationChargeDefinitionType,
                    }),
                ProrationDays: normalizeValue(data.ProrationDays),
              },
            ],
            PaymentType: paymentType,
            // Exclude OperationChargeDefinitionType for supplier financing at the main level too (matching old project)
            ...(isSupplierFinancing ? {} : { OperationChargeDefinitionType: operationChargeDefinitionType }),
            ChargeCompanyType: chargeCompanyType,
            IsDaily: isDaily,
            ProductType: productType,
            ReceiverIdentifiers: receiverIdentifiers || [],
            FinancerIdentifiers: financerIdentifiers || [],
          };

          // Call the API via onSave callback
          if (onSave) {
            await onSave(apiBody);
          }
        }
      } catch (error) {
        console.error('Error submitting operation charge amount:', error);
        // Don't reset form on error so user can retry
      }
    },
    [
      senderIdentifier,
      transactionType,
      isAmountType,
      isScoreFieldsDisabled,
      paymentType,
      chargeCompanyType,
      isDaily,
      productType,
      receiverIdentifiers,
      financerIdentifiers,
      onSave,
      operationChargeId,
      createOperationChargeAmount,
      notice,
      amounts,
      onAmountsChange,
      parentForm,
    ],
  );

  const handleEditAmount = useCallback(
    (id: number, data: NewOperationChargeAmountFormData) => {
      const updatedAmounts = amounts.map((amount) =>
        amount.Id === id
          ? {
              ...amount,
              ...data,
              // Clear fields that don't apply to current transaction type
              ...(isAmountType ? { MinDueDay: 0, MaxDueDay: 0 } : { MinAmount: 0, MaxAmount: 0 }),
              // Clear score fields if disabled
              ...(isScoreFieldsDisabled ? { MinScore: null, MaxScore: null } : {}),
            }
          : amount,
      );
      setAmounts(updatedAmounts);
      onAmountsChange?.(updatedAmounts);
      setEditingId(null);
      editAmountForm.reset(DEFAULT_NEW_OPERATION_CHARGE_AMOUNT);
    },
    [amounts, isAmountType, isScoreFieldsDisabled, onAmountsChange, editAmountForm],
  );

  const handleDeleteAmount = useCallback(
    (id: number) => {
      const updatedAmounts = amounts.filter((amount) => amount.Id !== id);
      setAmounts(updatedAmounts);
      onAmountsChange?.(updatedAmounts);
    },
    [amounts, onAmountsChange],
  );

  const startEditing = useCallback(
    (amount: OperationChargeAmount) => {
      setEditingId(amount.Id ?? null);
      editAmountForm.reset({
        MinDueDay: amount.MinDueDay ?? 0,
        MaxDueDay: amount.MaxDueDay ?? 0,
        MinAmount: amount.MinAmount ?? 0,
        MaxAmount: amount.MaxAmount ?? 0,
        TransactionFee: amount.TransactionFee ?? 0,
        PercentFee: amount.PercentFee ?? 0,
        MinScore: amount.MinScore,
        MaxScore: amount.MaxScore,
        ProrationDays: amount.ProrationDays,
        amountType: 2, // Default to Yüzde (Percentage) - amountType is not stored, always use form data or default
      });
    },
    [editAmountForm],
  );

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    editAmountForm.reset(DEFAULT_NEW_OPERATION_CHARGE_AMOUNT);
  }, [editAmountForm]);

  // Handle numeric format changes matching legacy maxAmountHelper
  const handleNumericChange = useCallback((value: string | number, field: string, form: ReturnType<typeof useForm>) => {
    const numericValue = maxAmountHelper(value);
    form.setValue(field, numericValue);
  }, []);

  // Validation helpers
  const validateAmountRange = useCallback((minAmount: number, maxAmount: number) => {
    return maxAmount >= minAmount;
  }, []);

  const validateDayRange = useCallback((minDay: number, maxDay: number) => {
    return maxDay >= minDay;
  }, []);

  const validateScoreRange = useCallback((minScore: number | null, maxScore: number | null) => {
    if (minScore === null || maxScore === null) return true;
    return maxScore >= minScore;
  }, []);

  return {
    amounts,
    editingId,
    newAmountForm,
    editAmountForm,
    isScoreFieldsDisabled,
    isAmountType,
    isDayType,
    handleAddAmount,
    handleEditAmount,
    handleDeleteAmount,
    startEditing,
    cancelEditing,
    handleNumericChange,
    validateAmountRange,
    validateDayRange,
    validateScoreRange,
    setAmounts, // For external updates (e.g., from API)
  };
};
