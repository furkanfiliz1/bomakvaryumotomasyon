import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ManualTransactionFeeStatusOption } from '../manual-transaction-fee-tracking.types';

/**
 * Form data interface matching legacy ManuelTransactionPayTrackingEdit structure
 */
export interface ManualTransactionFeeEditFormData {
  IsInvoiceBilled: boolean;
  IsExtraFinancialRecorded: boolean;
  Status: string | number;
  Description: string;
}

interface UseManualTransactionFeeEditFormProps {
  statusOptions: ManualTransactionFeeStatusOption[];
  initialData?: Partial<ManualTransactionFeeEditFormData>;
}

/**
 * Custom hook for Manual Transaction Fee Edit Form
 * Following OperationPricing pattern with schema-based form definition
 */
export const useManualTransactionFeeEditForm = ({
  statusOptions,
  initialData,
}: UseManualTransactionFeeEditFormProps) => {
  // Convert status options to select format
  const statusSelectOptions = useMemo(
    () => statusOptions.map((opt) => ({ Value: opt.Value, Description: opt.Text })),
    [statusOptions],
  );

  // Create validation schema with fields from common Form schemas
  const schema = useMemo(
    () =>
      yup.object({
        // IsInvoiceBilled - Switch Field
        IsInvoiceBilled: fields.switchField.default(false).label('Faturası kesildi mi?').meta({ spaceBetween: true }),

        // IsExtraFinancialRecorded - Switch Field
        IsExtraFinancialRecorded: fields.switchField
          .default(false)
          .label('Gelir Gider girişi yapıldı mı?')
          .meta({ spaceBetween: true }),

        // Status - Select Dropdown
        Status: fields
          .select(statusSelectOptions, 'number', ['Value', 'Description'])
          .required('Statü seçimi zorunludur')
          .label('Statü')
          .meta({}),

        // Description - Textarea
        Description: fields.textarea.default('').label('Notlar').meta({}),
      }),
    [statusSelectOptions],
  );

  // Initialize form with default values
  const form = useForm<ManualTransactionFeeEditFormData>({
    defaultValues: {
      IsInvoiceBilled: initialData?.IsInvoiceBilled || false,
      IsExtraFinancialRecorded: initialData?.IsExtraFinancialRecorded || false,
      Status: initialData?.Status || '',
      Description: initialData?.Description || '',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onBlur', // Better for edit forms to avoid excessive validation
  });

  // Update form when initial data changes (only once when data is loaded)
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (initialData && !hasInitialized) {
      // Only reset form once when data is first loaded
      form.reset({
        IsInvoiceBilled: initialData.IsInvoiceBilled ?? false,
        IsExtraFinancialRecorded: initialData.IsExtraFinancialRecorded ?? false,
        Status: initialData.Status ?? '',
        Description: initialData.Description ?? '',
      });
      setHasInitialized(true);
    }
  }, [initialData, form, hasInitialized]);

  return {
    form,
    schema,
  };
};
