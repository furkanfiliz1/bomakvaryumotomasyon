/**
 * Integrator Reconciliation Charts Table Configuration
 * Table headers and column definitions
 * Following OperationPricing table patterns
 */

import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table header configuration
 * Matches legacy renderListHeader column order and labels exactly
 */
export function getIntegratorChartsTableHeaders(): HeadCell[] {
  return [
    {
      id: 'MinAmount',
      label: 'Min. Tutar',
      type: 'number', // Auto-formats with thousand separator
      width: 200,
    },
    {
      id: 'MaxAmount',
      label: 'Max. Tutar',
      type: 'number',
      width: 200,
    },
    {
      id: 'PercentFee',
      label: 'İşlem Ücreti (%)',
      slot: true, // Custom slot for "%" prefix
      width: 200,
    },
    {
      id: 'TransactionFee',
      label: 'İşlem Ücreti (Birim)',
      type: 'currency', // Auto-formats as currency
      width: 200,
    },
    {
      id: 'actions',
      label: '',
      slot: true, // Custom slot for delete button
      width: 100,
    },
  ];
}
