import { Form, LoadingButton } from '@components';
import { Box, Button, Card, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { useFinancerData, useTransactionFeeForm } from './hooks';

interface TransactionFeeStepProps {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  onSkip?: () => void;
  initialData?: Record<string, unknown>;
}

export const TransactionFeeStep: React.FC<TransactionFeeStepProps> = ({ onNext, onBack, onSkip, initialData }) => {
  // Fetch financers from API
  const { financiers, isLoading: isLoadingFinancers, error: financersError } = useFinancerData();

  const [integratorStatus] = useState([
    { value: '1', label: 'Entegratörlü' },
    { value: '2', label: 'Entegratörsüz' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the custom form hook
  const { form, schema } = useTransactionFeeForm({
    initialData: initialData?.TransactionFee as Record<string, unknown>,
    financiers,
    integratorStatus,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);

    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, this would be an actual API call
      console.log('Submitting transaction fee data:', data);

      onNext(data as Record<string, unknown>);
    } catch (error) {
      console.error('Error submitting transaction fee:', error);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  // Show loading while financers are being fetched
  if (isLoadingFinancers) {
    return (
      <Box mt={2} display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if financers failed to load
  if (financersError) {
    return (
      <Box mt={2}>
        <Card sx={{ p: 2, backgroundColor: 'error.light' }}>
          <Box textAlign="center">Finansör verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</Box>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
          <Button variant="outlined" onClick={onBack}>
            Önceki
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Card sx={{ p: 2 }}>
        <Form form={form} schema={schema} />
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>
          Önceki
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {onSkip && (
            <Button variant="outlined" onClick={handleSkip}>
              Atla
            </Button>
          )}
          <LoadingButton id="transaction-fee-submit" variant="contained" loading={isSubmitting} onClick={handleSubmit}>
            Sonraki
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};
