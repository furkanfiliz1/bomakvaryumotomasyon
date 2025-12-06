/**
 * Business logic helpers for Customer Arrival Channels
 * Following OperationPricing helper patterns
 */

/**
 * Type representing possible consensus value formats from various sources
 * (API responses, form inputs, table cells, etc.)
 */
export type ConsensusValue = boolean | string | number | undefined;

/**
 * Format rate value for display
 * Handles null/undefined cases
 */
export const formatRateValue = (rate: number | null | undefined): string => {
  if (rate === null || rate === undefined) {
    return '-';
  }
  return rate.toString();
};

/**
 * Consensus Status Management
 * Multiple methods to handle different consensus-related operations
 */

/**
 * Check if a channel is marked as consensus
 * Handles various input types from API and forms
 */
export const isConsensusChannel = (value: ConsensusValue): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  if (typeof value === 'number') return value === 1;
  return false; // default for undefined
};

/**
 * Check if a channel is non-consensus
 * Handles various input types from API and forms
 */
export const isNonConsensusChannel = (value: ConsensusValue): boolean => {
  return !isConsensusChannel(value);
};

/**
 * Format consensus value for API create request (string format)
 * Converts any input type to API-expected string format
 */
export const formatConsensusForCreate = (value: ConsensusValue): string => {
  if (isConsensusChannel(value)) {
    return 'true';
  }
  return 'false';
};

/**
 * Format consensus value for API update request (boolean format)
 * Converts any input type to API-expected boolean format
 */
export const formatConsensusForUpdate = (value: ConsensusValue): boolean => {
  return isConsensusChannel(value);
};

/**
 * Parse consensus value from form input string
 * Specifically for handling form data where consensus is represented as "true"/"false" strings
 */
export const parseConsensusFromForm = (value: string): boolean => {
  return value === 'true';
};

/**
 * Convert consensus boolean to form input value
 * Used when initializing forms with existing data
 */
export const consensusToFormValue = (consensusStatus: boolean): string => {
  if (isConsensusChannel(consensusStatus)) {
    return 'true';
  }
  return 'false';
};

/**
 * Get display label for consensus status in UI
 * Returns localized text for display
 */
export const getConsensusDisplayLabel = (value: ConsensusValue): string => {
  if (isConsensusChannel(value)) {
    return 'Evet';
  }
  return 'Hayır';
};

/**
 * Get chip color for consensus status display
 * Returns Material-UI chip color variant
 */
export const getConsensusChipColor = (value: ConsensusValue): 'success' | 'default' => {
  if (isConsensusChannel(value)) {
    return 'success';
  }
  return 'default';
};

/**
 * Filter channels by consensus status
 */
export const filterConsensusChannels = <T extends { IsConsensus: boolean }>(
  channels: T[],
  consensusOnly: boolean = true,
): T[] => {
  return channels.filter((channel) =>
    consensusOnly ? isConsensusChannel(channel.IsConsensus) : isNonConsensusChannel(channel.IsConsensus),
  );
};

/**
 * Validate consensus value
 */
export const isValidConsensusValue = (value: unknown): value is boolean | 'true' | 'false' => {
  return typeof value === 'boolean' || value === 'true' || value === 'false';
};
