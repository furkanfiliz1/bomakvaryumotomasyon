import { Form, LoadingButton, fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import yup from '@validation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateRepresentativeTargetMutation } from '../representative-target-entry.api';
import type { CustomerManager, MonthOption, UserTargetType, YearOption } from '../representative-target-entry.types';

interface CreateTargetDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customerManagerList: CustomerManager[];
  userTargetTypeList: UserTargetType[];
  monthOptions: MonthOption[];
  yearOptions: YearOption[];
}

interface FormData {
  userId: string;
  targetTypeId: string;
  month: string;
  year: string;
  amount: number | null;
}

/**
 * Dialog component for creating a new representative target
 * Matches legacy AgentTargetAdd.js functionality exactly
 */
export const CreateTargetDialog: React.FC<CreateTargetDialogProps> = ({
  open,
  onClose,
  onSuccess,
  customerManagerList,
  userTargetTypeList,
  monthOptions,
  yearOptions,
}) => {
  const notice = useNotice();

  // Create mutation
  const [createTarget, { isLoading, error }] = useCreateRepresentativeTargetMutation();

  // Error handling
  useErrorListener([error]);

  // Form schema - matching legacy exactly
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      userId: fields
        .select(customerManagerList || [], 'string', ['Id', 'FullName'])
        .required('Müşteri temsilcisi seçimi zorunludur')
        .label('Müşteri Temsilcisi')
        .meta({ col: 12 }),
      month: fields
        .select(monthOptions, 'string', ['value', 'label'])
        .required('Ay seçimi zorunludur')
        .label('Ay')
        .meta({ col: 6 }),
      year: fields
        .select(yearOptions, 'string', ['value', 'label'])
        .required('Yıl seçimi zorunludur')
        .label('Yıl')
        .meta({ col: 6 }),
      targetTypeId: fields
        .select(userTargetTypeList || [], 'string', ['Id', 'Name'])
        .required('Hedef tipi seçimi zorunludur')
        .label('Hedef Tipi')
        .meta({ col: 12 }),
      amount: fields.currency
        .required('Hedef tutarı zorunludur')
        .positive('Hedef tutarı pozitif olmalıdır')
        .label('Hedef')
        .meta({ col: 12, currency: 'TRY' }),
    };

    return yup.object(baseFields);
  }, [customerManagerList, userTargetTypeList, monthOptions, yearOptions]);

  // Initialize form with default values - matching legacy defaults
  const form = useForm({
    defaultValues: {
      userId: '',
      targetTypeId: '',
      month: '1', // Default to January like legacy
      year: '2025', // Default to current year
      amount: null,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange' as const,
  });

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    try {
      await createTarget({
        month: data.month,
        year: data.year,
        userId: data.userId,
        targetTypeId: data.targetTypeId,
        amount: data.amount || 0,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Hedef başarıyla eklendi',
      });
      form.reset();
      onSuccess();
      onClose();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Failed to create target:', err);
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Hedef Girişi</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={form as any} schema={schema} space={2} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          İptal
        </Button>
        <LoadingButton
          id="create-target-submit"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={form.handleSubmit(handleSubmit as any)}
          variant="contained"
          loading={isLoading}
          disabled={!form.formState.isValid}>
          Kaydet
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTargetDialog;
