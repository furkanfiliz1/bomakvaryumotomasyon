import { useErrorListener } from '@hooks';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useGetCompanyDetailQuery, useGetInvoiceBuyerAnalysisQuery } from '../company-invoice-buyer-tab.api';
import CompanyInvoiceScoreCard from './CompanyInvoiceScoreCard';
import InvoiceScoreMetricsTable from './InvoiceScoreMetricsTable';

interface InvoiceBuyerTabPageProps {
  /** Company identifier for API call */
  companyId: string;
}

/**
 * Invoice Buyer Tab Page Component
 * Displays invoice buyer analysis data with metrics details
 * Matches legacy system at localhost:3001/figo-score/sirketler/40930/faturaskor exactly
 */
export const InvoiceBuyerTabPage: React.FC<InvoiceBuyerTabPageProps> = ({ companyId }) => {
  // Fetch company details first to get the identifier using /companies/{companyId} endpoint
  const { data: companyData, error: companyError } = useGetCompanyDetailQuery({ companyId: Number(companyId) });

  // Fetch invoice buyer analysis data using the company identifier
  const { data, error, isLoading } = useGetInvoiceBuyerAnalysisQuery(
    { identifier: companyData?.Identifier || '' },
    { skip: !companyData?.Identifier },
  );

  // Error handling for both queries
  useErrorListener([companyError, error]);

  // Extract receivers data
  const receiversData = data?.Receivers || [];

  // Show loading or no data message like legacy
  if (isLoading || !companyData?.Identifier) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  // Show no data message like legacy
  if (!data || receiversData.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Yeterli veri bulunmuyor.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Company Info Card - matches legacy ScoreCompanyInvoiceScoreCard */}
      <CompanyInvoiceScoreCard
        companyName={companyData?.CompanyName}
        identifier={companyData?.Identifier}
        data={data}
      />

      {/* Metrics Table - matches legacy ScoreCompanyInvoiceScoreTable */}
      <InvoiceScoreMetricsTable data={receiversData} />
    </Box>
  );
};

export default InvoiceBuyerTabPage;
