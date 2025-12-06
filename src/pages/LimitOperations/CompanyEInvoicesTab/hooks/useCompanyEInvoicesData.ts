/**
 * Company E-Invoices Data Hook
 * Following OperationPricing pattern for data fetching
 * Combines company detail and e-invoices data fetching
 */

import { useErrorListener } from '@hooks';
import { useGetCompanyDetailQuery } from '../../limit-operations.api';
import { useGetCompanyEInvoicesQuery } from '../company-einvoices-tab.api';
import type { CompanyEInvoicesData } from '../company-einvoices-tab.types';

/**
 * Hook for fetching company e-invoices data
 * Matches legacy component behavior:
 * 1. Fetch company detail to get identifier
 * 2. Use identifier to fetch e-invoices data
 */
export const useCompanyEInvoicesData = (companyId: string): CompanyEInvoicesData => {
  // Get company detail to extract identifier (matches legacy companyServices.getCompanyById)
  const {
    data: companyDetailResponse,
    isLoading: companyLoading,
    error: companyError,
  } = useGetCompanyDetailQuery({ companyId: Number.parseInt(companyId, 10) }, { skip: !companyId });

  const companyIdentifier = companyDetailResponse?.Identifier;

  // Get e-invoices data using company identifier (matches legacy _getScoreInvoices)
  const {
    data: eInvoicesResponse,
    isLoading: eInvoicesLoading,
    error: eInvoicesError,
  } = useGetCompanyEInvoicesQuery({ companyIdentifier: companyIdentifier || '' }, { skip: !companyIdentifier });

  // Error handling for both queries
  useErrorListener([companyError, eInvoicesError]);

  // Combine loading states - show loading if either is loading
  const isLoading = companyLoading || eInvoicesLoading;

  // Combine error states
  const error = companyError || eInvoicesError;
  let errorMessage: string | null = null;
  if (error) {
    errorMessage = typeof error === 'string' ? error : 'Veri yüklenirken hata oluştu';
  }

  // Extract invoices data or return empty array
  const invoices = eInvoicesResponse?.currencies || [];

  return {
    invoices,
    isLoading,
    error: errorMessage,
  };
};
