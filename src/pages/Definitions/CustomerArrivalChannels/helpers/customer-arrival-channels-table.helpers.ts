import { HeadCell } from 'src/components/common/Table/types';

/**
 * Table header configuration for Customer Arrival Channels
 * Following OperationPricing table configuration patterns
 */
export const getCustomerArrivalChannelsTableHeaders = (): HeadCell[] => [
  {
    id: 'Value',
    label: 'Kanal Adı',
    width: 300,
  },
  {
    id: 'Rate',
    label: 'Oran',
    width: 150,
    type: 'number', // Auto-formats numbers
  },
  {
    id: 'IsConsensus',
    label: 'Mutabakat Yapılacak mı?',
    width: 150,
    slot: true, // Custom slot for Chip rendering
  },
  {
    id: 'actions',
    label: 'İşlemler',
    width: 200,
    slot: true, // Custom slot for action buttons
    isSortDisabled: true,
  },
];
