import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

/**
 * Excel field mapping for cheques
 * Referans: /Users/furkanfiliz/Desktop/Project/Figopara.Operation/src/helpers/excelParserHelper.js
 */
function convertChequeField(key: string): string {
  switch (key) {
    case 'Banka_Kodu':
      return 'bankEftCode';
    case 'Banka_Adı':
      return 'bankName';
    case 'Sube_kodu':
      return 'bankBranchEftCode';
    case 'Sube_Adi':
      return 'bankBranchName';
    case 'Cek_No':
      return 'no';
    case 'Cek_Hesap_No':
      return 'chequeAccountNo';
    case 'Kesideci_Yeri':
      return 'placeOfIssue';
    case 'Vergi_No':
      return 'drawerIdentifier';
    case 'Kesideci_Adı':
      return 'drawerName';
    case 'Cek_Vade_Tarihi':
      return 'paymentDueDate';
    case 'Doviz':
      return 'payableAmountCurrency';
    case 'Tutar':
      return 'payableAmount';
    case 'Borclu_Vergi_No':
      return 'endorserIdentifier';
    default:
      return 'nodef_cheque';
  }
}

/**
 * Excel parser for cheque files
 * OperationPricing pattern'ini takip eder
 */
export const parseChequeExcel = (excelFile: File): Promise<{ header: string[]; data: Record<string, unknown>[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });

        // Get first worksheet
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        // Convert array of arrays
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];

        const formattedData = { header: [] as string[], data: [] as Record<string, unknown>[] };

        data.forEach((excelArray: unknown[], index: number) => {
          if (excelArray.length > 0) {
            if (index === 0) {
              // Header row
              formattedData.header = excelArray as string[];
            } else {
              // Data rows
              const rowData: Record<string, unknown> = {};

              for (let i = 0; i < formattedData.header.length; i += 1) {
                const fieldValue = convertChequeField(formattedData.header[i]);
                const cellValue = excelArray[i];

                // Handle date fields
                if (fieldValue === 'paymentDueDate' && cellValue) {
                  if (cellValue instanceof Date) {
                    rowData[fieldValue] = dayjs(cellValue).format('YYYY-MM-DD');
                  } else {
                    rowData[fieldValue] = dayjs(String(cellValue)).format('YYYY-MM-DD');
                  }
                } else {
                  rowData[fieldValue] = cellValue === undefined ? null : cellValue;
                }
              }

              formattedData.data.push(rowData);
            }
          }
        });

        resolve(formattedData);
      } catch (error) {
        reject(new Error('Excel dosyası okunurken hata oluştu: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Dosya okuma hatası'));
    };

    reader.readAsBinaryString(excelFile);
  });
};

/**
 * File size checker
 * Referans projeden alınan helper
 */
export const checkFileSize = (file: File, maxSizeMB: number = 15): { isValid: boolean; error?: string } => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Dosya boyutu ${maxSizeMB}MB'dan büyük olamaz. Seçilen dosya: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    };
  }

  return { isValid: true };
};
