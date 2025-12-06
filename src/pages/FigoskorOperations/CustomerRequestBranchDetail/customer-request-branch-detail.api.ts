import { baseApi } from '@api';
import type {
  GetCitiesResponse,
  GetCompanyDocumentsRequest,
  GetCompanyDocumentsResponse,
  GetCountriesResponse,
  GetFigoScoreProFormDataRequest,
  GetFigoScoreProFormDataResponse,
} from './customer-request-branch-detail.types';

/**
 * Customer Request Branch Detail API
 * Handles all API calls for the customer request branch detail functionality
 */
export const customerRequestBranchDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get FigoScore Pro Form Data
     * Fetches comprehensive company information from FigoScore API
     */
    getFigoScoreProForm: builder.query<GetFigoScoreProFormDataResponse, GetFigoScoreProFormDataRequest['companyId']>({
      query: (companyId) => ({
        url: `/figoscore/figoScoreProForm/${companyId}`,
        method: 'GET',
      }),
    }),

    /**
     * Get Company Documents
     * Fetches uploaded documents for financial information evaluation
     */
    getCompanyDocumentsForFigoscore: builder.query<
      GetCompanyDocumentsResponse,
      GetCompanyDocumentsRequest['senderCompanyId']
    >({
      query: (senderCompanyId) => ({
        url: `/documents`,
        method: 'GET',
        params: { senderCompanyId },
      }),
    }),

    /**
     * Get Countries Enum
     * Fetches available countries for dropdowns
     */
    getCountries: builder.query<GetCountriesResponse, void>({
      query: () => ({
        url: '/addresses/countriesEnum',
        method: 'GET',
      }),
    }),

    /**
     * Get Cities
     * Fetches available cities for dropdowns
     */
    getCities: builder.query<GetCitiesResponse, void>({
      query: () => ({
        url: '/addresses/cities',
        method: 'GET',
      }),
    }),

    /**
     * Get Corporation Types Enum
     * Fetches corporation type options
     */
    getCorporationTypes: builder.query<Array<{ Description: string; Value: string }>, void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'CorporationType' },
      }),
    }),

    /**
     * Get Facility Property Status Enum
     * Fetches facility property status options (Mülk/Kiralık/Diğer)
     */
    getFacilityPropertyStatus: builder.query<Array<{ Description: string; Value: string }>, void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'FacilityPropertyStatus' },
      }),
    }),

    /**
     * Get Facility Type Enum
     * Fetches facility type options (Ofis/Fabrika/Depo etc.)
     */
    getFacilityTypes: builder.query<Array<{ Description: string; Value: string }>, void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'FacilityType' },
      }),
    }),

    /**
     * Get Payment Method Enum
     * Fetches payment method options (Nakit/Vadeli/Çek etc.)
     */
    getPaymentMethods: builder.query<Array<{ Description: string; Value: string }>, void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'PaymentMethod' },
      }),
    }),
  }),
  overrideExisting: false,
});

// Export hooks for use in components
export const {
  useGetFigoScoreProFormQuery,
  useLazyGetFigoScoreProFormQuery,
  useGetCompanyDocumentsForFigoscoreQuery,
  useLazyGetCompanyDocumentsForFigoscoreQuery,
  useGetCountriesQuery,
  useGetCitiesQuery,
  useGetCorporationTypesQuery,
  useGetFacilityPropertyStatusQuery,
  useGetFacilityTypesQuery,
  useGetPaymentMethodsQuery,
} = customerRequestBranchDetailApi;
