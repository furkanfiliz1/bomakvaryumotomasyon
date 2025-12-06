import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface BulkUpdateFormData {
  issueDate: string;
  paymentDueDate: string;
  payableAmount?: number;
  approvedPayableAmount?: number;
  remainingAmount?: number;
  IsResetPaymentDueDate?: boolean;
}

interface UseBulkUpdateFormProps {
  onBulkUpdate: (data: BulkUpdateFormData) => void;
  maxIssueDate?: Date | null;
}

function useBulkUpdateForm({ onBulkUpdate, maxIssueDate }: UseBulkUpdateFormProps) {
  const initialValues: BulkUpdateFormData = {
    issueDate: '',
    paymentDueDate: '',
    payableAmount: undefined,
    approvedPayableAmount: undefined,
    remainingAmount: undefined,
    IsResetPaymentDueDate: false,
  };

  // Form schema using the project's form system
  const schema = useMemo(() => {
    const today = new Date();

    return yup.object({
      issueDate: fields.date
        .label('Fatura Tarihi')
        .test('not-future', 'Fatura tarihi bugünden sonra olamaz', (value) => {
          if (!value) return true; // Empty is allowed
          const inputDate = new Date(value);
          return inputDate <= today;
        })
        .meta({
          col: 4,
          maxDate: today, // Issue date cannot be in the future
        }),

      paymentDueDate: fields.date.label('Vade Tarihi').meta({
        col: 4,
        minDate: maxIssueDate || undefined, // Payment due date cannot be before max issue date
      }),

      IsResetPaymentDueDate: fields.checkbox.label('Vade Tarihi Sıfırlansın mı?').meta({ col: 4 }),

      payableAmount: fields.currency.label('Fatura Tutarı').meta({ col: 4, currency: 'TRY' }),
      approvedPayableAmount: fields.currency.label('Alıcı Onaylı Fatura Tutarı').meta({ col: 4, currency: 'TRY' }),
      remainingAmount: fields.currency.label('İskontolabilir Tutar').meta({ col: 4, currency: 'TRY' }),
    });
  }, [maxIssueDate]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSubmit = () => {
    const formData = form.getValues() as BulkUpdateFormData;
    onBulkUpdate(formData);
  };

  return {
    form,
    schema,
    handleSubmit,
  };
}

export default useBulkUpdateForm;
