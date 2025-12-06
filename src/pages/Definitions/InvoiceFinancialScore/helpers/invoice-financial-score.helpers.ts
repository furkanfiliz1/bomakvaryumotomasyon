/**
 * Invoice Financial Score Helper Functions
 * Business logic and utility functions for concentration metrics
 */

import type { ConcentrationMetric } from '../invoice-financial-score.types';

/**
 * Validates if a concentration metric has all required fields
 */
export function isValidMetric(metric: Partial<ConcentrationMetric>): boolean {
  return (
    typeof metric.minFinancialScore === 'number' &&
    metric.minFinancialScore >= 0 &&
    typeof metric.maxFinancialScore === 'number' &&
    metric.maxFinancialScore >= 0 &&
    typeof metric.minInvoiceScore === 'number' &&
    metric.minInvoiceScore >= 0
  );
}

/**
 * Checks if metric fields are empty
 */
export function isMetricEmpty(
  minFinancialScore: number | null,
  maxFinancialScore: number | null,
  minInvoiceScore: number | null,
): boolean {
  return minFinancialScore === null && maxFinancialScore === null && minInvoiceScore === null;
}

/**
 * Formats a metric for display (if needed for additional formatting)
 */
export function formatMetricForDisplay(metric: ConcentrationMetric): ConcentrationMetric {
  return {
    ...metric,
    // Additional formatting can be added here if needed
  };
}
