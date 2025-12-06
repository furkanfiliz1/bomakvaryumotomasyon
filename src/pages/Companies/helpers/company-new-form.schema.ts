import { fields } from '@components';
import yup from '@validation';
import type { CompanyCreateFormData } from '../companies.types';

/**
 * Company Creation Form Schema using built-in Form component patterns
 * Following OperationPricing schema structure and project form standards
 * Matches validation logic from legacy CompanyNew.js component
 */
export const createCompanyNewFormSchema = (
  companyTypes: Array<{ Value: string; Description: string }> = [],
  activityTypes: Array<{ Value: string; Description: string }> = [],
  cities: Array<{ Id: number; Name: string }> = [],
  districts: Array<{ Id: number; Name: string }> = [],
) => {
  const schema = yup.object({
    CompanyName: fields.text
      .required('Şirket Ünvanı zorunludur')
      .min(2, 'Şirket Ünvanı en az 2 karakter olmalıdır')
      .matches(
        /^[a-zA-ZığüşöçĞÜŞÖÇİ0-9][a-zA-ZığüşöçĞÜŞÖÇİ0-9' '.!?_/\\,()&$€*%^=#-]+$/,
        'Şirket Ünvanı geçerli karakterler içermelidir',
      )
      .label('Şirket Ünvanı')
      .meta({ col: 12 }),

    Type: fields
      .select(companyTypes, 'string', ['Value', 'Description'])
      .required('Şirket Tipi seçmelisiniz')
      .label('Şirket Tipi')
      .meta({ col: 6 }),

    Identifier: fields.text
      .required('VKN/TCKN zorunludur')
      .min(10, 'VKN/TCKN en az 10 karakter olmalıdır')
      .max(11, 'VKN/TCKN en fazla 11 karakter olmalıdır')
      .matches(/^\d+$/, 'VKN/TCKN sadece rakam içermelidir')
      .label('VKN/TCKN')
      .meta({ col: 6 }),

    TaxOffice: fields.text
      .required('Vergi dairesi zorunludur')
      .min(1, 'Vergi dairesi en az 1 karakter olmalıdır')
      .matches(
        /^[a-zA-ZığüşöçĞÜŞÖÇİ0-9][a-zA-ZığüşöçĞÜŞÖÇİ0-9' '.!?_/\\,()&$€*%^=#-]+$/,
        'Vergi dairesi geçerli karakterler içermelidir',
      )
      .label('Vergi Dairesi')
      .meta({ col: 6 }),

    Address: fields.text
      .required('Adres zorunludur')
      .min(1, 'Adres en az 1 karakter olmalıdır')
      .label('Adres')
      .meta({ col: 6 }),

    CityId: fields
      .select(cities, 'number', ['Id', 'Name'])
      .required('Şehir seçmelisiniz')
      .label('Şehir')
      .meta({ col: 6 }),

    DistrictId: fields
      .select(districts, 'number', ['Id', 'Name'])
      .required('İlçe seçmelisiniz')
      .label('İlçe')
      .meta({ col: 6 }),

    Phone: fields.phone.required('Telefon numarası zorunludur').label('Telefon Numarası').meta({ col: 6 }),

    MailAddress: fields.text
      .required('E-posta adresi zorunludur')
      .email('Geçerli bir e-posta adresi giriniz')
      .min(6, 'E-posta adresi en az 6 karakter olmalıdır')
      .label('E-posta Adresi')
      .meta({ col: 6 }),

    ActivityType: fields
      .select(activityTypes, 'number', ['Value', 'Description'])
      .required('Şirket Tipi (Satıcı/Alıcı) seçmelisiniz')
      .label('Şirket Tipi (Satıcı/Alıcı)')
      .meta({ col: 6 }),

    Status: fields.switchField.label('Şirket Durumu Aktif').meta({ col: 6, labelPlacement: 'top' }),
  });

  return schema;
};

// Initial values for the form (matching CompanyNew.js default values)
export const getCompanyNewInitialValues = (): CompanyCreateFormData => ({
  CompanyName: '',
  Type: '',
  Identifier: '',
  TaxOffice: '',
  Address: '',
  CityId: null,
  DistrictId: null,
  Phone: '',
  MailAddress: '',
  ActivityType: 2, // Default from legacy component
  Status: false, // Inactive by default
});
