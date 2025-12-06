/**
 * Integrators Types
 * TypeScript interfaces matching legacy API exactly
 * API Base: https://apitest.figopara.com
 */

/**
 * Integrator Parameter
 * Used in Params array for each integrator
 */
export interface IntegratorParam {
  Id?: number;
  Key: string;
  SubKey: string | null;
  Description: string;
  DataType: number | string;
  DataTypeDescription: string;
  OrderIndex: number;
  InputDataType: number | string;
  InputDataTypeDescription: string;
  Detail: string;
}

/**
 * Sub Integrator - nested structure
 * Each integrator can have SubIntegrators recursively
 */
export interface SubIntegrator {
  Id: number;
  Identifier: string;
  Name: string;
  IsActive: boolean;
  IsBackground: boolean;
  Type: number;
  TypeDescription: string;
  CommissionRate: number | null;
  ParentId: number | null;
  TutorialVideoUrl?: string | null;
  Params?: IntegratorParam[];
  SubIntegrators: SubIntegrator[];
}

/**
 * Main Integrator from /integrators/nestedIntegrators
 */
export interface Integrator {
  Id: number;
  Identifier: string;
  Name: string;
  IsActive: boolean;
  IsBackground: boolean;
  Type: number;
  TypeDescription: string;
  CommissionRate: number | null;
  ParentId: number | null;
  TutorialVideoUrl?: string | null;
  Params?: IntegratorParam[];
  SubIntegrators: SubIntegrator[];
}

/**
 * Integrator Detail from GET /integrators/{id}
 */
export interface IntegratorDetail {
  Id: number;
  Identifier: string;
  Name: string;
  IsActive: boolean;
  IsBackground: boolean;
  Type: number;
  TypeDescription: string;
  CommissionRate: number | null;
  ParentId: number | null;
  TutorialVideoUrl: string | null;
  Params: IntegratorParam[];
  SubIntegrators: SubIntegrator[] | null;
}

/**
 * Integration Type option from /types?EnumName=IntegrationType
 */
export interface IntegrationTypeOption {
  Description: string;
  Value: string;
}

/**
 * Data Type option from /types?EnumName=DataType
 */
export interface DataTypeOption {
  Description: string;
  Value: string;
}

/**
 * Input Data Type option from /types?EnumName=InputDataType
 */
export interface InputDataTypeOption {
  Description: string;
  Value: string;
}

/**
 * Create Integrator Request - POST /integrators
 */
export interface CreateIntegratorRequest {
  Identifier: string;
  Name: string;
  IsActive: boolean;
  IsBackground: boolean;
  Type: string;
  ParentId?: string | null;
  CommissionRate?: string | null;
  Params: IntegratorParam[];
}

/**
 * Update Integrator Request - PUT /integrators/{id}
 */
export interface UpdateIntegratorRequest {
  Id: number;
  Identifier: string;
  Name: string;
  IsActive: boolean;
  IsBackground: boolean;
  Type: number;
  TypeDescription?: string;
  CommissionRate?: number | null;
  ParentId?: string | number | null;
  TutorialVideoUrl?: string | null;
  Params: IntegratorParam[];
  SubIntegrators?: SubIntegrator[] | null;
}

/**
 * Update Commission Rate Request - PUT /integrators/{id}/commissionRate
 */
export interface UpdateCommissionRateRequest {
  Id: number;
  CommissionRate: string;
}

/**
 * Integrator Template from GET /integrators/templates/{id}/{languageId}
 */
export interface IntegratorTemplate {
  Id: number;
  IntegratorId: number;
  LanguageId: number;
  Name: string;
  FileContent: string; // base64
  Version: number;
  IsDeleted: boolean;
}

/**
 * Form data for add/edit integrator modal
 */
export interface IntegratorFormData {
  Identifier: string;
  Name: string;
  IsActive?: boolean;
  IsBackground?: boolean;
  Type: string | number;
  ParentId?: string | number;
}

/**
 * Form data for add param
 */
export interface ParamFormData {
  Key: string;
  SubKey: string;
  Description: string;
  DataType?: string | number;
  InputDataType?: string | number;
  OrderIndex: string;
  Detail: string;
}

/**
 * Flattened integrator for parent dropdown
 */
export interface FlattenedIntegrator {
  Id: number;
  Name: string;
}
