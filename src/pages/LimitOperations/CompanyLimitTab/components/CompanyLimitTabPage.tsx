/**
 * Company Limit Tab Page Component
 * Main component for Company Limit Tab - First Implementation
 * Following OperationPricing pattern exactly
 */

import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';
import type { CompanyLimitTabPageProps } from '../company-limit-tab.types';
import { useCompanyLimitData, useCompanyLimitDropdownData } from '../hooks';
import { CompanyLimitInfos } from './CompanyLimitInfos';
import { GuarantorLimitList } from './GuarantorLimitList';
import { LimitDashboard } from './LimitDashboard';
import { NonGuarantorLimitList } from './NonGuarantorLimitList';
import { RoofLimit } from './RoofLimit';

/**
 * Company Limit Tab Page Component
 * Displays company limit information with forms and tables
 * Matches legacy ScoreCompanyLimit.js functionality exactly
 */
export const CompanyLimitTabPage: React.FC<CompanyLimitTabPageProps> = ({ companyId }) => {
  // Fetch all company limit related data
  const {
    companyLimitInfos,
    dashboardData,
    roofLimitData,
    withGuarantorLimitListData,
    withoutGuarantorLimitListData,
    withoutGuarantorLimitData,
    isLoading: isDataLoading,
    error: dataError,
    getCompaniesLimit,
    getGuarantedList,
    getNonGuarantedList,
    getFinancersLimit,
    onChangeRoofLimitField,
    onChangeGuarantorLimitField,
    onChangeNonGuarantorLimitField,
  } = useCompanyLimitData({ companyId });

  // Fetch dropdown data including product types and activity types
  const { productTypes, activityTypes, financerCompanies } = useCompanyLimitDropdownData();

  // Calculate loading state
  const isLoading = isDataLoading;

  // Handle loading state
  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="300px" gap={2}>
        <CircularProgress size={40} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Limit bilgileri yükleniyor...
        </Typography>
      </Box>
    );
  }

  // Handle error state
  if (dataError) {
    return (
      <Alert severity="error">
        Limit bilgileri yüklenirken bir hata oluştu:{' '}
        {dataError instanceof Error ? dataError.message : 'Bilinmeyen hata'}
      </Alert>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Left Column: Company Limit Information Form */}
        <Grid item xs={12} md={8}>
          <CompanyLimitInfos
            companyLimitInfos={companyLimitInfos}
            getCompaniesLimit={getCompaniesLimit}
            companyId={companyId}
          />
        </Grid>

        {/* Right Column: Limit Dashboard */}
        <Grid item xs={12} md={4}>
          <LimitDashboard dashboardData={dashboardData} productTypes={productTypes} />
        </Grid>
      </Grid>

      {/* Roof Limit Component */}
      <RoofLimit
        creditRiskLoanDecision={companyLimitInfos?.CreditRiskLoanDecision}
        figoScoreLoanDecision={companyLimitInfos?.FigoScoreLoanDecision}
        roofLimitData={roofLimitData}
        getGuarantedList={getGuarantedList}
        onChangeRoofLimitField={onChangeRoofLimitField}
        productTypes={productTypes}
        activityTypes={activityTypes}
        companyId={companyId}
      />

      {/* Şirket Limits */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontSize: '22px', fontWeight: 600 }} gutterBottom>
            Şirket Limitleri
          </Typography>
          <Grid item xs={12}>
            <GuarantorLimitList
              creditRiskLoanDecision={companyLimitInfos?.CreditRiskLoanDecision}
              figoScoreLoanDecision={companyLimitInfos?.FigoScoreLoanDecision}
              roofLimitData={roofLimitData}
              getGuarantedList={getGuarantedList}
              withGuarantorLimitListData={withGuarantorLimitListData}
              onChangeGuarantorLimitField={onChangeGuarantorLimitField}
              activityTypes={activityTypes}
              financerCompanies={financerCompanies}
              companyId={Number(companyId)}
            />
          </Grid>

          {/* Non-Guarantor Limit List Component */}
          <Grid item xs={12} mt={5}>
            <NonGuarantorLimitList
              getNonGuarantedList={getNonGuarantedList}
              withoutGuarantorLimitListData={withoutGuarantorLimitListData}
              withoutGuarantorLimitData={withoutGuarantorLimitData}
              onChangeNonGuarantorLimitField={onChangeNonGuarantorLimitField}
              getFinancersLimit={getFinancersLimit}
              productTypes={productTypes}
              financerCompanies={financerCompanies}
              companyId={companyId}
            />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
