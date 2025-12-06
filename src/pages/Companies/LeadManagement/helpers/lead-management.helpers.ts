/**
 * Lead Management Business Logic Helpers
 * Following OperationPricing pattern for utility functions
 */

import { CallResult, MembershipStatus } from '../constants';

/**
 * Get color for membership status chip
 */
export function getMembershipStatusColor(status: MembershipStatus): 'success' | 'warning' {
  switch (status) {
    case MembershipStatus.COMPLETED:
      return 'success';
    case MembershipStatus.NOT_COMPLETED:
      return 'warning';
    default:
      return 'warning';
  }
}

/**
 * Get color for call result chip
 */
export function getCallResultColor(result?: CallResult): 'success' | 'error' | 'warning' | 'info' | 'default' {
  if (!result) return 'default';

  switch (result) {
    case CallResult.POSITIVE:
    case CallResult.REQUEST_RECEIVED:
    case CallResult.PROCESSED:
      return 'success';

    case CallResult.NEGATIVE:
    case CallResult.JUNK_DATA:
    case CallResult.NO_CONTACT_INFO:
      return 'error';

    case CallResult.UNREACHABLE:
      return 'warning';

    case CallResult.FOLLOW_UP:
    case CallResult.ROUTINE_CALL:
      return 'info';

    case CallResult.ARCHIVE:
    default:
      return 'default';
  }
}

/**
 * Format products array for display
 */
export function formatProducts(products: number[]): string {
  if (!products || products.length === 0) return '-';
  if (products.length === 1) return String(products[0]);
  return `${products[0]} +${products.length - 1}`;
}

/**
 * Get full products list as tooltip content
 */
export function getProductsTooltip(products: number[]): string {
  if (!products || products.length === 0) return '';
  return products.map(String).join(', ');
}
