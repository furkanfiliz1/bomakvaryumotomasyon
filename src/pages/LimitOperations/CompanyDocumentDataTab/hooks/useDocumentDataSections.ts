/**
 * Document Data Sections Hook
 * Following OperationPricing pattern for data fetching hooks
 * Matches legacy ScoreCompanyDocumentAndInvoices.js data initialization exactly
 */

import { useErrorListener } from '@hooks';
import { useCallback, useEffect, useState } from 'react';
import {
  useGetConnectedIntegratorQuery,
  useGetFinancialDataQuery,
  useGetFindexReportsQuery,
  useLazyGetCompanyDetailScoreQuery,
  useLazyGetFindexReportQuery,
} from '../company-document-data-tab.api';
import type { DocumentDataState } from '../company-document-data-tab.types';

interface UseDocumentDataSectionsProps {
  companyId: string;
  identifier: string;
}

interface UseDocumentDataSectionsReturn extends DocumentDataState {
  // Actions
  selectFindeksReport: (reportId: string) => void;
  refreshFinancialData: () => void;
  refreshIntegratorData: () => void;
}

/**
 * Main hook for managing document data sections
 * Handles all data fetching and state management
 * Matches legacy initialization exactly
 */
export const useDocumentDataSections = ({
  companyId,
  identifier,
}: UseDocumentDataSectionsProps): UseDocumentDataSectionsReturn => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Initialize state matching legacy component state structure
  const [state, setState] = useState<DocumentDataState>({
    findeksReports: [],
    selectedReportId: null,
    findeksData: null,
    financialData: [],
    invoiceIntegrator: { entry: false, integratorName: '', active: false },
    invoiceIntegratorDetail: {
      id: 0,
      companySectorId: 0,
      companySector: '',
      identifier: '',
      createdDate: '',
      nextIncomingDate: '',
      nextOutgoingDate: '',
      nextOutgoingFirstDate: '',
      requestCurrentLimit: 0,
      requestLimit: 0,
      requestLimitDate: '',
      firstDownloadComplete: false,
    },
    ledgerIntegrator: { entry: false, integratorName: '', active: false },
    company: null,
    loadingStates: {
      findeksReports: false,
      findeksData: false,
      financialData: false,
      invoiceIntegrator: false,
      ledgerIntegrator: false,
      company: false,
    },
    errors: {
      findeksReports: null,
      findeksData: null,
      financialData: null,
      invoiceIntegrator: null,
      ledgerIntegrator: null,
      company: null,
    },
  });

  // 2. Get findeks reports - matches legacy getFindexReports
  const {
    data: findeksReportsData,
    isLoading: findeksReportsLoading,
    error: findeksReportsError,
  } = useGetFindexReportsQuery({ companyId }, { skip: !companyId });

  // 3. Get financial data - matches legacy getFinancialData
  const {
    data: financialData,
    isLoading: financialDataLoading,
    error: financialDataError,
    refetch: refetchFinancialData,
  } = useGetFinancialDataQuery({ identifier: identifier }, { skip: !identifier });

  // 4. Get invoice integrator - matches legacy getInvoiceIntegrator
  const {
    data: invoiceIntegratorData,
    isLoading: invoiceIntegratorLoading,
    error: invoiceIntegratorError,
    refetch: refetchInvoiceIntegrator,
  } = useGetConnectedIntegratorQuery(
    { type: 1, identifier: identifier }, // type 1 = invoice
    { skip: !identifier },
  );

  // 5. Get ledger integrator - matches legacy getLedgerIntegrator
  const {
    data: ledgerIntegratorData,
    isLoading: ledgerIntegratorLoading,
    error: ledgerIntegratorError,
    refetch: refetchLedgerIntegrator,
  } = useGetConnectedIntegratorQuery(
    { type: 2, identifier: identifier }, // type 2 = ledger
    { skip: !identifier },
  );

  // 6. Lazy query for company detail (invoice integrator detail) - Score API
  const [fetchCompanyDetail, { data: companyDetailData, isLoading: companyDetailLoading, error: companyDetailError }] =
    useLazyGetCompanyDetailScoreQuery();

  // 7. Lazy query for specific findeks report - matches legacy getFindexReport
  const [fetchFindeksReport, { data: findeksReportData, isLoading: findeksDataLoading, error: findeksDataError }] =
    useLazyGetFindexReportQuery();

  // Error handling for all queries
  useErrorListener([
    findeksReportsError,
    financialDataError,
    invoiceIntegratorError,
    ledgerIntegratorError,
    companyDetailError,
    findeksDataError,
  ]);

  // Trigger company detail fetch when identifier is available
  useEffect(() => {
    if (identifier) {
      fetchCompanyDetail({ identifier });
    }
  }, [identifier, fetchCompanyDetail]);

  // Update state when findeks reports change
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      findeksReports: findeksReportsData || [],
      loadingStates: { ...prev.loadingStates, findeksReports: findeksReportsLoading },
      errors: { ...prev.errors, findeksReports: findeksReportsError ? 'Findeks raporları alınamadı' : null },
    }));

    // Auto-select latest report if available (select most recent by date)
    if (findeksReportsData?.length && !selectedReportId) {
      // Parse dates and find the most recent report
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('.');
        return new Date(Number(year), Number(month) - 1, Number(day));
      };

      const latestReport = findeksReportsData.reduce((latest, current) => {
        const currentDate = parseDate(current.ReportDate);
        const latestDate = parseDate(latest.ReportDate);

        return currentDate > latestDate ? current : latest;
      }, findeksReportsData[0]); // Start with first report as initial value

      setSelectedReportId(String(latestReport.Id));
      fetchFindeksReport({ reportId: String(latestReport.Id) });
    }
  }, [findeksReportsData, findeksReportsLoading, findeksReportsError, selectedReportId, fetchFindeksReport]);

  // Update state when financial data changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      financialData: financialData?.data || [],
      loadingStates: { ...prev.loadingStates, financialData: financialDataLoading },
      errors: { ...prev.errors, financialData: financialDataError ? 'Finansal veriler alınamadı' : null },
    }));
  }, [financialData, financialDataLoading, financialDataError]);

  // Update state when company data changes (includes invoice integrator details)
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      invoiceIntegratorDetail: companyDetailData || {
        id: 0,
        companySectorId: 0,
        companySector: '',
        identifier: '',
        createdDate: '',
        nextIncomingDate: '',
        nextOutgoingDate: '',
        nextOutgoingFirstDate: '',
        requestCurrentLimit: 0,
        requestLimit: 0,
        requestLimitDate: '',
        firstDownloadComplete: false,
      },
      loadingStates: { ...prev.loadingStates, company: companyDetailLoading },
      errors: { ...prev.errors, company: companyDetailError ? 'E-Fatura detayları alınamadı' : null },
    }));
  }, [companyDetailData, companyDetailLoading, companyDetailError]);

  // Update state when invoice integrator changes
  useEffect(() => {
    // Parse invoice integrator data according to legacy logic
    // Legacy: if (response.data.Integrators.length > 0) -> entry: true
    let invoiceIntegratorState = { entry: false, integratorName: '', active: false };

    if (invoiceIntegratorData?.Integrators && invoiceIntegratorData.Integrators.length > 0) {
      const firstIntegrator = invoiceIntegratorData.Integrators[0];
      invoiceIntegratorState = {
        entry: true,
        integratorName: firstIntegrator.Name,
        active: firstIntegrator.IsActive,
      };
    }

    // Also extract company info from integrator response
    let companyInfo = null;
    if (invoiceIntegratorData?.Integrators && invoiceIntegratorData.Integrators.length > 0) {
      const firstIntegrator = invoiceIntegratorData.Integrators[0];
      companyInfo = {
        Id: firstIntegrator.CompanyId,
        Identifier: firstIntegrator.CompanyIdentifier,
        Name: firstIntegrator.CompanyName,
      };
    }

    setState((prev) => ({
      ...prev,
      invoiceIntegrator: invoiceIntegratorState,
      company: companyInfo,
      loadingStates: { ...prev.loadingStates, invoiceIntegrator: invoiceIntegratorLoading },
      errors: { ...prev.errors, invoiceIntegrator: invoiceIntegratorError ? 'E-Fatura bilgileri alınamadı' : null },
    }));
  }, [invoiceIntegratorData, invoiceIntegratorLoading, invoiceIntegratorError]);

  // Update state when ledger integrator changes
  useEffect(() => {
    // Parse ledger integrator data according to legacy logic
    // Legacy: if (response.data.Integrators.length > 0) -> entry: true
    let ledgerIntegratorState = { entry: false, integratorName: '', active: false };

    if (ledgerIntegratorData?.Integrators && ledgerIntegratorData.Integrators.length > 0) {
      const firstIntegrator = ledgerIntegratorData.Integrators[0];
      ledgerIntegratorState = {
        entry: true,
        integratorName: firstIntegrator.Name,
        active: firstIntegrator.IsActive,
      };
    }

    setState((prev) => ({
      ...prev,
      ledgerIntegrator: ledgerIntegratorState,
      loadingStates: { ...prev.loadingStates, ledgerIntegrator: ledgerIntegratorLoading },
      errors: { ...prev.errors, ledgerIntegrator: ledgerIntegratorError ? 'E-Defter bilgileri alınamadı' : null },
    }));
  }, [ledgerIntegratorData, ledgerIntegratorLoading, ledgerIntegratorError]);

  // Update state when specific findeks report data changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      findeksData: findeksReportData || null,
      selectedReportId,
      loadingStates: { ...prev.loadingStates, findeksData: findeksDataLoading },
      errors: { ...prev.errors, findeksData: findeksDataError ? 'Findeks raporu alınamadı' : null },
    }));
  }, [findeksReportData, findeksDataLoading, findeksDataError, selectedReportId]);

  // Action handlers
  const selectFindeksReport = useCallback(
    (reportId: string) => {
      setSelectedReportId(reportId);
      fetchFindeksReport({ reportId });
    },
    [fetchFindeksReport],
  );

  const refreshFinancialData = useCallback(() => {
    refetchFinancialData();
  }, [refetchFinancialData]);

  const refreshIntegratorData = useCallback(() => {
    refetchInvoiceIntegrator();
    refetchLedgerIntegrator();
    fetchCompanyDetail({ identifier });
  }, [fetchCompanyDetail, identifier, refetchInvoiceIntegrator, refetchLedgerIntegrator]);

  return {
    ...state,
    selectFindeksReport,
    refreshFinancialData,
    refreshIntegratorData,
  };
};
