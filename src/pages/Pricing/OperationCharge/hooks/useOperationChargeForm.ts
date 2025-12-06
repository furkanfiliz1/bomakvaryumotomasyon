import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { DEFAULT_OPERATION_CHARGE_FORM } from '../constants';
import {
  createOperationChargeFormSchema,
  transformApiResponseToFormData,
  transformFormDataToApiRequest,
} from '../helpers';
import type { GetOperationChargeByIdResponse, OperationChargeFormData } from '../operation-charge.types';
import { useOperationChargeDropdownData } from './useOperationChargeDropdownData';

interface UseOperationChargeFormProps {
  initialData?: GetOperationChargeByIdResponse;
  onSubmit: (data: ReturnType<typeof transformFormDataToApiRequest>) => void;
}

/**
 * Hook for managing operation charge form state and validation
 * Following OperationPricing form patterns
 */
export const useOperationChargeForm = ({ initialData, onSubmit }: UseOperationChargeFormProps) => {
  // Get dropdown data for schema creation
  const dropdownData = useOperationChargeDropdownData();

  // Create validation schema with proper dropdown data
  const schema = useMemo(() => {
    // Convert number values to strings for schema compatibility
    const integratorStatusForSchema = dropdownData.integratorStatus.map((item) => ({
      ...item,
      value: String(item.value),
    }));

    return createOperationChargeFormSchema(
      dropdownData.productTypes,
      integratorStatusForSchema,
      dropdownData.transactionTypes,
      dropdownData.sellersCompanySearchResults,
      dropdownData.buyersCompanySearchResults,
      dropdownData.financierCompanies, // Changed from search results to direct list
      dropdownData.searchSellersByCompanyNameOrIdentifier,
      dropdownData.searchBuyersByCompanyNameOrIdentifier,
      dropdownData.isSellersSearchLoading,
      dropdownData.isBuyersSearchLoading,
      undefined, // currentProductType - will be watched by form
      false, // isEditMode
    );
  }, [
    dropdownData.productTypes,
    dropdownData.integratorStatus,
    dropdownData.transactionTypes,
    dropdownData.sellersCompanySearchResults,
    dropdownData.buyersCompanySearchResults,
    dropdownData.financierCompanies, // Changed from search results to direct list
    dropdownData.searchSellersByCompanyNameOrIdentifier,
    dropdownData.searchBuyersByCompanyNameOrIdentifier,
    dropdownData.isSellersSearchLoading,
    dropdownData.isBuyersSearchLoading,
  ]);

  const form = useForm({
    defaultValues: DEFAULT_OPERATION_CHARGE_FORM,
    resolver: yupResolver(schema),
    mode: 'onChange',
  }) as UseFormReturn<OperationChargeFormData>;

  // Load initial data when provided (edit mode)
  useEffect(() => {
    if (initialData) {
      const formData = transformApiResponseToFormData(initialData);
      form.reset(formData);
    }
  }, [initialData, form]);

  const handleSubmit = form.handleSubmit((data: OperationChargeFormData) => {
    const apiRequest = transformFormDataToApiRequest(data);
    onSubmit(apiRequest);
  });

  const handleReset = () => {
    form.reset(DEFAULT_OPERATION_CHARGE_FORM);
  };

  return {
    form,
    schema,
    handleSubmit,
    handleReset,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
  };
};
