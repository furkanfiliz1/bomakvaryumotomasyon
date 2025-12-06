// Legacy bank identifier validation
export const LEGACY_BANK_IDENTIFIERS = ['0150015264', '4810058590'] as const;

// Check if a bank identifier is valid per legacy system
export const isValidBankIdentifier = (identifier: string): boolean => {
  return LEGACY_BANK_IDENTIFIERS.includes(identifier as (typeof LEGACY_BANK_IDENTIFIERS)[number]);
};

// Format empty values - showing "-" for null/empty like other reports
export const formatEmptyValue = (value: unknown): string => {
  if (value == null || value === '' || (typeof value === 'number' && isNaN(value))) {
    return '-';
  }
  return String(value);
};
