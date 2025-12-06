import type { InvoiceBuyerAnalysisMetric, InvoiceBuyerAnalysisReceiver } from '../company-invoice-buyer-tab.types';

/**
 * Format invoice buyer data for display
 */
export const formatInvoiceBuyerData = (data: InvoiceBuyerAnalysisReceiver[]): InvoiceBuyerAnalysisReceiver[] => {
  return data.map((receiver) => ({
    ...receiver,
    // Ensure proper data format
    CompanyName: receiver.CompanyName || '-',
    Identifier: receiver.Identifier || '-',
    Metrics: receiver.Metrics || [],
  }));
};

/**
 * Get metric display value
 */
export const getMetricDisplayValue = (metric: InvoiceBuyerAnalysisMetric): string => {
  if (metric.Score === null || metric.Score === undefined) {
    return '-';
  }

  return String(metric.Score);
};

/**
 * Get receivers count display text
 */
export const getReceiversCountText = (count: number): string => {
  return `Toplam ${count} alıcı bilgisi`;
};

/**
 * Check if receiver has metrics
 */
export const hasMetrics = (receiver: InvoiceBuyerAnalysisReceiver): boolean => {
  return receiver.Metrics && receiver.Metrics.length > 0;
};

/**
 * Get empty state message for table
 */
export const getEmptyStateMessage = (): string => {
  return 'Fatura alıcı bilgisi bulunamadı';
};

/**
 * Get loading message
 */
export const getLoadingMessage = (): string => {
  return 'Fatura alıcı bilgileri yükleniyor...';
};

/**
 * Get error message
 */
export const getErrorMessage = (error?: string): string => {
  return error || 'Fatura alıcı bilgileri yüklenirken bir hata oluştu';
};
