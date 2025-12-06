/**
 * Company Representative Settings Helper Functions
 * Business logic and utility functions following OperationPricing patterns
 */

import type {
  BulkUpdateFormData,
  CompanyCustomerManagerItem,
  UpdateCompanyCustomerManagerRequest,
} from '../company-representative-settings.types';

/**
 * Transform form data to API request format for individual updates
 * Matches legacy putCompanyCustomerManager format exactly
 */
export function transformRowToApiRequest(row: CompanyCustomerManagerItem): UpdateCompanyCustomerManagerRequest {
  return {
    CompanyCustomerManagers: [
      {
        companyId: row.CompanyId,
        startDate: row.StartDate,
        managerUserId: row.ManagerUserId,
        productType: row.ProductType,
        financerCompanyId: row.FinancerCompanyId,
        companyCustomerManagerId: row.CompanyCustomerManagerId,
        buyerCompanyId: row.BuyerCompanyId,
      },
    ],
  };
}

/**
 * Transform bulk update form data to API request format
 * Matches legacy bulk update format exactly
 */
export function transformBulkUpdateToApiRequest(
  selectedRows: CompanyCustomerManagerItem[],
  formData: BulkUpdateFormData,
): UpdateCompanyCustomerManagerRequest {
  return {
    CompanyCustomerManagers: selectedRows.map((row) => ({
      companyId: row.CompanyId,
      startDate: formData.startDate,
      managerUserId: formData?.managerUserId || 0,
      productType: formData?.productType || 0,
      financerCompanyId: formData?.financerCompanyId || null,
      companyCustomerManagerId: row.CompanyCustomerManagerId,
      buyerCompanyId: formData?.buyerCompanyId || null,
    })),
  };
}

/**
 * Validate individual row data before update
 * Matches legacy validation logic exactly
 */
export function validateRowData(row: CompanyCustomerManagerItem): boolean {
  // Basic required fields
  const hasRequiredFields = row.ManagerUserId && row.StartDate && row.ProductType;

  // Special validation for Fatura Finansmanı (ProductType = 3)
  const isInvoiceFinancing = row.ProductType === 3 || row.ProductType === ('3' as unknown as number);

  if (isInvoiceFinancing) {
    return Boolean(hasRequiredFields && row.FinancerCompanyId);
  }

  return Boolean(hasRequiredFields);
}

/**
 * Validate bulk update form data before submission
 * Matches legacy validation logic exactly
 */
export function validateBulkUpdateData(formData: BulkUpdateFormData): boolean {
  // Basic required fields
  const hasRequiredFields = formData.managerUserId && formData.startDate;

  // Special validation for Fatura Finansmanı (ProductType = 3)
  const isInvoiceFinancing = formData.productType === 3 || formData.productType === ('3' as unknown as number);

  if (isInvoiceFinancing) {
    return Boolean(hasRequiredFields && formData.financerCompanyId);
  }

  return Boolean(hasRequiredFields);
}

/**
 * Check if financer field should be disabled based on product type
 * Matches legacy conditional logic exactly
 */
export function isFinancerDisabled(productType: number | string): boolean {
  return productType !== 3 && productType !== '3';
}

export function isBuyerDisabled(productType: number | string): boolean {
  return productType !== 2 && productType !== '2';
}

/**
 * Check if a row should be disabled based on VKN (CompanyIdentifier) rules
 *
 * Business Rule: When multiple records share the same VKN (Tax Number):
 * - Only the FIRST record is selectable and editable
 * - All other records with the same VKN are disabled
 *
 * This prevents duplicate VKN assignments and ensures data consistency
 *
 * @param row The row to check for disabled state
 * @param allRows All rows in the current table data
 * @returns true if the row should be disabled, false if it should be enabled
 */
export function isRowDisabledByVKN(row: CompanyCustomerManagerItem, allRows: CompanyCustomerManagerItem[]): boolean {
  // Find all rows with the same VKN (CompanyIdentifier)
  const rowsWithSameVKN = allRows.filter((r) => r.CompanyIdentifier === row.CompanyIdentifier);

  // If there's only one record with this VKN, it's not disabled
  if (rowsWithSameVKN.length <= 1) {
    return false;
  }

  // Find the first record with this VKN (by array order)
  // The first occurrence in the array is considered the "primary" record
  const firstRecord = rowsWithSameVKN[0];

  // Disable if this is not the first record with this VKN
  return row.CompanyCustomerManagerId !== firstRecord.CompanyCustomerManagerId;
}

/**
 * Check if a row should be disabled (combines all disabled rules)
 *
 * This is the main function to use in the table component for determining
 * which rows should be disabled from selection and editing.
 *
 * Currently applies:
 * - VKN-based disabled rule (only first record per VKN is enabled)
 *
 * @param row The row to check for disabled state
 * @param allRows All rows in the current table data
 * @returns true if the row should be disabled, false if it should be enabled
 */
export function isRowDisabled(row: CompanyCustomerManagerItem, allRows: CompanyCustomerManagerItem[]): boolean {
  // Apply VKN-based disabled rule
  return isRowDisabledByVKN(row, allRows);
}

/**
 * Format company display text for table
 * Matches legacy display format exactly
 */
export function formatCompanyDisplay(row: CompanyCustomerManagerItem): {
  primary: string;
  secondary: string;
} {
  return {
    primary: row.CompanyIdentifier,
    secondary: row.CompanyName,
  };
}

/**
 * Get manager name by ID from manager list
 * Helper for displaying manager names in table
 */
export function getManagerNameById(managerId: number, managerList: Array<{ Id: number; FullName: string }>): string {
  const manager = managerList.find((m) => m.Id === managerId);
  return manager?.FullName || '';
}

/**
 * Get product type description by value
 * Helper for displaying product type descriptions in table
 */
export function getProductTypeDescription(
  productType: number | string,
  productTypeList: Array<{ Value: string; Description: string }>,
): string {
  const type = productTypeList.find((t) => t.Value === String(productType));
  return type?.Description || '';
}

/**
 * Get financer name by ID from financer list
 * Helper for displaying financer names in table
 */
export function getFinancerNameById(
  financerId: number | null,
  financerList: Array<{ Id: number; CompanyName: string }>,
): string {
  if (!financerId) return '';
  const financer = financerList.find((f) => f.Id === financerId);
  return financer?.CompanyName || '';
}

/**
 * Get buyer company name by ID from buyer company list
 * Helper for displaying buyer company names in table
 */
export function getBuyerCompanyNameById(
  buyerId: number | null,
  buyerList: Array<{ Id: number; CompanyName: string }>,
): string {
  if (!buyerId) return '';
  const buyer = buyerList.find((b) => b.Id === buyerId);
  return buyer?.CompanyName || '';
}
