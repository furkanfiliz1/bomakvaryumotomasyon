import { SchemaField } from 'src/components/common/Form/enums';
import { fields } from 'src/components/common/Form/schemas/_common';
import * as yup from 'yup';
import { CompanyFilters, CompanyType } from '../companies.types';

// Type for dropdown options
interface DropdownOptions {
  companyTypes?: Array<{ value: number; label: string }>;
  companyStatusOptions?: Array<{ value: string; text: string }>;
  activityTypes?: Array<{ value: string; label: string }>;
  onboardingStatus?: Array<{ value: string; label: string }>;
  signedContractOptions?: Array<{ value: string; label: string }>;
  leadingChannels?: Array<{ value: string; label: string }>;
  customerManagers?: Array<{ value: number; label: string }>;
  cities?: Array<{ value: number; label: string }>;
}

// Function to create schema with actual options and optional section parameter
export const createCompaniesFilterSchema = (dropdownOptions: DropdownOptions, section?: string) => {
  if (section) {
    return getFormSchemaBySection(section, dropdownOptions);
  }

  // Default: return all fields
  return yup.object({
    // Basic filters
    companyIdentifier: fields.text.default('').nullable().optional().label('VKN/TCKN').meta({
      col: 2,
      field: SchemaField.InputText,
    }),
    companyName: fields.text.default('').nullable().optional().label('Ünvan').meta({
      col: 3,
      field: SchemaField.InputText,
    }),
    type: fields
      .select(dropdownOptions.companyTypes || [], 'number', ['value', 'label'])
      .nullable()
      .optional()
      .label('Şirket Tipi')
      .meta({
        col: 3,
      }),
    status: fields
      .select(dropdownOptions.companyStatusOptions || [], 'string', ['value', 'text'])
      .nullable()
      .optional()
      .label('Durum')
      .meta({
        col: 2,
      }),
    activityType: fields
      .select(dropdownOptions.activityTypes || [], 'string', ['value', 'label'], undefined, undefined, true)
      .nullable()
      .optional()
      .label('Şirket Tipi(Alıcı / Satıcı)')
      .meta({
        col: 2,
        showSelectOption: true,
      }),

    // Advanced filters (collapsible)
    startDate: fields.date.nullable().optional().default(null).label('Başlangıç Tarihi').meta({
      col: 2,
      field: SchemaField.InputDate,
    }),
    endDate: fields.date.nullable().optional().default(null).label('Bitiş Tarihi').meta({
      col: 2,
      field: SchemaField.InputDate,
    }),
    onboardingStatusTypes: fields
      .select(dropdownOptions.onboardingStatus || [], 'string', ['value', 'label'])
      .nullable()
      .optional()
      .label('Statü')
      .meta({
        col: 2,
        showSelectOption: true,
      }),
    signedContract: fields
      .select(dropdownOptions.signedContractOptions || [], 'string', ['value', 'label'])
      .nullable()
      .optional()
      .label('Sözleşme Onayı')
      .meta({
        col: 2,
      }),
    LeadingChannelId: fields
      .select(dropdownOptions.leadingChannels || [], 'string', ['value', 'label'])
      .label('Geliş Kanalı')
      .optional()
      .nullable()
      .meta({
        showSelectOption: true,
        col: 2,
      }),
    UserMail: fields.text.default('').nullable().optional().label('Kullanıcı E-posta').meta({
      col: 2,
      field: SchemaField.InputText,
    }),
    UserPhone: fields.phone.default('').nullable().optional().label('Kullanıcı Telefon').meta({
      col: 2,
      field: SchemaField.InputPhoneNumber,
    }),
    UserName: fields.text.default('').nullable().optional().label('Kullanıcı Adı').meta({
      col: 2,
      field: SchemaField.InputText,
    }),
    NameSurname: fields.text.default('').nullable().optional().label('Ad Soyad').meta({
      col: 2,
      field: SchemaField.InputText,
    }),
    userIds: fields
      .multipleSelect(dropdownOptions?.customerManagers || [], 'number', ['value', 'label'])
      .nullable()
      .optional()
      .label('Müşteri Temsilcisi')
      .meta({
        col: 3,
      }),
    CityId: fields
      .autoComplete(dropdownOptions.cities || [], 'number', ['value', 'label'])
      .nullable()
      .optional()
      .label('Şehir')
      .meta({
        col: 2,
        placeholder: 'Seçiniz',
      }),
  });
};

