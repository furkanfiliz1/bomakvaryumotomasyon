/**
 * Sector Ratios Query Params Hook
 * Manages URL parameters for sector filter
 * Follows OperationPricing pattern exactly
 */

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SectorRatiosFilters } from '../sector-ratios.types';

export const useSectorRatiosQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params to filters object
  const filters = useMemo<SectorRatiosFilters>(() => {
    const companySectorIdParam = searchParams.get('companySectorId');
    return {
      companySectorId: companySectorIdParam ? Number(companySectorIdParam) : null,
    };
  }, [searchParams]);

  // Update filters and sync to URL
  const updateFilters = useCallback(
    (newFilters: Partial<SectorRatiosFilters>) => {
      const params: Record<string, string> = {};

      const updatedFilters = { ...filters, ...newFilters };

      if (updatedFilters.companySectorId) {
        params.companySectorId = String(updatedFilters.companySectorId);
      }

      setSearchParams(params);
    },
    [filters, setSearchParams],
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
};

export default useSectorRatiosQueryParams;
