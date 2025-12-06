import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { fields } from '@components';
import yup from '@validation';
import {
  TransactionFeeScaleFormData,
  CreateTransactionFeeScaleRequest,
  UpdateTransactionFeeScaleRequest,
} from '../transaction-fee-scales.types';

interface UseTransactionFeeScaleFormProps {
  initialValues?: TransactionFeeScaleFormData;
}

/**
 * Hook for managing transaction fee scale form state and validation
 * Matches legacy TransactionScalesCreate.js and TransactionScalesEdit.js exactly
 */
export const useTransactionFeeScaleForm = ({ initialValues }: UseTransactionFeeScaleFormProps = {}) => {
  const defaultValues: TransactionFeeScaleFormData = {
    minAmount: null,
    maxAmount: null,
    transactionFee: null,
    percentFee: null,
    ...initialValues,
  };

  // Validation schema matching legacy validation
  const schema = yup.object().shape({
    minAmount: fields.currency
      .label('Minimum Tutar')
      .meta({
        col: 3,
        thousandSeparator: '.',
        decimalSeparator: ',',
        allowNegative: false,
      })
      .nullable()
      .default(null),
    maxAmount: fields.currency
      .label('Maximum Tutar')
      .meta({
        col: 3,
        thousandSeparator: '.',
        decimalSeparator: ',',
        allowNegative: false,
      })
      .nullable()
      .default(null),
    transactionFee: fields.currency
      .label('İşlem Ücreti(Birim)')
      .meta({
        col: 3,
        thousandSeparator: '.',
        decimalSeparator: ',',
        allowNegative: false,
      })
      .nullable()
      .default(null),
    percentFee: fields.number
      .label('İşlem Ücreti(Yüzde)')
      .meta({
        col: 3,
        thousandSeparator: '.',
        decimalSeparator: ',',
        allowNegative: false,
      })
      .nullable()
      .default(null),
  });

  const form = useForm<TransactionFeeScaleFormData>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  // Transform form data to API format for create
  const transformToCreateRequest = (formData: TransactionFeeScaleFormData): CreateTransactionFeeScaleRequest => ({
    minAmount: formData.minAmount ?? null,
    maxAmount: formData.maxAmount ?? null,
    transactionFee: formData.transactionFee ?? null,
    percentFee: formData.percentFee ?? null,
  });

  // Transform form data to API format for update
  const transformToUpdateRequest = (
    formData: TransactionFeeScaleFormData,
    id: number,
  ): UpdateTransactionFeeScaleRequest => ({
    Id: id,
    minAmount: formData.minAmount ?? null,
    maxAmount: formData.maxAmount ?? null,
    transactionFee: formData.transactionFee ?? null,
    percentFee: formData.percentFee ?? null,
  });

  return {
    form,
    schema,
    transformToCreateRequest,
    transformToUpdateRequest,
  };
};
