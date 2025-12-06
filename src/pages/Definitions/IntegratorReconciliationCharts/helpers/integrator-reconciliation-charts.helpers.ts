/**
 * Integrator Reconciliation Charts Business Logic Helpers
 * Pure functions for data transformation and validation
 * Following OperationPricing patterns
 */

import type { CreateIntegratorChartRequest, IntegratorChartFormData } from '../integrator-reconciliation-charts.types';

/**
 * Validate that percentFee and transactionFee are mutually exclusive
 * Matches legacy validation rule from IntegratorConsensusCharts
 */
export function validateFeeExclusivity(
  percentFee: number | null,
  transactionFee: number | null,
): { isValid: boolean; errorMessage?: string } {
  const hasPercentFee = percentFee !== null && percentFee !== undefined && percentFee > 0;
  const hasTransactionFee = transactionFee !== null && transactionFee !== undefined && transactionFee > 0;

  if (hasPercentFee && hasTransactionFee) {
    return {
      isValid: false,
      errorMessage: 'Her iki ücret türü birlikte girilemez. Lütfen sadece birini seçiniz.',
    };
  }

  return { isValid: true };
}

/**
 * Transform form data to API request format
 * Form now uses currency fields which return numbers directly
 */
export function transformFormDataToRequest(formData: IntegratorChartFormData): CreateIntegratorChartRequest {
  return {
    minAmount: formData.minAmount,
    maxAmount: formData.maxAmount,
    transactionFee: formData.transactionFee,
    percentFee: formData.percentFee,
  };
}

/**
 * Get empty form initial values
 * Matches legacy component initial state
 */
export function getEmptyFormValues(): IntegratorChartFormData {
  return {
    minAmount: null,
    maxAmount: null,
    transactionFee: null,
    percentFee: null,
  };
}
