import type { IntegrationReportsFilters } from '../integration-reports.types';

/**
 * Integration Reports Helper Functions
 * Following OperationPricing helper patterns
 */

// Display value or dash for null/empty values - matches OperationPricing pattern
export const displayValueOrDash = (value: string | null | undefined): string => {
  return value ?? '-';
};

// Process filter params for API - matches legacy parameter processing
export const processFilterParams = (params: IntegrationReportsFilters): IntegrationReportsFilters => {
  const processedParams = { ...params };

  // Remove empty values
  Object.keys(processedParams).forEach((key) => {
    const value = processedParams[key as keyof IntegrationReportsFilters];
    if (value === null || value === undefined || value === '') {
      delete processedParams[key as keyof IntegrationReportsFilters];
    }
  });

  return processedParams;
};
