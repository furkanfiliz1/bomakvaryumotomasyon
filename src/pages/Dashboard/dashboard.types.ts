export interface DailyRegisteredCompaniesResponse {
  Count: number;
}

export interface DailyCompanyIntegrationCountResponse {
  Count: number;
}

export interface DailyCompanyActivityCountByAllowanceStatusResponse {
  Count: number;
}

export interface FinancingStats {
  Count: number;
  Amount: number;
  Percentage: number;
}

export interface DailyPaymentStatsResponse {
  Count: number;
  TotalAmount: number;
  SupplierFinancing: FinancingStats;
  SMBFinancing: FinancingStats;
}

export interface InvoiceFinancingStats {
  Count: number;
  TotalAmount: number;
  Percentage: number;
}

export interface DailyInvoiceStatsResponse {
  Count: number;
  TotalAmount: number;
  SupplierFinancing: InvoiceFinancingStats;
  SMBFinancing: InvoiceFinancingStats;
}
