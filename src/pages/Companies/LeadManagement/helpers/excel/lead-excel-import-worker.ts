/**
 * Lead Excel Import Worker
 * Following InvoiceOperations pattern for Excel processing
 * Web Worker for processing Excel files without blocking UI
 */

import * as XLSX from 'xlsx';
import { LeadAddManuelFormData } from '../../lead-management.types';
import { getExcelFieldKey } from './lead-excel-field-mappings';

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
  payload: (LeadAddManuelFormData & { id?: number })[];
}

export type ExcelImportEvent = ExcelImportStartedEvent | ExcelImportFinishedEvent | ExcelImportImportEvent;

// Create empty lead row
const createEmptyLeadRow = (): LeadAddManuelFormData & { id?: number } => ({
  taxNumber: '',
  title: '',
  firstName: '',
  lastName: '',
  phone: '',
  products: [],
  id: Math.random(),
});

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
    });

    const wsname = workbook.SheetNames[0];
    const ws = workbook.Sheets[wsname];
    const rows: (string | number)[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const result: (LeadAddManuelFormData & { id?: number })[] = [];

    // Limit to 500 rows max (including header) to prevent memory overflow
    // Process only first 501 rows (1 header + 500 data rows)
    const maxRows = Math.min(rows.length, 501);
    const rowsToProcess = rows.slice(0, maxRows);

    // Process each row (skip header row)
    rowsToProcess.forEach((row, index) => {
      if (index !== 0 && row.length !== 0) {
        const tmp = createEmptyLeadRow();

        // Process each cell in the row
        row.forEach((cellValue, cellIndex) => {
          const fieldKey = getExcelFieldKey(rowsToProcess[0][cellIndex]?.toString() || '');
          let value: string | number = cellValue;

          // Convert to string and trim
          value = String(value || '').trim();

          // Handle products field - split comma-separated values and convert to integers
          if (fieldKey === 'products') {
            const productsArray = value
              .split(',')
              .map((p) => p.trim())
              .filter((p) => p.length > 0)
              .map((p) => Number.parseInt(p, 10))
              .filter((p) => !Number.isNaN(p));
            tmp[fieldKey] = productsArray;
          } else {
            // Assign value to the appropriate field
            (tmp as unknown as Record<string, string>)[fieldKey] = value;
          }
        });

        // Add unique ID for table row identification
        tmp.id = Date.now() + index;
        result.push(tmp);
      }
    });

    // Notify completion with processed data
    self.postMessage({
      type: EXCEL_IMPORT_ACTION_TYPES.FINISHED,
      payload: result,
    });
  } catch (error) {
    console.error('Excel parsing error:', error);
    // Return empty array on error
    self.postMessage({
      type: EXCEL_IMPORT_ACTION_TYPES.FINISHED,
      payload: [],
    });
  }
};

export {};
