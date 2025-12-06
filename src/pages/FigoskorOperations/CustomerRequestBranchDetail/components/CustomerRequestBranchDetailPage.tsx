import { PageHeader } from '@components';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Box, Button, Card, Grid } from '@mui/material';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SessionStorageHelper } from '../helpers';
import { useCustomerRequestData, useStepNavigation, useStepStatusValidation } from '../hooks';

import { CustomerSummaryCard, StepContentArea, StepNavigationSidebar } from './index';

/**
 * Customer Request Branch Detail Page
 * Main page component for displaying customer branch report details
 * Follows OperationPricing patterns exactly
 */
export const CustomerRequestBranchDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { customerId, requestId } = useParams<{
    customerId: string;
    requestId: string;
    branchId: string;
  }>();

  // Get parent data from session storage
  const { parentRequest, parentBranch } = useMemo(() => SessionStorageHelper.getAllParentData(), []);

  // Get company ID from URL params (primary) or parent customer (fallback)
  const companyId = parentBranch?.TargetCompanyId;

  // Fetch customer request data
  const { figoScoreData, companyDocuments, enumData, isLoading, error, refetch } = useCustomerRequestData(companyId);

  // Step navigation management
  const { activeStep, setActiveStep, steps: stepDefinitions } = useStepNavigation();

  // Step status validation
  const { stepStatuses, getStepStatus, updateStepStatus } = useStepStatusValidation(figoScoreData, companyDocuments);

  // Update step definitions with current statuses
  const stepsWithStatus = useMemo(
    () =>
      stepDefinitions.map((step, index) => ({
        ...step,
        status: getStepStatus(index),
      })),
    [stepDefinitions, getStepStatus],
  );

  // Handle back navigation
  const handleGoBack = () => {
    if (customerId && requestId) {
      navigate(`/figoskor-islemleri/musteri-talepleri/${customerId}/${requestId}`);
    } else {
      navigate('/figoskor-islemleri/musteri-talepleri');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <div>Yükleniyor...</div>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box>
        <PageHeader title="Bayi Rapor Detayları" subtitle="Bayi rapor detaylarını görüntüleyin ve yönetin" />
        <Box mx={2}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <div>⚠️ {error}</div>
            <Button onClick={refetch} variant="contained" sx={{ mt: 2 }}>
              Tekrar Dene
            </Button>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        title="Bayi Rapor Detayları"
        subtitle="Bayi rapor detaylarını görüntüleyin ve yönetin"
        rightContent={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            size="small"
            sx={{ color: 'white', borderColor: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            Geri
          </Button>
        }
      />

      <Box mx={2} mb={2}>
        {/* Customer Summary Card */}
        <CustomerSummaryCard parentBranch={parentBranch} parentRequest={parentRequest} sx={{ mb: 3 }} />

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Step Navigation Sidebar */}
          <Grid item xs={12} md={4}>
            <StepNavigationSidebar steps={stepsWithStatus} activeStep={activeStep} onStepSelect={setActiveStep} />
          </Grid>

          {/* Step Content Area */}
          <Grid item xs={12} md={8}>
            <StepContentArea
              activeStep={activeStep}
              steps={stepsWithStatus}
              figoScoreData={figoScoreData}
              companyDocuments={companyDocuments}
              enumData={enumData}
              isLoading={isLoading}
              stepStatuses={stepStatuses}
              updateStepStatus={updateStepStatus}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
