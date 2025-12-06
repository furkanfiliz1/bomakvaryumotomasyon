/**
 * useExport Hook
 * Reusable hook for exporting data to Excel files
 * Following OperationPricing pattern for consistent export functionality
 *
 * @example
 * ```tsx
 * const { handleExport, isExporting } = useExport({
 *   triggerQuery: triggerExportQuery,
 *   params: queryParams,
 *   fileName: 'gelir_gider_girisi',
 * });
 * ```
 */

import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { useCallback, useState } from 'react';
import { useNotice } from '../components/common/NoticeModal/NoticeService';

interface ExportResponse {
  ExtensionData?: string | null;
}

// Type for RTK Query trigger function
type QueryTrigger<TParams> = (
  params: TParams & { IsExport?: boolean },
) => Promise<{ data?: ExportResponse; error?: unknown }>;

interface UseExportOptions<TParams = Record<string, unknown>> {
  /**
   * The RTK Query trigger function from a lazy query hook
   * Pass the first element of the array returned by the lazy query hook
   * @example const [triggerExportQuery] = useLazyExportFinancialRecordsQuery();
   */
  triggerQuery: QueryTrigger<TParams>;
  /**
   * The current filter parameters to pass to the export query
   */
  params: TParams;
  /**
   * Base filename for the exported file (without date and extension)
   * Date and .xls extension will be appended automatically
   * @example 'gelir_gider_girisi' -> 'gelir_gider_girisi_2025-11-11.xls'
   */
  fileName: string;
  /**
   * Optional callback to execute after successful export
   */
  onSuccess?: () => void;
  /**
   * Optional callback to execute on export error
   */
  onError?: (error: unknown) => void;
}

interface UseExportReturn {
  /**
   * Function to trigger the export
   */
  handleExport: () => Promise<void>;
  /**
   * Whether the export is currently in progress
   */
  isExporting: boolean;
}

/**
 * Custom hook for exporting data to Excel files
 *
 * This hook provides a consistent way to export data across all list pages.
 * It handles the API call with IsExport: true, downloads the file using FileSaver,
 * and manages loading states and error handling.
 *
 * @param options - Export configuration options
 * @returns Export handler function and loading state
 */
export const useExport = <TParams = Record<string, unknown>>({
  triggerQuery,
  params,
  fileName,
  onSuccess,
  onError,
}: UseExportOptions<TParams>): UseExportReturn => {
  const notice = useNotice();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      // Add IsExport flag to params
      const exportParams = {
        ...params,
        IsExport: true,
      } as TParams & { IsExport: boolean };

      // Execute the query
      const result = await triggerQuery(exportParams);

      // Check for errors
      if (result.error) {
        throw result.error;
      }

      // Check for ExtensionData in response
      if (!result.data?.ExtensionData) {
        throw new Error('Export başarısız: Dosya verisi alınamadı');
      }

      // Generate filename with date
      const fileDate = dayjs().format('YYYY-MM-DD');
      const fullFileName = `${fileName}_${fileDate}.xls`;

      // Download the file using FileSaver
      FileSaver.saveAs(`data:xls;base64,${result.data.ExtensionData}`, fullFileName);

      // Call success callback if provided
      onSuccess?.();

      // Show success notification
      await notice({
        type: 'dialog',
        variant: 'success',
        title: 'Başarılı',
        message: 'Dosya başarıyla indirildi',
        buttonTitle: 'Tamam',
      });
    } catch (error) {
      console.error('Export failed:', error);

      // Call error callback if provided
      onError?.(error);

      // Show error notification
      await notice({
        type: 'dialog',
        variant: 'error',
        title: 'Hata',
        message: 'Export işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        buttonTitle: 'Tamam',
      });
    } finally {
      setIsExporting(false);
    }
  }, [triggerQuery, params, fileName, onSuccess, onError, notice]);

  return {
    handleExport,
    isExporting,
  };
};

export default useExport;
