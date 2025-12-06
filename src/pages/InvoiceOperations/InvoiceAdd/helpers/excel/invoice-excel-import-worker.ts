/**
 * Excel Import Worker
 * Following Portal pattern and Operation.RD DDD structure
 * Web Worker for processing Excel files without blocking UI
 */

import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { getExcelFieldKey } from './invoice-excel-field-mappings';
import { createEmptyInvoiceRow, EXCEL_ACCEPTED_DATE, RESPONSE_DATE } from './invoice-excel.helpers';
import { CreateInvoiceFormData } from '../../invoice-add.types';

// Worker action types
export enum EXCEL_IMPORT_ACTION_TYPES {
  IMPORT = 'IMPORT',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
}

// Worker event interfaces
interface ExcelImportImportEvent {
  type: EXCEL_IMPORT_ACTION_TYPES.IMPORT;
  payload: Blob;
}

interface ExcelImportStartedEvent {
  type: EXCEL_IMPORT_ACTION_TYPES.STARTED;
  payload: null;
}

interface ExcelImportFinishedEvent {
  type: EXCEL_IMPORT_ACTION_TYPES.FINISHED;
  payload: (CreateInvoiceFormData & { id?: number })[];
}

export type ExcelImportEvent = ExcelImportStartedEvent | ExcelImportFinishedEvent | ExcelImportImportEvent;

// File reader instance
const reader = new FileReader();

// Worker message handler
self.onmessage = (e: MessageEvent<ExcelImportEvent>) => {
  const { type, payload } = e.data;

  switch (type) {
    case EXCEL_IMPORT_ACTION_TYPES.IMPORT:
      reader.readAsBinaryString(payload);
      break;
  }
};

// File reading handler
reader.onload = (evt) => {
  // Notify start of processing
  self.postMessage({ type: EXCEL_IMPORT_ACTION_TYPES.STARTED, payload: null });

  try {
    const data = evt?.target?.result;
    const workbook = XLSX.read(data, {
      type: 'binary',
      cellDates: true,
      dateNF: EXCEL_ACCEPTED_DATE,
    });

    const wsname = workbook.SheetNames[0];
    const ws = workbook.Sheets[wsname];
    const rows: (string | Date | number)[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const result: (CreateInvoiceFormData & { id?: number })[] = [];

    // Process each row (skip header row)
    rows.forEach((row, index) => {
      if (index !== 0 && row.length !== 0) {
        const tmp = createEmptyInvoiceRow();

        // Process each cell in the row
        row.forEach((cellValue, cellIndex) => {
          const fieldKey = getExcelFieldKey(rows[0][cellIndex]?.toString() || '');
          let value: string | number | Date | undefined = cellValue;

          // Handle date fields
          if (fieldKey === 'issueDate' || fieldKey === 'paymentDueDate') {
            if (value instanceof Date) {
              value = dayjs(value).isValid() ? dayjs(value).add(3, 'hours').format(RESPONSE_DATE) : '';
            } else {
              value = '';
            }
          }

          // Handle numeric fields
          if (fieldKey === 'payableAmount' || fieldKey === 'approvedPayableAmount' || fieldKey === 'taxFreeAmount') {
            value = Number(value || 0) || 0;
          }

          // Handle integer fields
          if (fieldKey === 'type' || fieldKey === 'eInvoiceType') {
            value = parseInt(String(value || 0), 10) || 0;
          }

          // Assign value to the appropriate field
          (tmp as Record<string, unknown>)[fieldKey] = value;
        });

        result.push(tmp);
      }
    });

    // Post-process results
    let processedResult = result;
    if (processedResult.length > 0) {
      processedResult = processedResult.map((invoice) => {
        // Apply business logic for different invoice types
        if (invoice.eInvoiceType === 2 && invoice.type === 1) {
          // e-fatura - keep as is
          return invoice;
        }

        // For other types, clear taxFreeAmount if not required
        return {
          ...invoice,
          taxFreeAmount: invoice.eInvoiceType === 2 && invoice.type === 1 ? invoice.taxFreeAmount : 0,
        };
      });
    }

    // Send processed data back to main thread
    self.postMessage({
      type: EXCEL_IMPORT_ACTION_TYPES.FINISHED,
      payload: processedResult,
    });
  } catch (error) {
    // Send empty result on error
    console.error('Excel processing error:', error);
    self.postMessage({
      type: EXCEL_IMPORT_ACTION_TYPES.FINISHED,
      payload: [],
    });
  }
};
