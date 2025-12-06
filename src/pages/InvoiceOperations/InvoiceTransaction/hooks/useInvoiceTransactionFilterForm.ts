import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFilterFormWithUrlSync } from '@hooks';
import yup from '@validation';
import dayjs from 'dayjs';
import { useForm, UseFormReturn } from 'react-hook-form';
import { SchemaField } from 'src/components/common/Form/enums';
import type { InvoiceTransactionFilters } from '../invoice-transaction.types';

export interface InvoiceTransactionFilterFormData extends Record<string, unknown> {
  OrderNumber: string;
  InvoiceNumber: string;
  ReferenceId: string;
  ReceiverIdentifier: string;
  StartDate: string;
  EndDate: string;
}

interface UseInvoiceTransactionFilterFormProps {
  onFilterChange: (filters: Partial<InvoiceTransactionFilters>) => void;
}

function useInvoiceTransactionFilterForm({ onFilterChange }: UseInvoiceTransactionFilterFormProps) {
  const defaultValues: InvoiceTransactionFilterFormData = {
    OrderNumber: '',
    InvoiceNumber: '',
    ReferenceId: '',
    ReceiverIdentifier: '',
    StartDate: '',
    EndDate: '',
  };

  const schema = yup.object({
    OrderNumber: fields.text.label('Sipariş Numarası').meta({
      col: 2,
      field: SchemaField.InputText,
      size: 'small',
    }),
    InvoiceNumber: fields.text.label('Fatura Numarası').meta({
      col: 2,
      field: SchemaField.InputText,
      size: 'small',
    }),
    ReferenceId: fields.text.label('İskonto No').meta({
      col: 2,
      field: SchemaField.InputText,
      size: 'small',
    }),
    ReceiverIdentifier: fields.text.label('Fatura Kesilen VKN').meta({
      col: 2,
      field: SchemaField.InputText,
      size: 'small',
    }),
    StartDate: fields.date.label('Başlangıç Tarihi').meta({
      col: 2,
      field: SchemaField.InputDate,
      size: 'small',
    }),
    EndDate: fields.date.label('Bitiş Tarihi').meta({
      col: 2,
      field: SchemaField.InputDate,
      size: 'small',
    }),
  });

  const form = useForm<InvoiceTransactionFilterFormData>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  // Transform form data to API filter format
  const transformToApiFilters = (data: InvoiceTransactionFilterFormData): Partial<InvoiceTransactionFilters> => {
    return {
      OrderNumber: data.OrderNumber || undefined,
      InvoiceNumber: data.InvoiceNumber || undefined,
      ReferenceId: data.ReferenceId || undefined,
      ReceiverIdentifier: data.ReceiverIdentifier || undefined,
      StartDate: data.StartDate ? dayjs(data.StartDate).format('YYYY-MM-DD') : undefined,
      EndDate: data.EndDate ? dayjs(data.EndDate).format('YYYY-MM-DD') : undefined,
      page: 1, // Reset to first page when filtering
    };
  };

  // Use the generic useFilterFormWithUrlSync hook for URL sync
  const { handleApply, handleReset: resetForm } = useFilterFormWithUrlSync<
    InvoiceTransactionFilterFormData,
    Partial<InvoiceTransactionFilters>
  >({
    form,
    onFilterChange,
    transformToApiFilters,
  });

  const handleReset = () => {
    resetForm(defaultValues);
  };

  return {
    form: form as unknown as UseFormReturn<InvoiceTransactionFilterFormData, unknown, undefined>,
    schema,
    handleSubmit: handleApply,
    handleReset,
  };
}

export default useInvoiceTransactionFilterForm;
