/**
 * Company Limit Data Hook
 * Centralized data fetching for Company Limit Tab
 * Following OperationPricing hook patterns
 */

import { useNotice } from '@components';
import { useEffect, useState } from 'react';
import { useGetCompanyDetailQuery } from '../../limit-operations.api';
import {
  companyLimitTabApi,
  useGetCompaniesLimitQuery,
  useLazyGetGuarantorCompanyListQuery,
  useLazyGetNonGuarantorCompanyListQuery,
} from '../company-limit-tab.api';
import type {
  CompanyLimitInfo,
  GuarantorCompanyListItem,
  NonGuarantorCompanyListItem,
  UseCompanyLimitDataResult,
} from '../company-limit-tab.types';
import { getDefaultCompanyLimitInfo, processCompaniesLimitResponse } from '../helpers';

interface UseCompanyLimitDataProps {
  companyId: string;
}

/**
 * Hook for fetching all company limit related data
 * Matches legacy ScoreCompanyLimit component data fetching logic
 */
export const useCompanyLimitData = ({ companyId }: UseCompanyLimitDataProps): UseCompanyLimitDataResult => {
  const notice = useNotice();

  // State matching legacy component state structure
  const [companyLimitInfos, setCompanyLimitInfos] = useState<CompanyLimitInfo>(getDefaultCompanyLimitInfo());
  const [dashboardData, setDashboardData] = useState<GuarantorCompanyListItem[]>([]);
  const [roofLimitData, setRoofLimitData] = useState<GuarantorCompanyListItem[]>([]);
  const [withGuarantorLimitListData, setWithGuarantorLimitListData] = useState<GuarantorCompanyListItem[]>([]);
  const [withoutGuarantorLimitListData, setWithoutGuarantorLimitListData] = useState<NonGuarantorCompanyListItem[]>([]);
  const [withoutGuarantorLimitData, setWithoutGuarantorLimitData] = useState<NonGuarantorCompanyListItem[] | null>(
    null,
  );
  const [companyIdentifier, setCompanyIdentifier] = useState<string | null>(null);

  // Get company details to obtain identifier
  const {
    data: companyDetailResponse,
    isLoading: isCompanyLoading,
    error: companyError,
  } = useGetCompanyDetailQuery({ companyId: Number.parseInt(companyId || '0') }, { skip: !companyId });

  // Get companies limit data using identifier
  const {
    data: companiesLimitResponse,
    isLoading: isLimitLoading,
    error: limitError,
    refetch: refetchCompaniesLimit,
  } = useGetCompaniesLimitQuery({ identifier: companyIdentifier || '' }, { skip: !companyIdentifier });

  // Lazy queries for manual triggering (matching legacy patterns)
  const [getGuarantorList, { data: guarantorData, isLoading: isGuarantorLoading, error: guarantorError }] =
    useLazyGetGuarantorCompanyListQuery();

  const [getNonGuarantorList, { data: nonGuarantorData, isLoading: isNonGuarantorLoading, error: nonGuarantorError }] =
    useLazyGetNonGuarantorCompanyListQuery();

  // putFinancierLimit mutation - matches legacy getFinancersLimit business logic
  const [putFinancierLimit, { data: financierLimitData, isLoading: isFinancierLimitLoading }] =
    companyLimitTabApi.usePutFinancierLimitMutation();

  // Set company identifier when company details are loaded
  useEffect(() => {
    if (companyDetailResponse?.Identifier) {
      setCompanyIdentifier(companyDetailResponse.Identifier);
    }
  }, [companyDetailResponse]);

  // Process companies limit response when received
  useEffect(() => {
    if (companiesLimitResponse) {
      setCompanyLimitInfos(processCompaniesLimitResponse(companiesLimitResponse));
    }
  }, [companiesLimitResponse]);

  // Process guarantor data when received - matches legacy getGuarantedList
  useEffect(() => {
    if (guarantorData) {
      setWithGuarantorLimitListData(guarantorData);
      setRoofLimitData(guarantorData);
      setDashboardData(guarantorData);
    }
  }, [guarantorData]);

  // Process non-guarantor data when received - matches legacy getNonGuarantedList
  useEffect(() => {
    if (nonGuarantorData) {
      setWithoutGuarantorLimitListData(nonGuarantorData);
    }
  }, [nonGuarantorData]);

  // Process financier limit data and handle errors - matches legacy componentWillReceiveProps
  useEffect(() => {
    if (financierLimitData) {
      // Set the withoutGuarantorLimitData which contains error messages
      setWithoutGuarantorLimitData(financierLimitData);

      // Process error messages like legacy componentWillReceiveProps
      let errorMessage = '';
      for (const item of financierLimitData) {
        if (item.ErrorMessage !== null && item.ErrorMessage !== '') {
          errorMessage = `${errorMessage}${item.FinancerName || 'Finansör'}: ${item.ErrorMessage}<br>`;
        }
      }

      // Show error notice if there are any error messages - matches legacy Swal.fire
      if (errorMessage !== null && errorMessage !== '') {
        notice({
          variant: 'error',
          title: 'İşlem Başarısız',
          message: errorMessage,
        });
      }
    }
  }, [financierLimitData, notice]);

  // Initialize data fetching when component mounts - matches legacy initialize()
  useEffect(() => {
    if (companyId) {
      const numericCompanyId = Number.parseInt(companyId);

      // Fetch guarantor and non-guarantor lists
      getGuarantorList({ companyId: numericCompanyId });
      getNonGuarantorList({ companyId: numericCompanyId });
    }
  }, [companyId, getGuarantorList, getNonGuarantorList]);

  // Functions to refresh data - matching legacy component methods
  const getGuarantedList = () => {
    if (companyId) {
      getGuarantorList({ companyId: Number.parseInt(companyId) });
    }
  };

  const getNonGuarantedList = () => {
    if (companyId) {
      getNonGuarantorList({ companyId: Number.parseInt(companyId) });
    }
  };

  const getCompaniesLimit = () => {
    refetchCompaniesLimit();
  };

  const getFinancersLimit = async () => {
    // Matches legacy getFinancersLimit() which calls _putCompaniesFinancerLimit service
    // This endpoint returns error messages for each financer
    if (companyId) {
      try {
        const response = await putFinancierLimit({
          companyId: Number.parseInt(companyId),
        }).unwrap();

        // Set withoutGuarantorLimitData with response - matches legacy setState
        // Response contains error messages that will be processed by useEffect
        setWithoutGuarantorLimitData(response);

        // After successful call, refresh the non-guarantor list - matches legacy
        getNonGuarantedList();
      } catch (error) {
        // Network/API errors handled here, business logic errors come in response
        console.error('Get financers limit failed:', error);
      }
    }
  };

  // Field change handlers matching legacy component methods
  const onChangeRoofLimitField = (value: number, index: number) => {
    const updatedRoofLimitData = [...roofLimitData];
    updatedRoofLimitData[index] = { ...updatedRoofLimitData[index], Amount: value };
    setRoofLimitData(updatedRoofLimitData);
  };

  const onChangeGuarantorLimitField = (field: string, value: unknown) => {
    // Handle different field types for guarantor limit changes
    if (field === 'TotalLimit' && typeof value === 'object' && value !== null) {
      // Handle TotalLimit changes with limitId, detailId, and totalLimit
      const { limitId, detailId, totalLimit } = value as { limitId: number; detailId: number; totalLimit: number };

      // Update local state for TotalLimit like legacy onChangeGuarantorLimitField
      const updatedData = withGuarantorLimitListData.map((limit) => {
        if (limit.Id === limitId) {
          return {
            ...limit,
            LimitDetails: limit.LimitDetails?.map((detail) =>
              detail.Id === detailId ? { ...detail, TotalLimit: totalLimit } : detail,
            ),
          };
        }
        return limit;
      });
      setWithGuarantorLimitListData(updatedData);
    } else if (field === 'IsHold' && typeof value === 'object' && value !== null) {
      // Handle IsHold changes with limitId and detailId
      const { limitId, detailId, isHold } = value as { limitId: number; detailId: number; isHold: boolean };

      // Update local state for IsHold
      const updatedData = withGuarantorLimitListData.map((limit) => {
        if (limit.Id === limitId) {
          return {
            ...limit,
            LimitDetails: limit.LimitDetails?.map((detail) =>
              detail.Id === detailId ? { ...detail, IsHold: isHold } : detail,
            ),
          };
        }
        return limit;
      });
      setWithGuarantorLimitListData(updatedData);
    }
  };

  const onChangeNonGuarantorLimitField = (name: string, value: unknown, index: number) => {
    // Handle non-guarantor limit field changes matching legacy onChangeNonGuarantorLimitField
    // Create proper immutable update like legacy implementation
    const updatedData = withoutGuarantorLimitListData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [name]: value,
        };
      }
      return item;
    });
    setWithoutGuarantorLimitListData(updatedData);
  };

  // Calculate overall loading state
  const isLoading =
    isCompanyLoading || isLimitLoading || isGuarantorLoading || isNonGuarantorLoading || isFinancierLimitLoading;

  // Calculate overall error state
  const error = companyError || limitError || guarantorError || nonGuarantorError;

  return {
    // Data state matching legacy component
    companyLimitInfos,
    dashboardData,
    roofLimitData,
    withGuarantorLimitListData,
    withoutGuarantorLimitListData,
    withoutGuarantorLimitData,
    companyIdentifier,

    // Loading and error states
    isLoading,
    error,

    // Refresh functions matching legacy methods
    getGuarantedList,
    getNonGuarantedList,
    getCompaniesLimit,
    getFinancersLimit,

    // Field change handlers
    onChangeRoofLimitField,
    onChangeGuarantorLimitField,
    onChangeNonGuarantorLimitField,
  };
};
