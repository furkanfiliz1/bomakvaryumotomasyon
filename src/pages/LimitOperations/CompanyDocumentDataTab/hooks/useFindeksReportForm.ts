/**
 * Findeks Report Form Hook
 * Following OperationPricing pattern for form management hooks
 * Matches legacy Findeks report dropdown functionality exactly
 */

import { useCallback } from 'react';
import type { FindeksReportOption } from '../company-document-data-tab.types';

interface UseFindeksReportFormProps {
  findeksReports: FindeksReportOption[];
  selectedReportId: string | null;
  onReportSelect: (reportId: string) => void;
}

/**
 * Simplified form hook for managing Findeks report selection
 * Handles dropdown options and selection logic without complex form validation
 */
export const useFindeksReportForm = ({
  findeksReports,
  selectedReportId,
  onReportSelect,
}: UseFindeksReportFormProps) => {
  // Transform reports for dropdown options (matches legacy dropdown format)
  const reportOptions = findeksReports.map((report) => ({
    id: report.Id,
    name: report.ReportDate, // Show date as display text
    value: String(report.Id), // Use ID as value
  }));

  // Handle report selection change
  const handleReportChange = useCallback(
    (reportId: string) => {
      onReportSelect(reportId);
    },
    [onReportSelect],
  );

  return {
    reportOptions,
    selectedReportId: selectedReportId || '',
    handleReportChange,
  };
};
