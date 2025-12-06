import yup from '@validation';
import { fields } from '@components';
import type { TtkLimitQueryFormValues } from '../ttk-limit-query.types';

/**
 * TTK Limit Query Form Schema with conditional validation logic matching the original
 */
export const createTtkLimitQuerySchema = (formValues?: Partial<TtkLimitQueryFormValues>) => {
  const searchType = formValues?.searchType || 'PERSON';
  const isExistCustomer = formValues?.IsExistCustomer || 'YES';
  const isFigoParaCustomer = isExistCustomer === 'YES';
  const isCompany = searchType === 'COMPANY';

  return yup.object({
    IsExistCustomer: fields
      .select(
        [
          { label: 'Evet', value: 'YES' },
          { label: 'Hayır', value: 'NO' },
        ],
        'string',
        ['value', 'label'],
      )
      .required('Bu alan zorunludur')
      .label('Figopara müşterisi mi?')
      .meta({
        col: 2,
      }),

    searchType: fields
      .select(
        [
          { label: 'Şahıs Şirketi', value: 'PERSON' },
          { label: 'Tüzel Şirket', value: 'COMPANY' },
        ],
        'string',
        ['value', 'label'],
      )
      .required('Bu alan zorunludur')
      .label('Şirket Tipi')
      .meta({
        col: 2,
      }),

    NationalIdentityNumber: fields.text
      .required('Bu alan zorunludur')
      .min(11, 'TCKN 11 haneli olmalıdır.')
      .max(11, 'TCKN 11 haneli olmalıdır.')
      .label('TCKN')
      .meta({
        col: 2,
        maxLength: 11,
      }),

    // VKN is required only when searchType is COMPANY and disabled when PERSON
    TaxNumber: isCompany
      ? fields.text
          .required('VKN zorunludur')
          .min(10, 'VKN 10 haneli olmalıdır.')
          .max(10, 'VKN 10 haneli olmalıdır.')
          .label('VKN')
          .meta({
            col: 2,
            maxLength: 10,
            disabled: false,
          })
      : fields.text.label('VKN').meta({
          col: 2,
          maxLength: 10,
          disabled: true,
        }),

    // Birth Date and Phone are required only when IsExistCustomer is NO (not Figopara customer)
    BirthDate: !isFigoParaCustomer
      ? fields.date.required('Doğum tarihi zorunludur').nullable().default(null).label('Doğum Tarihi').meta({
          col: 2,
          disabled: false,
        })
      : fields.date.nullable().default(null).label('Doğum Tarihi').meta({
          col: 2,
          disabled: true,
        }),

    PhoneNumber: !isFigoParaCustomer
      ? fields.phone.required('Telefon numarası zorunludur').label('Telefon').meta({
          col: 2,
          disabled: false,
        })
      : fields.phone.label('Telefon').meta({
          col: 2,
          disabled: true,
        }),
  }) as yup.ObjectSchema<TtkLimitQueryFormValues>;
};

/**
 * Default form values
 */
export const ttkLimitQueryFormDefaults: TtkLimitQueryFormValues = {
  NationalIdentityNumber: '',
  TaxNumber: '',
  BirthDate: '',
  PhoneNumber: '',
  searchType: 'PERSON',
  IsExistCustomer: 'YES',
};
