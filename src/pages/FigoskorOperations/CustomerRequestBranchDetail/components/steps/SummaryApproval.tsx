import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  PlayCircle as PlayCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { Alert, Box, Chip, CircularProgress, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import type { StepStatus, StepStatusState } from '../../customer-request-branch-detail.types';

export interface SummaryApprovalProps {
  isLoading: boolean;
  stepStatuses?: StepStatusState;
  onUpdateStepStatus?: (stepIndex: number, status: StepStatus) => void;
}

/**
 * Summary Approval Step Component
 * Displays comprehensive step completion overview with exact legacy business logic
 */
export const SummaryApproval: React.FC<SummaryApprovalProps> = ({
  isLoading,
  stepStatuses = {},
  onUpdateStepStatus,
}) => {
  // Step names matching legacy exactly (Turkish labels)
  const stepNames = [
    'Firma Bilgileri',
    'Ticari ve Operasyonel Bilgiler',
    'Sicil Bilgileri',
    'Firma Tarihi',
    'Güncel Yönetim Kadrosu',
    'Yapısal Bilgiler',
    'Finansal Bilgiler',
    'Grup Şirket Yapısı',
  ];

  // Exclude Summary Approval (step 8) and Group Company Structure (step 7 - optional) from evaluation
  const evaluationSteps = [0, 1, 2, 3, 4, 5, 6]; // Removed step 7 (Grup Şirket Yapısı)

  const completedStepsCount = evaluationSteps.filter((stepIndex) => stepStatuses[stepIndex] === 'Tamamlandı').length;

  const startedStepsCount = evaluationSteps.filter((stepIndex) => stepStatuses[stepIndex] === 'Başlandı').length;

  const totalSteps = evaluationSteps.length; // Only count required steps

  // Determine Summary Approval status based on other steps (exact legacy logic)
  const getSummaryApprovalStatus = (): StepStatus => {
    if (completedStepsCount === evaluationSteps.length) {
      return 'Tamamlandı'; // All steps completed
    } else if (startedStepsCount > 0 || completedStepsCount > 0) {
      return 'Başlandı'; // At least one step started or completed
    }
    return 'Başlanmadı'; // No steps started
  };

  const summaryStatus = getSummaryApprovalStatus();

  // Update Summary Approval status automatically (exact legacy logic)
  useEffect(() => {
    if (onUpdateStepStatus) {
      onUpdateStepStatus(8, summaryStatus);
    }
  }, [summaryStatus, onUpdateStepStatus]);

  // Get status chip configuration
  const getStatusChip = (status: StepStatus) => {
    switch (status) {
      case 'Tamamlandı':
        return {
          icon: <CheckCircleIcon fontSize="small" />,
          label: 'Tamamlandı',
          color: 'success' as const,
        };
      case 'Başlandı':
        return {
          icon: <PlayCircleIcon fontSize="small" />,
          label: 'Başlandı',
          color: 'warning' as const,
        };
      case 'Opsiyonel':
        return {
          icon: <InfoIcon fontSize="small" />,
          label: 'Opsiyonel',
          color: 'primary' as const,
        };
      case 'Başlanmadı':
      default:
        return {
          icon: <RadioButtonUncheckedIcon fontSize="small" />,
          label: 'Başlanmadı',
          color: 'default' as const,
        };
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Özet değerlendirmesi yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Progress Summary - exact legacy layout */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Adım Tamamlanma Durumu:
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Tamamlanan: {completedStepsCount} / {totalSteps} adım
          </Typography>

          <LinearProgress
            variant="determinate"
            value={(completedStepsCount / evaluationSteps.length) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'success.main',
                borderRadius: 4,
              },
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            İlerleme: %{Math.round((completedStepsCount / evaluationSteps.length) * 100)}
          </Typography>
        </Box>

        {/* Step Status Grid - exact legacy layout */}
        <Grid container spacing={2}>
          {stepNames.map((stepName, index) => {
            // Mark step 7 (Grup Şirket Yapısı) as optional
            const isOptionalStep = index === 7;
            const status = isOptionalStep ? 'Opsiyonel' : stepStatuses[index] || 'Başlanmadı';
            const statusChip = getStatusChip(status);

            return (
              <Grid item xs={12} md={6} key={`step-${stepName}-${index}`}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip icon={statusChip.icon} label={statusChip.label} color={statusChip.color} size="small" />
                  <Typography variant="body2">{stepName}</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Information Alert - exact legacy message */}
      <Grid container>
        <Grid item xs={12}>
          <Alert
            severity="info"
            icon={<InfoIcon />}
            sx={{
              backgroundColor: 'info.50',
              '& .MuiAlert-icon': {
                color: 'info.main',
              },
            }}>
            Bu sayfada portal tarafından girilen veriler görüntülenmektedir. Değişiklik yapmak için portal üzerinden
            işlem yapmanız gerekmektedir.
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
