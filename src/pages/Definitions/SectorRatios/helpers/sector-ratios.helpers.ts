/**
 * Sector Ratios Helpers
 * Business logic and utility functions
 */

import type { RatioTally, RatioTallyFormData } from '../sector-ratios.types';

/**
 * Filter ratio tallies by company sector ID
 * Matches legacy: ratioTallyList.data.filter(item => item.companySectorId === parseInt(companySectorId, 10))
 */
export const filterRatioTalliesBySector = (
  ratioTallies: RatioTally[],
  companySectorId: number | null | undefined,
): RatioTally[] => {
  if (!companySectorId || companySectorId === 0) {
    return [];
  }
  return ratioTallies.filter((item) => item.companySectorId === companySectorId);
};

/**
 * Parse form data to API request format
 * Converts string values to numbers for API
 */
export const parseRatioTallyFormData = (
  data: RatioTallyFormData,
): { ratioId: number; point: number; min: number; max: number } => {
  return {
    ratioId: typeof data.ratioId === 'number' ? data.ratioId : Number.parseInt(data.ratioId, 10),
    point: Number.parseFloat(data.point) || 0,
    min: Number.parseFloat(data.min) || 0,
    max: Number.parseFloat(data.max) || 0,
  };
};

/**
 * Convert RatioTally to form data format
 * Used for populating edit form
 */
export const ratioTallyToFormData = (ratioTally: RatioTally): RatioTallyFormData => {
  return {
    ratioId: String(ratioTally.ratioId),
    point: String(ratioTally.point),
    min: String(ratioTally.min),
    max: String(ratioTally.max),
  };
};

/**
 * Format number for display
 * Shows dash for null/undefined/zero values
 */
export const formatNumberValue = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '-';
  }
  return String(value);
};

/**
 * Validate ratio form data
 * Returns validation errors if any
 */
export const validateRatioTallyFormData = (
  data: RatioTallyFormData,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const ratioIdValue = typeof data.ratioId === 'number' ? data.ratioId : Number.parseInt(data.ratioId, 10);
  if (!data.ratioId || ratioIdValue === 0) {
    errors.ratioId = 'Rasyo seçimi zorunludur';
  }

  if (!data.point || data.point.trim() === '') {
    errors.point = 'Puan zorunludur';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
