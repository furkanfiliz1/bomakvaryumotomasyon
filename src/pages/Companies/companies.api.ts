import { baseApi, scoreBaseURL } from '@api';
import { BaseResponseModel } from '@types';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import { FinancialSettingsResponse, FinancialSettingsSaveRequest } from './FinancialSettings/financial-settings.types';
import {
  ActivityType,
  ApplicationSubChannel,
  AuthorityProject,
  CallerDataResponse,
  City,
  Company,
  CompanyCode,
  CompanyCodeCreateRequest,
  CompanyCodeFilters,
  CompanyCodeUpdateRequest,
  CompanyCreateRequest,
  CompanyCustomerManagerFilters,
  CompanyCustomerManagerResponse,
  CompanyCustomerManagersUpdateRequest,
  CompanyDetail,
  CompanyDetailUpdateRequest,
  CompanyFilters,
  CompanyKind,
  CompanyLimitation,
  CompanyLimitationUpdateRequest,
  CompanyRole,
  CompanyRule,
  CompanyRuleFilters,
  CompanyRuleFinancer,
  CompanyRuleFinancerUpdateRequest,
  CompanySector,
  CompanySizeType,
  CompanyStatusUpdateRequest,
  CompanySystemSettings,
  CompanySystemSettingsUpdateRequest,
  CompanyType,
  CompanyUser,
  CreateUserRequest,
  Currency,
  CustomerAcquisitionDetailResponse,
  District,
  GroupCompany,
  Integrator,
  LeadCallResultStatus,
  LeadingChannel,
  NotificationType,
  NotificationUpdateRequest,
  OnboardingStatus,
  PassiveReason,
  PasswordChangeRequest,
  PasswordCreationRequest,
  ProductType,
  PutCustomerAcquisitionDetailRequest,
  ReferralChannelResponse,
  RevenueType,
  RoleAuthority,
  ScoreCompany,
  StatusDataResponse,
  SubChannelResponse,
  TransactionHistory,
  UserNotification,
  WalletInfo,
} from './companies.types';

