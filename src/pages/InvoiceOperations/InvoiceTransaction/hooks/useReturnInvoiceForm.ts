import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { fields } from '@components';
import yup from '@validation';
import type { InvoiceTransactionItem } from '../invoice-transaction.types';

interface ReturnInvoiceFormData {
  ReturnInvoiceNumber: string;
  ReturnInvoiceDate: string;
  ReturnInvoiceAmount?: number;
}

interface UseReturnInvoiceFormProps {
  invoice?: InvoiceTransactionItem;
}

/**
 * Hook for managing return invoice form state and validation
 * Following OperationPricing pattern for form management
 */
export const useReturnInvoiceForm = ({ invoice }: UseReturnInvoiceFormProps = {}) => {
  // Default form values
  const initialValues: ReturnInvoiceFormData = {
    ReturnInvoiceNumber: invoice?.ReturnInvoiceNumber || '',
    ReturnInvoiceDate: invoice?.ReturnInvoiceDate || '',
    ReturnInvoiceAmount: invoice?.ReturnInvoiceAmount || undefined,
  };

  // Form validation schema
  const schema = useMemo(() => {
    return yup.object().shape({
      ReturnInvoiceNumber: fields.text.label('İade Fatura Numarası').meta({ col: 12 }),

      ReturnInvoiceDate: fields.date.label('İade Fatura Tarihi').meta({ col: 12 }),

      ReturnInvoiceAmount: fields.currency.label('İade Fatura Tutarı').meta({
        col: 12,
        currency: 'TRY',
      }),
    });
  }, []);

  // Initialize form with react-hook-form
  const form = useForm<ReturnInvoiceFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Transform form data for submission
  const transformForSubmission = (data: ReturnInvoiceFormData) => {
    return {
      ReturnInvoiceNumber: data.ReturnInvoiceNumber || undefined,
      ReturnInvoiceDate: data.ReturnInvoiceDate || undefined,
      ReturnInvoiceAmount: data.ReturnInvoiceAmount || undefined,
    };
  };

  return {
    form,
    schema,
    initialValues,
    transformForSubmission,
  };
};

export type { ReturnInvoiceFormData };
