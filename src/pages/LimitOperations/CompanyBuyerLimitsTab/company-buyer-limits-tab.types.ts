/**
 * Company Buyer Limits Tab Type Definitions
 * Following OperationPricing pattern for type definitions
 */

import { ServerSideQueryArgs, ServerSideQueryResult } from 'src/hooks/useServerSideQuery';

/**
 * Buyer Limit Item - matches legacy API response exactly
 */
export interface BuyerLimitItem {
  /** Unique identifier for the buyer limit */
  Id: number;

  /** Date when the record was inserted */
  InsertedDate: string;

  /** Whether the buyer limit is active */
  IsActive: boolean;

  /** Receiver identifier (VKN) */
  ReceiverIdentifier: string;

  /** Maximum invoice due days */
  MaxInvoiceDueDay: number;

  /** Company limit ID this belongs to */
  CompanyLimitId: number;

  /** Maximum invoice amount */
  MaxInvoiceAmount: number;

  /** Invoice score (read-only) */
  InvoiceScore: number;
}

/**
 * Buyer Limits Response - server-side query result
 */
export type BuyerLimitsResponse = ServerSideQueryResult<BuyerLimitItem>;

/**
 * Buyer Limits Query Parameters
 */
export interface BuyerLimitsQueryParams extends ServerSideQueryArgs {
  /** Company ID to get buyer limits for */
  companyId: number;
}

/**
 * Search Buyer Limits Parameters
 */
export interface SearchBuyerLimitsParams {
  /** Company ID to search within */
  companyId: number;

  /** Receiver identifier to search for */
  ReceiverIdentifier?: string;

  /** Whether to include only active limits */
  IsActive?: boolean;
}

/**
 * Update Buyer Limit Request
 */
export interface UpdateBuyerLimitRequest {
  /** Buyer limit ID to update */
  Id: number;

  /** Company limit ID */
  CompanyLimitId: number;

  /** Receiver identifier (VKN) - read-only but required */
  ReceiverIdentifier: string;

  /** Maximum invoice due days */
  MaxInvoiceDueDay: number;

  /** Maximum invoice amount */
  MaxInvoiceAmount: number;

  /** Whether the buyer limit is active */
  IsActive: boolean;

  /** Invoice score - read-only but included in request */
  InvoiceScore: number;
}

/**
 * Sync Buyer Concentration Request
 */
export interface SyncBuyerConcentrationRequest {
  /** Company identifier for concentration calculation */
  identifier: string;
}

/**
 * Form data for buyer limit editing (client-side only)
 */
export interface BuyerLimitFormData {
  /** Maximum invoice amount as string for form input */
  maxInvoiceAmount: string;

  /** Maximum invoice due days as string for form input */
  maxInvoiceDueDay: string;

  /** Whether the buyer limit is active */
  isActive: boolean;
}

/**
 * Search form data
 */
export interface BuyerLimitsSearchFormData {
  /** VKN to search for */
  receiverIdentifier: string;
}
