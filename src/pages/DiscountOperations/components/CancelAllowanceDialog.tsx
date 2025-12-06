import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  useCancelAllowanceMutation,
  useCancelAllowancePaymentRequestMutation,
  useLazyGetPaymentRequestQuery,
} from '../discount-operations.api';

interface CancelAllowanceDialogProps {
  open: boolean;
  allowanceId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CancelAllowanceDialog: React.FC<CancelAllowanceDialogProps> = ({ open, allowanceId, onClose, onSuccess }) => {
  const notice = useNotice();
  const dialogShownRef = useRef(false);
  const successHandledRef = useRef(false);

  // API hooks
  const [getPaymentRequest, { data: paymentRequestData, isLoading: isCheckingPayment, error: paymentError }] =
    useLazyGetPaymentRequestQuery();

  const [cancelAllowance, { isLoading: isCancelingAllowance, error: cancelError, isSuccess: isCancelSuccess }] =
    useCancelAllowanceMutation();

  const [
    cancelAllowancePaymentRequest,
    { isLoading: isCancelingPayment, error: cancelPaymentError, isSuccess: isCancelPaymentSuccess },
  ] = useCancelAllowancePaymentRequestMutation();

  // Computed values
  const hasPaymentRequest = paymentRequestData && paymentRequestData.length > 0;
  const isSuccess = isCancelSuccess || isCancelPaymentSuccess;
  const isCanceling = isCancelingAllowance || isCancelingPayment;

  // Error handling
  useErrorListener([paymentError, cancelError, cancelPaymentError]);

  // Reset refs when dialog opens/closes
  useEffect(() => {
    if (open) {
      dialogShownRef.current = false;
      successHandledRef.current = false;
      // Only fetch payment request data when dialog opens
      if (allowanceId) {
        getPaymentRequest({ allowanceId });
      }
    }
  }, [open, allowanceId, getPaymentRequest]);

  // Show confirmation dialog and handle cancel operation
  const showConfirmationAndProcess = useCallback(async () => {
    try {
      // Show confirmation dialog - will reject if user cancels
      await notice({
        type: 'confirm',
        variant: 'warning',
        title: 'İskonto İptal Onayı',
        message: hasPaymentRequest
          ? 'Ödeme talepli iskonto talebini iptal etmek istediğinize emin misiniz?'
          : 'İlgili iskonto talebini iptal etmek istediğinize emin misiniz?',
        buttonTitle: isCanceling ? 'İptal Ediliyor...' : 'Evet, İptal Et',
        catchOnCancel: true,
      });

      // User confirmed - execute cancel
      if (!allowanceId) return;

      try {
        if (hasPaymentRequest) {
          await cancelAllowancePaymentRequest({ allowanceId }).unwrap();
        } else {
          await cancelAllowance(allowanceId).unwrap();
        }
      } catch (error) {
        // Error is handled by useErrorListener
        console.error('Cancel allowance failed:', error);
        onClose();
      }
    } catch {
      // User cancelled the confirmation dialog
      dialogShownRef.current = false;
      onClose();
    }
  }, [allowanceId, hasPaymentRequest, cancelAllowance, cancelAllowancePaymentRequest, isCanceling, notice, onClose]);

  // Show confirmation dialog once when data is ready
  useEffect(() => {
    if (open && paymentRequestData !== undefined && !isCheckingPayment && !dialogShownRef.current) {
      dialogShownRef.current = true;
      void showConfirmationAndProcess();
    }
  }, [open, paymentRequestData, isCheckingPayment, showConfirmationAndProcess]);

  // Handle success - only once
  useEffect(() => {
    if (isSuccess && !successHandledRef.current) {
      successHandledRef.current = true;
      notice({
        variant: 'success',
        title: 'İptal Edildi',
        message: 'İskonto talebi başarıyla iptal edildi.',
        buttonTitle: 'Tamam',
      });
      onClose();
      // Call onSuccess after a small delay to ensure cleanup
      setTimeout(() => onSuccess(), 300);
    }
  }, [isSuccess, notice, onClose, onSuccess]);

  return null;
};

export default CancelAllowanceDialog;
