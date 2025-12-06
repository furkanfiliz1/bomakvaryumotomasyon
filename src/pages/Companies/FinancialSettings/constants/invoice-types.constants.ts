/**
 * Invoice Types Constants
 * Based on reference project InvoiceTypes.js
 */

export const INVOICE_TYPE_OPTIONS = [
  { id: 0, label: 'Hepsi' },
  { id: 1, label: 'E-Fatura Temel' },
  { id: 2, label: 'E-Fatura Ticari' },
  { id: 4, label: 'E-Arşiv' },
];

export const INVOICE_TYPE_OPTIONS_TFS = [
  { id: 0, label: 'Hepsi' },
  { id: 1, label: 'E-Fatura Temel' },
  { id: 2, label: 'E-Fatura Ticari' },
  { id: 8, label: 'E-Fatura Müstahsil' },
  { id: 4, label: 'E-Arşiv' },
  { id: 16, label: 'Kağıt Fatura' },
];

/**
 * Get invoice type options based on product type
 */
export const getInvoiceTypeOptions = (productType: number) => {
  // TFS (Supplier Financing) = 2
  if (productType === 2) {
    return INVOICE_TYPE_OPTIONS_TFS;
  }
  // SME Financing, Spot, RC use standard options
  return INVOICE_TYPE_OPTIONS;
};
