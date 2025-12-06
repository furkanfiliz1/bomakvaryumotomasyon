import dayjs from 'dayjs';
import FileSaver from 'file-saver';

/**
 * Download company codes Excel export
 * @param base64Data - Base64 encoded Excel file data
 */
export const downloadCompanyCodesExcel = (base64Data: string): void => {
  const language = localStorage.getItem('language') || 'en';
  const fileInitial = language === 'tr' ? 'şirket_kodları' : 'company_codes';
  const fileDate = dayjs().format('YYYY-MM-DD');
  const fileName = `${fileInitial}_${fileDate}.xls`;

  FileSaver.saveAs(`data:application/vnd.ms-excel;base64,${base64Data}`, fileName);
};

/**
 * Format company code data for API submission
 * @param formData - Form data from user input
 * @param companyIdentifier - Receiver company identifier
 * @returns Formatted data for API
 */
export const formatCompanyCodeForSubmit = (
  formData: {
    Code: string;
    SenderIdentifier: string;
    FinancerCompanyId?: number | null;
    CurrencyId?: number | null;
  },
  companyIdentifier: string,
) => {
  return {
    code: formData.Code,
    SenderIdentifier: formData.SenderIdentifier,
    ReceiverIdentifier: companyIdentifier,
    FinancerCompanyId: formData.FinancerCompanyId ? Number(formData.FinancerCompanyId) : undefined,
    CurrencyId: formData.CurrencyId ? Number(formData.CurrencyId) : null,
  };
};

/**
 * Get currency value from form data, handling legacy CurrencyCode field
 * @param values - Form values
 * @param currencies - Available currencies list
 * @returns CurrencyId or default value
 */
export const getCurrencyValue = (
  values: { CurrencyCode?: string | null; CurrencyId?: number | null },
  currencies: Array<{ Id: number; Code: string }>,
): number | null => {
  if (values.CurrencyCode) {
    const findCurrency = currencies.find((r) => r.Code === values.CurrencyCode);
    return findCurrency?.Id || null;
  }
  return values.CurrencyId || null;
};
