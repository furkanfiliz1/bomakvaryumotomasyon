// Product types enum matching legacy implementation
export const ProductTypesList = {
  SPOT_LOAN_FINANCING_WITHOUT_INVOICE: 8,
  SPOT_LOAN_FINANCING: 6,
  CHEQUES_FINANCING: 4,
  SME_FINANCING: 3,
  SUPPLIER_FINANCING: 2,
  RECEIVER_FINANCING: 7,
  REVOLVING_CREDIT: 9,
  COMMERCIAL_LOAN: 11,
  INSTANT_BUSINESS_LOAN: 13,
} as const;

// Operation charge definition types (matching legacy implementation)
export const OperationChargeDefinitionTypes = {
  withIntegrator: 1, // Entegratörlü
  withoutIntegrator: 2, // Entegratörsüz
} as const;

// Charge calculation types (ÜcretlendirmeTipi - Yüzde/Birim)
export const ChargeCalculationTypes = {
  unit: 1, // Birim
  percentage: 2, // Yüzde
} as const;

export const FINANCIAL_TYPE_ACCOUNTS_RECEIVABLE = 1;
export const FINANCIAL_TYPE_ACCOUNTS_PAYABLE = 2;

export const OPERATION_CHARGE_DEFINITION_TYPE_FACTORING = 'F';
export const OPERATION_CHARGE_DEFINITION_TYPE_SUPPLY_CHAIN_FINANCING = 'T';
export const OPERATION_CHARGE_DEFINITION_TYPE_RECEIVABLES_PURCHASE = 'A';
export const OPERATION_CHARGE_DEFINITION_TYPE_INVOICE_DISCOUNTING = 'I';
export const OPERATION_CHARGE_DEFINITION_TYPE_BUYER_FINANCING = 'B';
export const OPERATION_CHARGE_DEFINITION_TYPE_SELLER_FINANCING = 'S';
export const OPERATION_CHARGE_DEFINITION_TYPE_SPOT_FINANCING = 'SP';
export const OPERATION_CHARGE_DEFINITION_TYPE_ROTATIVE_FINANCING = 'R';

// Transaction Types matching legacy component
export const TRANSACTION_TYPE_INVOICE_AMOUNT = '2';
export const TRANSACTION_TYPE_INVOICE_EXPIRY = '3';

// Payment Types
export const PAYMENT_TYPE_DEFAULT = 1;

// Charge Company Types
export const CHARGE_COMPANY_TYPE_DEFAULT = 1;

// Transaction type options matching legacy
export const TRANSACTION_TYPE_OPTIONS = [
  {
    label: 'Tutar', // Changed from 'Fatura Tutarı'
    value: TRANSACTION_TYPE_INVOICE_AMOUNT,
  },
  {
    label: 'Vade', // Changed from 'Fatura Vadesi'
    value: TRANSACTION_TYPE_INVOICE_EXPIRY,
  },
];

// Daily options
export const IS_DAILY_OPTIONS = [
  {
    label: 'Evet', // lang.companySetting.yes
    value: true,
  },
  {
    label: 'Hayır', // lang.companySetting.no
    value: false,
  },
];

// Charge Calculation Type options for amountType field (Ücretlendirme Tipi - Yüzde/Birim)
// This is for the fee calculation type dropdown (1=Unit/Birim, 2=Percentage/Yüzde)
export const OPERATION_CHARGE_DEFINITION_TYPE_OPTIONS = [
  {
    label: 'Yüzde (%)',
    value: ChargeCalculationTypes.percentage, // value = 2
  },
  {
    label: 'Birim',
    value: ChargeCalculationTypes.unit, // value = 1
  },
];

// Default values for new operation charge amount entry
export const DEFAULT_NEW_OPERATION_CHARGE_AMOUNT = {
  MinDueDay: 0,
  MaxDueDay: 0,
  MinAmount: 0,
  MaxAmount: 0,
  TransactionFee: 0,
  PercentFee: 0,
  MinScore: null,
  MaxScore: null,
  ProrationDays: null,
  amountType: ChargeCalculationTypes.percentage, // Default to Yüzde (2)
};

// Default values for operation charge form
export const DEFAULT_OPERATION_CHARGE_FORM = {
  ProductType: '',
  SenderIdentifier: '',
  ReceiverIdentifier: '',
  FinancerIdentifier: [], // Changed to empty array for multiple selection
  TransactionType: TRANSACTION_TYPE_INVOICE_AMOUNT,
  PaymentType: PAYMENT_TYPE_DEFAULT,
  OperationChargeDefinitionType: '',
  ChargeCompanyType: CHARGE_COMPANY_TYPE_DEFAULT,
  IsDaily: false,
};
