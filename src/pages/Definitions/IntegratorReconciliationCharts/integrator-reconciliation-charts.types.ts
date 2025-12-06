/**
 * Integrator Reconciliation Charts Types
 * Matches legacy IntegratorConsensusCharts data structures
 */

export interface IntegratorChart {
  Id: number;
  MinAmount: number;
  MaxAmount: number;
  TransactionFee: number;
  PercentFee: number;
}

export interface IntegratorChartsResponse {
  Items: IntegratorChart[];
  IsSuccess: boolean;
}

export interface CreateIntegratorChartRequest {
  minAmount: number | null;
  maxAmount: number | null;
  transactionFee: number | null;
  percentFee: number | null;
}

export interface IntegratorChartFormData {
  minAmount: number | null;
  maxAmount: number | null;
  transactionFee: number | null;
  percentFee: number | null;
}
