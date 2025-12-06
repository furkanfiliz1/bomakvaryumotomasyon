// Service Provider types for company integrator management
// Based on CompaniesDetailFileTransfer.js legacy component

export interface IntegratorType {
  Id: number;
  Identifier: string;
  Name: string;
  IsActive: boolean;
  IsBackground: boolean;
  Type: number;
  TypeDescription: string;
  CommissionRate: number | null;
  ParentId: number | null;
  TutorialVideoUrl?: string;
  Params?: IntegratorKey[];
  Keys?: IntegratorKey[]; // Keep for backward compatibility
  SubIntegrators?: IntegratorType[];
}

export interface IntegratorKey {
  Key: string;
  SubKey?: string | null;
  DataType: number;
  Description: string;
  InputDataType: number;
}

export interface CompanyIntegratorParam {
  Key: string;
  SubKey?: string | null;
  Value: string;
  DataType: number;
  Description: string;
}

export interface CompanyIntegrator {
  Id: number;
  Name: string;
  Identifier: string;
  Type: number; // Changed from enum to number to match API
  IntegratorId: number;
  CompanyIntegratorParams: CompanyIntegratorParam[];
  IsActive: boolean;
  CompanyId: number;
  CompanyName: string;
  CompanyIdentifier: string;
  IsReadyToBringInvoice: boolean;
  ConnectedTime: string;
  IntegratorMessage: string | null;
}

export interface NewIntegrator {
  CompanyId: number;
  IntegratorId: number;
  IsActive: boolean;
  Parameters: Array<{
    Key: string;
    SubKey?: string | null;
    Value: string;
  }>;
}

export interface UpdateIntegratorRequest {
  CompanyIntegratorId: number;
  CompanyId: number;
  IntegratorId: number;
  IsActive: number; // API expects 0 or 1
  Parameters: Array<{
    Key: string;
    SubKey?: string | null;
    Value: string;
  }>;
}

export interface UpdateCompanyIntegratorStatusRequest {
  Id: number;
  IsActive: number; // 0 for false, 1 for true
  CompanyId: number;
}

export interface NestedIntegratorOption {
  Id: number;
  Name: string;
}

// Integrator type enum matching API response
export enum IntegratorTypeEnum {
  Invoice = 1, // Fatura
  ELedger = 2, // Edefter
  FileService = 3, // Dosya Servisi
  WebService = 4, // Web Servis
  BankMovementService = 5, // Banka Hareket Servisi
  Bank = 6, // Banka
  BankAccount = 7, // Banka Hesabı
}

// Form data for parameter inputs
export interface IntegratorParametersForm {
  [key: string]: string; // Dynamic form based on integrator keys
}

// Form data for editing integrator
export interface EditIntegratorForm extends CompanyIntegrator {
  // Uses the same structure as CompanyIntegrator for editing
}

// Dropdown options
export interface IntegratorDropdownOption {
  Id: number;
  Name: string;
}

// API response types
export interface GetAllIntegratorsResponse {
  Integrators: CompanyIntegrator[];
  IsSuccess: boolean;
}
