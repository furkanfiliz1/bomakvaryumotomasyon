import { useErrorListener } from '@hooks';
import { useEffect, useState } from 'react';
import {
  useGetCompaniesTransferListQuery,
  useGetCompanyDetailQuery,
  useGetCompanyDetailWithAllocationsQuery,
  useGetCompanyInvoiceTransferCheckQuery,
  useGetGroupCompanyQuery,
  useGetIntegratorHistoryQuery,
  useGetScoreCompanyByIdentifierQuery,
} from '../../limit-operations.api';
import type { InvoiceTransferCheck, ScoreCompanyByIdentifier } from '../../limit-operations.types';
import type { CompanyDetailData } from '../company-general-tab.types';

/**
 * Hook for fetching all company general tab data
 * Following OperationPricing pattern for comprehensive data fetching
 */
export const useCompanyGeneralTabData = (companyId: string) => {
  const [isTransferPossible, setIsTransferPossible] = useState(false);

  // Primary company data from Score API (basic info)
  const {
    data: companyDetailResponse,
    isLoading: companyLoading,
    error: companyError,
  } = useGetCompanyDetailQuery({ companyId: Number.parseInt(companyId, 10) });

  // Enhanced company data with product types, revenue, allocations
  const {
    data: companyDetailWithAllocationsResponse,
    isLoading: companyAllocationsLoading,
    error: companyAllocationsError,
  } = useGetCompanyDetailWithAllocationsQuery({ companyId: Number.parseInt(companyId, 10) });

  // Merge company detail data - use basic info for Identifier, detailed info for other fields
  // Identifier comes from basic API, detailed fields come from /details endpoint
  const companyIdentifier = companyDetailResponse?.Identifier || '';
  const companyDetail = {
    ...companyDetailResponse,
    ...companyDetailWithAllocationsResponse,
  } as CompanyDetailData;
  const companyAllocations = companyDetailWithAllocationsResponse;

  // Conditional queries - only run when we have company data
  const {
    data: transferListResponse,
    isLoading: transferLoading,
    error: transferError,
    refetch: refetchTransferList,
  } = useGetCompaniesTransferListQuery({ identifier: companyIdentifier }, { skip: !companyIdentifier });

  const {
    data: invoiceCheckResponse,
    isLoading: invoiceCheckLoading,
    error: invoiceCheckError,
    refetch: refetchInvoiceCheck,
  } = useGetCompanyInvoiceTransferCheckQuery({ identifier: companyIdentifier }, { skip: !companyIdentifier });

  const {
    data: scoreCompanyResponse,
    isLoading: scoreCompanyLoading,
    error: scoreCompanyError,
    refetch: refetchScoreCompany,
  } = useGetScoreCompanyByIdentifierQuery({ identifier: companyIdentifier }, { skip: !companyIdentifier });

  const {
    data: integratorHistoryResponse,
    isLoading: integratorHistoryLoading,
    error: integratorHistoryError,
    refetch: refetchIntegratorHistory,
  } = useGetIntegratorHistoryQuery({ companyId: Number.parseInt(companyId, 10) });

  const {
    data: groupCompaniesResponse,
    isLoading: groupCompaniesLoading,
    error: groupCompaniesError,
    refetch: refetchGroupCompanies,
  } = useGetGroupCompanyQuery({ companyId: Number.parseInt(companyId, 10) });

  // Extract data from responses
  const transferList = transferListResponse?.Items || [];

  // Based on your feedback, these APIs return direct data without .data wrapper
  const invoiceCheck = invoiceCheckResponse as unknown as InvoiceTransferCheck;
  const scoreCompany = scoreCompanyResponse as unknown as ScoreCompanyByIdentifier;

  // Check if API returns direct array or wrapped in Items
  const integratorHistory = Array.isArray(integratorHistoryResponse)
    ? integratorHistoryResponse
    : integratorHistoryResponse?.Items || [];
  const groupCompanies = groupCompaniesResponse?.Items || [];

  // Get the current integrator data (first item from transfer list)
  const currentIntegrator = transferList.length > 0 ? transferList[0] : null;

  // Error handling for all queries
  useErrorListener([
    companyError,
    companyAllocationsError,
    transferError,
    invoiceCheckError,
    scoreCompanyError,
    integratorHistoryError,
    groupCompaniesError,
  ]);

  // Effect to handle invoice check and transfer possibility
  useEffect(() => {
    if (invoiceCheck) {
      // If invoiceCheckResponse returns direct InvoiceTransferCheck object
      setIsTransferPossible(invoiceCheck.IsAvailable || false);
    }
  }, [invoiceCheck]);

  // Loading states
  const isLoading = companyLoading || companyAllocationsLoading || transferLoading;
  const isDataLoading =
    isLoading || invoiceCheckLoading || scoreCompanyLoading || integratorHistoryLoading || groupCompaniesLoading;

  // Error states
  const hasError =
    companyError ||
    companyAllocationsError ||
    transferError ||
    invoiceCheckError ||
    scoreCompanyError ||
    integratorHistoryError ||
    groupCompaniesError;

  // Combined refetch function to refresh all data
  const refetchAll = () => {
    refetchTransferList();
    refetchInvoiceCheck();
    refetchScoreCompany();
    refetchIntegratorHistory();
    refetchGroupCompanies();
  };

  return {
    // Data
    companyDetail,
    companyAllocations,
    transferList,
    currentIntegrator,
    invoiceCheck,
    scoreCompany,
    integratorHistory,
    groupCompanies,
    isTransferPossible,

    // Loading states
    isLoading,
    isDataLoading,
    companyLoading,
    companyAllocationsLoading,
    transferLoading,
    invoiceCheckLoading,
    scoreCompanyLoading,
    integratorHistoryLoading,
    groupCompaniesLoading,

    // Error states
    hasError,
    companyError,
    companyAllocationsError,
    transferError,
    invoiceCheckError,
    scoreCompanyError,
    integratorHistoryError,
    groupCompaniesError,

    // Refetch functions
    refetchAll,
    refetchTransferList,
    refetchInvoiceCheck,
    refetchScoreCompany,
    refetchIntegratorHistory,
    refetchGroupCompanies,
  };
};
