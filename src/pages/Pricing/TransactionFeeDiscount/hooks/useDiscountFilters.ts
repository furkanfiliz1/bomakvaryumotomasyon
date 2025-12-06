import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFilterFormWithUrlSync } from '@hooks';
import yup from '@validation';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import {
  CompanyDiscountFilters,
  CompanySearchResult,
  TransactionFeeDiscountStatus,
} from '../transaction-fee-discount.types';

export interface DiscountFiltersFormData extends Record<string, unknown> {
  senderCompanyIdentifier?: AnyObject | string;
  receiverCompanyIdentifier?: AnyObject | string;
  isActive: string;
}

interface UseDiscountFiltersProps {
  onFilterChange: (filters: CompanyDiscountFilters) => void;
  // Async search props
  buyersCompanySearchResults: CompanySearchResult[];
  sellersCompanySearchResults: CompanySearchResult[];
  searchBuyersByCompanyNameOrIdentifier: (query: string) => Promise<void>;
  searchSellersByCompanyNameOrIdentifier: (query: string) => Promise<void>;
  isBuyersSearchLoading: boolean;
  isSellersSearchLoading: boolean;
}

// Status options for dropdown - following OperationPricing pattern exactly
const STATUS_OPTIONS = [
  { Value: TransactionFeeDiscountStatus.All, Description: 'Hepsi' },
  { Value: TransactionFeeDiscountStatus.Active, Description: 'Aktif' },
  { Value: TransactionFeeDiscountStatus.Inactive, Description: 'Pasif' },
];

// Default form values
const DEFAULT_VALUES: DiscountFiltersFormData = {
  senderCompanyIdentifier: '',
  receiverCompanyIdentifier: '',
  isActive: String(TransactionFeeDiscountStatus.All),
};

/**
 * Hook for managing discount filter form state with URL synchronization
 * Uses useFilterFormWithUrlSync for URL parameter persistence
 * Follows the exact pattern from useOperationChargeFilters
 */
export const useDiscountFilters = ({
  onFilterChange,
  buyersCompanySearchResults,
  sellersCompanySearchResults,
  searchBuyersByCompanyNameOrIdentifier,
  searchSellersByCompanyNameOrIdentifier,
  isBuyersSearchLoading,
  isSellersSearchLoading,
}: UseDiscountFiltersProps) => {
  const schema = yup.object({
    senderCompanyIdentifier: fields
      .asyncAutoComplete(
        sellersCompanySearchResults,
        'string',
        ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
        searchSellersByCompanyNameOrIdentifier,
        isSellersSearchLoading,
        3,
      )
      .label('Satıcı Ünvan / VKN')
      .meta({ col: 4, placeholder: 'Ara' })
      .optional(),
    receiverCompanyIdentifier: fields
      .asyncAutoComplete(
        buyersCompanySearchResults,
        'string',
        ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
        searchBuyersByCompanyNameOrIdentifier,
        isBuyersSearchLoading,
        3,
      )
      .label('Alıcı Ünvan / VKN')
      .meta({ col: 4, placeholder: 'Ara' })
      .optional(),
    isActive: fields.select(STATUS_OPTIONS, 'string', ['Value', 'Description']).label('Durumu').meta({ col: 4 }),
  });

  const form = useForm<DiscountFiltersFormData>({
    defaultValues: DEFAULT_VALUES,
    // @ts-expect-error - Schema types don't match AsyncAutoComplete runtime behavior (objects vs strings)
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Transform form values to API filter format
  const transformToApiFilters = (formData: DiscountFiltersFormData): CompanyDiscountFilters => {
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

    // Handle status following OperationPricing pattern - if "All" is selected, send undefined
    const statusValue = Number(formData.isActive);
    const isActiveFilter =
      statusValue === TransactionFeeDiscountStatus.All
        ? undefined
        : statusValue === TransactionFeeDiscountStatus.Active;

    return {
      senderCompanyIdentifier: getIdentifier(formData.senderCompanyIdentifier),
      receiverCompanyIdentifier: getIdentifier(formData.receiverCompanyIdentifier),
      isActive: isActiveFilter,
    };
  };

  // Transform URL param value to form field value
  // Handles the case where URL has 'true'/'false' but form needs enum value
  const getIsActiveFromUrl = (): string | undefined => {
    const urlParams = new URLSearchParams(globalThis.location.search);
    const isActiveParam = urlParams.get('isActive');

    if (isActiveParam === null) {
      return undefined;
    }

    // Convert URL boolean to enum value for form dropdown
    if (isActiveParam === 'true') {
      return String(TransactionFeeDiscountStatus.Active);
    }
    if (isActiveParam === 'false') {
      return String(TransactionFeeDiscountStatus.Inactive);
    }

    return undefined;
  };

  // Use generic filter form URL sync hook
  const { handleApply, handleReset: resetForm } = useFilterFormWithUrlSync<
    DiscountFiltersFormData,
    CompanyDiscountFilters
  >({
    form,
    onFilterChange,
    transformToApiFilters,
    asyncFields: {
      senderCompanyIdentifier: {
        searchFn: searchSellersByCompanyNameOrIdentifier,
        results: sellersCompanySearchResults,
        matchField: 'Identifier',
      },
      receiverCompanyIdentifier: {
        searchFn: searchBuyersByCompanyNameOrIdentifier,
        results: buyersCompanySearchResults,
        matchField: 'Identifier',
      },
    },
    // Map isActive URL param to a dummy field so it won't overwrite customInitialValues
    urlToFormFieldMap: {
      isActive: '_isActiveUrlParam',
    },
    customInitialValues: {
      isActive: getIsActiveFromUrl(),
    },
  });

  // Wrap reset to include default values
  const handleReset = () => {
    resetForm(DEFAULT_VALUES);
  };

  return {
    form,
    schema,
    handleSearch: handleApply,
    handleReset,
    transformToApiFilters,
  };
};
