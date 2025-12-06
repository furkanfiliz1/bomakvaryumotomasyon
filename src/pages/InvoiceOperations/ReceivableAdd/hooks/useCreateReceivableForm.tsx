import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { fields } from '@components';
import yup from '@validation';
import { SchemaField } from 'src/components/common/Form/enums';
import { RESPONSE_DATE } from '@constant';
import dayjs from 'dayjs';
import checkEndDateFilterEligibility from 'src/utils/checkEndDateFilterEligibility';
import type { CreateReceivableFormData } from '../receivable-add.types';
import { Divider, Typography } from '@mui/material';

/**
 * Custom hook for managing receivable creation form
 * Following Portal reference pattern from useCreateReceivableForm
 */
export const useCreateReceivableForm = () => {
  // Initial values with default date
  const initialValues = {
    ReceiverIdentifier: '',
    ReceiverName: '',
    SenderIdentifier: '',
    SenderName: '',
    ReceivableAmount: undefined as number | undefined,
    ReceivableNumber: '',
    ReceivableDueDate: undefined as string | undefined,
    ReceivableIssueDate: dayjs().format(RESPONSE_DATE),
  };

  // Create schema with sections following Portal pattern
  const createReceivableSchema = yup.object({
    // Alıcı Bilgileri (Receiver Information)
    _: fields.customComponent(() => (
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Alıcı Bilgileri
      </Typography>
    )),
    ReceiverIdentifier: fields.text
      .required('Alıcı VKN/TCKN zorunludur')
      .label('Alıcı VKN/TCKN')
      .min(10, 'En az 10 karakter olmalıdır')
      .meta({
        col: 6,
        field: SchemaField.InputText,
        maxLength: 11,
      }),

    ReceiverName: fields.text.label('Alıcı Ünvan').meta({
      col: 6,
      field: SchemaField.InputText,
    }),
    __: fields.customComponent(() => <Divider sx={{ my: 1 }} />),
    ___: fields.customComponent(() => (
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Satıcı Bilgileri
      </Typography>
    )),
    // Gönderici Bilgileri (Sender Information)
    SenderIdentifier: fields.text
      .required('Satıcı VKN/TCKN  zorunludur')
      .label('Satıcı VKN/TCKN ')
      .min(10, 'En az 10 karakter olmalıdır')
      .meta({
        col: 6,
        field: SchemaField.InputText,
        maxLength: 11,
      }),
    SenderName: fields.text.label('Satıcı Ünvan').meta({
      col: 6,
      field: SchemaField.InputText,
    }),
    ____: fields.customComponent(() => <Divider sx={{ my: 1 }} />),
    _____: fields.customComponent(() => (
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Alacak Bilgileri
      </Typography>
    )),
    // Alacak Bilgileri (Receivable Information)
    ReceivableAmount: fields.currency.required('Alacak tutarı zorunludur').label('Alacak Tutarı').meta({
      col: 3,
      field: SchemaField.InputCurrency,
    }),
    ReceivableNumber: fields.text.label('Alacak Numarası').meta({
      col: 3,
      field: SchemaField.InputText,
    }),
    ReceivableDueDate: fields.date
      .required('Vade tarihi zorunludur')
      .label('Vade Tarihi')
      .meta({
        col: 3,
        field: SchemaField.InputDate,
        disablePast: true,
      })
      .test('ReceivableDueDateAfterToday', 'Vade tarihi bugünden sonra olmalıdır', function () {
        const { ReceivableDueDate } = this.parent;
        return checkEndDateFilterEligibility(new Date().toDateString(), ReceivableDueDate);
      }),
    ReceivableIssueDate: fields.date
      .required('Düzenleme tarihi zorunludur')
      .label('Düzenleme Tarihi')
      .meta({
        col: 3,
        field: SchemaField.InputDate,
        disableFuture: true,
      })
      .test('ReceivableIssueDateNotFuture', 'Düzenleme tarihi ileri tarih olamaz', function () {
        const { ReceivableIssueDate } = this.parent;
        return checkEndDateFilterEligibility(ReceivableIssueDate, new Date().toDateString());
      }),
  });

  // Initialize form with validation
  const createReceivableForm = useForm<CreateReceivableFormData>({
    resolver: yupResolver(createReceivableSchema as yup.ObjectSchema<CreateReceivableFormData>),
    defaultValues: initialValues,
  });

  return {
    createReceivableForm,
    createReceivableSchema,
  };
};
