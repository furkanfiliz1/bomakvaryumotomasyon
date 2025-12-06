export interface InvoiceScoreMetricDefinition {
  Id: number;
  Name: string;
  Type: number;
  Min: number | null;
  Max: number | null;
  Value: number;
  Percent: number;
}

export interface InvoiceScoreMetric {
  Type: number;
  Name: string;
  Definitions: InvoiceScoreMetricDefinition[];
}

export interface InvoiceScoreMetricFormData {
  Min: string;
  Max: string;
  Value: string;
  Percent: string;
}

export interface CreateInvoiceScoreMetricRequest {
  Name: string;
  Type: number;
  Min: number | null;
  Max: number | null;
  Value: number;
  Percent: number;
}

export interface UpdateInvoiceScoreMetricRequest {
  Id: number;
  Name: string;
  Type: number;
  Min: number | null;
  Max: number | null;
  Value: number;
  Percent: number;
}

export interface InvoiceScoreRatiosFilters {
  metricType?: number | null;
}
