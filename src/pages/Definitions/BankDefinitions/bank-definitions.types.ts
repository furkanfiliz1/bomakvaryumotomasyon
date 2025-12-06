// Bank Types
export interface Bank {
  Id: number;
  Code: string;
  Name: string;
}

export interface CreateBankPayload {
  code: string;
  name: string;
}

// Bank Branch Types
export interface BankBranch {
  Id: number;
  Bank: string;
  Code: string;
  Name: string;
}

export interface BankBranchResponse {
  Items: BankBranch[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null;
}

export interface BankBranchQueryParams {
  bankId?: string;
  branchCode?: string;
  page?: number;
  pageSize?: number;
  isExport?: boolean;
}

export interface BankBranchFilters {
  bankId?: string;
  branchCode?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateBankBranchPayload {
  code: string;
  bankId: string;
  name: string;
}
