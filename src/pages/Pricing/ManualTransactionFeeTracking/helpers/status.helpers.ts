import { ManualTransactionFeeStatusOption } from '../manual-transaction-fee-tracking.types';

export const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return 'warning'; // Pending
    case 2:
      return 'success'; // Paid
    case 3:
      return 'error'; // Cancelled
    case 4:
      return 'info'; // Processing
    default:
      return 'default';
  }
};

export const getStatusOptions = (statusList: ManualTransactionFeeStatusOption[]) => {
  return [
    { value: '', label: 'Tümü' },
    ...statusList.map((status) => ({
      value: status.Value,
      label: status.Text,
    })),
  ];
};

export const formatStatusForDisplay = (statusDesc: string) => {
  return statusDesc || '-';
};
