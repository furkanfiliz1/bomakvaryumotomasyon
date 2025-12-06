/**
 * Opportunity Management Business Logic Helpers
 * Following LeadManagement pattern for utility functions
 */

import { LeadSalesScenario, OpportunityStatus, OpportunityWinningStatus } from '../constants';
import type { OpportunityFormData } from '../opportunity-management.types';

/**
 * Transform form values to API format
 * Reduces cognitive complexity by extracting transformation logic
 */
export function transformFormValuesToApiFormat(data: Record<string, unknown>): OpportunityFormData {
  return {
    subject: (data.subject as string) || '',
    isReceiverInPortal: data.isReceiverInPortal === 'true',
    receiverId: typeof data.receiverId === 'number' ? data.receiverId : null,
    receiverName: (data.receiverName as string) || '',
    customerManagerId: typeof data.customerManagerId === 'number' ? data.customerManagerId : null,
    description: (data.description as string) || '',
    salesScenario: data.salesScenario as OpportunityFormData['salesScenario'],
    statusDescription: data.statusDescription as OpportunityFormData['statusDescription'],
    lastMeetingDate: (data.lastMeetingDate as string) || undefined,
    productType: data.productType ? Number(data.productType) : undefined,
    currency: (data.currency as string) || undefined,
    estimatedLimit: (data.estimatedLimit as number) ?? null,
    estimatedMonthlyVolume: (data.estimatedMonthlyVolume as number) ?? null,
    supplierCount: (data.supplierCount as number) ?? null,
    takeRate: (data.takeRate as number) ?? null,
    estimatedMonthlyRevenue: (data.estimatedMonthlyRevenue as number) ?? null,
    estimatedClosingDate: (data.estimatedClosingDate as string) || undefined,
    offerDate: (data.offerDate as string) || undefined,
    offerQuantity: (data.offerQuantity as number) ?? null,
    offerUnitPrice: (data.offerUnitPrice as number) ?? null,
    offerTotalAmount: (data.offerTotalAmount as number) ?? null,
  };
}

/**
 * Get color for opportunity status chip
 */
export function getOpportunityStatusColor(
  status?: OpportunityStatus | null,
): 'success' | 'error' | 'warning' | 'info' | 'default' | 'primary' | 'secondary' {
  if (!status) return 'default';

  switch (status) {
    case OpportunityStatus.ACTIVE_BUYER:
    case OpportunityStatus.INVOICE_UPLOAD_COMPLETED:
      return 'success';

    case OpportunityStatus.ON_HOLD:
      return 'warning';

    case OpportunityStatus.IN_PROGRESS:
    case OpportunityStatus.FIRST_CONTACT:
    case OpportunityStatus.MEETING_HELD:
      return 'info';

    case OpportunityStatus.PROPOSAL_SENT:
    case OpportunityStatus.IN_CONTRACT_PROCESS:
      return 'primary';

    case OpportunityStatus.COMPANY_EVALUATION:
    case OpportunityStatus.INVOICE_INTEGRATION:
    case OpportunityStatus.SUPPLIER_DEFINITION:
    case OpportunityStatus.WAITING_BANK_LIMIT:
      return 'secondary';

    default:
      return 'default';
  }
}

/**
 * Get color for winning status chip
 */
export function getWinningStatusColor(status?: OpportunityWinningStatus | null): 'success' | 'error' | 'default' {
  if (!status) return 'default';

  switch (status) {
    case OpportunityWinningStatus.WON:
      return 'success';
    case OpportunityWinningStatus.LOST:
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Get color for sales scenario chip
 */
export function getSalesScenarioColor(
  scenario?: LeadSalesScenario | null,
): 'success' | 'error' | 'warning' | 'info' | 'default' {
  if (!scenario) return 'default';

  switch (scenario) {
    case LeadSalesScenario.DEFINITELY_SELLABLE:
      return 'success';
    case LeadSalesScenario.HIGH_PROBABILITY_SELLABLE:
      return 'info';
    case LeadSalesScenario.LOW_PROBABILITY_SELLABLE:
      return 'warning';
    case LeadSalesScenario.NOT_SELLABLE:
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Format currency value for display
 */
export function formatCurrencyValue(value: number | null | undefined, currency?: string | null): string {
  if (value === null || value === undefined) return '-';

  const formattedValue = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return currency ? `${formattedValue} ${currency}` : formattedValue;
}

/**
 * Format percentage value for display
 */
export function formatPercentageValue(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `%${value.toFixed(2)}`;
}
