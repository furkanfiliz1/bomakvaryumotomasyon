import { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers configuration for representative target entry
 * Matches legacy table columns exactly
 */
export function getRepresentativeTargetTableHeaders(): HeadCell[] {
  return [
    {
      id: 'FullName',
      label: 'Müşteri Temsilcisi',
      width: 200,
      slot: true, // Custom slot for full name display
    },
    {
      id: 'MonthYear',
      label: 'Ay / Yıl',
      width: 150,
      slot: true, // Custom slot for formatted month/year display
    },
    {
      id: 'TargetTypeName',
      label: 'Hedef Tipi',
      width: 250,
    },
    {
      id: 'Amount',
      label: 'Hedef Tutarı',
      width: 150,
      type: 'currency',
    },
    {
      id: 'actions',
      label: '',
      width: 100,
      slot: true, // Custom slot for action buttons
    },
  ];
}
