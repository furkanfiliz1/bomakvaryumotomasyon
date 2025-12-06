import { ServerSideQueryArgs } from 'src/hooks/useServerSideQuery';

// Main data interface matching legacy API response
export interface TransactionFeeScale {
  Id: number;
  MinAmount: number | null;
  MaxAmount: number | null;
  TransactionFee: number | null;
  PercentFee: number | null;
  SysLastUpdate: string;
}

// Form data interface
export interface TransactionFeeScaleFormData {
  minAmount: number | null;
  maxAmount: number | null;
  transactionFee: number | null;
  percentFee: number | null;
}

// API request/response types
export interface CreateTransactionFeeScaleRequest {
  minAmount: number | null;
  maxAmount: number | null;
  transactionFee: number | null;
  percentFee: number | null;
}

export interface UpdateTransactionFeeScaleRequest {
  Id: number;
  minAmount: number | null;
  maxAmount: number | null;
  transactionFee: number | null;
  percentFee: number | null;
}

// Query parameters - no filters needed for transaction fee scales (simple list)
export interface TransactionFeeScaleFilters extends ServerSideQueryArgs {
  // No additional filters - legacy has no search/filter functionality
}
