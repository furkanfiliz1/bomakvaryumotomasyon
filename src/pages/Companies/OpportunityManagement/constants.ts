/**
 * Opportunity Management Constants
 * Following LeadManagement pattern for enums and constants
 * Enum values from Swagger API specification
 */

// Opportunity Status enum (from API)
export enum OpportunityStatus {
  IN_PROGRESS = 'InProgress',
  ON_HOLD = 'OnHold',
  COMPANY_EVALUATION = 'CompanyEvaluation',
  FIRST_CONTACT = 'FirstContact',
  MEETING_HELD = 'MeetingHeld',
  PROPOSAL_SENT = 'ProposalSent',
  IN_CONTRACT_PROCESS = 'InContractProcess',
  INVOICE_INTEGRATION = 'InvoiceIntegration',
  SUPPLIER_DEFINITION = 'SupplierDefinition',
  INVOICE_UPLOAD_COMPLETED = 'InvoiceUploadCompleted',
  WAITING_BANK_LIMIT = 'WaitingBankLimit',
  ACTIVE_BUYER = 'ActiveBuyer',
}

// Opportunity Winning Status enum (from API) - Numeric values for BE
export enum OpportunityWinningStatus {
  WON = 1,
  LOST = 2,
}

// Lead Sales Scenario enum (from API)
export enum LeadSalesScenario {
  DEFINITELY_SELLABLE = 'DefinitelySellable',
  HIGH_PROBABILITY_SELLABLE = 'HighProbabilitySellable',
  LOW_PROBABILITY_SELLABLE = 'LowProbabilitySellable',
  NOT_SELLABLE = 'NotSellable',
}
