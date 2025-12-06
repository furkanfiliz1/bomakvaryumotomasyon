import dayjs from 'dayjs';
import { isNil } from 'lodash';
import * as XLSX from 'xlsx';

/**
 * Excel sütun adlarını proje field adlarına çeviren mapping
 * Legacy constants.js'den alınan chequeHeaderFieldNames ile eşleşir
 */
const CHEQUE_FIELD_MAPPING: Record<string, string> = {
  'Banka Kodu': 'bankEftCode',
  'Banka Adı': 'bankName',
  'Şube Kodu': 'bankBranchEftCode',
  'Şube Adı': 'bankBranchName',
  'Çek No': 'no',
  'Çek Hesap No': 'chequeAccountNo',
  'Keşide Yeri': 'placeOfIssue',
  'Keşideci VKN': 'drawerIdentifier',
  'Keşideci Adı': 'drawerName',
  'Çek Vade Tarihi': 'paymentDueDate',
  Döviz: 'payableAmountCurrency',
  Tutar: 'payableAmount',
  'Borçlu VKN': 'endorserIdentifier',
};

/**
 * Tarih formatını kontrol eder ve doğru formata çevirir
 */
function formatDateField(value: unknown): string | null {
  if (isNil(value)) return null;

  // Excel tarih objesi ise
  if (value instanceof Date) {
    return dayjs(value).format('YYYY-MM-DD');
  }

  // String tarih ise (DD.MM.YYYY formatında olabilir)
  if (typeof value === 'string') {
    const parsedDate = dayjs(value, 'DD.MM.YYYY');
    if (parsedDate.isValid()) {
      return parsedDate.format('YYYY-MM-DD');
    }

    // Başka formatları da deneyelim
    const parsedDate2 = dayjs(value);
    if (parsedDate2.isValid()) {
      return parsedDate2.format('YYYY-MM-DD');
    }
  }

  return null;
}

/**
 * Sayısal değeri kontrol eder ve doğru formata çevirir
 */
function formatNumberField(value: unknown): number | null {
  if (isNil(value)) return null;

  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : Number(value);
  return isNaN(numValue) ? null : numValue;
}

export interface ExcelParserResult<T> {
  header: string[];
  data: T[];
  errors: string[];
}

/**
 * Excel dosyasını okur ve çek verilerine çevirir
 * Legacy excelParserHelper.js'den uyarlandı
 */
export const parseExcelFile = <T = Record<string, unknown>>(
  file: File,
  fieldMapping: Record<string, string> = CHEQUE_FIELD_MAPPING,
): Promise<ExcelParserResult<T>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryString = event.target?.result as string;

        // Excel dosyasını oku
        const workbook = XLSX.read(binaryString, {
          type: 'binary',
          cellDates: true,
          dateNF: 'DD.MM.YYYY', // Tarih formatı
        });

        // İlk worksheet'i al
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Veriyi JSON array olarak çevir
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false, // Formatlanmış değerleri al
          dateNF: 'DD.MM.YYYY',
        }) as unknown[][];

        const result: ExcelParserResult<T> = {
          header: [],
          data: [],
          errors: [],
        };

        // Veri işleme
        jsonData.forEach((row, rowIndex) => {
          if (row.length === 0) return; // Boş satırları atla

          if (rowIndex === 0) {
            // Header satırı
            result.header = row as string[];
          } else {
            // Veri satırı
            const rowData: Record<string, unknown> = {};

            for (let colIndex = 0; colIndex < result.header.length; colIndex++) {
              const excelColumnName = result.header[colIndex];
              const fieldName = fieldMapping[excelColumnName];
              const cellValue = row[colIndex];

              if (!fieldName || fieldName.startsWith('unknown_')) {
                // Bilinmeyen sütun, atla
                continue;
              }

              // Değer dönüşümü
              let processedValue: unknown = cellValue;

              // Tarih alanları
              if (fieldName === 'paymentDueDate' || fieldName === 'issueDate') {
                processedValue = formatDateField(cellValue);
              }
              // Sayısal alanlar
              else if (fieldName === 'payableAmount') {
                processedValue = formatNumberField(cellValue);
              }
              // String alanlar
              else {
                processedValue = cellValue === undefined ? null : String(cellValue);
              }

              rowData[fieldName] = processedValue;
            }

            result.data.push(rowData as T);
          }
        });

        resolve(result);
      } catch (error) {
        console.error('Excel parsing error:', error);
        reject(new Error('Excel dosyası okunurken hata oluştu: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Dosya okunamadı'));
    };

    reader.readAsBinaryString(file);
  });
};

/**
 * Çekler için özelleştirilmiş Excel parser
 */
export const parseChequeExcel = (file: File) => {
  return parseExcelFile(file, CHEQUE_FIELD_MAPPING);
};
