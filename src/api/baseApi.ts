import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { serialize } from '@utils';
import type { ExceptionResponseModel, RootState } from '../store';
import { baseURL } from './config';

const ignoredJsonPaths = [
  'postDocumentsFile',
  'postInvoicesByInvoiceIdDocument',
  'uploadCompanyDocument',
  'uploadIntegratorTemplate',
];

const baseApi = createApi({
  reducerPath: 'baseApiReducer',
  // refetchOnFocus: true,
  // refetchOnMountOrArgChange: false,
  refetchOnReconnect: true,
  tagTypes: [
    'CompanyDetail',
    'Company',
    'CompanyUsers',
    'CompanyRoles',
    'CompanyDocuments',
    'CompanySettings',
    'CompanyLimitation',
    'CompanyWallet',
    'UserPositions',
    'TargetTypes',
    'FinancialSettings',
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    paramsSerializer: (params) => {
      return serialize(params);
    },
    prepareHeaders: (headers, { getState, endpoint }) => {
      // headers.set('Strict-Transport-Security', 'max-age=600');
      // headers.set('X-Content-Type-Options', 'nosniff');
      // headers.set('X-Frame-Options', 'sameorigin');
      // headers.set('X-XSS-Protection', '1');

      const token = (getState() as RootState)?.auth?.token || '';
      if (token) {
        headers.set('Token', token);
      }
      if (!ignoredJsonPaths.includes(endpoint)) {
        headers.set('Accept', 'application/json');
        headers.set('Content-Type', 'application/json; charset=UTF-8');
      }
      return headers;
    },
  }) as BaseQueryFn<string | FetchArgs, unknown, { data: ExceptionResponseModel }, object>,
  endpoints: () => ({}),
});

export { baseApi };
