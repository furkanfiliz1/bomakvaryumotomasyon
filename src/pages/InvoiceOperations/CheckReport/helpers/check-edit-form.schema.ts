import { fields } from '@components';
import yup from '@validation';
import type { BankOption, BranchOption } from '../check-report.types';

export interface BillReferenceEndorser {
  id: string;
  endorserIdentifier: string;
}

export interface CheckEditFormData {
  drawerName: string;
  drawerIdentifier: string;
  placeOfIssue: string;
  bankEftCode: string;
  bankBranchEftCode: string;
  no: string;
  chequeAccountNo: string;
  payableAmount: number;
  paymentDueDate: Date | null;
  endorserName?: string;
  endorserIdentifier?: string;
  referenceEndorserName?: string;
  referenceEndorserIdentifier?: string;
  billReferenceEndorsersList?: BillReferenceEndorser[];
}

export const createCheckEditFormSchema = (
  banks: BankOption[] = [],
  branches: BranchOption[] = [],
  t: (key: string) => string,
) => {
  // Transform banks data for select component
  const bankOptions = banks.map((bank) => ({
    id: bank.Id,
    name: `${bank.Name} (${bank.Code})`, // Display name with code like SingleChequeForm
    code: bank.Code,
  }));

  // Transform branches data for select component
  const branchOptions = branches.map((branch) => ({
    id: branch.Id,
    name: `${branch.Name} (${branch.Code})`, // Display name with code like SingleChequeForm
    code: branch.Code,
  }));

  return yup.object({
    // Drawer Information
    drawerName: fields.text.optional().nullable().label('Keşideci Adı').meta({ col: 6 }),

    drawerIdentifier: fields.text
      .required(t('REQUIRED'))
      .test('identifier-length', 'VKN 10 haneli, TCKN 11 haneli olmalıdır', (value) => {
        if (!value) return false;
        const cleanValue = value.replace(/\D/g, '');
        return cleanValue.length === 10 || cleanValue.length === 11;
      })
      .label('Keşideci VKN/TCKN')
      .meta({ col: 6 }),

    placeOfIssue: fields.text.required(t('REQUIRED')).label('Keşide Yeri').meta({ col: 6 }),

    // Bank Information
    bankEftCode: fields
      .select(bankOptions, 'string', ['id', 'name'])
      .required(t('REQUIRED'))
      .label('Banka Adı')
      .meta({ col: 6 }),

    bankBranchEftCode: fields
      .select(branchOptions, 'string', ['id', 'name'])
      .required(t('REQUIRED'))
      .label('Banka Şubesi')
      .meta({ col: 6 }),

    // Check Information
    no: fields.text.required(t('REQUIRED')).label('Çek No').meta({ col: 6 }),

    chequeAccountNo: fields.text.required(t('REQUIRED')).label('Çek Hesap No').meta({ col: 6 }),

    payableAmount: fields.currency
      .required(t('REQUIRED'))
      .min(0.01, "Çek tutarı 0'dan büyük olmalıdır")
      .label('Çek Tutarı')
      .meta({ currency: 'TRY', col: 6 }),

    paymentDueDate: fields.date
      .required(t('REQUIRED'))
      .test('future-date', 'Çek ödeme tarihi geçmiş tarih olamaz', (value) => {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      })
      .label('Çek Ödeme Tarihi')
      .meta({ col: 6 }),

    // Ciranta Bilgileri (Endorser Information)
    endorserName: fields.text.label('Fatura Borçlusu Ünvanı').meta({ col: 6 }),

    endorserIdentifier: fields.text
      .test('identifier-length-optional', 'VKN 10 haneli, TCKN 11 haneli olmalıdır', (value) => {
        if (!value) return true; // Optional field
        const cleanValue = value.replace(/\D/g, '');
        return cleanValue.length === 10 || cleanValue.length === 11;
      })
      .label('Fatura Borçlusu VKN / TCKN')
      .meta({ col: 6 }),

    referenceEndorserName: fields.text.label('Ciranta Ünvanı').meta({ col: 6 }),

    referenceEndorserIdentifier: fields.text
      .test('identifier-length-optional', 'VKN 10 haneli, TCKN 11 haneli olmalıdır', (value) => {
        if (!value) return true; // Optional field
        const cleanValue = value.replace(/\D/g, '');
        return cleanValue.length === 10 || cleanValue.length === 11;
      })
      .label('Ciranta VKN/TCKN')
      .meta({ col: 6 }),
  });
};

// Default form values
export const DEFAULT_CHECK_EDIT_FORM: CheckEditFormData = {
  drawerName: '',
  drawerIdentifier: '',
  placeOfIssue: '',
  bankEftCode: '',
  bankBranchEftCode: '',
  no: '',
  chequeAccountNo: '',
  payableAmount: 0,
  paymentDueDate: null,
  endorserName: '',
  endorserIdentifier: '',
  referenceEndorserName: '',
  referenceEndorserIdentifier: '',
  billReferenceEndorsersList: [{ id: 'default-1', endorserIdentifier: '' }],
};
