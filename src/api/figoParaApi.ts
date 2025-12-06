import { baseApi as api } from './baseApi';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Invoice operations
    postInvoices: build.mutation<PostInvoicesApiResponse, PostInvoicesApiArg>({
      query: (queryArg) => ({ url: `/invoices`, method: 'POST', body: queryArg }),
    }),
    postInvoicesDocumentUpsert: build.mutation<PostInvoicesDocumentUpsertApiResponse, PostInvoicesDocumentUpsertApiArg>(
      {
        query: (queryArg) => ({ url: `/invoices/document/upsert`, method: 'POST', body: queryArg }),
      },
    ),

    // Session operations
    postSessions: build.mutation<PostSessionsApiResponse, PostSessionsApiArg>({
      query: (queryArg) => ({ url: `/sessions`, method: 'POST', body: queryArg }),
    }),
    postSessionsAuthenticationCode: build.mutation<
      PostSessionsAuthenticationCodeApiResponse,
      PostSessionsAuthenticationCodeApiArg
    >({
      query: (queryArg) => ({ url: `/sessions/authenticationCode`, method: 'POST', body: queryArg }),
    }),
    postSessionsGetSalt: build.mutation<PostSessionsGetSaltApiResponse, PostSessionsGetSaltApiArg>({
      query: (queryArg) => ({ url: `/sessions/getSalt`, method: 'POST', body: queryArg }),
    }),
    getSessionsVerify: build.query<GetSessionsVerifyApiResponse, GetSessionsVerifyApiArg>({
      query: () => ({ url: `/sessions/verify` }),
    }),
    getSessionsSystemRules: build.query<GetSessionsSystemRulesApiResponse, GetSessionsSystemRulesApiArg>({
      query: () => ({ url: `/sessions/systemRules` }),
    }),

    // User operations
    putUsersResetPassword: build.mutation<PutUsersResetPasswordApiResponse, PutUsersResetPasswordApiArg>({
      query: (queryArg) => ({ url: `/users/resetPassword`, method: 'PUT', body: queryArg }),
    }),
    putUsersUpdatePassword: build.mutation<PutUsersUpdatePasswordApiResponse, PutUsersUpdatePasswordApiArg>({
      query: (queryArg) => ({ url: `/users/updatePassword`, method: 'PUT', body: queryArg }),
    }),
    postUsersVerify: build.mutation<PostUsersVerifyApiResponse, PostUsersVerifyApiArg>({
      query: (queryArg) => ({ url: `/users/verify`, method: 'POST', body: queryArg }),
    }),
    postUsersValidateUserEmail: build.mutation<PostUsersValidateUserEmailApiResponse, PostUsersValidateUserEmailApiArg>(
      {
        query: (queryArg) => ({ url: `/users/validateUserEmail`, method: 'POST', body: queryArg }),
      },
    ),

    // Document operations
    getDocuments: build.query<GetDocumentsApiResponse, GetDocumentsApiArg>({
      query: (queryArg) => ({
        url: `/documents`,
        params: {
          CompanyId: queryArg.companyId,
          SenderCompanyId: queryArg.sendercompanyId,
          LabelId: queryArg.labelId,
          PeriodYear: queryArg.periodYear,
          PeriodQuarter: queryArg.periodQuarter,
          PeriodMonth: queryArg.periodMonth,
        },
      }),
    }),
    deleteDocumentsById: build.mutation<DeleteDocumentsByIdApiResponse, DeleteDocumentsByIdApiArg>({
      query: (queryArg) => ({ url: `/documents/${queryArg}`, method: 'DELETE' }),
    }),
    getDocumentsByIdView: build.query<GetDocumentsByIdViewApiResponse, GetDocumentsByIdViewApiArg>({
      query: (queryArg) => ({ url: `/documents/${queryArg}/view` }),
    }),
    getDocumentsByIdFile: build.query<GetDocumentsByIdFileApiResponse, GetDocumentsByIdFileApiArg>({
      query: (queryArg) => ({
        url: `/documents/${queryArg}/file`,
        responseHandler: (response) => response.blob(),
      }),
    }),
    postDocumentsFile: build.mutation<PostDocumentsFileApiResponse, PostDocumentsFileApiArg>({
      query: (queryArg) => {
        const { companyId, labelId, description, periodYear, periodQuarter, periodMonth, ...formData } = queryArg;
        return {
          url: `/documents/file`,
          method: 'POST',
          body: formData,
          params: {
            companyId,
            labelId,
            description,
            periodYear,
            periodQuarter,
            periodMonth,
          },
        };
      },
    }),

    // Label operations
    getLabels: build.query<GetLabelsApiResponse, GetLabelsApiArg>({
      query: () => ({ url: `/labels` }),
    }),

    // Order operations
    postOrders: build.mutation<PostOrdersApiResponse, PostOrdersApiArg>({
      query: (queryArg) => ({ url: `/orders`, method: 'POST', body: queryArg }),
    }),

    // Announcements
    getAnnouncementUserAnnouncements: build.query<
      GetAnnouncementUserAnnouncementsApiResponse,
      GetAnnouncementUserAnnouncementsApiArg
    >({
      query: () => ({ url: `/announcement/userAnnouncements` }),
    }),

    // Company wallet operations
    putCompanyWalletShowWalletMessageById: build.mutation<
      PutCompanyWalletShowWalletMessageByIdApiResponse,
      PutCompanyWalletShowWalletMessageByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/companyWallet/showWalletMessage/${queryArg.id}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),

    // Company operations
    getCompaniesByCompanyIdDefinitionsPaymentDays: build.query<
      GetCompaniesByCompanyIdDefinitionsPaymentDaysApiResponse,
      GetCompaniesByCompanyIdDefinitionsPaymentDaysApiArg
    >({
      query: (queryArg) => ({ url: `/companies/${queryArg}/definitions/paymentDays` }),
    }),

    // Common types/enums
    getProductTypes: build.query<ProductTypeOption[], void>({
      query: () => ({
        url: '/types?EnumName=ProductTypes',
      }),
    }),

    getCustomerManagerList: build.query<{ Items: CustomerManager[] }, void>({
      query: () => ({
        url: '/customerManagers',
        method: 'GET',
      }),
    }),

    getLeadingChannels: build.query<LeadingChannel[], void>({
      query: () => ({
        url: '/definitions/leadingChannels',
        method: 'GET',
      }),
    }),

    // Address endpoints
    getCountriesEnum: build.query<CountryOption[], void>({
      query: () => ({
        url: '/addresses/countriesEnum',
        method: 'GET',
      }),
    }),

    getCities: build.query<CityOption[], void>({
      query: () => ({
        url: '/addresses/cities',
        method: 'GET',
      }),
    }),

    getDistrictsByCityId: build.query<DistrictOption[], number>({
      query: (cityId) => ({
        url: `/addresses/${cityId}/districts`,
        method: 'GET',
      }),
    }),

    getLeadDocumentStatus: build.query<LeadDocumentStatusOption[], void>({
      query: () => ({
        url: '/types?EnumName=LeadDocumentStatus',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as figoParaApi };

export const {
  usePostInvoicesMutation,
  usePostInvoicesDocumentUpsertMutation,
  usePostSessionsMutation,
  usePostSessionsAuthenticationCodeMutation,
  usePostSessionsGetSaltMutation,
  useGetSessionsVerifyQuery,
  useLazyGetSessionsVerifyQuery,
  useGetSessionsSystemRulesQuery,
  useLazyGetSessionsSystemRulesQuery,
  usePutUsersResetPasswordMutation,
  usePutUsersUpdatePasswordMutation,
  usePostUsersVerifyMutation,
  usePostUsersValidateUserEmailMutation,
  useGetDocumentsQuery,
  useLazyGetDocumentsQuery,
  useDeleteDocumentsByIdMutation,
  useGetDocumentsByIdViewQuery,
  useLazyGetDocumentsByIdViewQuery,
  useGetDocumentsByIdFileQuery,
  useLazyGetDocumentsByIdFileQuery,
  usePostDocumentsFileMutation,
  useGetLabelsQuery,
  useLazyGetLabelsQuery,
  usePostOrdersMutation,
  useGetAnnouncementUserAnnouncementsQuery,
  useLazyGetAnnouncementUserAnnouncementsQuery,
  usePutCompanyWalletShowWalletMessageByIdMutation,
  useGetCompaniesByCompanyIdDefinitionsPaymentDaysQuery,
  useLazyGetCompaniesByCompanyIdDefinitionsPaymentDaysQuery,
  useGetProductTypesQuery,
  useGetCustomerManagerListQuery,
  useGetLeadingChannelsQuery,
  useGetCountriesEnumQuery,
  useGetCitiesQuery,
  useGetDistrictsByCityIdQuery,
  useLazyGetDistrictsByCityIdQuery,
  useGetLeadDocumentStatusQuery,
} = injectedRtkApi;

// ===== TYPE DEFINITIONS =====

// Common types for dropdowns and options
export interface ProductTypeOption {
  Description: string;
  Value: string;
}

export interface CustomerManager {
  Id: number;
  FullName: string;
}

export interface LeadingChannel {
  Id: number;
  Value: string;
  Rate: number | null;
  IsConsensus: boolean;
}

export interface CountryOption {
  Description: string;
  Value: string;
}

export interface CityOption {
  Id: number;
  Name: string;
}

export interface DistrictOption {
  Id: number;
  Name: string;
  CityId: number;
}

export interface LeadDocumentStatusOption {
  Description: string;
  Value: string;
}

// Basic enum types
export type CompanyVerify = 0 | 1 | 2 | 3;
export type ProductTypes = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type CompanyTypes = 0 | 1 | 2 | 3 | 4 | 5;
export type RadarCompanyActivityType = 'Receiver' | 'Sender' | 'Financer';
export type RadarCompanyVerify = 'None' | 'Waiting' | 'Verified' | 'Rejected';

export type RadarProductTypes =
  | 'ReceiverGuaranteed'
  | 'EasyFinancing'
  | 'FactoringBill'
  | 'FigoCard'
  | 'SpotLoan'
  | 'ReceivablesFinancing'
  | 'SpotLoanWithoutInvoice'
  | 'RevolvingCredit'
  | 'FigoScore'
  | 'InstallmentCommercialLoan';

// Language types
export type RadarLanguageResponseModel = {
  Id?: number;
  Name?: string | null;
  Code?: string | null;
  CultureCode?: string | null;
  IsDefault?: boolean;
  IsActive?: boolean;
  Image?: string | null;
};

export type RadarCompanyDetailProductResponseModel = {
  ProductType?: RadarProductTypes;
  ProductTypeDescription?: string | null;
};

// Authority types
export type AuthorityResponseModel = {
  id?: number;
  description?: string | null;
  CompanyTypes?: CompanyTypes[] | null;
};

// User response models
export type UserResponseModel = {
  Id?: number;
  Identifier?: string | null;
  CompanyId?: number;
  UserName?: string | null;
  Email?: string | null;
  Phone?: string | null;
  FirstName?: string | null;
  LastName?: string | null;
  Consent?: number | null;
  ConsentKvkk?: boolean;
  CommercialConsent?: boolean;
  IsLocked?: number | null;
  LockDate?: string;
  Type?: number | null;
  LastSessionDate?: string | null;
  InsertDateTime?: string | null;
  LastSessionIpAddress?: string | null;
  Authorities?: AuthorityResponseModel[] | null;
  FullName?: string | null;
  BirthDate?: string | null;
  LanguageId?: number | null;
  UserPositionId?: number | null;
  PasswordStatusType?: number | null;
  Verify?: CompanyVerify;
  SignedContract?: number | null;
  SignedScoreContract?: number | null;
  ProductTypes?: ProductTypes[] | null;
};

// Exception and base response types
export type ExceptionResponseModel = {
  Code?: string | null;
  Title?: string | null;
  FriendlyMessage?: string | null;
  ExceptionMessage?: string | null;
};

export type BaseResponseModel = {
  IsSuccess?: boolean;
};

export type ServiceResult = {
  message?: string | null;
  success?: boolean;
};

export type BaseResponseModelServiceResult = BaseResponseModel & {
  ServiceResult?: ServiceResult;
};

// Authentication types
export type LoginRequestModel = {
  AccessToken?: string | null;
  Identifier?: string | null;
  UserName?: string | null;
  Password?: string | null;
  IsPasswordEncrypted?: boolean;
  Password2?: string | null;
  Consent?: number | null;
  UserAgent?: string | null;
  BusinessPartnerCompanyId?: number | null;
  AuthenticationCode?: string | null;
  SignedContract?: number | null;
  consent?: number | null;
};

export type LoginUserResponseModel = {
  AccessToken?: string | null;
  RefreshToken?: string | null;
  Token?: string | null;
  User?: UserResponseModel;
  IsValidated?: boolean;
  IsTwoFactorAuthenticationIsActive?: boolean;
  UserContact?: string | null;
  Id?: number;
  UserName?: string | null;
  CompanyId?: number;
  CompanyName?: string | null;
  CompanyIdentifier?: string | null;
  CompanyType?: number;
  ActivityType?: number;
  FirstName?: string | null;
  MiddleName?: string | null;
  FamilyName?: string | null;
  MailAddress?: string | null;
  Phone?: string | null;
  Identifier?: string | null;
  Gender?: number | null;
  JobTitle?: string | null;
  JobPosition?: string | null;
  InsertDateTime?: string;
  LogInDateTime?: string | null;
  IpAddress?: string | null;
  UserAgent?: string | null;
  IsLockedOut?: boolean;
  Verify?: number;
  VerifiedDate?: string | null;
  CompanyVerify?: number;
  CompanyVerifiedDate?: string | null;
  Products?: ProductResponseModel[] | null;
  Authorities?: AuthorityResponseModel[] | null;
};

export type ProductResponseModel = {
  Id?: number;
  Name?: string | null;
  ProductType?: number;
  IsActive?: boolean;
};

export type LoginAuthenticationCodeRequestModel = {
  Identifier?: string | null;
  UserName?: string | null;
  AuthenticationCode?: string | null;
  IsPasswordEncrypted?: boolean;
  UserAgent?: string | null;
};

export type LoginAuthenticationCodeResponseModel = {
  AccessToken?: string | null;
  RefreshToken?: string | null;
  Token?: string | null;
  User?: UserResponseModel;
  IsValidated?: boolean;
  IsTwoFactorAuthenticationIsActive?: boolean;
  UserContact?: string | null;
  Id?: number;
  UserName?: string | null;
  CompanyId?: number;
  CompanyName?: string | null;
  CompanyIdentifier?: string | null;
  CompanyType?: number;
  ActivityType?: number;
  FirstName?: string | null;
  MiddleName?: string | null;
  FamilyName?: string | null;
  MailAddress?: string | null;
  Phone?: string | null;
  Identifier?: string | null;
  Gender?: number | null;
  JobTitle?: string | null;
  JobPosition?: string | null;
  InsertDateTime?: string;
  LogInDateTime?: string | null;
  IpAddress?: string | null;
  UserAgent?: string | null;
  IsLockedOut?: boolean;
  Verify?: number;
  VerifiedDate?: string | null;
  CompanyVerify?: number;
  CompanyVerifiedDate?: string | null;
  Products?: ProductResponseModel[] | null;
  Authorities?: AuthorityResponseModel[] | null;
};

// Document types
export type DocumentStatus = 0 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type DocumentResponseModel = {
  Id?: number;
  LabelId?: number;
  LabelDescription?: string | null;
  SenderCompanyId?: number;
  ReceiverCompanyId?: number | null;
  AllowanceId?: number | null;
  Name?: string | null;
  Type?: string | null;
  IsSigned?: number;
  InsertDatetime?: string | null;
  LabelName?: string | null;
  ReceiverCompanies?: number[] | null;
  ReceiverCompanyName?: string | null;
  SenderCompanyName?: string | null;
  Status?: DocumentStatus;
  Message?: string | null;
  PeriodYear?: number | null;
  PeriodMonth?: number | null;
  PeriodQuarter?: number | null;
  SenderIdentifier?: string | null;
  ExpireDate?: string | null;
  OriginalFileName?: string | null;
};

export type LabelResponseModel = {
  Id?: number;
  Name?: string | null;
  Description?: string | null;
  OrderIndex?: number;
};

// Allowance types
export type AllowanceStatus =
  | 0
  | 1
  | 2
  | 10
  | 20
  | 30
  | 40
  | 50
  | 60
  | 61
  | 70
  | 71
  | 72
  | 80
  | 800
  | 810
  | 830
  | 840
  | 850
  | 860
  | 870
  | 880
  | 890
  | 900
  | 910
  | 950;

export type AllowanceResponseModel = {
  Id?: number;
  SenderCompanyId?: number;
  ReceiverCompanyId?: number | null;
  AllowanceDueDate?: string | null;
  TotalPayableAmount?: number | null;
  PayableAmountCurrency?: string | null;
  TotalInvoiceCount?: number;
  TotalApprovedPayableAmount?: number | null;
  NotifyBuyer?: number;
  Type?: number | null;
  Status?: AllowanceStatus;
  StatusDescription?: string | null;
  StatusDate?: string | null;
  InsertDatetime?: string | null;
  UserId?: number;
  SenderCompanyName?: string | null;
  SenderCompanyIdentifier?: string | null;
  ReceiverCompanyName?: string | null;
  ReceiverCompanyIdentifier?: string | null;
  Kind?: number;
  AvgDueDayCount?: number | null;
  CompanyBankAccountId?: number | null;
  CompanyBankAccountIban?: string | null;
  IsQuarantee?: number | null;
  TransactionFee?: number | null;
  AllInvoiceIsPaymentApproved?: boolean;
  InterestRate?: number | null;
  AllowanceStatus?: AllowanceStatus;
  AllowanceStatusDescription?: string | null;
};

export type AllowanceListResponseModel = {
  Page?: number;
  PageSize?: number;
  SortType?: string | null;
  Sort?: string | null;
  TotalCount?: number;
  IsExport?: boolean;
  ExtensionData?: string | null;
  Allowances?: AllowanceResponseModel[] | null;
  TotalAllowancePayment?: number;
  TotalApprovedInvoiceCount?: number;
};

export type AllowancePaymentGetResponseModel = {
  Id?: number;
  AllowanceId?: number;
  Amount?: number;
  PaymentDate?: string | null;
  Status?: number;
  StatusDescription?: string | null;
  BankTransferOrderNumber?: string | null;
  PaymentType?: number;
  Description?: string | null;
};

export type AllowanceFinancerResponseModel = {
  Id?: number;
  AllowanceId?: number;
  FinancerCompanyId?: number;
  FinancerCompanyName?: string | null;
  FinancerCompanyIdentifier?: string | null;
  Status?: number;
  StatusDescription?: string | null;
  BidAmount?: number | null;
  InterestRate?: number | null;
  MarginRate?: number | null;
  InsertDatetime?: string | null;
};

export type AllowancePaymentRequestModel = {
  AllowanceId?: number;
  Amount?: number;
  PaymentDate?: string | null;
  PaymentType?: number;
  Description?: string | null;
  BankTransferOrderNumber?: string | null;
};

// Invoice types
export type InvoiceCreateRequestModel = {
  senderIdentifier?: string | null;
  receiverIdentifier?: string | null;
  invoiceNumber?: string | null;
  serialNumber?: string | null;
  sequenceNumber?: string | null;
  issueDate?: string | null;
  dueDate?: string | null;
  paymentDueDate?: string | null;
  payableAmount?: number | null;
  payableAmountCurrency?: string | null;
  remainingAmount?: number | null;
  approvedPayableAmount?: number | null;
  approvedPaymentDueDate?: string | null;
  type?: number | null;
  eInvoiceType?: number | null;
  hashCode?: string | null;
  uuid?: string | null;
  senderName?: string | null;
  receiverName?: string | null;
  payableAmountCurrencyCode?: string | null;
  invoiceTypeCode?: string | null;
  profileId?: string | null;
};

export type UpsertInvoiceDocumentRequestModel = {
  invoiceDocumentList?: InvoiceDocumentModel[] | null;
};

export type InvoiceDocumentModel = {
  invoiceNumber?: string | null;
  serialNumber?: string | null;
  sequenceNumber?: string | null;
  hash?: string | null;
  base64?: string | null;
};

export type AllowanceInvoiceReponseModel = {
  Id?: number;
  InvoiceId?: number;
  AllowanceId?: number;
  PayableAmount?: number;
  PayableAmountCurrency?: string | null;
  PaymentDueDate?: string | null;
  ApprovedPayableAmount?: number | null;
  ApprovedPaymentDueDate?: string | null;
  UserId?: number;
  InsertDatetime?: string | null;
  Status?: AllowanceStatus;
  StatusDescription?: string | null;
  InvoiceNumber?: string | null;
  SerialNumber?: string | null;
  SequenceNumber?: string | null;
  IsDeleted?: number;
};

export type BillGetDetailResponseModel = {
  Id?: number;
  BillNumber?: string | null;
  DrawerName?: string | null;
  DrawerIdentifier?: string | null;
  PayeeName?: string | null;
  PayeeIdentifier?: string | null;
  PayableAmount?: number;
  PayableAmountCurrency?: string | null;
  DueDate?: string | null;
  IssueDate?: string | null;
  PaymentDueDate?: string | null;
  RemainingAmount?: number | null;
  ApprovedPayableAmount?: number | null;
  ApprovedPaymentDueDate?: string | null;
  UserId?: number;
  InsertDatetime?: string | null;
  Status?: number;
  StatusDescription?: string | null;
};

export type InvoiceBaseResponseModel = {
  Id?: number;
  SenderIdentifier?: string | null;
  ReceiverIdentifier?: string | null;
  InvoiceNumber?: string | null;
  SerialNumber?: string | null;
  SequenceNumber?: string | null;
  IssueDate?: string | null;
  DueDate?: string | null;
  PaymentDueDate?: string | null;
  PayableAmount?: number | null;
  PayableAmountCurrency?: string | null;
  RemainingAmount?: number | null;
  ApprovedPayableAmount?: number | null;
  ApprovedPaymentDueDate?: string | null;
  Type?: number | null;
  EInvoiceType?: number | null;
  HashCode?: string | null;
  Uuid?: string | null;
  SenderName?: string | null;
  ReceiverName?: string | null;
  UserId?: number;
  InsertDatetime?: string | null;
  Status?: number;
  StatusDescription?: string | null;
};

export type AllowanceOrderResponseModel = {
  Id?: number;
  OrderNo?: string | null;
  SenderIdentifier?: string | null;
  ReceiverIdentifier?: string | null;
  PayableAmount?: number;
  PayableAmountCurrency?: string | null;
  CurrencyCode?: string | null;
  RemainingAmount?: number | null;
  ApprovedPayableAmount?: number | null;
  PaymentDueDate?: string | null;
  ApprovedPaymentDueDate?: string | null;
  IssueDate?: string | null;
  ProductType?: number;
  UserId?: number;
  InsertDatetime?: string | null;
  Status?: number;
  StatusDescription?: string | null;
  SenderName?: string | null;
  ReceiverName?: string | null;
};

export type OrderGetResponseModel = {
  Id?: number;
  OrderNo?: string | null;
  SenderIdentifier?: string | null;
  ReceiverIdentifier?: string | null;
  PayableAmount?: number;
  PayableAmountCurrency?: string | null;
  RemainingAmount?: number | null;
  ApprovedPayableAmount?: number | null;
  PaymentDueDate?: string | null;
  ApprovedPaymentDueDate?: string | null;
  IssueDate?: string | null;
  ProductType?: number;
  UserId?: number;
  InsertDatetime?: string | null;
  Status?: number;
  StatusDescription?: string | null;
  SenderName?: string | null;
  ReceiverName?: string | null;
};

// Company types
export type CompanyPaymentDaysResponseModel = {
  Id?: number;
  CompanyDefinitionId?: number;
  PaymentDay?: number;
  PaymentType?: number;
};

export type OfficialHolidaysResponseModel = {
  Id?: number;
  Date?: string;
  Description?: string | null;
};

// Announcements
export type AnnouncementSearchResponseModel = {
  Page?: number;
  PageSize?: number;
  SortType?: string | null;
  Sort?: string | null;
  TotalCount?: number;
  IsExport?: boolean;
  ExtensionData?: string | null;
  Items?: AnnouncementSearchItemResponseModel[] | null;
};

export type AnnouncementSearchItemResponseModel = {
  Id?: number;
  Title?: string | null;
  Content?: string | null;
  ReleaseDate?: string | null;
  IsNew?: boolean;
  Type?: number;
};

// Utility type for merged search
export type MergedSearch = {
  [key: string]: unknown;
};

// ===== API ARGUMENT AND RESPONSE TYPES =====

// Invoice API types
export type PostInvoicesApiResponse = BaseResponseModel;
export type PostInvoicesApiArg = InvoiceCreateRequestModel[];

export type PostInvoicesDocumentUpsertApiResponse = BaseResponseModelServiceResult;
export type PostInvoicesDocumentUpsertApiArg = UpsertInvoiceDocumentRequestModel;

// Session API types
export type PostSessionsApiResponse = LoginUserResponseModel;
export type PostSessionsApiArg = LoginRequestModel;

export type PostSessionsAuthenticationCodeApiResponse = LoginAuthenticationCodeResponseModel;
export type PostSessionsAuthenticationCodeApiArg = LoginAuthenticationCodeRequestModel;

export type PostSessionsGetSaltApiResponse = string;
export type PostSessionsGetSaltApiArg = LoginRequestModel;

export type GetSessionsVerifyApiResponse = UserResponseModel;
export type GetSessionsVerifyApiArg = void;

export type GetSessionsSystemRulesApiResponse = unknown; // Define according to actual response
export type GetSessionsSystemRulesApiArg = void;

// User API types
export type PutUsersResetPasswordApiResponse = BaseResponseModel & {
  SiteUrl?: string | null;
};
export type PutUsersResetPasswordApiArg = {
  UserName?: string | null;
  Identifier?: string | null;
  AuthenticationCode?: string | null;
  Password?: string | null;
  IsPasswordEncrypted?: boolean;
};

export type PutUsersUpdatePasswordApiResponse = BaseResponseModel & {
  SiteUrl?: string | null;
};
export type PutUsersUpdatePasswordApiArg = {
  UserName?: string | null;
  Identifier?: string | null;
  LastPassword?: string | null;
  NewPassword?: string | null;
  IsPasswordEncrypted?: boolean;
};

export type PostUsersVerifyApiResponse = BaseResponseModel & {
  SiteUrl?: string | null;
};
export type PostUsersVerifyApiArg = {
  Identifier?: string | null;
  AuthenticationCode?: string | null;
};

export type PostUsersValidateUserEmailApiResponse = BaseResponseModel;
export type PostUsersValidateUserEmailApiArg = {
  email?: string | null;
  accessToken?: string | null;
};

// Document API types
export type GetDocumentsApiResponse = DocumentResponseModel[];
export type GetDocumentsApiArg = {
  companyId?: number;
  sendercompanyId?: number;
  labelId?: number;
  periodYear?: number;
  periodQuarter?: number;
  periodMonth?: number;
};

export type DeleteDocumentsByIdApiResponse = unknown;
export type DeleteDocumentsByIdApiArg = number;

export type GetDocumentsByIdViewApiResponse = unknown;
export type GetDocumentsByIdViewApiArg = number;

export type GetDocumentsByIdFileApiResponse = Blob;
export type GetDocumentsByIdFileApiArg = number;

export type PostDocumentsFileApiResponse = DocumentResponseModel;
export type PostDocumentsFileApiArg = {
  companyId?: number;
  labelId?: number;
  description?: string;
  periodYear?: number;
  periodQuarter?: number;
  periodMonth?: number;
  file?: File;
};

// Label API types
export type GetLabelsApiResponse = LabelResponseModel[];
export type GetLabelsApiArg = number | void;

// Order API types
export type PostOrdersApiResponse = BaseResponseModel;
export type PostOrdersApiArg = AllowanceOrderResponseModel[];

// Announcement API types
export type GetAnnouncementUserAnnouncementsApiResponse = AnnouncementSearchResponseModel;
export type GetAnnouncementUserAnnouncementsApiArg = void;

// Company Wallet API types
export type PutCompanyWalletShowWalletMessageByIdApiResponse = BaseResponseModel;
export type PutCompanyWalletShowWalletMessageByIdApiArg = {
  id: number;
  companyShowWalletMessageRequestModel?: unknown;
  body?: unknown;
};

// Company API types
export type GetCompaniesByCompanyIdDefinitionsPaymentDaysApiResponse = CompanyPaymentDaysResponseModel[];
export type GetCompaniesByCompanyIdDefinitionsPaymentDaysApiArg = string | number;
