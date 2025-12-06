import { fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { SchemaField } from 'src/components/common/Form/enums';
import { useCreateAllowancePaymentMutation, useLazyGetAllowanceBidsQuery } from '../discount-operations.api';
import { AllowancePaymentRequestModel } from '../discount-operations.types';

export interface PaymentFormData {
  TotalPayableAmount: number | null;
  TotalBidAmount: number | null;
  InterestRate: number | null;
  TotalInterestAmount: number | null;
  TotalBsmvAmount: number | null;
  PaymentDate: string;
  ReceiverInterestRate: number | null;
  RebateAmount: number | null;
  ExtraDueDayCount: number | null;
  TotalDeductionAmount: number | null;
  AdditionalDueDayCount: number | null;
}

interface UsePaymentFormProps {
  allowanceId?: number | null;
  initialData?: Partial<PaymentFormData>;
  onSubmit: (data: PaymentFormData) => void;
}

/**
 * Hook for managing payment form state and validation
 * Following OperationPricing form patterns and DiscountOperations structure
 */
export const usePaymentForm = ({ allowanceId, initialData, onSubmit }: UsePaymentFormProps) => {
  const notice = useNotice();
  const [getAllowanceBids, { isLoading: isLoadingBids }] = useLazyGetAllowanceBidsQuery();
  const [createAllowancePayment, { isLoading: isSubmittingPayment }] = useCreateAllowancePaymentMutation();

  const initialValues: PaymentFormData = useMemo(
    () => ({
      TotalPayableAmount: initialData?.TotalPayableAmount || null,
      TotalBidAmount: initialData?.TotalBidAmount || null,
      InterestRate: initialData?.InterestRate || null,
      TotalInterestAmount: initialData?.TotalInterestAmount || null,
      TotalBsmvAmount: initialData?.TotalBsmvAmount || null,
      PaymentDate: initialData?.PaymentDate || dayjs().format('YYYY-MM-DD'),
      ReceiverInterestRate: initialData?.ReceiverInterestRate || null,
      RebateAmount: initialData?.RebateAmount || null,
      ExtraDueDayCount: initialData?.ExtraDueDayCount || null,
      TotalDeductionAmount: initialData?.TotalDeductionAmount || null,
      AdditionalDueDayCount: initialData?.AdditionalDueDayCount || null,
    }),
    [initialData],
  );

  // Form validation schema following project patterns
  const validationSchema = yup.object().shape({
    TotalPayableAmount: fields.currency.nullable().optional().label('Ödenecek Tutar').meta({
      col: 6,
      field: SchemaField.InputCurrency,
      currency: 'TRY',
    }),
    TotalBidAmount: fields.currency.nullable().optional().label('Ödenen Tutar').meta({
      col: 6,
      field: SchemaField.InputCurrency,
      currency: 'TRY',
    }),
    InterestRate: fields.number
      .nullable()
      .optional()
      .max(100, "Faiz oranı 100'den büyük olamaz")
      .label('Faiz Oranı (%)')
      .meta({
        col: 6,
        field: SchemaField.InputText,
      }),
    TotalInterestAmount: fields.currency.nullable().optional().label('Faiz Tutarı').meta({
      col: 6,
      field: SchemaField.InputCurrency,
      currency: 'TRY',
    }),
    TotalBsmvAmount: fields.currency.nullable().optional().label('Faiz BSMV Tutarı').meta({
      col: 6,
      field: SchemaField.InputCurrency,
      currency: 'TRY',
    }),
    PaymentDate: fields.date.nullable().optional().label('Ödeme Tarihi').meta({
      col: 6,
      field: SchemaField.InputDate,
    }),
    ReceiverInterestRate: fields.number
      .nullable()
      .optional()
      .max(100, "Alıcı faiz oranı 100'den büyük olamaz")
      .label('Alıcı Faiz Oranı (%)')
      .meta({
        col: 6,
        field: SchemaField.InputText,
      }),
    RebateAmount: fields.currency.nullable().optional().label('Rebate Tutarı').meta({
      col: 6,
      field: SchemaField.InputCurrency,
      currency: 'TRY',
    }),
    ExtraDueDayCount: fields.number.nullable().optional().label('Ek Vade Kazanım Gün Sayısı').meta({
      col: 6,
      field: SchemaField.InputText,
    }),
    TotalDeductionAmount: fields.currency.nullable().optional().label('Kesinti Tutarı').meta({
      col: 6,
      field: SchemaField.InputCurrency,
      currency: 'TRY',
    }),
    AdditionalDueDayCount: fields.number.nullable().optional().label('Ek Vade Gün Sayısı').meta({
      col: 6,
      field: SchemaField.InputText,
    }),
  });

  const form = useForm({
    defaultValues: initialValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(validationSchema) as any,
    mode: 'onChange' as const,
  });

  const { handleSubmit, reset, formState } = form;
  const { isValid } = formState;

  const handleFormSubmit = handleSubmit(async (data) => {
    if (allowanceId === null || allowanceId === undefined) {
      notice({
        title: 'Hata',
        message: 'İşlem ID bulunamadı.',
      });
      return;
    }

    try {
      // Transform form data to match API request format
      const paymentRequest: AllowancePaymentRequestModel = {
        AdditionalDueDayCount: data.AdditionalDueDayCount || 0,
        AllowanceId: allowanceId,
        ExtraDueDayCount: data.ExtraDueDayCount || 0,
        InterestRate: data.InterestRate || 0,
        Libor: 0, // Fixed value as seen in curl
        PayableAmountCurrency: 'TRY', // Fixed value as seen in curl
        PaymentDate: data.PaymentDate ? new Date(data.PaymentDate).toISOString() : new Date().toISOString(),
        ReceiverInterestRate: data.ReceiverInterestRate || 0,
        TotalBsmvAmount: data.TotalBsmvAmount || 0,
        TotalInterestAmount: data.TotalInterestAmount || 0,
        TotalPaidAmount: data.TotalBidAmount || 0, // Using TotalBidAmount as TotalPaidAmount
        TotalPayableAmount: data.TotalPayableAmount || 0,
        RebateAmount: data.RebateAmount || 0,
      };

      await createAllowancePayment({ allowanceId, data: paymentRequest }).unwrap();

      notice({
        title: 'Başarılı',
        message: 'Ödeme bilgileri başarıyla kaydedildi.',
      });

      // Call the onSubmit callback after successful API call
      onSubmit(data as unknown as PaymentFormData);
    } catch (error) {
      console.error('Error creating payment:', error);
      notice({
        title: 'Hata',
        message: 'Ödeme bilgileri kaydedilirken hata oluştu.',
      });
    }
  });

  const handleReset = useCallback(() => {
    reset(initialValues);
  }, [reset, initialValues]);

  const handleGetPaymentInfo = useCallback(async () => {
    console.log('handleGetPaymentInfo called with allowanceId:', allowanceId);

    if (allowanceId === null || allowanceId === undefined) {
      notice({
        title: 'Hata',
        message: `İşlem ID bulunamadı. AllowanceId: ${allowanceId}`,
      });
      return;
    }

    try {
      const response = await getAllowanceBids(allowanceId).unwrap();

      // Map API response to form fields
      const paymentData: Partial<PaymentFormData> = {
        TotalPayableAmount: response.TotalPayableAmount || null,
        TotalBidAmount: response.TotalBidAmount || null,
        InterestRate: response.InterestRate || null,
        TotalInterestAmount: response.TotalInterestAmount || null,
        TotalBsmvAmount: response.TotalBsmvAmount || null,
        PaymentDate: response.AllowancePaymentDate || dayjs().format('YYYY-MM-DD'),
        ReceiverInterestRate: response.ReceiverInterestRate || null,
        RebateAmount: response.RebateAmount || null,
        ExtraDueDayCount: response.ExtraDueDayCount || null,
        TotalDeductionAmount: null, // This field doesn't exist in API response
        AdditionalDueDayCount: null, // This field doesn't exist in API response
      };

      // Update form with API data
      Object.keys(paymentData).forEach((key) => {
        const value = paymentData[key as keyof PaymentFormData];
        if (value !== null && value !== undefined) {
          form.setValue(key as keyof PaymentFormData, value);
        }
      });

      notice({
        title: 'Başarılı',
        message: 'Ödeme bilgileri tekliften alındı.',
      });
    } catch (error) {
      console.error('Error fetching payment info:', error);
      notice({
        title: 'Hata',
        message: 'Ödeme bilgileri alınırken hata oluştu.',
      });
    }
  }, [allowanceId, getAllowanceBids, form, notice]);

  return {
    form,
    schema: validationSchema,
    handleSubmit: handleFormSubmit,
    handleReset,
    handleGetPaymentInfo,
    isValid,
    isLoadingBids,
    isSubmittingPayment,
  };
};
