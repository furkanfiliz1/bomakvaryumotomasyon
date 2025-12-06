import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { fields } from '@components';
import yup from '@validation';
import {
  TransactionFeeDiscountFormData,
  CreateCompanyDiscountRequest,
  UpdateCompanyDiscountRequest,
  CompanySearchResult,
} from '../transaction-fee-discount.types';
import { AnyObject } from 'yup';

interface UseTransactionFeeDiscountFormProps {
  initialValues?: TransactionFeeDiscountFormData;
  discountTypes?: { label: string; value: number }[];
  isEditing?: boolean;
  // Async search props for company selection
  buyersCompanySearchResults?: CompanySearchResult[];
  sellersCompanySearchResults?: CompanySearchResult[];
  searchBuyersByCompanyNameOrIdentifier?: (query: string) => Promise<void>;
  searchSellersByCompanyNameOrIdentifier?: (query: string) => Promise<void>;
  isBuyersSearchLoading?: boolean;
  isSellersSearchLoading?: boolean;
}

/**
 * Hook for managing transaction fee discount form state and validation
 * Matches legacy DiscountPricingAdd.js form exactly
 */
export const useTransactionFeeDiscountForm = ({
  initialValues,
  discountTypes = [],
  isEditing = false,
  buyersCompanySearchResults = [],
  sellersCompanySearchResults = [],
  searchBuyersByCompanyNameOrIdentifier,
  searchSellersByCompanyNameOrIdentifier,
  isBuyersSearchLoading = false,
  isSellersSearchLoading = false,
}: UseTransactionFeeDiscountFormProps = {}) => {
  const defaultValues: TransactionFeeDiscountFormData = {
    Type: null,
    ReceiverCompanyIdentifier: null,
    SenderCompanyIdentifier: null,
    Percent: null,
    Amount: null,
    StartDate: new Date().toISOString(),
    ExpireDateTime: null,
    ...initialValues,
  };

  // Create initial company objects for async autocomplete if initialValues exist
  const createInitialCompanyOption = (identifier: string): CompanySearchResult => ({
    Id: 0, // Placeholder ID
    CompanyName: '', // Empty name to avoid duplication in display
    Identifier: identifier,
    label: identifier,
    value: identifier,
  });

  // Enhance options arrays with initial values if they exist and are not already present
  const enhancedBuyersCompanySearchResults = (() => {
    const results = [...buyersCompanySearchResults];
    if (initialValues?.ReceiverCompanyIdentifier) {
      const exists = results.some((company) => company.Identifier === initialValues.ReceiverCompanyIdentifier);
      if (!exists) {
        results.unshift(createInitialCompanyOption(initialValues.ReceiverCompanyIdentifier));
      }
    }
    return results;
  })();

  const enhancedSellersCompanySearchResults = (() => {
    const results = [...sellersCompanySearchResults];
    if (initialValues?.SenderCompanyIdentifier) {
      const exists = results.some((company) => company.Identifier === initialValues.SenderCompanyIdentifier);
      if (!exists) {
        results.unshift(createInitialCompanyOption(initialValues.SenderCompanyIdentifier));
      }
    }
    return results;
  })();

  // Validation schema matching legacy validation exactly
  const schema = yup.object({
    Type: fields
      .select(discountTypes, 'number', ['value', 'label'])
      .label('Ürün')
      .meta({ col: 6 })
      .nullable()
      .required('Ürün seçiniz'),

    ReceiverCompanyIdentifier: fields
      .asyncAutoComplete(
        enhancedBuyersCompanySearchResults,
        'string',
        [
          'Identifier',
          (option: AnyObject) =>
            option.CompanyName ? `${option.Identifier} - ${option.CompanyName}` : option.Identifier,
        ],
        searchBuyersByCompanyNameOrIdentifier,
        isBuyersSearchLoading,
        3,
      )
      .meta({ label: 'Alıcı Ünvan / VKN', col: 6 })
      .nullable(),

    SenderCompanyIdentifier: fields
      .asyncAutoComplete(
        enhancedSellersCompanySearchResults,
        'string',
        [
          'Identifier',
          (option: AnyObject) =>
            option.CompanyName ? `${option.Identifier} - ${option.CompanyName}` : option.Identifier,
        ],
        searchSellersByCompanyNameOrIdentifier,
        isSellersSearchLoading,
        3,
      )
      .meta({ label: 'Satıcı Ünvan / VKN', col: 6 })
      .nullable(),

    Percent: fields.number
      .label('İndirim(%)')
      .meta({
        col: 6,
        allowNegative: false,
        min: 0,
        max: 100,
      })
      .nullable(),

    Amount: fields.currency
      .label('İndirim(TL)')
      .meta({
        col: 6,
        thousandSeparator: '.',
        decimalSeparator: ',',
        allowNegative: false,
      })
      .nullable(),

    StartDate: fields.date
      .label('Geçerlilik Başlangıç Tarihi')
      .meta({
        col: 6,
        disabled: isEditing,
      })
      .required('Başlangıç tarihi seçiniz'),

    ExpireDateTime: fields.date
      .label('Geçerlilik Bitiş Tarihi')
      .meta({
        col: 6,
        disabled: isEditing,
      })
      .nullable(),
  }) as yup.ObjectSchema<TransactionFeeDiscountFormData>;

  const form = useForm<TransactionFeeDiscountFormData>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  // Transform form data to API format for create - matches legacy setEmptyToNull + moment formatting
  const transformToCreateRequest = (formData: TransactionFeeDiscountFormData): CreateCompanyDiscountRequest => ({
    Type: formData.Type!,
    ReceiverCompanyIdentifier: formData.ReceiverCompanyIdentifier ?? null,
    SenderCompanyIdentifier: formData.SenderCompanyIdentifier ?? null,
    Percent: formData.Percent ?? null,
    Amount: formData.Amount ?? null,
    StartDate: formData.StartDate,
    ExpireDateTime: formData.ExpireDateTime ?? null,
  });

  // Transform form data to API format for update
  const transformToUpdateRequest = (
    formData: TransactionFeeDiscountFormData,
    id: number,
  ): UpdateCompanyDiscountRequest => ({
    Id: id,
    Type: formData.Type!,
    ReceiverCompanyIdentifier: formData.ReceiverCompanyIdentifier ?? null,
    SenderCompanyIdentifier: formData.SenderCompanyIdentifier ?? null,
    Percent: formData.Percent ?? null,
    Amount: formData.Amount ?? null,
    StartDate: formData.StartDate,
    ExpireDateTime: formData.ExpireDateTime ?? null,
  });

  return {
    form,
    schema,
    transformToCreateRequest,
    transformToUpdateRequest,
  };
};
