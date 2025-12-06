import { Divider } from '@mui/material';
import yup from '@validation';
import { SchemaField } from 'src/components/common/Form/enums';
import { fields } from 'src/components/common/Form/schemas/_common';

interface SchemaOptions {
  banksOptions?: Array<{ id: number; name: string }>;
  branchesOptions?: Array<{ id: number; name: string }>;
}

/**
 * Validation schema for single cheque form
 * Following forms.instructions.md patterns - single unified schema
 * Based on ChequesAddManuel component structure
 */
export const createSingleChequeSchema = (options: SchemaOptions = {}) => {
  const { banksOptions = [], branchesOptions = [] } = options;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return yup.object().shape({
    // Keşideci Bilgileri
    drawerName: fields.text.nullable().label('Keşideci Adı').meta({
      col: 3,
      field: SchemaField.InputText,
      maxLength: 200,
    }),
    drawerIdentifier: fields.text.required('Keşideci VKN/TCKN zorunludur').label('Keşideci VKN/TCKN').meta({
      col: 3,
      field: SchemaField.InputText,
      maxLength: 11,
    }),
    placeOfIssue: fields.text.required('Keşideci yeri zorunludur').label('Keşide Yeri').meta({
      col: 2,
      field: SchemaField.InputText,
      maxLength: 200,
    }),

    // Banka Bilgileri
    bankEftCode: fields
      .autoComplete(banksOptions, 'number', ['id', 'name'])
      .required('Banka seçimi zorunludur')
      .label('Banka Adı')
      .meta({
        col: 2,
        field: SchemaField.InputAutoComplete,
      }),
    bankBranchEftCode: fields
      .autoComplete(branchesOptions, 'number', ['id', 'name'])
      .required('Şube seçimi zorunludur')
      .label('Banka Şubesi')
      .meta({
        col: 2,
        field: SchemaField.InputAutoComplete,
      }),
    _: fields.customComponent(() => <Divider sx={{ my: 1 }} />),

    // Çek Bilgileri
    no: fields.text.required('Çek no zorunludur').label('Çek No').meta({
      col: 3,
      field: SchemaField.InputText,
      maxLength: 16,
    }),
    billPaymentType: yup.number().default(1).label('Çek Tipi').meta({
      col: 3,
      field: SchemaField.InputText,
      disabled: true,
      visible: false,
    }),
    chequeAccountNo: fields.text.required('Çek hesap no zorunludur').label('Çek Hesap No').meta({
      col: 3,
      field: SchemaField.InputText,
      maxLength: 28,
    }),
    payableAmount: fields.currency
      .min(0, 'Çek tutarı negatif olamaz')
      .required('Çek tutarı zorunludur')
      .label('Çek Tutarı')
      .meta({
        col: 3,
        field: SchemaField.InputCurrency,
        currency: 'TRY',
      }),
    paymentDueDate: fields.date.required('Çek ödeme tarihi zorunludur').label('Çek Ödeme Tarihi').meta({
      col: 3,
      field: SchemaField.InputDate,
      minDate: tomorrow,
    }),
    __: fields.customComponent(() => <Divider sx={{ my: 1 }} />),

    // Ciranta Bilgileri
    endorserName: fields.text.nullable().label('Fatura Borçlusu Ünvanı').meta({
      col: 3,
      field: SchemaField.InputText,
    }),
    endorserIdentifier: fields.text.nullable().label('Fatura Borçlusu VKN / TCKN').meta({
      col: 3,
      field: SchemaField.InputText,
      maxLength: 11,
    }),
    referenceEndorserName: fields.text.nullable().label(' Ciranta Adı').meta({
      col: 3,
      field: SchemaField.InputText,
    }),
    referenceEndorserIdentifier: fields.text.nullable().label(' Ciranta VKN/TCKN').meta({
      col: 3,
      field: SchemaField.InputText,
      maxLength: 11,
    }),
    // Hidden field for billReferenceEndorsers - handled manually in form component
    billReferenceEndorsers: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string().required(),
          endorserName: yup.string().nullable(),
          endorserIdentifier: yup.string().nullable(),
        }),
      )
      .min(1, 'En az bir ara ciranta girilmelidir')
      .label('Ara Ciranta Bilgileri')
      .meta({
        field: SchemaField.InputHidden,
        visible: false,
      }),

    // Hidden fields for form submission
    payableAmountCurrency: fields.text.default('TRY').meta({ field: SchemaField.InputHidden }),
    type: yup.number().default(1).meta({ field: SchemaField.InputHidden }),
  });
};

export type SingleChequeSchemaType = ReturnType<typeof createSingleChequeSchema>;
