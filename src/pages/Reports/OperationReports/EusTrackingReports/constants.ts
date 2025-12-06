import type { EusStatusColor, MonthYearOption } from './eus-tracking-reports.types';

// Month options matching legacy implementation exactly
export const MONTH_OPTIONS: MonthYearOption[] = [
  { value: '1', label: 'Ocak' },
  { value: '2', label: 'Şubat' },
  { value: '3', label: 'Mart' },
  { value: '4', label: 'Nisan' },
  { value: '5', label: 'Mayıs' },
  { value: '6', label: 'Haziran' },
  { value: '7', label: 'Temmuz' },
  { value: '8', label: 'Ağustos' },
  { value: '9', label: 'Eylül' },
  { value: '10', label: 'Ekim' },
  { value: '11', label: 'Kasım' },
  { value: '12', label: 'Aralık' },
];

// Year options matching legacy implementation exactly
export const YEAR_OPTIONS: MonthYearOption[] = [
  { value: '2022', label: '2022' },
  { value: '2023', label: '2023' },
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
];

// Status colors matching legacy returnColorRow method exactly
export const EUS_STATUS_COLORS: Record<number, EusStatusColor> = {
  1: 'black', // Aktif
  2: '#d1d422', // Uyarı (yellow)
  3: 'red', // Bloke
};

// Default color for unknown status
export const DEFAULT_STATUS_COLOR: EusStatusColor = 'black';

// Default pagination values
export const EUS_DEFAULT_PAGE_SIZE = 50;
export const EUS_DEFAULT_PAGE = 1;

// Default form values - matching legacy component initialization
export const DEFAULT_FORM_VALUES = {
  companyIdentifier: '',
  companyName: '',
  eusFormulaTypes: '',
  eusStatusTypes: '',
  companyStatus: '',
  month: String(new Date().getMonth()), // Current month (0-indexed, but legacy uses 1-indexed)
  year: String(new Date().getFullYear()),
};

// Table column identifiers
export const TABLE_COLUMNS = {
  SUPPLIER: 'supplier',
  DECREASE_TOTAL_AMOUNT: 'totalPaymentMonthlyDecreaseRatio',
  LAST_PERIOD_DECREASE: 'totalPaymentThreeMonthlyDecreaseRatio',
  INVOICE_INCREASE: 'invoiceMonthlyIncreaseRatio',
  LAST_PERIOD_INVOICE_INCREASE: 'invoiceThreeMonthlyIncreaseRatio',
  MUTUAL_TRADE_RATIO: 'senderAndReceiverRelation',
  REFUND_DISCOUNTED: 'senderAndReceiverReturnedAllowance',
  INTEGRATOR_OUTAGE: 'companyIntegratorCount',
  DETAIL: 'detail',
} as const;

// Navigation constants
export const COMPANY_DETAIL_PATH = '/figo-score/sirketler';

// API configuration
export const EUS_FORMULA_TYPES_ENUM = 'EUSFormulaTypes';
export const EUS_STATUS_TYPES_ENUM = 'EUSStatusTypes';
