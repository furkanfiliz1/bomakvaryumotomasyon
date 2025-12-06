/**
 * Call History Dialog Component
 * Dialog for adding/editing call history records
 * Following OperationPricing dialog and form patterns
 */

import { Form } from '@components';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useCallHistoryForm } from '../hooks';
import type { CallHistory, CallHistoryFormData } from '../lead-management.types';

interface CallHistoryDialogProps {
  open: boolean;
  callData: CallHistory | null;
  leadId: number;
  customerManagerId?: number;
  onClose: () => void;
  onSubmit: (data: CallHistoryFormData) => Promise<void>;
}

export const CallHistoryDialog: React.FC<CallHistoryDialogProps> = ({
  open,
  callData,
  leadId,
  customerManagerId,
  onClose,
  onSubmit,
}) => {
  const { form, schema } = useCallHistoryForm(callData, leadId, customerManagerId);

  // Reset form when call data changes
  useEffect(() => {
    if (callData) {
      form.reset({
        callResult: callData.CallResult,
        salesScenario: callData.SalesScenario,
        followUpDate: callData.FollowUpDate || '',
        notes: callData.Notes || '',
        callDate: callData.CallDate,
        customerManagerId: customerManagerId ?? null,
      });
    } else {
      form.reset({
        callResult: null,
        salesScenario: null,
        followUpDate: '',
        notes: '',
        callDate: dayjs().format('YYYY-MM-DD'), // Use local date without time/timezone
        customerManagerId: customerManagerId ?? null,
      });
    }
  }, [callData, customerManagerId, form]);

  const handleSubmit = async (data: CallHistoryFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{callData ? 'Görüşme Düzenle' : 'Yeni Görüşme Ekle'}</DialogTitle>
      <DialogContent>
        <Form form={form} schema={schema} space={2} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          İptal
        </Button>
        <LoadingButton onClick={form.handleSubmit(handleSubmit)} variant="contained" color="primary">
          {callData ? 'Güncelle' : 'Ekle'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
