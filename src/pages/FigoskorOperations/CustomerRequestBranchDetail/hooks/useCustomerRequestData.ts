import { useState } from 'react';
import {
  useGetCitiesQuery,
  useGetCompanyDocumentsForFigoscoreQuery,
  useGetCorporationTypesQuery,
  useGetCountriesQuery,
  useGetFacilityPropertyStatusQuery,
  useGetFacilityTypesQuery,
  useGetFigoScoreProFormQuery,
  useGetPaymentMethodsQuery,
} from '../customer-request-branch-detail.api';

import { useErrorListener } from '@hooks';
import type { UseCustomerRequestDataReturn } from '../customer-request-branch-detail.types';

/**
 * Custom hook for fetching and managing customer request data
 * Replaces the legacy CustomerRequestContext with RTK Query
 */
export const useCustomerRequestData = (companyId?: number): UseCustomerRequestDataReturn => {
  const [error, setError] = useState<string | null>(null);

  const {
    data: figoScoreResponse,
    error: figoScoreError,
    isLoading: figoScoreLoading,
    refetch: refetchFigoScore,
  } = useGetFigoScoreProFormQuery(companyId!, {
    skip: !companyId,
  });

  // Fetch Company Documents
  const {
    data: documentsResponse,
    error: documentsError,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = useGetCompanyDocumentsForFigoscoreQuery(companyId!, {
    skip: !companyId,
  });

  // Fetch Countries (for dropdowns)
  const { data: countriesResponse, error: countriesError, isLoading: countriesLoading } = useGetCountriesQuery();

  // Fetch Cities (for dropdowns)
  const { data: citiesResponse, error: citiesError, isLoading: citiesLoading } = useGetCitiesQuery();

  // Fetch Enum Options (for dropdowns)
  const {
    data: corporationTypes,
    error: corporationTypesError,
    isLoading: corporationTypesLoading,
  } = useGetCorporationTypesQuery();
  const {
    data: facilityTypes,
    error: facilityTypesError,
    isLoading: facilityTypesLoading,
  } = useGetFacilityTypesQuery();
  const {
    data: facilityPropertyStatuses,
    error: facilityPropertyStatusError,
    isLoading: facilityPropertyStatusLoading,
  } = useGetFacilityPropertyStatusQuery();
  const {
    data: paymentMethods,
    error: paymentMethodsError,
    isLoading: paymentMethodsLoading,
  } = useGetPaymentMethodsQuery();

  useErrorListener([
    figoScoreError,
    documentsError,
    countriesError,
    citiesError,
    corporationTypesError,
    facilityTypesError,
    facilityPropertyStatusError,
    paymentMethodsError,
  ]);

  // API returns data directly without wrapper
  const figoScoreData = figoScoreResponse;
  const companyDocuments = documentsResponse || [];
  // Countries API returns array directly with Value/Description structure
  const countries = countriesResponse || [];
  // Cities API returns array directly with Id/Name structure
  const cities = citiesResponse || [];
  // Enum APIs return arrays directly with Description/Value structure
  const enumData = {
    corporationTypes: corporationTypes || [],
    facilityTypes: facilityTypes || [],
    facilityPropertyStatuses: facilityPropertyStatuses || [],
    paymentMethods: paymentMethods || [],
    cities: cities || [],
    countries: countries || [],
  };

  // Combine loading states
  const isLoading =
    figoScoreLoading ||
    documentsLoading ||
    countriesLoading ||
    citiesLoading ||
    corporationTypesLoading ||
    facilityTypesLoading ||
    facilityPropertyStatusLoading ||
    paymentMethodsLoading;

  // Refetch all data
  const refetch = () => {
    refetchFigoScore();
    refetchDocuments();
    setError(null);
  };

  return {
    figoScoreData,
    companyDocuments,
    enumData,
    isLoading,
    error,
    refetch,
  };
};
