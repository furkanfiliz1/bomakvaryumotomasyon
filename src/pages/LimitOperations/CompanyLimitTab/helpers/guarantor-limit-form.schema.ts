/**
 * Guarantor Limit Form Schema
 * Form validation schema for guarantor limit operations
 * Following OperationPricing pattern for schema organization
 */

import { fields } from '@components';
import yup from '@validation';
import type { FinancerCompany, GuarantorCompanyListItem } from '../company-limit-tab.types';

export interface GuarantorLimitFormData {
  selectedProduct: string | number;
  selectedFinancer: string | number;
  totalLimit: number;
}

export const createGuarantorLimitFormSchema = (
  roofLimitData: GuarantorCompanyListItem[],
  financerCompanies: FinancerCompany[] = [],
) => {
  return yup.object({
    selectedProduct: fields
      .select(roofLimitData, 'number', ['Id', 'ProductTypeName'])
      .required('Ürün seçimi zorunludur')
      .label('Ürün')
      .meta({ col: 3, placeholder: 'Seçiniz' }),

    selectedFinancer: fields
      .select(financerCompanies || [], 'number', ['Id', 'CompanyName'])
      .required('Finansör seçimi zorunludur')
      .label('Finansör')
      .meta({ col: 3, placeholder: 'Seçiniz' }),

    totalLimit: fields.currency
      .required('Toplam limit zorunludur')
      .min(1, "Toplam limit 0'dan büyük olmalıdır")
      .label('Verilen Toplam Limit')
      .meta({ col: 3, currency: 'TRY' }),
  });
};

export type GuarantorLimitFormSchema = ReturnType<typeof createGuarantorLimitFormSchema>;
