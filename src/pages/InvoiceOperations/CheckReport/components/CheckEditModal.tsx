import { Form, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useLazyGetBankBranchessQuery, useUpdateCheckMutation } from '../check-report.api';
import type { BankOption, BranchOption, CheckReportItem, CheckUpdateRequest } from '../check-report.types';
import type { CheckEditFormData } from '../helpers/check-edit-form.schema';
import { useCheckEditForm } from '../hooks';
import { BillReferenceEndorserList } from './BillReferenceEndorserList';

interface CheckEditModalProps {
  open: boolean;
  onClose: () => void;
  checkData?: CheckReportItem;
  onSuccess?: () => void;
  banksData?: BankOption[];
  branchesData?: BranchOption[];
}

/**
 * Modal for editing check information
 * Following OperationPricing modal patterns with Form component integration
 */
export const CheckEditModal: React.FC<CheckEditModalProps> = ({
  open,
  onClose,
  checkData,
  onSuccess,
  banksData = [],
  branchesData = [],
}) => {
  const notice = useNotice();
  const [updateCheck, { isLoading: isUpdating, error }] = useUpdateCheckMutation();
  const [getBankBranches, { data: dynamicBranchesData }] = useLazyGetBankBranchessQuery();
  const [currentBranchesData, setCurrentBranchesData] = React.useState<BranchOption[]>(branchesData);

  useErrorListener(error);

  // Update branches data when lazy query returns results
  React.useEffect(() => {
    if (dynamicBranchesData?.Items) {
      setCurrentBranchesData(dynamicBranchesData.Items);
    }
  }, [dynamicBranchesData]);

  // Initialize branches data
  React.useEffect(() => {
    setCurrentBranchesData(branchesData);
  }, [branchesData]);

  // Load branches for initial bank selection when modal opens
  React.useEffect(() => {
    if (open && checkData && banksData.length > 0) {
      // Find the bank by BankEftCode
      const selectedBank = banksData.find((bank) => bank.Code === checkData.BankEftCode);
      if (selectedBank) {
        getBankBranches(selectedBank.Id);
        setPreviousBankCode(selectedBank.Id);
      }
    }
  }, [open, checkData, banksData, getBankBranches]);
  // Handle form submission
  const handleFormSubmit = async (formData: CheckEditFormData) => {
    if (!checkData) return;

    try {
      // Get current user info from localStorage (matching legacy pattern)
      const user = JSON.parse(localStorage.getItem('opUser') || '{}');
      const userId = user.Id || 0;
      // Transform form data to API request format using the hook's transformer
      const transformedData = transformFormDataToApiRequest(formData);
      const apiRequest: CheckUpdateRequest = {
        ...transformedData,
        id: checkData.Id,
        userId: userId,
      };

      await updateCheck(apiRequest).unwrap();

      // Show success notification
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Çek bilgileri başarıyla güncellendi.',
        buttonTitle: 'Tamam',
      });

      // Close modal and trigger success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating check:', error);
    }
  };

  // Use check edit form hook
  const { form, schema, handleSubmit, handleReset, transformFormDataToApiRequest } = useCheckEditForm({
    checkData,
    onSubmit: handleFormSubmit,
    banksData,
    branchesData: currentBranchesData,
  });

  // Watch for bank changes and fetch branches
  const watchedBankCode = form.watch('bankEftCode');
  const [previousBankCode, setPreviousBankCode] = React.useState<string | null>(null);
  const [isFormInitialized, setIsFormInitialized] = React.useState(false);

  // Track when form is properly initialized
  React.useEffect(() => {
    if (open && checkData && !isFormInitialized) {
      // Wait for form to be initialized
      const timer = setTimeout(() => {
        setIsFormInitialized(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    if (!open) {
      setIsFormInitialized(false);
    }
  }, [open, checkData, isFormInitialized]);

  React.useEffect(() => {
    // Only process bank changes after form is initialized and we have a real change
    if (isFormInitialized && watchedBankCode && banksData.length > 0 && watchedBankCode !== previousBankCode) {
      // Find the selected bank
      const selectedBank = banksData.find((bank) => bank.Id === watchedBankCode);
      if (selectedBank) {
        // Reset branch selection when bank changes (only if it's not the initial load)
        if (previousBankCode !== null) {
          form.setValue('bankBranchEftCode', '');
          setCurrentBranchesData([]);
        }
        // Fetch branches for the selected bank
        getBankBranches(selectedBank.Id);
        // Update previous bank code
        setPreviousBankCode(selectedBank.Id);
      }
    }
  }, [watchedBankCode, banksData, getBankBranches, form, previousBankCode, isFormInitialized]);

  // Handle modal close
  const handleClose = () => {
    if (!isUpdating) {
      // Reset all state when modal closes
      setPreviousBankCode(null);
      setIsFormInitialized(false);
      setCurrentBranchesData([]);
      handleReset();
      onClose();
    }
  };

  // Handle form submit
  const onFormSubmit = () => {
    handleSubmit();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth disableEscapeKeyDown={isUpdating}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Çek Düzenle</Typography>
          <IconButton onClick={handleClose} disabled={isUpdating} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ minHeight: '500px' }}>
          <Typography variant="subtitle2" sx={{ mb: 3, color: 'text.secondary' }}>
            Çek bilgilerini güncelleyin
          </Typography>

          <FormProvider {...form}>
            {/* Main Check Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Çek Bilgileri
              </Typography>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Form form={form} schema={schema as any} space={2} />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Bill Reference Endorsers */}
            <Box sx={{ mb: 2 }}>
              <BillReferenceEndorserList />
            </Box>
          </FormProvider>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={isUpdating} variant="outlined">
          İptal
        </Button>
        <Button
          onClick={onFormSubmit}
          disabled={isUpdating}
          variant="contained"
          color="primary"
          startIcon={isUpdating ? <CircularProgress size={16} /> : undefined}>
          {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
