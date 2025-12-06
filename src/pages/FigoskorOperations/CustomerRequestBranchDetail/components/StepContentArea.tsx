import { Icon } from '@components';
import { Info as InfoIcon } from '@mui/icons-material';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react';
import type {
  EnumData,
  FigoScoreProFormData,
  FinancialDocument,
  StepDefinition,
  StepStatus,
  StepStatusState,
} from '../customer-request-branch-detail.types';
import {
  CommercialOperationalInfo,
  CompanyHistory,
  CompanyInformation,
  CurrentManagement,
  FinancialInformation,
  GroupCompanyStructure,
  RegistrationInformation,
  StructuralInformation,
  SummaryApproval,
} from './steps';

export interface StepContentAreaProps {
  activeStep: string;
  steps: StepDefinition[];
  figoScoreData?: FigoScoreProFormData;
  companyDocuments: FinancialDocument[];
  enumData: EnumData;
  isLoading: boolean;
  stepStatuses?: StepStatusState;
  updateStepStatus?: (stepIndex: number, status: StepStatus) => void;
}

/**
 * Step Content Area Component
 * Displays the selected step's content dynamically
 * Matches legacy content area layout
 */
export const StepContentArea: React.FC<StepContentAreaProps> = ({
  activeStep,
  steps,
  figoScoreData,
  companyDocuments,
  enumData,
  isLoading,
  stepStatuses,
  updateStepStatus,
}) => {
  const currentStep = steps.find((step) => step.id === activeStep);

  // Render step content based on component name
  const renderStepContent = () => {
    if (!currentStep) return null;

    // Render appropriate step component based on componentName
    switch (currentStep.componentName) {
      case 'CompanyInformation':
        return <CompanyInformation figoScoreData={figoScoreData} enumData={enumData} isLoading={isLoading} />;
      case 'CommercialOperationalInfo':
        return <CommercialOperationalInfo figoScoreData={figoScoreData} enumData={enumData} isLoading={isLoading} />;
      case 'RegistrationInformation':
        return <RegistrationInformation figoScoreData={figoScoreData} enumData={enumData} isLoading={isLoading} />;
      case 'CompanyHistory':
        return <CompanyHistory figoScoreData={figoScoreData} enumData={enumData} isLoading={isLoading} />;
      case 'CurrentManagement':
        return <CurrentManagement figoScoreData={figoScoreData} isLoading={isLoading} />;
      case 'StructuralInformation':
        return <StructuralInformation figoScoreData={figoScoreData} isLoading={isLoading} />;
      case 'FinancialInformation':
        return (
          <FinancialInformation
            figoScoreData={figoScoreData}
            companyDocuments={companyDocuments}
            isLoading={isLoading}
          />
        );
      case 'GroupCompanyStructure':
        return <GroupCompanyStructure figoScoreData={figoScoreData} enumData={enumData} isLoading={isLoading} />;
      case 'SummaryApproval':
        return (
          <SummaryApproval isLoading={isLoading} stepStatuses={stepStatuses} onUpdateStepStatus={updateStepStatus} />
        );
      default:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              {currentStep.componentName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bu bölüm henüz implement edilmemiş.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Durum: {currentStep.status}
            </Typography>
          </Box>
        );
    }
  };

  // Default empty state when no step is selected
  if (!currentStep) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <InfoIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              Detayları görüntülemek için sol taraftan bir bölüm seçin.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        avatar={<Icon icon={currentStep.icon as keyof typeof import('@components').IconTypes} size={24} />}
        title={currentStep.title}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <CardContent>{renderStepContent()}</CardContent>
    </Card>
  );
};
