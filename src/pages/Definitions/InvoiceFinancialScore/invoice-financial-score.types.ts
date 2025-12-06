/**
 * Invoice Financial Score Type Definitions
 * Matches legacy InvoiceFinancialScore.js data structures exactly
 */

/**
 * Concentration Metric item from API response
 */
export interface ConcentrationMetric {
  id: number;
  minFinancialScore: number;
  maxFinancialScore: number;
  minInvoiceScore: number;
  insertDatetime: string;
}

/**
 * API response for GET /concentrationmetrics
 */
export interface GetConcentrationMetricsResponse {
  data: ConcentrationMetric[] | null;
  extensionData: unknown;
  message: string | null;
  success: boolean;
}

/**
 * Create concentration metric payload (POST /concentrationmetrics)
 */
export interface CreateConcentrationMetricPayload {
  MinFinancialScore: number;
  MaxFinancialScore: number;
  MinInvoiceScore: number;
}

/**
 * Update concentration metric payload (PUT /concentrationmetrics/{id})
 */
export interface UpdateConcentrationMetricPayload {
  id: number;
  minFinancialScore: number;
  maxFinancialScore: number;
  minInvoiceScore: number;
  insertDatetime: string;
}

/**
 * Form data structure for create form
 */
export interface InvoiceFinancialScoreCreateFormData {
  minFinancialScore: number | null;
  maxFinancialScore: number | null;
  minInvoiceScore: number | null;
}

/**
 * Form data structure for editing existing metrics
 */
export interface InvoiceFinancialScoreEditFormData extends ConcentrationMetric {}
