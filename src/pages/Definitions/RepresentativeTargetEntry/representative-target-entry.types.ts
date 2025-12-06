export interface RepresentativeTargetItem {
  Id: number;
  FirstName: string;
  LastName: string;
  TargetTypeName: string;
  Month: number;
  Year: number;
  Amount: number;
}

export interface RepresentativeTargetResponse {
  Items: RepresentativeTargetItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null;
}

export interface RepresentativeTargetQueryParams {
  month?: string;
  year?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
  isExport?: boolean;
}

export interface RepresentativeTargetFilters {
  month?: string;
  year?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateRepresentativeTargetPayload {
  month: string;
  year: string;
  userId: string;
  targetTypeId: string;
  amount: number;
}

export interface UserTargetType {
  Id: number;
  Name: string;
}

export interface CustomerManager {
  Id: number;
  FullName: string;
}

// Month options for dropdown
export interface MonthOption {
  value: string;
  label: string;
}

// Year options for dropdown
export interface YearOption {
  value: string;
  label: string;
}
