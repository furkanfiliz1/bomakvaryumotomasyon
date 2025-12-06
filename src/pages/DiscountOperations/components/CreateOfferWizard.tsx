import { Close } from '@mui/icons-material';
import {
  Box,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import type { CreateOfferWizardProps, WizardFormData } from '../discount-operations.types';
import { ChequeDetailsStep, CompanyInfoStep, FinancialSettingsStep, TransactionFeeStep } from './steps';

const steps = ['Şirket Bilgileri', 'İşlem Ücreti', 'Çek Bilgileri', 'Finansal Ayarlar'];

export const CreateOfferWizard: React.FC<CreateOfferWizardProps> = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>({
    step0: { companyId: undefined },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepData = (stepIndex: number, data: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      [`step${stepIndex}`]: data,
    }));
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      step0: { companyId: undefined },
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CompanyInfoStep
            onNext={(data) => handleStepData(0, data)}
            onBack={handleBack}
            initialData={formData.step0 as Record<string, unknown>}
          />
        );
      case 1:
        return (
          <TransactionFeeStep
            onNext={(data) => handleStepData(1, data)}
            onBack={handleBack}
            onSkip={() => handleStepData(1, {})}
            initialData={formData.step1 as Record<string, unknown>}
          />
        );
      case 2:
        return (
          <ChequeDetailsStep
            onNext={(data) => handleStepData(2, data)}
            onBack={handleBack}
            companyId={formData.step0?.companyId as number}
            initialData={{
              selectedCheques: formData.step2?.selectedCheques,
              companyId: formData.step0?.companyId,
            }}
          />
        );
      case 3:
        return (
          <FinancialSettingsStep
            onNext={(data) => handleStepData(3, data as unknown as Record<string, unknown>)}
            onBack={handleBack}
            onSubmit={(finalData) => {
              // Handle final submission - close wizard and show success
              console.log('Final submission:', finalData);
              handleClose();
            }}
            initialData={formData.step3}
            formData={formData}
            onSuccess={() => {
              handleClose();
              onSuccess?.();
            }}
          />
        );
      default:
        return (
          <Box sx={{ py: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Bilinmeyen adım
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Dialog open={open} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Teklif Oluştur</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {(formData.step0?.companyName || formData.step0?.selectedCompanyData?.CompanyName) && (
            <Typography variant="body2" color="text.secondary">
              {formData.step0?.companyName || formData.step0?.selectedCompanyData?.CompanyName}
            </Typography>
          )}
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 4, backgroundColor: '#f5f6fa' }}>
        {/* Stepper */}
        <Card sx={{ p: 2 }}>
          <Box>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Card>

        {/* Step Content */}
        {activeStep === steps.length ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Tüm adımlar tamamlandı!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teklifiniz başarıyla oluşturuldu.
            </Typography>
          </Box>
        ) : (
          getStepContent(activeStep)
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferWizard;
