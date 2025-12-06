import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFilterFormWithUrlSync } from '@hooks';
import yup from '@validation';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import { OperationChargeFilters } from '../operation-charge.types';
import { useDropdownData } from './useDropdownData';

export interface OperationChargeFiltersFormData extends Record<string, unknown> {
  ReceiverIdentifier?: AnyObject | string;
  SenderIdentifier?: AnyObject | string;
  FinancerIdentifier?: AnyObject | string;
  operationChargeDefinitionType?: string;
  ProductType?: string;
  IsDaily?: string;
}

interface UseOperationChargeFiltersProps {
  onFilterChange?: (filters: OperationChargeFilters) => void;
}

/**
 * Hook for managing operation charge filter form state and URL parameters
 * Uses generic useFilterFormWithUrlSync hook for URL synchronization
 */
export const useOperationChargeFilters = ({ onFilterChange }: UseOperationChargeFiltersProps = {}) => {
  const {
    integratorStatusOptions,
    productTypeOptions,
    isDailyOptions,
    buyersList,
    sendersCompanySearchResults,
    searchSendersByCompanyNameOrIdentifier,
    isSendersSearchLoading,
    financersCompanySearchResults,
    searchFinancersByCompanyNameOrIdentifier,
    isFinancersSearchLoading,
  } = useDropdownData();

  // Create form schema matching legacy filter fields with correct field names
  const getSchema = () => {
    return yup.object({
      ReceiverIdentifier: fields
        .autoComplete(buyersList, 'string', ['Identifier', 'CompanyName'])
        .label('Alıcı Ünvan / VKN')
        .meta({ col: 3, placeholder: 'Ara' })
        .optional() as yup.StringSchema,
      SenderIdentifier: fields
        .asyncAutoComplete(
          sendersCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchSendersByCompanyNameOrIdentifier,
          isSendersSearchLoading,
          3,
        )
        .label('Satıcı Ünvan / VKN')
        .meta({ col: 3, placeholder: 'Ara' })
        .optional() as yup.StringSchema,
      FinancerIdentifier: fields
        .asyncAutoComplete(
          financersCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchFinancersByCompanyNameOrIdentifier,
          isFinancersSearchLoading,
          3,
        )
        .label('Finansör Ünvan / VKN')
        .meta({ col: 3, placeholder: 'Ara' })
        .optional() as yup.StringSchema,
      operationChargeDefinitionType: fields
        .select(integratorStatusOptions, 'string', ['value', 'label'])
        .label('Entegratör Durumu')
        .meta({ col: 3, showSelectOption: true })
        .nullable() as yup.StringSchema,
      ProductType: fields
        .select([{ Value: '*', Description: 'Tümü' }, ...productTypeOptions], 'string', ['Value', 'Description'])
        .label('Ürün')
        .meta({ col: 3, showSelectOption: true, showSelectOptionText: 'Tümü' })
        .optional() as yup.StringSchema,
      IsDaily: fields
        .select(isDailyOptions, 'string', ['value', 'label'])
        .label('Günlük mü?')
        .meta({ col: 3, showSelectOption: true })
        .nullable() as yup.StringSchema,
    });
  };

  const schema = getSchema();

  // Initialize form with default values
  const form = useForm<OperationChargeFiltersFormData>({
    defaultValues: {
      ReceiverIdentifier: undefined,
      SenderIdentifier: undefined,
      FinancerIdentifier: undefined,
      operationChargeDefinitionType: '',
      ProductType: '*',
      IsDaily: '',
    },
    // @ts-expect-error - Schema types don't match AsyncAutoComplete runtime behavior (objects vs strings)
    resolver: yupResolver(schema),
  });

  // Transform form values to API filter format
  const transformToApiFilters = (formData: OperationChargeFiltersFormData): OperationChargeFilters => {
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

    return {
      ReceiverIdentifier: getIdentifier(formData.ReceiverIdentifier),
      SenderIdentifier: getIdentifier(formData.SenderIdentifier),
      FinancerIdentifier: getIdentifier(formData.FinancerIdentifier),
      operationChargeDefinitionType: String(formData.operationChargeDefinitionType ?? ''),
      ProductType: formData.ProductType === '*' ? '' : String(formData.ProductType ?? ''),
      IsDaily: formData.IsDaily ? String(formData.IsDaily) : undefined,
    };
  };

  // Use generic filter form URL sync hook
  const { handleApply, handleReset: resetForm } = useFilterFormWithUrlSync<
    OperationChargeFiltersFormData,
    OperationChargeFilters
  >({
    form,
    onFilterChange: onFilterChange || (() => {}),
    transformToApiFilters,
    asyncFields: {
      SenderIdentifier: {
        searchFn: searchSendersByCompanyNameOrIdentifier,
        results: sendersCompanySearchResults,
        matchField: 'Identifier',
      },
      FinancerIdentifier: {
        searchFn: searchFinancersByCompanyNameOrIdentifier,
        results: financersCompanySearchResults,
        matchField: 'Identifier',
      },
    },
  });

  // Wrap reset to include default values
  const handleReset = () => {
    resetForm({
      ReceiverIdentifier: undefined,
      SenderIdentifier: undefined,
      FinancerIdentifier: undefined,
      operationChargeDefinitionType: '',
      ProductType: '*',
      IsDaily: '',
    });
  };

  return {
    form,
    schema,
    handleSearch: handleApply,
    handleReset,
    transformToApiFilters,
  };
};
