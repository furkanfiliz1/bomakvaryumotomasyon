/**
 * Business logic helpers for bank definitions
 */

/**
 * Validate bank code format
 * @param code - Bank code to validate
 * @returns true if valid
 */
export function validateBankCode(code: string): boolean {
  return code.trim().length > 0;
}

/**
 * Validate bank name format
 * @param name - Bank name to validate
 * @returns true if valid
 */
export function validateBankName(name: string): boolean {
  return name.trim().length > 0;
}
