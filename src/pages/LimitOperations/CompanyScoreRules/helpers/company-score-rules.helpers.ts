// Company Score Rules Helpers - Following OperationPricing helper pattern exactly

import type {
  CompanyScoreRule,
  FinanceCompany,
  FinanceCompanyRule,
  ProductTypeOption,
} from '../company-score-rules.types';
import { ProductTypesList } from '../company-score-rules.types';

/**
 * Get product type options for the tabs
 * Matches legacy selectedRulePageOptions exactly
 */
export const getProductTypeOptions = (): ProductTypeOption[] => [
  { id: ProductTypesList.SME_FINANCING, name: 'invoiceFinance', label: 'Fatura Finansmanı' },
  {
    id: ProductTypesList.SPOT_LOAN_FINANCING_WITHOUT_INVOICE,
    name: 'spotWithoutInvoice',
    label: 'Faturasız Spot Kredi',
  },
  {
    id: ProductTypesList.REVOLVING_CREDIT,
    name: 'rotatifCredit',
    label: 'Rotatif Kredi',
  },
];

/**
 * Check if partial allowance should be visible for the current product type
 * Matches legacy logic: hidden for SPOT_LOAN_FINANCING_WITHOUT_INVOICE
 */
export const isPartialAllowanceVisible = (productType: number): boolean => {
  return productType !== ProductTypesList.SPOT_LOAN_FINANCING_WITHOUT_INVOICE;
};

/**
 * Create default rule for new product types
 * Matches legacy rule initialization exactly
 */
export const createDefaultRule = (
  productType: number,
  senderIdentifier: string,
  senderCompanyId?: number,
): CompanyScoreRule => ({
  IsBidViewable: false,
  PartialAllowance: 0,
  SenderCancel: 0,
  NotifyBuyer: 0,
  SenderIdentifier: senderIdentifier,
  ProductType: productType,
  SenderInvoiceUpload: 0,
  IsSenderOrderAdd: false,
  AllowOnlySingleInvoice: false,
  SenderCompanyName: '',
  SenderCompanyId: senderCompanyId || 0,
});

/**
 * Merge finance companies with selected state
 * Matches legacy merge function exactly
 */
export const mergeFinanceCompaniesWithSelected = (
  financeList: FinanceCompany[],
  selectedFinancers: FinanceCompanyRule[],
): FinanceCompany[] => {
  return financeList.map((finance) => ({
    ...finance,
    selected: selectedFinancers.some((selected) => selected.FinancerCompanyId === finance.Id),
  }));
};

/**
 * Transform selected finance companies to API request format
 * Matches legacy onSaveFinanceList transformation
 */
export const transformFinanceCompaniesToRequest = (
  financeList: FinanceCompany[],
  ruleId: number,
): Array<{ CompanyDefinitionId: number; FinancerIdentifier: string }> => {
  return financeList
    .filter((finance) => finance.selected === true)
    .map((finance) => ({
      CompanyDefinitionId: ruleId,
      FinancerIdentifier: finance.Identifier,
    }));
};

/**
 * Get rule form validation messages based on product type
 * Matches legacy language keys exactly
 */
export const getRuleLabels = (productType: number) => ({
  partialDiscountRequest: `Kısmi İskonto Talebi_${productType}`,
  cancelRequest: `İptal Talebi_${productType}`,
  viewingOfferDetails: 'Teklif Detaylarını Görüntüleme',
  infoBuyer: `Bilgi Alıcı_${productType}`,
  cancelRequestInfo: `İptal Talebi Bilgisi_${productType}`,
  viewingOfferDetailsInfo: `Teklif Detayları Görüntüleme Bilgisi_${productType}`,
});

/**
 * Get finance companies alert message based on product type
 * Matches legacy financeCompaniesAlertMessage pattern exactly
 */
export const getFinanceCompaniesAlertMessage = (productType: number): string => {
  const messages: Record<number, string> = {
    // 3
    [ProductTypesList.SME_FINANCING]:
      'Bu alandan seçilen finansörler sadece Fatura Finansmanı için kullanılmaktadır. Çek Finansmanında kullanılacak finansörler, şirketler sayfasındaki ilgili finansörün ayarlarından yönetilmektedir.',
    // SPOT_LOAN_FINANCING (not in current constants but referenced in legacy)
    6: 'Bu alandan seçilen finansörler sadece Faturalı Spot Kredi için kullanılmaktadır. Çek Finansmanında kullanılacak finansörler, şirketler sayfasındaki ilgili finansörün ayarlarından yönetilmektedir.',
    // 8
    [ProductTypesList.SPOT_LOAN_FINANCING_WITHOUT_INVOICE]:
      'Bu alandan seçilen finansörler sadece Faturasız Spot Kredi için kullanılmaktadır. Çek Finansmanında kullanılacak finansörler, şirketler sayfasındaki ilgili finansörün ayarlarından yönetilmektedir.',
    // 9
    [ProductTypesList.REVOLVING_CREDIT]:
      'Bu alandan seçilen finansörler sadece Rotatif Kredi için kullanılmaktadır. Finans şirketi eklemek için kural oluşturunuz.',
  };

  return messages[productType] || `Finans şirketleri mesajı bulunamadı (ProductType: ${productType})`;
};

/**
 * Get the "no rule" message for finance companies section
 * Matches legacy behavior when no rule exists for the product type
 */
export const getNoRuleMessage = (): string => {
  // For other product types, show the generic message
  return 'Finans şirketi eklemek için kural oluşturunuz.';
};
