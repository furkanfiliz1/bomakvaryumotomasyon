/**
 * Company Document Data Tab Main Page Component
 * Following OperationPricing pattern for main feature page
 * Matches legacy ScoreCompanyDocumentAndInvoices.js component exactly
 */

import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useUpdateInvoiceIntegratorDetailsMutation } from '../company-document-data-tab.api';
import { useDocumentDataSections } from '../hooks';
import type { EInvoiceStatusFormData } from '../hooks/useEInvoiceStatusForm';
import { EInvoiceSection, ELedgerSection, FinancialDataSection, FindeksReportSection } from './index';

interface CompanyDocumentDataTabPageProps {
  companyId: string;
  identifier: string;
}

/**
 * Main component for Company Document Data Tab
 * Replicates legacy ScoreCompanyDocumentAndInvoices behavior exactly:
 * - Shows 4 main sections: Findeks, Financial Data, e-Fatura, e-Defter
 * - Handles loading states for each section independently
 * - Uses identical layout and styling patterns
 */
export const CompanyDocumentDataTabPage: React.FC<CompanyDocumentDataTabPageProps> = ({ companyId, identifier }) => {
  const documentData = useDocumentDataSections({ companyId, identifier });
  const [updateInvoiceIntegrator, { isLoading: isUpdating, error: updateError }] =
    useUpdateInvoiceIntegratorDetailsMutation();
  const notice = useNotice();

  // Error handling for mutation
  useErrorListener(updateError);

  // Handle invoice integrator update - matching legacy updateInvoiceCompaniesDetail
  const handleUpdateInvoiceStatus = async (formData: EInvoiceStatusFormData) => {
    try {
      await updateInvoiceIntegrator({
        identifier,
        data: {
          nextIncomingDate: formData.nextIncomingDate,
          nextOutgoingDate: formData.nextOutgoingDate,
          requestLimitDate: formData.requestLimitDate,
          requestCurrentLimit: formData.requestCurrentLimit,
        },
      }).unwrap();

      // Success notification matching legacy Swal.fire
      await notice({
        title: 'Başarılı',
        message: 'Güncelleme işlemi başarılı.',
      });

      // Refresh data after successful update
      documentData.refreshIntegratorData();
      documentData.refreshFinancialData();
    } catch (error) {
      console.error('Update invoice integrator failed:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header matching legacy layout */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          İşlenen Veriler
        </Typography>
        {documentData.company && (
          <Typography variant="subtitle1" color="text.secondary">
            {documentData.company.Name} - {documentData.company.Identifier}
          </Typography>
        )}
      </Box>

      {/* Main content grid - 4 sections matching legacy layout */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 1. Findeks Report Section */}
        <FindeksReportSection
          findeksReports={documentData.findeksReports}
          selectedReportId={documentData.selectedReportId}
          findeksData={documentData.findeksData}
          loading={documentData.loadingStates.findeksReports || documentData.loadingStates.findeksData}
          error={documentData.errors.findeksReports || documentData.errors.findeksData}
          onReportSelect={documentData.selectFindeksReport}
        />

        {/* 2. Financial Data Section */}
        <FinancialDataSection
          financialData={documentData.financialData}
          loading={documentData.loadingStates.financialData}
          error={documentData.errors.financialData}
          onRefresh={documentData.refreshFinancialData}
        />

        {/* 3. E-Invoice Section */}
        <EInvoiceSection
          invoiceIntegrator={documentData.invoiceIntegrator}
          invoiceIntegratorDetail={documentData.invoiceIntegratorDetail}
          loading={documentData.loadingStates.invoiceIntegrator || documentData.loadingStates.company}
          error={documentData.errors.invoiceIntegrator || documentData.errors.company}
          onRefresh={documentData.refreshIntegratorData}
          onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
          isUpdating={isUpdating}
        />

        {/* 4. E-Ledger Section */}
        <ELedgerSection
          ledgerIntegrator={documentData.ledgerIntegrator}
          loading={documentData.loadingStates.ledgerIntegrator}
          error={documentData.errors.ledgerIntegrator}
          onRefresh={documentData.refreshIntegratorData}
        />
      </Box>
    </Box>
  );
};

export default CompanyDocumentDataTabPage;
