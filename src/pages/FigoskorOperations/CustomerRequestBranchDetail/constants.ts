import type { StepDefinition, StepStatus } from './customer-request-branch-detail.types';

// Step statuses matching legacy system exactly
export const STEP_STATUSES: Record<string, StepStatus> = {
  NOT_STARTED: 'Başlanmadı',
  STARTED: 'Başlandı',
  COMPLETED: 'Tamamlandı',
  OPTIONAL: 'Opsiyonel',
} as const;

// Session storage keys for parent data
export const SESSION_STORAGE_KEYS = {
  PARENT_CUSTOMER: 'parentCustomer',
  PARENT_REQUEST: 'parentRequest',
  PARENT_BRANCH: 'parentBranch',
} as const;

// Step definitions matching legacy system exactly
export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: '0',
    title: 'Firma Bilgileri',
    icon: 'user-01',
    status: 'Başlanmadı',
    componentName: 'CompanyInformation',
  },
  {
    id: '1',
    title: 'Ticari ve Operasyonel Bilgiler',
    icon: 'info-circle',
    status: 'Başlanmadı',
    componentName: 'CommercialOperationalInfo',
  },
  {
    id: '2',
    title: 'Sicil Bilgileri',
    icon: 'settings-01',
    status: 'Başlanmadı',
    componentName: 'RegistrationInformation',
  },
  {
    id: '3',
    title: 'Firma Tarihi',
    icon: 'clock',
    status: 'Başlanmadı',
    componentName: 'CompanyHistory',
  },
  {
    id: '4',
    title: 'Güncel Yönetim Kadrosu',
    icon: 'users-01',
    status: 'Başlanmadı',
    componentName: 'CurrentManagement',
  },
  {
    id: '5',
    title: 'Yapısal Bilgiler',
    icon: 'building-01',
    status: 'Başlanmadı',
    componentName: 'StructuralInformation',
  },
  {
    id: '6',
    title: 'Finansal Bilgiler',
    icon: 'calculator',
    status: 'Başlanmadı',
    componentName: 'FinancialInformation',
  },
  {
    id: '7',
    title: 'Grup Şirket Yapısı',
    icon: 'dataflow-03',
    status: 'Opsiyonel',
    componentName: 'GroupCompanyStructure',
  },
  {
    id: '8',
    title: 'Özet ve Onay',
    icon: 'check',
    status: 'Başlanmadı',
    componentName: 'SummaryApproval',
  },
];
