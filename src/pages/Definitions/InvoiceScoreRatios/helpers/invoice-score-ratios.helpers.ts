import type { InvoiceScoreMetric } from '../invoice-score-ratios.types';

/**
 * Find a specific metric type from the metrics list
 */
export const findMetricByType = (metrics: InvoiceScoreMetric[], type: number): InvoiceScoreMetric | undefined => {
  return metrics.find((metric) => metric.Type === type);
};

/**
 * Convert form string values to proper numeric types for API
 */
export const parseMetricFormData = (data: {
  Min: string;
  Max: string;
  Value: string;
  Percent: string;
}): {
  Min: number | null;
  Max: number | null;
  Value: number;
  Percent: number;
} => {
  return {
    Min: data.Min === '' || data.Min === null ? null : Number.parseFloat(data.Min),
    Max: data.Max === '' || data.Max === null ? null : Number.parseFloat(data.Max),
    Value: Number.parseFloat(data.Value),
    Percent: Number.parseFloat(data.Percent),
  };
};

/**
 * Format number for display (handle null values)
 */
export const formatMetricValue = (value: number | null): string => {
  if (value === null) return '-';
  return String(value);
};

/**
 * Sort metrics by name alphabetically
 */
export const sortMetricsByName = (metrics: InvoiceScoreMetric[]): InvoiceScoreMetric[] => {
  return [...metrics].sort((a, b) => a.Name.localeCompare(b.Name));
};

/**
 * Check if a metric type has definitions
 */
export const hasDefinitions = (metric: InvoiceScoreMetric | undefined): boolean => {
  return !!metric && metric.Definitions.length > 0;
};
