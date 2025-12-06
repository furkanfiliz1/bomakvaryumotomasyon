export interface CompanyCommentsFilters {
  onboardingStatusType?: string;
  userId?: string;
  ActivityType?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: string;
}

export interface CompanyComment {
  Id: number;
  CommentText: string;
  UserName: string;
  ActivityStatus: string;
  ActivityType: string;
  InsertDateTime: string;
  CompanyId: number;
  UserId: number;
}

export interface CompanyCommentsResponse {
  Items: CompanyComment[];
  TotalCount: number;
  Page: number;
  PageSize: number;
}

export interface AdminUser {
  Id: number;
  FullName: string;
  Email: string;
  IsActive: boolean;
}

export interface CompanyStatus {
  Value: string;
  Description: string;
}

export interface ActivityType {
  Value: string;
  Description: string;
}

export interface ActivityLogRequest {
  activityType: string;
  commentText: string;
  companyId: number;
}

export interface DropdownData {
  users: AdminUser[];
  companyStatuses: CompanyStatus[];
  activityTypes: ActivityType[];
}
