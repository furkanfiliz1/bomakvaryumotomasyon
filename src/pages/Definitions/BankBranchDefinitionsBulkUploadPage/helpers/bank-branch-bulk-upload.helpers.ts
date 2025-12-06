/**
 * Banka Şubesi Excel ile Toplu Ekle Helper Functions
 * Constants and utility functions for bank branch bulk upload operations
 */

import type { BranchToAdd, ExcelValidationError } from '../bank-branch-bulk-upload.types';

/**
 * Branch code length (5 digits)
 */
export const BRANCH_CODE_LENGTH = 5;

/**
 * Max file size for excel upload (5MB)
 */
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Validate branch code - must be exactly 5 digits
 * @param code - Branch code to validate
 * @returns true if valid, false otherwise
 */
export const isValidBranchCode = (code: string): boolean => {
  return code.length === BRANCH_CODE_LENGTH && /^\d{5}$/.test(code);
};

/**
 * Validate branch name - must not be empty
 * @param name - Branch name to validate
 * @returns true if valid, false otherwise
 */
export const isValidBranchName = (name: string): boolean => {
  return name.trim().length > 0;
};

/**
 * Convert raw branch code from excel to 5-digit format
 * If code is 12+ digits, extract characters 5-9 (0-indexed: 4-9)
 * Otherwise pad with leading zeros
 * @param rawCode - Raw code from excel
 * @returns Converted 5-digit code
 */
export const convertBranchCode = (rawCode: string | number): string => {
  const codeStr = String(rawCode).trim();

  if (codeStr.length >= 9) {
    // Extract 5-digit code from position 4-9 (for 12+ digit bank codes like 004600833001)
    return codeStr.substring(4, 9);
  }

  // Pad with leading zeros to make 5 digits
  return codeStr.padStart(BRANCH_CODE_LENGTH, '0');
};

/**
 * Check file size
 * @param file - File to check
 * @returns Object with isValid and error message
 */
export const checkFileSize = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Dosya boyutu ${MAX_FILE_SIZE_MB}MB'dan büyük olamaz.`,
    };
  }
  return { isValid: true };
};

/**
 * Validate excel branches data
 * @param branches - Array of branches from excel
 * @returns Array of validation errors
 */
export const validateExcelBranches = (branches: BranchToAdd[]): ExcelValidationError[] => {
  const validationErrors: ExcelValidationError[] = [];

  branches.forEach((branch, index) => {
    const errors: string[] = [];

    // Check code
    if (!branch.code || branch.code.trim() === '') {
      errors.push('subeKodu');
    } else if (!isValidBranchCode(branch.code)) {
      errors.push('subeKodu');
    }

    // Check name
    if (!branch.name || branch.name.trim() === '') {
      errors.push('subeAdi');
    }

    if (errors.length > 0) {
      validationErrors.push({
        index,
        name: 'ValidationError',
        errors,
      });
    }
  });

  return validationErrors;
};

/**
 * Check if branch code already exists in list
 * @param code - Branch code to check
 * @param existingBranches - Existing branches list
 * @returns true if exists, false otherwise
 */
export const branchCodeExists = (code: string, existingBranches: BranchToAdd[]): boolean => {
  return existingBranches.some((branch) => branch.code === code);
};

/**
 * Filter out duplicate branches from new list
 * @param newBranches - New branches to add
 * @param existingBranches - Existing branches list
 * @returns Filtered branches without duplicates
 */
export const filterDuplicateBranches = (newBranches: BranchToAdd[], existingBranches: BranchToAdd[]): BranchToAdd[] => {
  const existingCodes = existingBranches.map((branch) => branch.code);
  return newBranches.filter((branch) => !existingCodes.includes(branch.code));
};
