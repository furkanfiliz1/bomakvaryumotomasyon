import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup'; // Will add back when resolver is needed
import { fields } from '@components';
import yup from '@validation';
import { SchemaField } from 'src/components/common/Form/enums';
import { RESPONSE_DATE } from '@constant';
import dayjs from 'dayjs';
import type { CreateInvoiceFormData } from '../invoice-add.types';
// import { Typography } from '@mui/material'; // Removed for now - will add back when needed
import { CurrencyCode } from '../invoice-add.types';

/**
 * Custom hook for managing invoice creation form
 * Simplified version following ReceivableAdd pattern
 */
export const useCreateInvoiceForm = () => {
  // Initial values - simplified
  const initialValues: CreateInvoiceFormData = {
    invoiceNumber: '',
    hashCode: '',
    uuId: '',
    senderIdentifier: '',
    senderName: '',
    receiverIdentifier: '',
    receiverName: '',
    payableAmount: undefined,
    remainingAmount: undefined,
    approvedPayableAmount: undefined,
    taxFreeAmount: 0,
    payableAmountCurrency: CurrencyCode.TRY,
    issueDate: dayjs().format(RESPONSE_DATE),
    paymentDueDate: undefined,
    invoiceTypeCode: 'SATIS',
    profileId: 'TEMELFATURA',
    eInvoiceType: 1,
    type: 1,
    issueTimex: 1,
    sequenceNumber: '',
    serialNumber: '',
  };

  // Create a simpler schema
  const createInvoiceSchema = yup.object({
    // Basic Invoice Information
    invoiceNumber: fields.text.required('Fatura numarası zorunludur').label('Fatura Numarası').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    hashCode: fields.text.required('Hash kodu zorunludur').label('Hash Kodu').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    uuId: fields.text.required('UUID zorunludur').label('UUID').meta({
      col: 12,
      field: SchemaField.InputText,
    }),

    // Sender Information
    senderIdentifier: fields.text.required('Satıcı VKN/TCKN zorunludur').label('Satıcı VKN/TCKN').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    senderName: fields.text.required('Satıcı ünvan zorunludur').label('Satıcı Ünvan').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    // Receiver Information
    receiverIdentifier: fields.text.required('Alıcı VKN/TCKN zorunludur').label('Alıcı VKN/TCKN').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    receiverName: fields.text.required('Alıcı ünvan zorunludur').label('Alıcı Ünvan').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    // Amount Information
    payableAmount: fields.number
      .required('Ödenecek tutar zorunludur')
      .label('Ödenecek Tutar')
      .min(0.01, "Tutar 0'dan büyük olmalıdır")
      .meta({
        col: 4,
        field: SchemaField.InputCurrency,
      }),

    remainingAmount: fields.number
      .required('Kalan tutar zorunludur')
      .label('Kalan Tutar')
      .min(0, "Tutar 0'dan küçük olamaz")
      .meta({
        col: 4,
        field: SchemaField.InputCurrency,
      }),

    approvedPayableAmount: fields.number
      .required('Onaylanan tutar zorunludur')
      .label('Onaylanan Tutar')
      .min(0.01, "Tutar 0'dan büyük olmalıdır")
      .meta({
        col: 4,
        field: SchemaField.InputCurrency,
      }),

    // Date Information
    issueDate: fields.date.required('Düzenleme tarihi zorunludur').label('Düzenleme Tarihi').meta({
      col: 6,
      field: SchemaField.InputDate,
    }),

    paymentDueDate: fields.date.required('Vade tarihi zorunludur').label('Vade Tarihi').meta({
      col: 6,
      field: SchemaField.InputDate,
    }),

    // Additional required fields from CreateInvoiceFormData
    sequenceNumber: fields.text.label('Sıra Numarası').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    serialNumber: fields.text.label('Seri Numarası').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    taxFreeAmount: fields.number.label('Vergisiz Tutar').min(0, "Tutar 0'dan küçük olamaz").meta({
      col: 6,
      field: SchemaField.InputCurrency,
    }),

    payableAmountCurrency: fields.text.required('Para birimi zorunludur').label('Para Birimi').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    invoiceTypeCode: fields.text.required('Fatura türü zorunludur').label('Fatura Türü').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    profileId: fields.text.required('Profil ID zorunludur').label('Profil ID').meta({
      col: 6,
      field: SchemaField.InputText,
    }),

    issueTimex: fields.number.required('Issue timex zorunludur').label('Issue Timex').meta({
      col: 4,
      field: SchemaField.InputText,
    }),

    type: fields.number.required('Tip zorunludur').label('Tip').meta({
      col: 4,
      field: SchemaField.InputText,
    }),

    eInvoiceType: fields.number.required('E-Fatura türü zorunludur').label('E-Fatura Türü').meta({
      col: 4,
      field: SchemaField.InputText,
    }),
  });

  // Create form without resolver for now to avoid type conflicts
  const createInvoiceForm = useForm<CreateInvoiceFormData>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  return {
    createInvoiceForm,
    createInvoiceSchema,
  };
};
