/**
 * Company Score Tab Main Page Component
 * Following OperationPricing pattern for main feature page
 */

import { Alert, Box, CircularProgress } from '@mui/material';
import React from 'react';

import type { CompanyScoreTabPageProps } from '../company-score-tab.types';
import { useCompanyScoreTabData } from '../hooks';
import { AnalysisSummary } from './AnalysisSummary';
import { CompanyScoreInfo } from './CompanyScoreInfo';
import { FinancialAnalysisTable } from './FinancialAnalysisTable';
import { RatiosAnalysisTable } from './RatiosAnalysisTable';

export const CompanyScoreTabPage: React.FC<CompanyScoreTabPageProps> = ({ companyId }) => {
  const {
    figoScoreData,
    financialAnalysisData,
    financialAnalysisLoading,
    financialAnalysisError,
    isLoading,
    hasError,
    refetchAll,
  } = useCompanyScoreTabData(companyId);

  // Show loading for initial data load
  if (isLoading && !figoScoreData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Box ml={2}>
          <Alert severity="info">Skor bilgileri yükleniyor...</Alert>
        </Box>
      </Box>
    );
  }

  // Show error for critical failures
  if (hasError && !figoScoreData && !financialAnalysisData) {
    return (
      <Alert
        severity="error"
        sx={{ m: 2 }}
        action={
          <button onClick={refetchAll} style={{ marginLeft: 8 }}>
            Tekrar Dene
          </button>
        }>
        Veri yüklenirken hata oluştu. Lütfen sayfayı yenileyin veya sistem yöneticisi ile iletişime geçin.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Company Figo Score Information */}
      <CompanyScoreInfo companyId={companyId} />

      <AnalysisSummary
        financialAnalysisData={financialAnalysisData}
        figoScoreData={figoScoreData}
        loading={financialAnalysisLoading}
        error={financialAnalysisError}
      />

      {/* Financial Ratios Table - Show when analysis data is available */}
      <RatiosAnalysisTable
        financialAnalysisData={financialAnalysisData}
        loading={financialAnalysisLoading}
        error={financialAnalysisError}
      />

      {/* Financial Analysis Accounts Table - Show when analysis data is available */}
      <FinancialAnalysisTable
        financialAnalysisData={financialAnalysisData}
        loading={financialAnalysisLoading}
        error={financialAnalysisError}
      />
    </Box>
  );
};
