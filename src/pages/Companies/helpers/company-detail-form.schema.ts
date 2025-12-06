import { fields } from '@components';
import yup from '@validation';
import type { CompanyDetailFormData } from '../companies.types';

/**
 * Company Detail Form Schema using built-in Form component patterns
 * Following OperationPricing schema structure and project form standards
 */
export const createCompanyDetailFormSchema = (
  productTypes: Array<{ Value: string; Description: string }> = [],
  companyKinds: Array<{ Value: string; Description: string }> = [],
  companySizeTypes: Array<{ Value: string; Description: string }> = [],
  revenueTypes: Array<{ Value: string; Description: string }> = [],
  integrators: Array<{ value: number; label: string }> = [],
) => {
  return yup.object({
    ProductTypes: fields
      .multipleSelect(productTypes, 'number', ['Value', 'Description'])
      .label('Ürün')
      .nullable()
      .meta({
        col: 6,
        placeholder: 'Seçiniz',
      }),
    IntegratorId: fields
      .select(integrators, 'number', ['Id', 'Name'])
      .label('Entegratör')
      .nullable()
      .meta({ col: 6, maxWidth: '340px', placeholder: 'Seçiniz' }),

    // Company Size Type - Select dropdown from legacy form
    CompanySizeType: fields
      .select(companySizeTypes, 'number', ['Value', 'Description'])
      .label('Çalışan Sayısı')
      .nullable()
      .meta({ col: 6, showSelectOption: true, placeholder: 'Seçiniz' }),

    // Revenue Type - Select dropdown from legacy form
    RevenueType: fields
      .select(revenueTypes, 'number', ['Value', 'Description'])
      .label('Ciro')
      .nullable()
      .meta({ col: 6, showSelectOption: true }),

    // Foundation Year - Number input from API response
    FoundationYear: fields.number.label('Kuruluş Yılı').nullable().meta({ col: 6 }),

    // Additional fields from API response
    AffiliateStructure: fields.text.label('Ortaklık Yapısı').nullable().meta({ col: 6 }),

    Activity: fields.text.label('Faaliyet').nullable().meta({ col: 6 }),
    Bail: fields.text.label('Kefalet').nullable().meta({ col: 6 }),

    CompanyKind: fields
      .select(companyKinds, 'number', ['Value', 'Description'])
      .label('Şirket Türü')
      .nullable()
      .meta({ col: 6, showSelectOption: true }),
  }) as yup.ObjectSchema<CompanyDetailFormData>;
};
