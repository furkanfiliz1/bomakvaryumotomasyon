import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useForm } from 'react-hook-form';
import { useGetCurrenciesQuery, useGetProfileTypesQuery } from '../../invoice-operations.api';
import { InvoiceEditFormData, InvoiceItem } from '../../invoice-operations.types';

const gibStatusOptions = [
  { value: 'true', label: 'GİB Onaylı' },
  { value: 'false', label: 'GİB Onaylı Değil' },
];

const invoiceTypeOptions = [
  { value: 1, label: 'e-Fatura' },
  { value: 2, label: 'Kağıt Fatura' },
];

const eInvoiceTypeOptions = [
  { value: 1, label: 'Temel / Ticari E-Fatura' },
  { value: 2, label: 'Arşiv Fatura' },
  { value: 3, label: 'Müstahsil' },
];

export const useInvoiceEditForm = (invoice?: InvoiceItem) => {
  const { data: currencies = [], isLoading: currenciesLoading } = useGetCurrenciesQuery();
  const { data: profileTypes = [], isLoading: profileTypesLoading } = useGetProfileTypesQuery();

  const getInitialValues = (): InvoiceEditFormData => {
    if (!invoice) {
      return {
        ReceiverName: '',
        CurrencyId: 1,
        IssueDate: '',
        PaymentDueDate: '',
        PayableAmount: 0,
        ApprovedPayableAmount: 0,
        RemainingAmount: 0,
        Type: 1,
        EInvoiceType: null,
        Status: 1,
        IsDeleted: null,
        IsGibApproved: null,
        GibMessage: '',
        ProfileId: '',
        TaxFreeAmount: null,
        InvoiceNumber: '',
        HashCode: '',
        SerialNumber: '',
        SequenceNumber: '',
      };
    }

    return {
      ReceiverName: invoice.ReceiverName || '',
      CurrencyId: invoice.CurrencyId || 1,
      IssueDate: invoice.IssueDate ? invoice.IssueDate.split('T')[0] : '',
      PaymentDueDate: invoice.PaymentDueDate ? invoice.PaymentDueDate.split('T')[0] : '',
      PayableAmount: invoice.PayableAmount || 0,
      ApprovedPayableAmount: invoice.ApprovedPayableAmount || 0,
      RemainingAmount: invoice.RemainingAmount || 0,
      Type: invoice.Type || 1,
      EInvoiceType: invoice.EInvoiceType || null,
      Status: invoice.Status || 1,
      IsDeleted: invoice.IsDeleted || null,
      IsGibApproved: invoice.IsGibApproved || null,
      GibMessage: invoice.GibMessage || '',
      ProfileId: invoice.ProfileId || '',
      TaxFreeAmount: invoice.TaxFreeAmount || null,
      InvoiceNumber: invoice.InvoiceNumber || '',
      HashCode: invoice.HashCode || '',
      SerialNumber: invoice.SerialNumber || '',
      SequenceNumber: invoice.SequenceNumber || '',
    };
  };

  const createSchema = () => {
    return yup.object({
      // Basic Information
      ReceiverName: fields.text.required('Alıcı unvanı zorunludur').label('Alıcı Unvanı').meta({ col: 4 }),

      CurrencyId: fields
        .select(currencies, 'number', ['Id', 'Code'])
        .required('Para birimi zorunludur')
        .label('Para Birimi')
        .meta({ col: 4 }),

      IssueDate: fields.date.label('Fatura Tarihi').meta({ col: 4 }),

      PaymentDueDate: fields.date.nullable().label('Fatura Vade Tarihi').meta({ col: 4 }),

      // Amount Information
      PayableAmount: fields.currency
        .required('Fatura tutarı zorunludur')
        .label('Fatura Tutarı')
        .meta({ col: 4, currency: 'TRY' }),

      ApprovedPayableAmount: fields.currency
        .required('Onaylanan tutar zorunludur')
        .label('Alıcı Onaylı Fatura Tutarı')
        .meta({ col: 4, currency: 'TRY' }),

      RemainingAmount: fields.currency
        .required('İskontolanabilir tutar zorunludur')
        .label('İskontolanabilir Tutar')
        .meta({ col: 4, currency: 'TRY' }),

      // Invoice Type
      Type: fields
        .select(invoiceTypeOptions, 'number', ['value', 'label'])
        .required('Fatura tipi zorunludur')
        .label('Fatura Tipi')
        .meta({ col: 4 }),

      // Conditional fields based on Type
      EInvoiceType: fields
        .select(eInvoiceTypeOptions, 'number', ['value', 'label'])
        .nullable()
        .label('e-Fatura Tipi')
        .meta({ col: 4 }),

      ProfileId: fields
        .select(profileTypes, 'string', ['Description', 'Description'])
        .nullable()
        .label('Profil Tipi')
        .meta({ col: 4 }),

      TaxFreeAmount: fields.currency
        .nullable()
        .label('E-Arşiv Vergisiz Tutar')
        .meta({ col: 6, currency: 'TRY', visible: false }),

      InvoiceNumber: fields.text.nullable().label('Fatura No').meta({ col: 4 }),

      HashCode: fields.text.nullable().label('Hash Kodu').meta({ col: 4 }),

      // Status Fields
      Status: fields.switchField.label('Aktiflik Durumu').meta({ col: 6 }),

      IsDeleted: fields.switchField.nullable().label('Silinme Durumu').meta({ col: 6 }),

      IsGibApproved: fields
        .select(gibStatusOptions, 'string', ['value', 'label'])
        .nullable()
        .label('GİB Durumu')
        .meta({ col: 6 }),

      GibMessage: fields.text.nullable().label('GİB Açıklaması').meta({ col: 6 }),
    });
  };

  const form = useForm<InvoiceEditFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(createSchema()) as any,
    defaultValues: getInitialValues(),
    mode: 'onChange',
  });

  return {
    form,
    schema: createSchema(),
    isLoading: currenciesLoading || profileTypesLoading,
    currencies,
    profileTypes,
  };
};
