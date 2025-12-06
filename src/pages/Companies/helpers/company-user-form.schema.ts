import { fields } from '@components';
import { RESPONSE_DATE } from '@constant';
import yup from '@validation';
import dayjs from 'dayjs';
import type { UserFormData } from '../companies.types';

/**
 * Company User Form Schema using built-in Form component patterns
 * Following OperationPricing schema structure and project form standards
 */
export const createCompanyUserFormSchema = (
  userPositions: Array<{ Id: number; Name: string }> = [],
  languages: Array<{ Id: number; Name: string; Code: string }> = [],
  isEdit = false,
) => {
  // Format user positions for dropdown
  const userPositionOptions = userPositions.map((position) => ({
    value: String(position.Id),
    label: position.Name,
  }));

  // Format languages for dropdown
  const languageOptions = languages.map((language) => ({
    value: String(language.Id),
    label: language.Name,
  }));

  // User type options
  const userTypeOptions = [
    { value: '2', label: 'Normal' },
    { value: '1', label: 'OP Admin' },
    { value: '3', label: 'Entegrasyon' },
  ];

  return yup.object({
    FirstName: fields.text.required('Ad alanı zorunludur').label('Ad').meta({ col: 6 }),

    LastName: fields.text.required('Soyad alanı zorunludur').label('Soyad').meta({ col: 6 }),

    Identifier: fields.text
      .required('TC Kimlik No zorunludur')
      .length(11, 'TC Kimlik No 11 haneli olmalıdır')
      .label('TC Kimlik No')
      .meta({ col: 6 }),

    BirthDate: fields.date
      .transform((value) => {
        if (!value) return '';
        return dayjs(value).isValid() ? dayjs(value).format(RESPONSE_DATE) : value;
      })
      .required('Doğum Tarihi zorunludur')
      .label('Doğum Tarihi')
      .meta({
        col: 6,
      }),

    Email: fields.text
      .required('E-posta alanı zorunludur')
      .email('Geçerli bir e-posta adresi giriniz')
      .label('E-posta')
      .meta({ col: 6 }),

    Phone: fields.text.label('Telefon Numarası').meta({
      col: 6,
      placeholder: '5XX XXX XX XX',
    }),

    UserName: fields.text.required('Kullanıcı Adı zorunludur').label('Kullanıcı Adı').meta({ col: 6 }),

    UserPositionId: fields
      .select(userPositionOptions, 'string', ['value', 'label'])
      .label('Pozisyon')
      .meta({ col: 6, showSelectOption: true, showSelectOptionText: 'Pozisyon Seçiniz' }),

    Type: fields
      .select(userTypeOptions, 'string', ['value', 'label'])
      .required('Kullanıcı Tipi seçimi zorunludur')
      .label('Kullanıcı Tipi')
      .meta({ col: 6 }),

    LanguageId: fields.select(languageOptions, 'string', ['value', 'label']).label('Dil Seçimi').meta({ col: 6 }),

    ...(isEdit && {
      IsLocked: fields.switchNumber.label('Kilitli mi?').meta({ col: 6 }),

      PasswordStatusType: fields.switchNumber.label('24 Saat Kilidi').meta({ col: 6 }),
    }),
  }) as yup.ObjectSchema<UserFormData>;
};

export type CompanyUserFormSchema = ReturnType<typeof createCompanyUserFormSchema>;
