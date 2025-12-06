import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFilterFormWithUrlSync } from '@hooks';
import yup from '@validation';
import { useMemo } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import { FinancialRecordFilters } from '../manual-transaction-entry.types';

interface UseFinancialRecordsFilterFormProps {
  financialRecordTypes: Array<{ Value: number; Description: string }>;
  financialActivityTypes: Array<{ Value: number; Description: string }>;
  processTypes: Array<{ Value: number; Description: string }>;
  bankList: Array<{ Id: number; CompanyName: string; Identifier: string }>; // Used for financer dropdown
  buyerList: Array<{ Id: number; Identifier: string; CompanyName: string }>;
  customerManagerList: Array<{ Id: number; FullName: string }>;
  buyersCompanySearchResults: Array<{ Id: number; CompanyName: string; Identifier: string }>;
  sellersCompanySearchResults: Array<{ Id: number; CompanyName: string; Identifier: string }>;
  searchBuyersByCompanyNameOrIdentifier: (CompanyNameOrIdentifier?: string) => Promise<void>;
  searchSellersByCompanyNameOrIdentifier: (CompanyNameOrIdentifier?: string) => Promise<void>;
  isBuyersSearchLoading: boolean;
  isSellersSearchLoading: boolean;
  onFilterChange: (filters: Partial<FinancialRecordFilters>) => void;
}

interface FormData extends Record<string, unknown> {
  referenceNumber: string;
  senderIdentifier: AnyObject | string;
  financerIdentifier: string;
  startDate: string;
  endDate: string;
  type: string;
  financialRecordProcessType: string;
  billingIdentifier: string;
  receiverIdentifier: AnyObject | string;
  senderUserIds: number[];
  receiverUserIds: number[];
}

/**
 * Hook for managing financial records filter form state with Yup schema validation
 * Following InvoiceReportFilters pattern exactly
 */
