import { Form, fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { currencyFormatter } from '@utils';
import yup from '@validation';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { OperationPricingItem } from '../operation-pricing.types';

interface RefundDialogProps {
  open: boolean;
  item: OperationPricingItem;
  onConfirm: (refundReason: string) => void;
  onCancel: () => void;
}

// Refund reasons matching legacy system exactly
const REFUND_REASONS = [
  { value: '0', label: 'İptal' },
  { value: '1', label: 'Zaman Aşımı' },
  { value: '2', label: 'Finans Şirketi Çekildi' },
];

export const RefundDialog: React.FC<RefundDialogProps> = ({ open, item, onConfirm, onCancel }) => {
  // Form schema using the custom fields system
  const schema = yup.object({
    refundReason: fields
      .select(REFUND_REASONS, 'string', ['value', 'label'])
      .required('İade nedeni seçimi zorunludur')
      .label('İade Nedeni')
      .meta({ col: 12 }),
  });

  const form = useForm({
    defaultValues: {
      refundReason: undefined,
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = form;

  const onSubmit = async (data: { refundReason?: string | number | undefined }) => {
    const selectedReason = REFUND_REASONS.find((r) => r.value === String(data.refundReason));
    await onConfirm(selectedReason?.label || '');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onCancel();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>İade Onayı</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                İade Bilgileri
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sipariş No: {item.OrderNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Firma: {item.CompanyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                İade Tutarı: {currencyFormatter(item.NetAmount, item.CurrencyName)}
              </Typography>
            </Box>

            <Alert severity="warning">
              {currencyFormatter(item.NetAmount, item.CurrencyName)} tutarında iade yapmak istediğinizden emin misiniz?
            </Alert>

            {/* Form with custom fields */}
            <Form form={form} schema={schema} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            İptal
          </Button>
          <Button type="submit" variant="contained" color="error" disabled={isSubmitting || !isValid}>
            {isSubmitting ? 'İşleniyor...' : 'İade Et'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