const api = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCompanies: builder.query<ServerSideQueryResult<Company>, CompanyFilters>({
      query: (params) => ({
        url: '/companies/search',
        params,
      }),
    }),
    getCompanyById: builder.query<Company, { companyId: string }>({
      query: ({ companyId }) => `/companies/${companyId}`,
      providesTags: (_result, _error, { companyId }) => [{ type: 'Company' as const, id: companyId }],
    }),
    createCompany: builder.mutation<Company, CompanyCreateRequest>({
      query: (data) => ({
        url: '/companies',
        method: 'POST',
        body: data,
      }),
    }),
    updateCompany: builder.mutation<Company, { companyId: string; data: Partial<Company> }>({
      query: ({ companyId, data }) => ({
        url: `/companies/${companyId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { companyId }) => [
        { type: 'Company' as const, id: companyId },
        { type: 'CompanyDetail' as const, id: companyId },
      ],
    }),
    deleteCompany: builder.mutation<void, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),
    getCompanyActivityTypes: builder.query<ActivityType[], void>({
      query: () => '/types?EnumName=CompanyActivityType',
    }),
    getCompanyTypes: builder.query<CompanyType[], void>({
      query: () => '/companies/types',
    }),
    getCompanyStatus: builder.query<OnboardingStatus[], void>({
      query: () => '/types?EnumName=OnboardingStatusTypes',
    }),
    getLeadingChannelList: builder.query<LeadingChannel[], void>({
      query: () => '/definitions/leadingChannels',
    }),
    getApplicationSubChannelByCompanyId: builder.query<ApplicationSubChannel[], { companyId: number }>({
      query: ({ companyId }) => `/companies/${companyId}/settings/leadingChannel`,
    }),
    getCities: builder.query<City[], void>({
      query: () => '/addresses/cities',
    }),
    getDistricts: builder.query<District[], { cityId: number }>({
      query: ({ cityId }) => `/addresses/${cityId}/districts`,
    }),
    getAddressesCities: builder.query<City[], void>({
      query: () => '/addresses/cities',
    }),
    getAddressesByCityIdDistricts: builder.query<District[], number>({
      query: (cityId) => `/addresses/${cityId}/districts`,
    }),
    getPassiveReasons: builder.query<PassiveReason[], void>({
      query: () => '/types?EnumName=PassiveStatusReasonTypes',
    }),

    // Score Company APIs
    getCompanySector: builder.query<{ data: CompanySector[] }, void>({
      query: () => `${scoreBaseURL}/companySectors/types`,
    }),
    getScoreCompanyByIdentifier: builder.query<ScoreCompany, { identifier: string }>({
      query: ({ identifier }) => `${scoreBaseURL}/companies/${identifier}`,
    }),
    updateScoreCompanyByIdentifier: builder.mutation<void, { CompanyId: number; CompanySectorId: number }>({
      query: ({ CompanyId, ...data }) => ({
        url: `${scoreBaseURL}/companies/${CompanyId}/sectors`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Detay sekmesi için API'lar
    getCompanyInfo: builder.query<CompanyDetail, { companyId: number }>({
      query: ({ companyId }) => `/companies/${companyId}/details`,
      providesTags: (_result, _error, { companyId }) => [{ type: 'CompanyDetail' as const, id: companyId }],
    }),
    updateCompanyDetail: builder.mutation<void, { companyId: number; data: CompanyDetailUpdateRequest }>({
      query: ({ companyId, data }) => ({
        url: `/companies/${companyId}/details`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { companyId }) => [
        { type: 'CompanyDetail' as const, id: companyId },
        { type: 'Company' as const, id: companyId.toString() },
      ],
    }),
    getTransactionHistory: builder.query<TransactionHistory, { companyId: number }>({
      query: ({ companyId }) => `/companies/${companyId}/transactionHistory`,
    }),
    getWalletInfo: builder.query<WalletInfo, { companyId: number }>({
      query: ({ companyId }) => `/companyWallet/walletInfo/${companyId}`,
    }),
    getGroupCompanies: builder.query<{ Items: GroupCompany[] }, { companyId: number }>({
      query: ({ companyId }) => `/companies/groups/${companyId}`,
    }),
    getProductTypes: builder.query<ProductType[], void>({
      query: () => '/types?EnumName=ProductTypes',
    }),
    getCompanyKinds: builder.query<CompanyKind[], void>({
      query: () => '/types?EnumName=CompanyKind',
    }),
    getCompanySizeTypes: builder.query<CompanySizeType[], void>({
      query: () => '/types?EnumName=CompanySizeTypes',
    }),
    getRevenueTypes: builder.query<RevenueType[], void>({
      query: () => '/types?EnumName=RevenueTypes',
    }),
    getIntegrators: builder.query<Integrator[], void>({
      query: () => '/integratorTemplates',
    }),
    getFinancierCompanies: builder.query<ServerSideQueryResult<Company>, void>({
      query: () => ({
        url: '/companies/search',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2,
          page: 1,
          pageSize: 100,
        },
      }),
    }),
    getCompanyCustomerManagersForCompanies: builder.query<
      CompanyCustomerManagerResponse,
      CompanyCustomerManagerFilters
    >({
      query: (params) => ({
        url: '/companies/customerManagers',
        params,
      }),
    }),
    updateCompanyCustomerManagers: builder.mutation<void, CompanyCustomerManagersUpdateRequest>({
      query: (data) => ({
        url: '/companies/customerManagers',
        method: 'PUT',
        body: data,
      }),
    }),
    getBuyerCompanies: builder.query<Company[], void>({
      query: () => '/companies/activityType/1',
    }),
    getFinancierCompaniesByType: builder.query<Company[], void>({
      query: () => ({
        url: '/companies',
        params: {
          type: 2,
        },
      }),
    }),

    updateLeadingChannel: builder.mutation<void, { companyId: number; LeadingChannelId: number | string }>({
      query: ({ companyId, LeadingChannelId }) => ({
        url: `/companies/${companyId}/settings/leadingChannel`,
        method: 'PUT',
        body: { LeadingChannelId },
      }),
    }),
    exportCompanies: builder.mutation<{ ExtensionData: string }, CompanyFilters>({
      query: (params) => ({
        url: '/companies/searchExcelExport',
        method: 'GET',
        params,
      }),
    }),
    updateGroupStatus: builder.mutation<void, { companyId: number; CompanyGroupStatus: number }>({
      query: ({ companyId, CompanyGroupStatus }) => ({
        url: `/companies/groupStatus/${companyId}/update`,
        method: 'PUT',
        body: { CompanyGroupStatus },
      }),
    }),
    removeGroupCompany: builder.mutation<void, { FromCompanyId: string; ToCompanyId: number }>({
      query: ({ FromCompanyId, ToCompanyId }) => ({
        url: '/companies/groups',
        method: 'PUT',
        body: { FromCompanyId, ToCompanyId },
      }),
    }),
    searchGroupCompanies: builder.query<
      { Items: Array<{ Id: number; CompanyName: string; Identifier: string }> },
      { GroupedCompanyId: number; CompanyName?: string; Status?: number }
    >({
      query: (params) => ({
        url: '/companies/groups/search',
        params,
      }),
    }),
    addGroupCompany: builder.mutation<void, { FromCompanyId: number; ToCompanyIds: number[] }>({
      query: (data) => ({
        url: '/companies/groups',
        method: 'POST',
        body: data,
      }),
    }),
    getCompanyUsers: builder.query<CompanyUser[], { companyId: number }>({
      query: ({ companyId }) => `/companies/${companyId}/users`,
    }),
    getCompanyMernisFailedUsers: builder.query<CompanyUser[], { companyId: number }>({
      query: ({ companyId }) => `/companies/${companyId}/mernisFailedUsers`,
    }),
    getUserById: builder.query<CompanyUser, { userId: number }>({
      query: ({ userId }) => `/users/${userId}`,
    }),
    updateUser: builder.mutation<CompanyUser, { userId: number; data: Partial<CompanyUser> }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    createUser: builder.mutation<CompanyUser, CreateUserRequest>({
      query: (data) => ({
        url: `/users`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteUser: builder.mutation<void, { userId: number }>({
      query: ({ userId }) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
    }),
    changeUserPassword: builder.mutation<void, PasswordChangeRequest>({
      query: (data) => ({
        url: `/users/password`,
        method: 'PUT',
        body: data,
      }),
    }),
    createPassword: builder.mutation<void, PasswordCreationRequest>({
      query: (data) => ({
        url: `/users/createPassword`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUserPositions: builder.query<{ Id: number; Name: string }[], void>({
      query: () => '/userPositions',
    }),
    getLanguages: builder.query<{ Id: number; Name: string; Code: string; IsActive: boolean }[], { IsActive?: string }>(
      {
        query: (params) => ({
          url: '/languages',
          params,
        }),
      },
    ),

    // Customer Acquisition Operations
    getCustomerAcquisitionDetail: builder.query<CustomerAcquisitionDetailResponse, number>({
      query: (id) => ({
        url: `/companyTracking/${id}`,
        method: 'GET',
      }),
    }),

    getCallerData: builder.query<CallerDataResponse[], void>({
      query: () => ({
        url: '/trackingTeam',
        method: 'GET',
      }),
    }),

    getCalledStatusData: builder.query<StatusDataResponse[], void>({
      query: () => ({
        url: '/types?EnumName=CallResultTypes',
        method: 'GET',
      }),
    }),

    getLeadStatusData: builder.query<StatusDataResponse[], void>({
      query: () => ({
        url: '/types?EnumName=LeadStatusTypes',
        method: 'GET',
      }),
    }),

    getLeadCallResultStatusData: builder.query<LeadCallResultStatus[], void>({
      query: () => ({
        url: '/types?EnumName=LeadCallResultStatus',
        method: 'GET',
      }),
    }),

    getReferralChannelData: builder.query<ReferralChannelResponse[], void>({
      query: () => ({
        url: '/applicationChannel',
        method: 'GET',
      }),
    }),

    getSubChannelData: builder.query<SubChannelResponse[], number>({
      query: (id) => ({
        url: `/applicationSubChannel/${id}`,
        method: 'GET',
      }),
    }),

    getWhereHearData: builder.query<StatusDataResponse[], void>({
      query: () => ({
        url: '/types?EnumName=CustomerSourceTypes',
        method: 'GET',
      }),
    }),

    putCustomerAcquisitionDetail: builder.mutation<BaseResponseModel, PutCustomerAcquisitionDetailRequest>({
      query: ({ id, ...data }) => ({
        url: `/companyTracking/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Document status update endpoints
    updateDocumentStatus: builder.mutation<BaseResponseModel, { Id: number; status: number; message?: string }>({
      query: ({ Id, status, message }) => ({
        url: `/documents/${Id}/status`,
        method: 'PUT',
        body: { Status: status, Message: message, Id },
      }),
    }),

    updateDocumentExpireDate: builder.mutation<BaseResponseModel, { documentId: number; expireDate: string }>({
      query: ({ documentId, expireDate }) => ({
        url: `/documents/${documentId}/status/expiration`,
        method: 'PUT',
        body: { ExpireDate: expireDate },
      }),
    }),

    // Get document statuses for dropdown
    getDocumentStatuses: builder.query<Array<{ Value: number; Description: string }>, void>({
      query: () => '/types?EnumName=DocumentStatus',
    }),

    // Upload document for company
    uploadCompanyDocument: builder.mutation<BaseResponseModel, FormData>({
      query: (formData) => {
        // FormData içeriğini debug için console'da görelim
        return {
          url: '/documents/file',
          method: 'POST',
          body: formData,
          // Content-Type'ı manuel set etmiyoruz - browser otomatik boundary ile multipart/form-data ekleyecek
        };
      },
    }),

    // Company Roles endpoints
    getCompanyRoles: builder.query<CompanyRole[], { companyId: number }>({
      query: ({ companyId }) => `/companies/${companyId}/roles`,
    }),
    createCompanyRole: builder.mutation<CompanyRole, { companyId: number; data: Partial<CompanyRole> }>({
      query: ({ companyId, data }) => ({
        url: `/companies/${companyId}/roles`,
        method: 'POST',
        body: data,
      }),
    }),
    updateCompanyRole: builder.mutation<CompanyRole, { companyId: number; roleId: number; data: Partial<CompanyRole> }>(
      {
        query: ({ companyId, roleId, data }) => ({
          url: `/companies/${companyId}/roles/${roleId}`,
          method: 'PUT',
          body: data,
        }),
      },
    ),
    deleteCompanyRole: builder.mutation<void, { companyId: number; roleId: number }>({
      query: ({ companyId, roleId }) => ({
        url: `/companies/${companyId}/roles/${roleId}`,
        method: 'DELETE',
      }),
    }),

    // Role Authorities endpoints
    getAuthorities: builder.query<AuthorityProject[], { companyType?: number }>({
      query: (params) => ({
        url: '/authorities',
        params,
      }),
    }),
    getRoleAuthorities: builder.query<RoleAuthority[], { companyId: number; roleId: number }>({
      query: ({ companyId, roleId }) => `/companies/${companyId}/roles/${roleId}/authorities`,
    }),
    updateRoleAuthorities: builder.mutation<
      void,
      { companyId: number; roleId: number; data: { CompanyRoleId: number; AuthorityIds: number[] } }
    >({
      query: ({ companyId, roleId, data }) => ({
        url: `/companies/${companyId}/roles/${roleId}/authorities`,
        method: 'PUT',
        body: data,
      }),
    }),

    // User Roles endpoints
    getUserRoles: builder.query<CompanyRole[], { companyId: number; userId: number }>({
      query: ({ companyId, userId }) => `/companies/${companyId}/roles/${userId}/user`,
    }),
    updateUserRoles: builder.mutation<
      void,
      { companyId: number; userId: number; data: { UserId: string; CompanyRoleIds: number[] } }
    >({
      query: ({ companyId, userId, data }) => ({
        url: `/companies/${companyId}/roles/${userId}/user`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Notification endpoints
    getNotificationTypes: builder.query<NotificationType[], { companyId: number; companyType: number }>({
      query: ({ companyId, companyType }) => ({
        url: `/companies/${companyId}/notifications`,
        params: { companyType },
      }),
    }),

    getUserNotifications: builder.query<UserNotification[], { companyId: number; userId: number }>({
      query: ({ companyId, userId }) => ({
        url: `/companies/${companyId}/users/${userId}/notifications`,
      }),
    }),

    updateUserNotifications: builder.mutation<
      void,
      { companyId: number; userId: number; data: NotificationUpdateRequest }
    >({
      query: ({ companyId, userId, data }) => ({
        url: `/companies/${companyId}/users/${userId}/notifications`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Company System Settings endpoints
    getCompanySettings: builder.query<CompanySystemSettings, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}/settings`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { companyId }) => [{ type: 'CompanySettings' as const, id: companyId }],
    }),

    updateCompanySettings: builder.mutation<void, { companyId: number; data: CompanySystemSettingsUpdateRequest }>({
      query: ({ companyId, data }) => ({
        url: `/companies/${companyId}/settings`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { companyId }) => [
        { type: 'CompanySettings' as const, id: companyId },
        { type: 'Company' as const, id: companyId.toString() },
      ],
    }),

    // Company Onboarding Status endpoints
    getAvailableOnboardingStatus: builder.query<OnboardingStatus[], { companyId: string }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}/settings/availableOnboardingStatus`,
        method: 'GET',
      }),
    }),

    updateCompanyOnboardingStatus: builder.mutation<void, { companyId: string; data: CompanyStatusUpdateRequest }>({
      query: ({ companyId, data }) => ({
        url: `/companies/${companyId}/settings/onboardingStatus`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { companyId }) => [
        { type: 'CompanySettings' as const, id: parseInt(companyId) },
        { type: 'Company' as const, id: companyId },
      ],
    }),

    // Company Limitation endpoints
    getCompanyLimitation: builder.query<CompanyLimitation, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}/limitation`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { companyId }) => [{ type: 'CompanyLimitation' as const, id: companyId }],
    }),

    updateCompanyLimitation: builder.mutation<void, { companyId: number; data: CompanyLimitationUpdateRequest }>({
      query: ({ companyId, data }) => ({
        url: `/companies/${companyId}/limitation`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { companyId }) => [
        { type: 'CompanyLimitation' as const, id: companyId },
        { type: 'Company' as const, id: companyId.toString() },
      ],
    }),

    // Company Codes endpoints
    getCompanyCodes: builder.query<ServerSideQueryResult<CompanyCode>, CompanyCodeFilters>({
      query: (params) => ({
        url: '/companies/currentAccountCode',
        params,
      }),
    }),

    createCompanyCode: builder.mutation<CompanyCode, CompanyCodeCreateRequest>({
      query: (data) => ({
        url: '/companies/createCurrentAccountCode',
        method: 'POST',
        body: data,
      }),
    }),

    updateCompanyCode: builder.mutation<CompanyCode, { id: number; data: CompanyCodeUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/companies/updateCurrentAccountCode/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteCompanyCode: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/companies/currentAccountCode/${id}`,
        method: 'DELETE',
      }),
    }),

    // Financial Settings endpoints
    getFinancialSettings: builder.query<FinancialSettingsResponse, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}/financer/info/allInfo`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0, // Don't cache this data
      providesTags: (_result, _error, { companyId }) => [{ type: 'FinancialSettings' as const, id: companyId }],
    }),

    updateFinancialSettings: builder.mutation<void, { companyId: number; data: FinancialSettingsSaveRequest }>({
      query: ({ companyId, data }) => ({
        url: `/companies/${companyId}/financer/info/allInfo`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { companyId }) => [
        { type: 'FinancialSettings' as const, id: companyId },
        { type: 'Company' as const, id: companyId.toString() },
      ],
    }),

    // Currencies endpoint
    getCurrencies: builder.query<Currency[], void>({
      query: () => '/currencies',
    }),

    // Company Rules endpoints
    getCompanyRules: builder.query<CompanyRule[], CompanyRuleFilters>({
      query: ({ ...params }) => ({
        url: `/companies/${params.ReceivercompanyId}/definitions`,
        params,
      }),
    }),

    getCompanyRuleFinancers: builder.query<CompanyRuleFinancer[], { companyId: number; ruleId: number }>({
      query: ({ companyId, ruleId }) => ({
        url: `/companies/${companyId}/definitions/${ruleId}/details`,
        method: 'GET',
      }),
    }),

    updateCompanyRuleFinancers: builder.mutation<
      void,
      { companyId: number; ruleId: number; data: CompanyRuleFinancerUpdateRequest[] }
    >({
      query: ({ companyId, ruleId, data }) => ({
        url: `/companies/${companyId}/definitions/${ruleId}/details`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useLazyGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useGetCompanyActivityTypesQuery,
  useGetCompanyTypesQuery,
  useGetCompanyStatusQuery,
  useGetLeadingChannelListQuery,
  useGetApplicationSubChannelByCompanyIdQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery,
  useGetAddressesCitiesQuery,
  useLazyGetAddressesByCityIdDistrictsQuery,
  useGetPassiveReasonsQuery,
  // Score Company hooks
  useGetCompanySectorQuery,
  useGetScoreCompanyByIdentifierQuery,
  useLazyGetScoreCompanyByIdentifierQuery,
  useUpdateScoreCompanyByIdentifierMutation,
  // Detay sekmesi hook'ları
  useGetCompanyInfoQuery,
  useUpdateCompanyDetailMutation,
  useGetTransactionHistoryQuery,
  useGetWalletInfoQuery,
  useGetGroupCompaniesQuery,
  useGetProductTypesQuery,
  useGetCompanyKindsQuery,
  useGetCompanySizeTypesQuery,
  useGetRevenueTypesQuery,
  useGetIntegratorsQuery,
  useGetFinancierCompaniesQuery,
  useGetCompanyCustomerManagersForCompaniesQuery,
  useUpdateCompanyCustomerManagersMutation,
  useGetBuyerCompaniesQuery,
  useGetFinancierCompaniesByTypeQuery,
  useUpdateLeadingChannelMutation,
  useExportCompaniesMutation,
  useUpdateGroupStatusMutation,
  useRemoveGroupCompanyMutation,
  useLazySearchGroupCompaniesQuery,
  useAddGroupCompanyMutation,
  useGetCompanyUsersQuery,
  useGetCompanyMernisFailedUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useChangeUserPasswordMutation,
  useCreatePasswordMutation,
  useGetUserPositionsQuery,
  useGetLanguagesQuery,
  // Customer Acquisition hooks
  useGetCustomerAcquisitionDetailQuery,
  useLazyGetCustomerAcquisitionDetailQuery,
  useGetCallerDataQuery,
  useLazyGetCallerDataQuery,
  useGetCalledStatusDataQuery,
  useLazyGetCalledStatusDataQuery,
  useGetLeadStatusDataQuery,
  useLazyGetLeadStatusDataQuery,
  useGetLeadCallResultStatusDataQuery,
  useLazyGetLeadCallResultStatusDataQuery,
  useGetReferralChannelDataQuery,
  useLazyGetReferralChannelDataQuery,
  useGetSubChannelDataQuery,
  useLazyGetSubChannelDataQuery,
  useGetWhereHearDataQuery,
  useLazyGetWhereHearDataQuery,
  usePutCustomerAcquisitionDetailMutation,
  // Document hooks
  useUpdateDocumentStatusMutation,
  useUpdateDocumentExpireDateMutation,
  useGetDocumentStatusesQuery,
  useUploadCompanyDocumentMutation,
  // Company Roles hooks
  useGetCompanyRolesQuery,
  useCreateCompanyRoleMutation,
  useUpdateCompanyRoleMutation,
  useDeleteCompanyRoleMutation,
  // Role Authorities hooks
  useGetAuthoritiesQuery,
  useGetRoleAuthoritiesQuery,
  useUpdateRoleAuthoritiesMutation,
  // User Roles hooks
  useGetUserRolesQuery,
  useUpdateUserRolesMutation,
  // Notification hooks
  useGetNotificationTypesQuery,
  useGetUserNotificationsQuery,
  useUpdateUserNotificationsMutation,
  // System Settings hooks
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  // Company Onboarding Status hooks
  useGetAvailableOnboardingStatusQuery,
  useUpdateCompanyOnboardingStatusMutation,
  // Company Limitation hooks
  useGetCompanyLimitationQuery,
  useUpdateCompanyLimitationMutation,
  // Company Codes hooks
  useGetCompanyCodesQuery,
  useLazyGetCompanyCodesQuery,
  useCreateCompanyCodeMutation,
  useUpdateCompanyCodeMutation,
  useDeleteCompanyCodeMutation,
  // Currencies hooks
  useGetCurrenciesQuery,
  // Financial Settings hooks
  useGetFinancialSettingsQuery,
  useLazyGetFinancialSettingsQuery,
  useUpdateFinancialSettingsMutation,
  // Company Rules hooks
  useGetCompanyRulesQuery,
  useLazyGetCompanyRulesQuery,
  useGetCompanyRuleFinancersQuery,
  useLazyGetCompanyRuleFinancersQuery,
  useUpdateCompanyRuleFinancersMutation,
} = api;
