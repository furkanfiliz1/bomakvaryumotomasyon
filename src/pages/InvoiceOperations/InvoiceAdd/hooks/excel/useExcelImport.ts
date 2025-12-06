/**
 * Excel Import Custom Hook
 * Following OperationPricing pattern and Portal project structure
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  EXCEL_IMPORT_ACTION_TYPES,
  ExcelImportEvent,
  validateFileSize,
  processInvoicesForSubmission,
  calculateTotalInvoiceAmount,
  isAllColumnsSameValue,
} from '../../helpers/excel';
import { CreateInvoiceFormData } from '../../invoice-add.types';
import { useUser } from '@hooks';
import { useNotice } from '@components';

interface UseExcelImportProps {
  onImportComplete?: (invoices: CreateInvoiceFormData[]) => void;
}

interface UseExcelImportReturn {
  excelList: (CreateInvoiceFormData & { id?: number })[];
  isExcelParserLoading: boolean;
  totalInvoiceAmount: number;
  handleFileUpload: (file: File) => void;
  processImport: () => Promise<CreateInvoiceFormData[]>;
  clearAll: () => void;
  updateInvoiceAmount: (id: number, amount: number | undefined) => void;
  updateInvoicePaymentDueDate: (id: number, date: string, isAllSelected?: boolean) => void;
  deleteRow: (id: number) => void;
  validateBusinessRules: () => boolean;
}

/**
 * Custom hook for Excel import functionality
 * Following OperationPricing pattern with comprehensive state management
 */
export const useExcelImport = ({ onImportComplete }: UseExcelImportProps = {}): UseExcelImportReturn => {
  const notice = useNotice();
  const user = useUser();

  // Worker ref for Excel processing
  const excelWorkerRef = useRef<Worker>();

  // State management
  const [excelList, setExcelList] = useState<(CreateInvoiceFormData & { id?: number })[]>([]);
  const [isExcelParserLoading, setIsExcelParserLoading] = useState(false);

  // Initialize Web Worker
  useEffect(() => {
    const excelWorker = new Worker(new URL('../helpers/excel/invoice-excel-import-worker', import.meta.url), {
      type: 'module',
    });

    excelWorkerRef.current = excelWorker;

    excelWorker.onmessage = (e: MessageEvent<ExcelImportEvent>) => {
      const { type, payload } = e.data;

      switch (type) {
        case EXCEL_IMPORT_ACTION_TYPES.STARTED:
          setIsExcelParserLoading(true);
          break;
        case EXCEL_IMPORT_ACTION_TYPES.FINISHED:
          setIsExcelParserLoading(false);
          setExcelList(payload);
          break;
      }
    };

    return () => {
      excelWorker.terminate();
    };
  }, []);

  // File upload handler
  const handleFileUpload = useCallback(
    (file: File) => {
      // Validate file size following Portal pattern
      const fileSizeValidation = validateFileSize(file);
      if (!fileSizeValidation.isValid) {
        notice({
          variant: 'error',
          title: 'Error',
          message: fileSizeValidation.error || 'File size must be less than 15MB',
          buttonTitle: 'OK',
        });
        return;
      }

      excelWorkerRef.current?.postMessage({
        type: EXCEL_IMPORT_ACTION_TYPES.IMPORT,
        payload: file,
      });
    },
    [notice],
  );

  // Calculate total amount
  const totalInvoiceAmount = calculateTotalInvoiceAmount(excelList);

  // Update invoice amount
  const updateInvoiceAmount = useCallback((id: number, amount: number | undefined) => {
    setExcelList((prevInvoices) =>
      prevInvoices.map((invoice) => (invoice.id === id ? { ...invoice, payableAmount: amount || 0 } : invoice)),
    );
  }, []);

  // Update payment due date
  const updateInvoicePaymentDueDate = useCallback((id: number, date: string, isAllSelected = false) => {
    if (isAllSelected) {
      setExcelList((invoices) => invoices.map((invoice) => ({ ...invoice, paymentDueDate: date })));
    } else {
      setExcelList((invoices) =>
        invoices.map((invoice) => (invoice.id === id ? { ...invoice, paymentDueDate: date } : invoice)),
      );
    }
  }, []);

  // Delete invoice row
  const deleteRow = useCallback(
    (id: number) => {
      const newExcelList = excelList.filter((invoice) => invoice.id !== id);
      setExcelList(newExcelList);
    },
    [excelList],
  );

  // Validate business rules
  const validateBusinessRules = useCallback((): boolean => {
    if (!user?.Identifier) {
      notice({
        variant: 'error',
        title: 'Error',
        message: 'User not found',
        buttonTitle: 'OK',
      });
      return false;
    }

    if (!isAllColumnsSameValue(excelList as Record<string, unknown>[], 'receiverIdentifier', user.Identifier)) {
      notice({
        variant: 'error',
        title: 'Error',
        message: 'All invoices must have the same receiver identifier',
        buttonTitle: 'OK',
      });
      return false;
    }

    return true;
  }, [excelList, user, notice]);

  // Process import for submission
  const processImport = useCallback(async (): Promise<CreateInvoiceFormData[]> => {
    if (!validateBusinessRules()) {
      return [];
    }

    const processedInvoices = processInvoicesForSubmission(excelList);

    if (onImportComplete) {
      onImportComplete(processedInvoices);
    }

    return processedInvoices;
  }, [excelList, validateBusinessRules, onImportComplete]);

  // Clear all data
  const clearAll = useCallback(() => {
    setExcelList([]);
  }, []);

  return {
    excelList,
    isExcelParserLoading,
    totalInvoiceAmount,
    handleFileUpload,
    processImport,
    clearAll,
    updateInvoiceAmount,
    updateInvoicePaymentDueDate,
    deleteRow,
    validateBusinessRules,
  };
};
