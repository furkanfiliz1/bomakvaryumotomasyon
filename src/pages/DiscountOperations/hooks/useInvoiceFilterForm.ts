import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import { useLazyGetAllAllowanceStatusQuery } from '../discount-operations.api';

interface InvoiceFormData {
  invoiceNumber: string;
  invoicePayableAmount: number | null;
  status: string;
}

interface InvoiceFilters {
  invoiceNumber?: string;
  invoicePayableAmount?: number;
  status?: string;
}

interface UseInvoiceFilterFormProps {
  onFilterChange: (filters: Partial<InvoiceFilters>) => void;
}

function useInvoiceFilterForm({ onFilterChange }: UseInvoiceFilterFormProps) {
  // Fetch allowance status options from API - following OperationPricing pattern
  const [getAllAllowanceStatus, { data: allowanceStatusData }] = useLazyGetAllAllowanceStatusQuery();

  // Transform status data for dropdown - matching legacy exactly
  const statusOptions = useMemo(() => {
    if (!allowanceStatusData) return [];
    return [
      { Value: '', Description: 'Tümü' }, // Add "All" option first like legacy
      ...allowanceStatusData,
    ];
  }, [allowanceStatusData]);

  // Fetch status options on mount
  useEffect(() => {
    getAllAllowanceStatus();
  }, [getAllAllowanceStatus]);

  const initialValues: InvoiceFormData = {
    invoiceNumber: '',
    invoicePayableAmount: null,
    status: '',
  };

  // Form schema following OperationPricing pattern exactly
  const schema = useMemo(() => {
    const baseFields: AnyObject = {
      invoiceNumber: fields.text.label('Fatura No').meta({ col: 4 }),
      invoicePayableAmount: fields.number.label('Fatura Tutarı').meta({ col: 4 }).nullable(),
      status: fields.select(statusOptions, 'string', ['Value', 'Description']).label('Durum').meta({ col: 4 }),
    };

    return yup.object(baseFields);
  }, [statusOptions]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const convertToFilters = (data: Record<string, unknown>): Partial<InvoiceFilters> => {
    return {
      invoiceNumber: (data.invoiceNumber as string) || undefined,
      invoicePayableAmount: (data.invoicePayableAmount as number) || undefined,
      status: (data.status as string) || undefined,
    };
  };

  const handleSearch = () => {
    const data = form.getValues();
    const filters = convertToFilters(data);
    onFilterChange(filters);
  };

  const handleReset = () => {
    form.reset(initialValues);
    // Explicitly clear all filter values - following OperationChargeFilters pattern
    onFilterChange({
      invoiceNumber: undefined,
      invoicePayableAmount: undefined,
      status: undefined,
    });
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
    statusOptions,
  };
}

export { useInvoiceFilterForm };
export type { InvoiceFilters };
