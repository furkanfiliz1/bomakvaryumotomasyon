/**
 * Lead Detail Helper Functions
 * Business logic and utility functions for lead detail pages
 * Following OperationPricing helper pattern
 */

import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers for call history
 * Following tables.instructions.md patterns
 * Using BE field names (PascalCase) directly
 */
export function getCallHistoryTableHeaders(): HeadCell[] {
  return [
    { id: 'CallerName', label: 'Arayan Kişi' },
    { id: 'CallResult', label: 'Arama Sonucu', slot: true },
    { id: 'SalesScenario', label: 'Satış Senaryosu', slot: true },
    { id: 'FollowUpDate', label: 'Takip Tarihi', type: 'date' },
    { id: 'Notes', label: 'Notlar' },
    { id: 'CallDate', label: 'Arama Tarihi', type: 'date' },
  ];
}
