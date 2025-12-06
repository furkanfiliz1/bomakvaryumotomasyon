// TTK Limit Query Types
export interface TtkLimitQueryFormValues {
  NationalIdentityNumber: string;
  TaxNumber: string;
  BirthDate: string;
  searchType: 'COMPANY' | 'PERSON';
  PhoneNumber: string;
  IsExistCustomer: string;
}

export interface TtkLimitQueryRequest {
  NationalIdentityNumber: string;
  TaxNumber: string;
  BirthDate: string;
  searchType: 'COMPANY' | 'PERSON';
  PhoneNumber: string;
  IsExistCustomer: boolean;
}

export interface TtkLimitQueryResponse {
  AvailableLimit?: number;
  Term?: number;
  CompanyName?: string;
}

export interface TtkLimitStats {
  CompanyQueryCount: number;
  TCKNQueryCount: number;
  TotalCount: number;
  VKNQueryCount: number;
}

export interface TtkLimitStatsResponse {
  Data: TtkLimitStats;
}

export type TtkSearchType = 'COMPANY' | 'PERSON';
export type CustomerType = 'YES' | 'NO';