const useFinancialRecordsFilterForm = ({
  financialRecordTypes,
  processTypes,
  bankList,
  customerManagerList,
  buyersCompanySearchResults,
  sellersCompanySearchResults,
  searchBuyersByCompanyNameOrIdentifier,
  searchSellersByCompanyNameOrIdentifier,
  isBuyersSearchLoading,
  isSellersSearchLoading,
  onFilterChange,
}: UseFinancialRecordsFilterFormProps) => {
  // Initialize with default values matching ExtraFinancialRecords legacy structure
  const defaultValues: FormData = useMemo(
    () => ({
      referenceNumber: '',
      senderIdentifier: '',
      financerIdentifier: '',
      startDate: '',
      endDate: '',
      type: '',
      financialRecordProcessType: '',
      billingIdentifier: '',
      receiverIdentifier: '',
      senderUserIds: [],
      receiverUserIds: [],
    }),
    [],
  );

  // Transform data for select dropdowns
  const typeOptions = useMemo(
    () => financialRecordTypes.map((t) => ({ value: t.Value.toString(), label: t.Description })),
    [financialRecordTypes],
  );

  const processOptions = useMemo(
    () => processTypes.map((p) => ({ value: p.Value.toString(), label: p.Description })),
    [processTypes],
  );
  const customerManagerOptions = useMemo(
    () => customerManagerList.map((cm) => ({ value: cm.Id, label: cm.FullName })),
    [customerManagerList],
  );

  // Form schema following InvoiceReportFilters pattern exactly
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      // İskonto/Kredi Numarası
      type: fields
        .select(typeOptions, 'string', ['value', 'label'])
        .optional()
        .label('İşlem Tipi')
        .meta({ col: 3, showSelectOption: true })
        .nullable()
        .optional(),
      startDate: fields.date.optional().label('Başlangıç Tarihi').meta({ col: 3 }).nullable().optional(),
      endDate: fields.date.optional().label('Bitiş Tarihi').meta({ col: 3 }).nullable().optional(),
      billingIdentifier: fields.text.optional().label('Fatura Kesilen VKN').meta({ col: 3 }).nullable().optional(),
      financialRecordProcessType: fields
        .select(processOptions, 'string', ['value', 'label'])
        .optional()
        .label('İlgili Süreç')
        .meta({ col: 3, showSelectOption: true })
        .nullable()
        .optional(),
      referenceNumber: fields.text.optional().label('İskonto No').meta({ col: 3 }).nullable().optional(),

      // İşlem Tipi

      // İşlem Tarih Aralığı

      // Fatura Kesilen VKN

      // Finansör Ünvan
      financerIdentifier: fields
        .select(bankList, 'string', ['Identifier', 'CompanyName'])
        .optional()
        .label('Finansör Ünvan')
        .meta({ col: 3, showSelectOption: true })
        .nullable()
        .optional(),

      // Tedarikçi Ünvan / VKN
      senderIdentifier: fields
        .asyncAutoComplete(
          sellersCompanySearchResults,
          'object',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchSellersByCompanyNameOrIdentifier,
          isSellersSearchLoading,
          3,
        )
        .nullable()
        .optional()
        .label('Tedarikçi Ünvan / VKN')
        .meta({ col: 3, placeholder: 'Ara' }),

      // Alıcı Ünvan
      receiverIdentifier: fields
        .asyncAutoComplete(
          buyersCompanySearchResults,
          'object',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchBuyersByCompanyNameOrIdentifier,
          isBuyersSearchLoading,
          3,
        )
        .nullable()
        .optional()
        .label('Alıcı Ünvan')
        .meta({ col: 3, placeholder: 'Ara' }),

      // Tedarikçi Müşteri Temsilcisi
      senderUserIds: fields
        .multipleSelect(customerManagerOptions, 'number', ['value', 'label'])
        .nullable()
        .optional()
        .label('Tedarikçi Müşteri Temsilcisi')
        .meta({ col: 3 }),

      // Alıcı Müşteri Temsilcisi
      receiverUserIds: fields
        .multipleSelect(customerManagerOptions, 'number', ['value', 'label'])
        .nullable()
        .optional()
        .label('Alıcı Müşteri Temsilcisi')
        .meta({ col: 3 }),
    };

    return yup.object(baseFields);
  }, [
    typeOptions,
    processOptions,
    bankList,
    customerManagerOptions,
    buyersCompanySearchResults,
    sellersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
  ]);

  const form = useForm<FormData>({
    defaultValues: defaultValues,
    // @ts-expect-error - Schema types don't match AsyncAutoComplete runtime behavior (objects vs strings)
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Helper to extract Identifier from object or return string value
  const getIdentifier = (value: AnyObject | string | undefined): string => {
    if (!value) return '';
    if (typeof value === 'object' && value !== null && 'Identifier' in value) {
      return String(value.Identifier);
    }
    if (typeof value === 'string') {
      return value;
    }
    return '';
  };

  // Transform form data to API filter format
  const transformToApiFilters = (formData: FormData): Partial<FinancialRecordFilters> => {
    const senderUserIds = formData.senderUserIds || [];
    const receiverUserIds = formData.receiverUserIds || [];

    return {
      ReferenceNumber: formData.referenceNumber || undefined,
      SenderIdentifier: getIdentifier(formData.senderIdentifier) || undefined,
      FinancerIdentifier: formData.financerIdentifier ? String(formData.financerIdentifier) : undefined,
      StartDate: formData.startDate || undefined,
      EndDate: formData.endDate || undefined,
      Type: formData.type || undefined,
      FinancialRecordProcessType: formData.financialRecordProcessType || undefined,
      BillingIdentifier: formData.billingIdentifier || undefined,
      ReceiverIdentifier: getIdentifier(formData.receiverIdentifier) || undefined,
      SenderUserIds: senderUserIds.length > 0 ? senderUserIds : undefined,
      ReceiverUserIds: receiverUserIds.length > 0 ? receiverUserIds : undefined,
    };
  };

  // Use the generic useFilterFormWithUrlSync hook for URL sync with async data loaders
  const { handleApply, handleReset: resetForm } = useFilterFormWithUrlSync<FormData, Partial<FinancialRecordFilters>>({
    form,
    onFilterChange,
    transformToApiFilters,
    asyncFields: {
      senderIdentifier: {
        searchFn: searchSellersByCompanyNameOrIdentifier,
        results: sellersCompanySearchResults,
        matchField: 'Identifier',
      },
      receiverIdentifier: {
        searchFn: searchBuyersByCompanyNameOrIdentifier,
        results: buyersCompanySearchResults,
        matchField: 'Identifier',
      },
    },
    // Map URL param names (PascalCase from API) to form field names (camelCase)
    urlToFormFieldMap: {
      ReferenceNumber: 'referenceNumber',
      SenderIdentifier: 'senderIdentifier',
      FinancerIdentifier: 'financerIdentifier',
      StartDate: 'startDate',
      EndDate: 'endDate',
      Type: 'type',
      FinancialRecordProcessType: 'financialRecordProcessType',
      BillingIdentifier: 'billingIdentifier',
      ReceiverIdentifier: 'receiverIdentifier',
      SenderUserIds: 'senderUserIds',
      ReceiverUserIds: 'receiverUserIds',
    },
  });

  // Handle reset - clears form, URL params, and filters
  const handleReset = () => {
    resetForm(defaultValues);
  };

  return {
    // Cast form to be compatible with Form component
    form: form as unknown as UseFormReturn,
    schema,
    handleSearch: handleApply,
    handleReset,
  };
};

export default useFinancialRecordsFilterForm;
