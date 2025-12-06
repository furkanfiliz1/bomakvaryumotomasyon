import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFilterFormWithUrlSync } from '@hooks';
import yup from '@validation';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import { ManualTransactionFeeFilters } from '../manual-transaction-fee-tracking.types';
import { useDropdownData } from './useDropdownData';

interface UseManualTransactionFeeFilterFormProps {
  onFilterChange: (filters: Partial<ManualTransactionFeeFilters>) => void;
}

// Extended form data to handle async autocomplete objects
interface ExtendedFilterFormData extends Record<string, unknown> {
  allowanceId: string;
  notifyBuyer: string;
  allowanceKind: string;
  status: string;
  startDate: string;
  endDate: string;
  receiverIdentifier?: AnyObject | string;
  senderIdentifier?: AnyObject | string;
}

// Default form values
const DEFAULT_VALUES: ExtendedFilterFormData = {
  allowanceId: '',
  notifyBuyer: '',
  allowanceKind: '',
  status: '1',
  startDate: '',
  endDate: '',
  receiverIdentifier: undefined,
  senderIdentifier: undefined,
};

// Empty filters to explicitly clear all filter values
// This is needed because useServerSideQuery merges with previousFetchParams
const EMPTY_FILTERS: Partial<ManualTransactionFeeFilters> = {
  AllowanceId: undefined,
  NotifyBuyer: undefined,
  AllowanceKind: undefined,
  Status: 1,
  StartDate: undefined,
  EndDate: undefined,
  ReceiverIdentifier: undefined,
  SenderIdentifier: undefined,
};

export const useManualTransactionFeeFilterForm = ({ onFilterChange }: UseManualTransactionFeeFilterFormProps) => {
  const {
    isLoading: dropdownLoading,
    statusList,
    allowanceKindsList,
    buyersCompanySearchResults,
    sellersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
  } = useDropdownData();

  const statusOptions = [
    { Value: '', Text: 'Tümü' },
    ...statusList.map((item) => ({ Value: item.Value.toString(), Text: item.Text })),
  ];

  const notifyBuyerOptions = [
    { Value: '', Text: 'Tümü' },
    { Value: '1', Text: 'Bildirimli' },
    { Value: '0', Text: 'Bildirimsiz' },
  ];

  const allowanceKindOptions = [
    { Value: '', Text: 'Tümü' },
    ...allowanceKindsList.map((item) => ({ Value: item.Value.toString(), Text: item.Text })),
  ];

  // Form schema matching old project filter structure exactly
  const createSchema = () => {
    const baseFields: yup.AnyObject = {
      allowanceId: fields.text.label('İskonto Talep No').meta({ col: 2 }),
      notifyBuyer: fields
        .select(notifyBuyerOptions, 'string', ['Value', 'Text'])
        .label('İlgili Süreç')
        .meta({ col: 2, showSelectOption: true }),
      allowanceKind: fields
        .select(allowanceKindOptions, 'string', ['Value', 'Text'])
        .label('İskonto Tipi')
        .meta({ col: 2, showSelectOption: true }),
      status: fields
        .select(statusOptions, 'string', ['Value', 'Text'])
        .label('Statü')
        .meta({ col: 2, showSelectOption: true }),
      startDate: fields.date.label('Başlangıç Tarihi').meta({ col: 2 }),
      endDate: fields.date.label('Bitiş Tarihi').meta({ col: 2 }),
      receiverIdentifier: fields
        .asyncAutoComplete(
          buyersCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchBuyersByCompanyNameOrIdentifier,
          isBuyersSearchLoading,
          3,
        )
        .label('Alıcı Ünvan / VKN')
        .meta({ col: 2, placeholder: 'Ara' }),
      senderIdentifier: fields
        .asyncAutoComplete(
          sellersCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchSellersByCompanyNameOrIdentifier,
          isSellersSearchLoading,
          3,
        )
        .label('Satıcı Ünvan / VKN')
        .meta({ col: 2, placeholder: 'Ara' }),
    };

    return yup.object(baseFields);
  };

  const schema = createSchema();

  const form = useForm<ExtendedFilterFormData>({
    defaultValues: DEFAULT_VALUES,
    // @ts-expect-error - Schema types don't match AsyncAutoComplete runtime behavior (objects vs strings)
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Transform form values to API filter format
  const transformToApiFilters = (formData: ExtendedFilterFormData): Partial<ManualTransactionFeeFilters> => {
    // Helper to extract Identifier from object or return string value
    const getIdentifier = (value: AnyObject | string | undefined): string | undefined => {
      if (!value) return undefined;
      if (typeof value === 'object' && value !== null && 'Identifier' in value) {
        return String(value.Identifier);
      }
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
      return undefined;
    };

    const filters: Partial<ManualTransactionFeeFilters> = {};

    if (formData.allowanceId && String(formData.allowanceId).trim() !== '') {
      filters.AllowanceId = Number(formData.allowanceId);
    }
    if (formData.notifyBuyer !== undefined && formData.notifyBuyer !== null && formData.notifyBuyer !== '') {
      filters.NotifyBuyer = Number(formData.notifyBuyer);
    }
    if (formData.allowanceKind !== undefined && formData.allowanceKind !== null && formData.allowanceKind !== '') {
      filters.AllowanceKind = Number(formData.allowanceKind);
    }
    if (formData.status !== undefined && formData.status !== null && formData.status !== '') {
      filters.Status = Number(formData.status);
    }
    if (formData.startDate && String(formData.startDate).trim() !== '') {
      filters.StartDate = formData.startDate;
    }
    if (formData.endDate && String(formData.endDate).trim() !== '') {
      filters.EndDate = formData.endDate;
    }

    const receiverIdentifier = getIdentifier(formData.receiverIdentifier);
    if (receiverIdentifier) {
      filters.ReceiverIdentifier = receiverIdentifier;
    }

    const senderIdentifier = getIdentifier(formData.senderIdentifier);
    if (senderIdentifier) {
      filters.SenderIdentifier = senderIdentifier;
    }

    return filters;
  };

  // Use generic filter form URL sync hook
  const { handleApply, handleReset: resetForm } = useFilterFormWithUrlSync<
    ExtendedFilterFormData,
    Partial<ManualTransactionFeeFilters>
  >({
    form,
    onFilterChange,
    transformToApiFilters,
    asyncFields: {
      receiverIdentifier: {
        searchFn: searchBuyersByCompanyNameOrIdentifier,
        results: buyersCompanySearchResults,
        matchField: 'Identifier',
      },
      senderIdentifier: {
        searchFn: searchSellersByCompanyNameOrIdentifier,
        results: sellersCompanySearchResults,
        matchField: 'Identifier',
      },
    },
    urlToFormFieldMap: {
      ReceiverIdentifier: 'receiverIdentifier',
      SenderIdentifier: 'senderIdentifier',
      AllowanceId: 'allowanceId',
      NotifyBuyer: 'notifyBuyer',
      AllowanceKind: 'allowanceKind',
      Status: 'status',
      StartDate: 'startDate',
      EndDate: 'endDate',
    },
  });

  // Wrap reset to include default values and ensure clean filters
  const handleReset = () => {
    // Reset the form
    form.reset(DEFAULT_VALUES);
    // Use resetForm to clear URL params
    resetForm(DEFAULT_VALUES);
    // Send explicit undefined values to override previousFetchParams in useServerSideQuery
    onFilterChange(EMPTY_FILTERS);
  };

  return {
    form,
    schema,
    handleSearch: handleApply,
    handleReset,
    dropdownLoading,
    statusList,
  };
};

export default useManualTransactionFeeFilterForm;
