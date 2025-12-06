import { fields } from '@components';
import yup from '@validation';
import type { LimitsToPassiveFormData } from '../other-operations.types';

/**
 * Limits to Passive Form Schema using built-in Form component
 * Matches legacy form validation rules exactly
 * Following OperationPricing patterns with proper Form component integration
 */
export const createLimitsToPassiveFormSchema = (
  productTypeOptions: Array<{ label: string; value: number }> = [],
  financerOptions: Array<{ label: string; value: number }> = [],
) => {
  return yup.object({
    companyIdentifier: fields.text.label('Şirket VKN/TCKN').meta({
      col: 12,
      placeholder: '10 veya 11 haneli VKN/TCKN giriniz...',
    }),

    FinancerCompanyId: fields
      .select(financerOptions, 'number', ['value', 'label'])
      .required('Finansör Unvan/VKN seçimi zorunludur')
      .label('Finansör Unvan/VKN')
      .meta({
        showSelectOption: true,
        col: 6,
      }),

    ProductType: fields
      .select(productTypeOptions, 'number', ['value', 'label'])
      .required('Ürün seçimi zorunludur')
      .label('Ürün')
      .meta({
        col: 6,
        showSelectOption: true,
      }),
  }) as yup.ObjectSchema<LimitsToPassiveFormData>;
};

/**
 * Default form values
 */
export const limitsToPassiveFormDefaults: LimitsToPassiveFormData = {
  companyIdentifier: '',
  FinancerCompanyId: null,
  ProductType: null,
};
