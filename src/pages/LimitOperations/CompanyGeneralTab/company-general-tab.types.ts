/**
 * Company General Tab Types
 * Following OperationPricing pattern for type definitions
 * Using existing API types from limit-operations.types.ts
 */

import type {
  CompanyDetailFullResponse,
  CompanyDetailWithAllocationsResponse,
  CompanyTransferItem,
  GroupCompanyItem,
  IntegratorConfig,
  IntegratorHistoryItem,
  InvoiceTransferCheck,
  LimitAllocation,
  ScoreCompanyByIdentifier,
} from '../limit-operations.types';

// Re-export existing API types for consistency with proper aliases
// Merged type that combines both API responses
export type CompanyDetailData = CompanyDetailFullResponse & CompanyDetailWithAllocationsResponse;
export type CompanyDetailWithAllocations = CompanyDetailWithAllocationsResponse;
export type GroupCompany = GroupCompanyItem;
export type IntegratorHistory = IntegratorHistoryItem;
export type ScoreCompanyData = ScoreCompanyByIdentifier;
export type TransferListItem = CompanyTransferItem;

// Export required types for use in interfaces
export type { IntegratorConfig, InvoiceTransferCheck, LimitAllocation };

// Form data interfaces following OperationPricing pattern
export interface GeneralInformationFormData {
  transferActive: boolean;
  startTransferDate: string | null;
}

export interface ScoreInformationFormData {
  nextOutgoingDate: string;
}

// Update payload interfaces
export interface UpdateCompanyTransferPayload {
  Id?: number;
  IsActive: boolean;
  StartTransferDate?: string;
  Config?: IntegratorConfig;
}

export interface UpdateScoreCompanyPayload {
  identifier?: string;
  nextOutgoingDate?: string;
}
