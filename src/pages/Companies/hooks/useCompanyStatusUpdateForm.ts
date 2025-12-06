import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { CompanyStatusUpdateRequest, OnboardingStatus } from '../companies.types';
import {
  CompanyStatusUpdateFormData,
  createCompanyStatusUpdateFormSchema,
  DEFAULT_COMPANY_STATUS_UPDATE_FORM,
} from '../helpers/company-status-update-form.schema';

/**
 * Custom hook for Company Status Update Form management
 * Following OperationPricing hooks pattern with form and schema creation
 */

interface UseCompanyStatusUpdateFormProps {
  availableStatuses: OnboardingStatus[];
  currentStatus?: string;
  onSubmit: (data: CompanyStatusUpdateRequest) => void;
}

export const useCompanyStatusUpdateForm = ({
  availableStatuses,
  currentStatus,
  onSubmit,
}: UseCompanyStatusUpdateFormProps) => {
  // Initialize form values
  const initialValues: CompanyStatusUpdateFormData = {
    ...DEFAULT_COMPANY_STATUS_UPDATE_FORM,
    OnboardingStatusTypes: currentStatus || '',
  };

  // Initialize form with react-hook-form (without schema initially)
  const form = useForm<CompanyStatusUpdateFormData>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  // Destructure form methods to avoid dependency issues
  const { setValue, reset, watch } = form;

  // Watch selected status to show/hide conditional fields
  const selectedStatus = watch('OnboardingStatusTypes');
  const showExtraFields = selectedStatus === '4' || selectedStatus === '17';

  // Create schema with available statuses and field visibility
  const schema = useMemo(
    () => createCompanyStatusUpdateFormSchema(availableStatuses, showExtraFields),
    [availableStatuses, showExtraFields],
  );

  // Reset conditional fields when they're not needed
  useEffect(() => {
    if (!showExtraFields) {
      setValue('LoanDecisionTypes', null);
      setValue('OperationalLimit', null);
    }
  }, [showExtraFields, setValue]);

  // Reset form when currentStatus changes
  useEffect(() => {
    reset({
      ...DEFAULT_COMPANY_STATUS_UPDATE_FORM,
      OnboardingStatusTypes: currentStatus || '',
    });
  }, [currentStatus, reset]);

  // Handle form submission with validation
  const handleSubmit = form.handleSubmit((data) => {
    // Add conditional validation
    if (showExtraFields) {
      if (!data.LoanDecisionTypes) {
        form.setError('LoanDecisionTypes', {
          message: 'Kredi karar türü seçimi zorunludur',
        });
        return;
      }
      if (!data.OperationalLimit || data.OperationalLimit <= 0) {
        form.setError('OperationalLimit', {
          message: "Operasyonel limit 0'dan büyük olmalıdır",
        });
        return;
      }
    }

    // Transform form data to API format
    const requestData: CompanyStatusUpdateRequest = {
      OnboardingStatusTypes: data.OnboardingStatusTypes,
      ...(showExtraFields && {
        LoanDecisionTypes: data.LoanDecisionTypes || undefined,
        OperationalLimit: data.OperationalLimit || undefined,
      }),
      commentText: data.commentText || undefined,
    };

    onSubmit(requestData);
  });

  // Handle form reset
  const handleReset = () => {
    form.reset({
      ...DEFAULT_COMPANY_STATUS_UPDATE_FORM,
      OnboardingStatusTypes: currentStatus || '',
    });
  };

  return {
    form,
    schema,
    handleSubmit,
    handleReset,
    showExtraFields,
    initialValues,
  };
};
