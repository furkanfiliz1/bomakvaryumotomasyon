import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { serialize } from '@utils';
import type { RootStateForApi } from 'src/store/types';
import { analysisBaseURL } from './config';
import type { ExceptionResponseModel } from './figoParaApi';

// Create a separate API for analysis endpoints with analysisBaseURL
export const analysisApi = createApi({
  reducerPath: 'analysisApiReducer',
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: analysisBaseURL,
    paramsSerializer: (params) => serialize(params),
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootStateForApi)?.auth?.token || '';
      if (token) {
        headers.set('Token', token);
      }
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json; charset=UTF-8');
      return headers;
    },
  }) as BaseQueryFn<string | FetchArgs, unknown, { data: ExceptionResponseModel }, object>,
  endpoints: () => ({}),
});
