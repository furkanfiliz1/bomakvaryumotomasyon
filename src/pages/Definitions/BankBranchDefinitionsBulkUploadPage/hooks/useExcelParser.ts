/**
 * Hook for Excel file parsing for bank branches
 * Handles file upload, parsing, and validation
 */

import { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import type { BranchToAdd, ExcelParsedData, ExcelValidationError } from '../bank-branch-bulk-upload.types';
import { checkFileSize, convertBranchCode, validateExcelBranches } from '../helpers';

interface ExcelRow {
  subeKodu?: string | number;
  subeAdi?: string;
}

interface UseExcelParserReturn {
  excelData: ExcelParsedData;
  excelValidation: ExcelValidationError[];
  isParsingExcel: boolean;
  parseExcelFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  clearExcelData: () => void;
  removeExcelRow: (index: number) => void;
  clearAllExcelRows: () => void;
}

/**
 * Convert raw excel rows to branch format
 */
function convertRowsToBranches(dataRows: ExcelRow[]): BranchToAdd[] {
  return dataRows.map((row) => {
    const branchCode = row.subeKodu ? convertBranchCode(row.subeKodu) : '';

    return {
      code: branchCode,
      name: row.subeAdi ? String(row.subeAdi).trim() : '',
      originalCode: row.subeKodu ? String(row.subeKodu) : '',
    };
  });
}

function useExcelParser(): UseExcelParserReturn {
  const [excelData, setExcelData] = useState<ExcelParsedData>({
    header: [],
    data: [],
  });
  const [excelValidation, setExcelValidation] = useState<ExcelValidationError[]>([]);
  const [isParsingExcel, setIsParsingExcel] = useState(false);

  const parseExcelFile = useCallback(async (file: File): Promise<{ success: boolean; error?: string }> => {
    // Check file size
    const fileSizeCheck = checkFileSize(file);
    if (!fileSizeCheck.isValid) {
      return { success: false, error: fileSizeCheck.error };
    }

    setIsParsingExcel(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

      // Get first worksheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      // Convert to JSON
      const rawData = XLSX.utils.sheet_to_json<ExcelRow>(ws, { header: ['subeKodu', 'subeAdi'] });

      // Skip header row
      const dataRows = rawData.slice(1);

      // Convert to branches format
      const branches = convertRowsToBranches(dataRows);

      // Validate branches
      const validationErrors = validateExcelBranches(branches);

      setExcelData({
        header: ['subeKodu', 'subeAdi'],
        data: branches,
      });
      setExcelValidation(validationErrors);
      setIsParsingExcel(false);

      return { success: true };
    } catch {
      setIsParsingExcel(false);
      return { success: false, error: 'Excel dosyası okunamadı.' };
    }
  }, []);

  const clearExcelData = useCallback(() => {
    setExcelData({ header: [], data: [] });
    setExcelValidation([]);
  }, []);

  const removeExcelRow = useCallback((indexToRemove: number) => {
    setExcelData((prev) => {
      const newData = prev.data.filter((_, index) => index !== indexToRemove);
      return { ...prev, data: newData };
    });

    setExcelValidation((prev) => {
      return prev
        .filter((v) => v.index !== indexToRemove)
        .map((v) => ({
          ...v,
          index: v.index > indexToRemove ? v.index - 1 : v.index,
        }));
    });
  }, []);

  const clearAllExcelRows = useCallback(() => {
    setExcelData((prev) => ({ ...prev, data: [] }));
    setExcelValidation([]);
  }, []);

  return {
    excelData,
    excelValidation,
    isParsingExcel,
    parseExcelFile,
    clearExcelData,
    removeExcelRow,
    clearAllExcelRows,
  };
}

export default useExcelParser;
