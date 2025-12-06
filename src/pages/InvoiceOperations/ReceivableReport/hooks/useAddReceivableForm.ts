import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AddReceivableFormData, ReceivableReportItem } from '../receivable-report.types';

/**
 * Custom hook for managing add receivable form state and validation
 * Following OperationPricing form patterns
 */
export const useAddReceivableForm = (receivableData?: ReceivableReportItem) => {
  // Initial form values - use receivableData if provided, otherwise empty form
  const initialValues: AddReceivableFormData = {
    OrderNo: receivableData?.OrderNo || '',
    SenderIdentifier: receivableData?.SenderIdentifier || '',
    SenderName: receivableData?.SenderName || '',
    ReceiverIdentifier: receivableData?.ReceiverIdentifier || '',
    ReceiverName: receivableData?.ReceiverName || '',
    PayableAmount: receivableData?.PayableAmount || 0,
    ApprovedPayableAmount: receivableData?.ApprovedPayableAmount || 0,
    CurrencyId: receivableData?.CurrencyId?.toString() || '1', // Default to TRY as string to match select field
    PaymentDueDate: receivableData?.PaymentDueDate || '',
    IssueDate: receivableData?.IssueDate || '',
    ProductType: receivableData?.ProductType || 7, // Default product type from curl example
  };

  // Form validation schema
  const schema = useMemo(
    () =>
      yup.object({
        ReceiverName: fields.text.required('Alıcı Adı zorunludur').label('Alıcı Adı').meta({ col: 6, readonly: true }),

        ReceiverIdentifier: fields.text
          .required('Alıcı VKN/TCKN zorunludur')
          .label('Alıcı VKN/TCKN')
          .meta({ col: 6, readonly: true }),

        SenderName: fields.text.required('Satıcı Adı zorunludur').label('Satıcı Adı').meta({ col: 6, readonly: true }),
        SenderIdentifier: fields.text
          .required('Satıcı VKN/TCKN zorunludur')
          .label('Satıcı VKN/TCKN')
          .meta({ col: 6, readonly: true }),

        OrderNo: fields.text.required('Alacak No zorunludur').label('Alacak No').meta({ col: 6, visible: false }),

        CurrencyId: fields
          .select(
            [
              { value: 1, label: 'TRY - Türk Lirası' },
              { value: 2, label: 'USD - Amerikan Doları' },
              { value: 3, label: 'EUR - Euro' },
            ],
            'number',
            ['value', 'label'],
          )
          .required('Para Birimi zorunludur')
          .label('Para Birimi')
          .meta({ col: 6, readonly: true }),
        ApprovedPayableAmount: fields.currency
          .required('Onaylanmış Alacak Tutarı zorunludur')
          .min(0.01, "Onaylanmış alacak tutarı 0'dan büyük olmalıdır")
          .label('Onaylanmış Alacak Tutarı')
          .meta({ currency: 'TRY', col: 6, visible: false }),
        IssueDate: fields.date
          .required('Oluşturma Tarihi zorunludur')
          .label('Oluşturma Tarihi')
          .meta({ col: 6, readonly: true }),

        PaymentDueDate: fields.date.required('Vade Tarihi zorunludur').label('Vade Tarihi').meta({ col: 6 }),
        PayableAmount: fields.currency
          .required('Alacak Tutarı zorunludur')
          .min(0.01, "Alacak tutarı 0'dan büyük olmalıdır")
          .label('Alacak Tutarı')
          .meta({ currency: 'TRY', col: 6 }),
        ProductType: fields.number.required('Ürün Tipi zorunludur').label('Ürün Tipi').meta({ col: 6, visible: false }),
      }),
    [],
  );

  // Form instance
  const form = useForm<AddReceivableFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Reset form to initial values
  const handleReset = () => {
    form.reset(initialValues);
  };

  return {
    form,
    schema,
    handleReset,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
  };
};