// Helper function to get form schema by section (similar to InvoiceAddManuel pattern)
const getFormSchemaBySection = (section: string, dropdownOptions: DropdownOptions) => {
  switch (section) {
    case 'basicInfoSide':
      return yup.object({
        companyIdentifier: fields.text.default('').nullable().optional().label('VKN/TCKN').meta({
          col: 2,
          field: SchemaField.InputText,
        }),
        companyName: fields.text.default('').nullable().optional().label('Ünvan').meta({
          col: 3,
          field: SchemaField.InputText,
        }),
        type: fields
          .select(dropdownOptions.companyTypes || [], 'number', ['value', 'label'])
          .nullable()
          .optional()
          .label('Şirket Tipi')
          .meta({
            col: 3,
          }),
        status: fields
          .select(dropdownOptions.companyStatusOptions || [], 'string', ['value', 'text'])
          .nullable()
          .optional()
          .label('Durum')
          .meta({
            col: 2,
            showSelectOption: true,
          }),
        activityType: fields
          .select(dropdownOptions.activityTypes || [], 'string', ['value', 'label'], undefined, undefined, true)
          .nullable()
          .optional()
          .label('Şirket Tipi(Alıcı / Satıcı)')
          .meta({
            col: 2,
            showSelectOption: true,
          }),
      });

    case 'advancedInfoSide':
      return yup.object({
        startDate: fields.date.nullable().optional().default(null).label('Başlangıç Tarihi').meta({
          col: 2,
          field: SchemaField.InputDate,
        }),
        endDate: fields.date.nullable().optional().default(null).label('Bitiş Tarihi').meta({
          col: 2,
          field: SchemaField.InputDate,
        }),
        onboardingStatusTypes: fields
          .select(dropdownOptions.onboardingStatus || [], 'string', ['value', 'label'])
          .nullable()
          .optional()
          .label('Statü')
          .meta({
            col: 2,
            showSelectOption: true,
          }),
        signedContract: fields
          .select(dropdownOptions.signedContractOptions || [], 'string', ['value', 'label'])
          .nullable()
          .optional()
          .label('Sözleşme Onayı')
          .meta({
            col: 2,
            showSelectOption: true,
          }),
        LeadingChannelId: fields
          .select(dropdownOptions.leadingChannels || [], 'string', ['value', 'label'])
          .nullable()
          .optional()
          .label('Geliş Kanalı')
          .meta({
            showSelectOption: true,
            col: 2,
          }),
        UserMail: fields.text.default('').nullable().optional().label('Kullanıcı E-posta').meta({
          col: 2,
          field: SchemaField.InputText,
        }),
        UserPhone: fields.phone.default('').nullable().optional().label('Kullanıcı Telefon').meta({
          col: 2,
          field: SchemaField.InputPhoneNumber,
        }),
        UserName: fields.text.default('').nullable().optional().label('Kullanıcı Adı').meta({
          col: 2,
          field: SchemaField.InputText,
        }),
        NameSurname: fields.text.default('').nullable().optional().label('Ad Soyad').meta({
          col: 2,
          field: SchemaField.InputText,
        }),
        userIds: fields
          .multipleSelect(dropdownOptions?.customerManagers || [], 'number', ['value', 'label'])
          .nullable()
          .optional()
          .label('Müşteri Temsilcisi')
          .meta({
            col: 3,
          }),
        CityId: fields
          .autoComplete(dropdownOptions.cities || [], 'number', ['value', 'label'])
          .nullable()
          .optional()
          .label('Şehir')
          .meta({
            col: 3,
            placeholder: 'Seçiniz',
          }),
      });

    default:
      // Return empty object for unknown sections
      return yup.object({});
  }
};

// Keep the static schema for backwards compatibility but it won't have options
export const companiesFilterSchema = createCompaniesFilterSchema({});

export interface CompaniesFilterFormData {
  companyIdentifier: string | null | undefined;
  companyName: string | null | undefined;
  type: number | string | null | undefined;
  status: number | string | null | undefined;
  activityType: string | number | null | undefined;
  startDate: Date | string | null | undefined;
  endDate: Date | string | null | undefined;
  onboardingStatusTypes: string | null | undefined;
  signedContract: string | null | undefined;
  LeadingChannelId: string | null | undefined;
  UserMail: string | null | undefined;
  UserPhone: string | null | undefined;
  UserName: string | null | undefined;
  NameSurname: string | null | undefined;
  userIds: number[] | null | undefined;
  CityId: number | string | null | undefined;
}

export const defaultFilterValues: CompaniesFilterFormData = {
  companyIdentifier: null,
  companyName: null,
  type: null, // No default selection
  status: null,
  activityType: null,
  startDate: null,
  endDate: null,
  onboardingStatusTypes: null,
  signedContract: null,
  LeadingChannelId: null,
  UserMail: null,
  UserPhone: null,
  UserName: null,
  NameSurname: null,
  userIds: null,
  CityId: null,
};

export const companyTypes: CompanyType[] = [
  {
    Description: 'Ticari', // lang.companyList.commercial
    Value: '1',
  },
  {
    Description: 'Finans', // lang.companyList.finance
    Value: '2',
  },
  {
    Description: 'Grup', // lang.companyList.group
    Value: '5',
  },
];

export const companyStatusOptions = [
  { value: '1', text: 'Aktif' },
  { value: '0', text: 'Pasif' },
];

export const signedContractOptions = [
  { label: 'Onaylandı', value: '1' },
  { label: 'Yok', value: '0' },
];

// Transform form data to API parameters
export const transformFiltersForAPI = (data: CompaniesFilterFormData): CompanyFilters => {
  const toNumber = (value: string | number | null | undefined): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  };

  const toString = (value: string | number | null | undefined): string | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    return String(value);
  };

  return {
    // Basic filters
    type: toNumber(data.type),
    status: toNumber(data.status),
    companyIdentifier: toString(data.companyIdentifier),
    companyName: toString(data.companyName),
    activityType: toString(data.activityType),

    // Advanced filters
    startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : undefined,
    endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : undefined,
    onboardingStatusTypes: toString(data.onboardingStatusTypes),
    signedContract: toString(data.signedContract),
    LeadingChannelId: toString(data.LeadingChannelId),
    UserMail: toString(data.UserMail),
    UserPhone: data.UserPhone ? data.UserPhone.replace(/\s/g, '') : undefined,
    UserName: toString(data.UserName),
    NameSurname: toString(data.NameSurname),
    userIds: data.userIds?.length ? (data.userIds as number[]) : undefined,
    CityId: toNumber(data.CityId),
    CityLabel: '', // Will be set separately
  };
};
