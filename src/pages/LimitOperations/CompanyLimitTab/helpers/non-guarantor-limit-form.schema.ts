/**
 * Non-Guarantor Limit Form Schema
 * Form validation schema for non-guarantor limit operations
 * Following OperationPricing pattern for schema organization
 * Matches legacy NonGuarantorLimitList.js form structure exactly
 */

import { fields } from '../../../../components';
import yup from '../../../../validation';
import type { EnumOption, FinancerCompany } from '../company-limit-tab.types';

export interface NonGuarantorLimitFormData {
  selectedProduct: string | number;
  selectedFinancer: string | number;
  totalLimit: number;
}

export const createNonGuarantorLimitFormSchema = (
  productTypes: EnumOption[] = [],
  financerCompanies: FinancerCompany[] = [],
) => {
  return yup.object({
    selectedProduct: fields
      .select(productTypes, 'string', ['Value', 'Description'])
      .required('Ürün seçimi zorunludur')
      .label('Ürün')
      .meta({ col: 2, placeholder: 'Seçiniz' }),

    selectedFinancer: fields
      .select(financerCompanies || [], 'number', ['Id', 'CompanyName'])
      .required('Finansör seçimi zorunludur')
      .label('Finansör')
      .meta({ col: 3, placeholder: 'Seçiniz' }),

    totalLimit: fields.currency
      .required('Toplam limit zorunludur')
      .min(1, "Toplam limit 0'dan büyük olmalıdır")
      .label('Verilen Toplam Limit')
      .meta({ col: 2, currency: 'TRY' }),
  });
};

export type NonGuarantorLimitFormSchema = ReturnType<typeof createNonGuarantorLimitFormSchema>;
