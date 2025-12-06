// Financial Settings Types based on reference project and API response

export interface FinancerDetailModel {
  Id: number;
  IsDirectApprove: boolean;
  IsEnableForTFS: boolean;
  IsEnableForKF: boolean;
  IsEnableForSpot: boolean;
  IsEnableForSpotWithoutInvoice: boolean;
  ProductTypes: number[];
  IsDigitalApproved: boolean | null;
  IsAutoReturnedBill: boolean | null;
  IsManuelChargedBill: boolean | null;
  IsManualPaymentApproved: boolean;
  IsDigitalConfirmationTextRequired: boolean;
  IsEnableForAF: boolean;
  IsEnableForRC: boolean;
  IsInvoiceBasedCalculation: boolean;
  IsVatRateVisible: boolean;
}

export interface FinancerRatioInfoDetail {
  Id?: number;
  CurrencyId: number;
  RatioValue: number;
  FinancerRatio: number;
  ProductType?: number;

  MinInvoiceDay?: number;
  MaxInvoiceDay?: number;
  SystemRatio?: number;
  MinAmount?: number | null;
  MaxAmount?: number | null;
}

export interface FinancerRatioModel {
  Id: number;
  RiskCalculationType: number;
  MinInvoiceDay: number;
  FinancerRatioInfoDetails: FinancerRatioInfoDetail[];
  InvoiceTypes: number[];
  IsAutoReturned: boolean;
  IsManuelCharged: boolean;
  IsAutoReturnedBill: boolean;
  IsManuelChargedBill: boolean;
  IsMultipleBill: boolean;
  IsWorkingDayRuleApply: boolean;
  MaxInvoiceDueDayForEasyFinancing: number | null;
  MaxInvoiceDay: number | null;
}

export interface FinancerRatioTFSModel {
  InvoiceTypes: number[];
  IsAutoReturned: boolean;
  IsIbanRequired: boolean;
  IsOnlyBankIbanAccepted: boolean;
}

export interface FinancerRatioSpotModel {
  InvoiceTypes: number[];
  IsAutoReturned: boolean;
  IsManuelCharged: boolean;
  MarginRatio: number | null;
  MinInvoiceDay: number | null;
  MaxInvoiceDueDayForSpotLoan: number | null;
  MaxInvoiceDayForSpotLoan: number | null;
  FinancerRatioInfoDetails?: FinancerRatioInfoDetail[];
}

export interface FinancerRatioSpotWithoutInvoiceModel {
  IsAutoReturned: boolean;
  IsManuelCharged: boolean;
  MaxInvoiceDueDayForSpotLoanWithoutInvoice: number | null;
  FinancerRatioInfoDetails?: FinancerRatioInfoDetail[];
}

export interface FinancerRatioCurrencyModel {
  CompanyId: number;
  CurrencyList: number[];
}

export interface FinancerRatioAFModel {
  IsAutoReturned: boolean;
  IsIbanRequired: boolean;
  IsOnlyBankIbanAccepted: boolean;
}

export interface FinancerRatioTTKModel {
  IsAutoReturned: boolean;
  IsManuelCharged: boolean;
  FinancerRatioInfoDetails?: FinancerRatioInfoDetail[];
}

export interface FinancerRatioRCModel {
  InvoiceTypes: number[];
  MarginRatio: number;
  IsAutoReturned: boolean;
  IsManuelCharged: boolean;
  MinInvoiceDay: number;
  MaxInvoiceDueDayForRevolvingCredit: number | null;
  MaxInvoiceDayForRevolvingCredit: number | null;
  FinancerRatioInfoDetails?: FinancerRatioInfoDetail[];
}

export interface FinancialSettingsResponse {
  FinancerDetailResponseModel: FinancerDetailModel;
  FinancerRatioModel: FinancerRatioModel;
  FinancerRatioTFSModel: FinancerRatioTFSModel;
  FinancerRatioSpotModel: FinancerRatioSpotModel;
  FinancerRatioSpotWithoutInvoiceModel: FinancerRatioSpotWithoutInvoiceModel;
  FinancerRatioTFSCurrencyModel: FinancerRatioCurrencyModel;
  FinancerRatioFFCurrencyModel: FinancerRatioCurrencyModel;
  FinancerRatioBillCurrencyModel: FinancerRatioCurrencyModel;
  FinancerRatioSpotCurrencyModel: FinancerRatioCurrencyModel;
  FinancerRatioSpotWithoutInvoiceCurrencyModel: FinancerRatioCurrencyModel;
  FinancerRatioAFCurrencyModel: FinancerRatioCurrencyModel;
  FinancerRatioTTKCurrencyModel: FinancerRatioCurrencyModel;
  FinancerRatioAFModel: FinancerRatioAFModel;
  FinancerRatioTTKModel: FinancerRatioTTKModel;
  FinancerRatioRCModel: FinancerRatioRCModel;
  FinancerRatioRCCurrencyModel: FinancerRatioCurrencyModel;
}

export interface FinancialSettingsSaveRequest {
  FinancerDetailModel: Partial<FinancerDetailModel>;
  FinancerRatioModel: Partial<FinancerRatioModel>;
  FinancerRatioTFSModel: Partial<FinancerRatioTFSModel>;
  FinancerRatioSpotModel: Partial<FinancerRatioSpotModel>;
  FinancerRatioSpotWithoutInvoiceModel: Partial<FinancerRatioSpotWithoutInvoiceModel>;
  FinancerRatioAFModel: Partial<FinancerRatioAFModel>;
  FinancerRatioTTKModel: Partial<FinancerRatioTTKModel>;
  FinancerRatioTFSCurrencyModel: {
    companyId: string;
    currencyList: number[];
    productType: number;
  };
  FinancerRatioSpotCurrencyModel: {
    companyId: string;
    currencyList: number[];
    productType: number;
  };
  FinancerRatioSpotWithoutInvoiceCurrencyModel: {
    companyId: string;
    currencyList: number[];
    productType: number;
  };
  FinancerRatioFFCurrencyModel: {
    companyId: string;
    currencyList: number[];
    productType: number;
  };
  FinancerRatioBillCurrencyModel: {
    companyId: string;
    currencyList: number[];
    productType: number;
  };
  FinancerRatioAFCurrencyModel: {
    companyId: string;
    currencyList: number[];
    productType: number;
  };
  FinancerRatioRCCurrencyModel: {
    companyId: string;
    currencyList: number[];
    productType: number;
  };
  FinancerRatioTTKCurrencyModel: {
    companyId: string;
    currencyList: number[];
    productType: number;
  };
  FinancerRatioRCModel: Partial<FinancerRatioRCModel>;
}

export interface ProductType {
  Value: string;
  Description: string;
}

export type FinancialSettingsSection =
  | 'finance-company-features'
  | 'invoice-finance-settings'
  | 'cheque-finance-settings'
  | 'supplier-finance-settings'
  | 'spot-loan-settings'
  | 'spot-loan-without-invoice-settings'
  | 'receiver-finance-settings'
  | 'commercial-loan-settings'
  | 'rotative-credit-settings';
