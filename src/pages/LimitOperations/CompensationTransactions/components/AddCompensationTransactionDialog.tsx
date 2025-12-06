import { Form, fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import yup from '@validation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCompensationTransactionMutation } from '../compensation-transactions.api';
import { useCompensationTransactionFormData } from '../hooks';

interface AddCompensationTransactionDialogProps {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddCompensationTransactionDialog: React.FC<AddCompensationTransactionDialogProps> = ({
  open,
  onSuccess,
  onCancel,
}) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  // Get dropdown data
  const { transactionTypeOptions, financerCompanyOptions, isLoading } = useCompensationTransactionFormData();

  // Create mutation
  const [createTransaction, { isLoading: isCreating }] = useCreateCompensationTransactionMutation();

  // Fixed schema - static form approach
  console.log('financerCompanyOptions', financerCompanyOptions);
  const schema = yup.object({
    operationType: fields
      .select(transactionTypeOptions, 'string', ['value', 'label'])
      .required('İşlem tipi seçimi zorunludur')
      .label('İşlem Tipi')
      .meta({ col: 12 }),
    identifier: fields.text.required('Firma seçimi zorunludur').label('Firma Kodu').meta({ col: 12 }),
    financerCompany: fields
      .select(financerCompanyOptions, 'number', ['value', 'label'])
      .label('Finansman Firması')
      .meta({ col: 12 }),
    transactionDate: fields.date.required('İşlem tarihi zorunludur').label('İşlem Tarihi').meta({ col: 6 }),
    amount: fields.currency
      .required('Tutar zorunludur')
      .positive('Tutar pozitif olmalıdır')
      .label('Tutar')
      .meta({ col: 6, currency: 'TRY' }),
  });

  const form = useForm({
    defaultValues: {
      operationType: '',
      identifier: '',
      financerCompany: 0,
      transactionDate: '',
      amount: 0,
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
    watch,
  } = form;

  // Watch for form changes to update conditional fields
  const watchedType = watch('operationType');
  const watchedCompany = watch('identifier');

  React.useEffect(() => {
    if (watchedType !== selectedType) {
      setSelectedType(String(watchedType));
    }
  }, [watchedType, selectedType]);

  React.useEffect(() => {
    if (watchedCompany !== selectedCompany) {
      setSelectedCompany(watchedCompany);
    }
  }, [watchedCompany, selectedCompany]);

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      await createTransaction({
        Identifier: data.identifier as string,
        TransactionDate: data.transactionDate as string,
        Amount: data.amount as number,
        Type: data.operationType as string,
        FinancerId: data.financerCompany as number,
      }).unwrap();

      // Success - close dialog and notify parent
      reset();
      setSelectedType('');
      setSelectedCompany('');
      onSuccess();
    } catch (error) {
      console.error('Error creating compensation transaction:', error);
      // Error handling is done by RTK Query error system
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isCreating) {
      reset();
      setSelectedType('');
      setSelectedCompany('');
      onCancel();
    }
  };

  const getActionButtonText = () => {
    if (isSubmitting || isCreating) return 'İşleniyor...';
    if (selectedType === '1') return 'Tahsilat Ekle';
    if (selectedType === '2') return 'Maliyet Ekle';
    return 'Ekle';
  };

  const getDialogTitle = () => {
    if (selectedType === '1') return 'Yeni Tahsilat İşlemi';
    if (selectedType === '2') return 'Yeni Maliyet İşlemi';
    return 'Yeni Tazmin İşlemi';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            {isLoading && <Alert severity="info">Dropdown verileri yükleniyor...</Alert>}
            {/* Dynamic Form based on schema */}
            <Form form={form} schema={schema} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting || isCreating}>
            İptal
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || isCreating || !isValid || isLoading}>
            {getActionButtonText()}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
