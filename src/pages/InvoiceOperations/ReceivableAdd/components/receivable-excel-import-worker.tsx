import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { IReceivableData } from '../components/AddExcelReceivableModal';
import { getExcelFieldKey } from '../helpers/receivable-add.helpers';

export const EXCEL_ACCEPTED_DATE = 'DD/MM/YYYY';
export const RESPONSE_DATE = 'YYYY-MM-DD';

export enum EXCELIMPORTACTIONTYPES {
  IMPORT = 'IMPORT',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
}

interface EXCELIMPORTIMPORTEVENT {
  type: EXCELIMPORTACTIONTYPES.IMPORT;
  payload: Blob;
}

interface EXCELIMPORTSTARTEDEVENT {
  type: EXCELIMPORTACTIONTYPES.STARTED;
  payload: null;
}

interface EXCELIMPORTFINISHEDEVENT {
  type: EXCELIMPORTACTIONTYPES.FINISHED;
  payload: IReceivableData[];
}

export type EXCELIMPORTEVENT = EXCELIMPORTSTARTEDEVENT | EXCELIMPORTFINISHEDEVENT | EXCELIMPORTIMPORTEVENT;

const emptyRow: IReceivableData = {
  id: 0,
  OrderNo: '',
  PayableAmount: undefined,
  ReceiverIdentifier: '',
  SenderIdentifier: '',
  PaymentDueDate: '',
  CurrencyCode: 'TRY',
  IssueDate: '',
  ReceiverName: '',
  SenderName: '',
};

const reader = new FileReader();

self.onmessage = (e: MessageEvent<EXCELIMPORTEVENT>) => {
  const { type, payload } = e.data;

  switch (type) {
    case EXCELIMPORTACTIONTYPES.IMPORT:
      reader.readAsBinaryString(payload);
      break;
    case EXCELIMPORTACTIONTYPES.FINISHED:
      console.log('finish');
      break;
    case EXCELIMPORTACTIONTYPES.STARTED:
      console.log('started');
  }
};

reader.onload = (evt) => {
  self.postMessage({ type: EXCELIMPORTACTIONTYPES.STARTED, payload: null });

  const data = evt?.target?.result;
  const workbook = XLSX.read(data, { type: 'binary', cellDates: true, dateNF: EXCEL_ACCEPTED_DATE });
  const wsname = workbook.SheetNames[0];
  const ws = workbook.Sheets[wsname];
  const rows: (string | Date | number)[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

  const result: IReceivableData[] = [];
  rows.forEach((row: (string | Date | number)[], index) => {
    if (index !== 0 && row.length !== 0) {
      let tmp = { ...emptyRow };
      tmp.id = crypto.getRandomValues(new Uint32Array(1))[0];

      row.forEach((cellValue, cellIndex) => {
        const fieldKey: string = getExcelFieldKey(rows[0][cellIndex] as string) || '';
        let value: string | number | Date | undefined = cellValue;

        if (fieldKey === 'IssueDate' || fieldKey === 'PaymentDueDate') {
          if (value instanceof Date) {
            value = dayjs(value).isValid() ? dayjs(value).add(3, 'hours').format(RESPONSE_DATE) : '';
          } else {
            value = String(value || '');
          }
        }

        if (fieldKey === 'PayableAmount') {
          value = Number(value) || 0;
        }

        if (fieldKey && typeof value !== 'undefined') {
          tmp = {
            ...tmp,
            [fieldKey]: value,
          };
        }
      });
      result.push(tmp);
    }
  });

  if (result) {
    self.postMessage({ type: EXCELIMPORTACTIONTYPES.FINISHED, payload: result });
  } else {
    self.postMessage({ type: EXCELIMPORTACTIONTYPES.FINISHED, payload: [] });
  }
};

export {};
