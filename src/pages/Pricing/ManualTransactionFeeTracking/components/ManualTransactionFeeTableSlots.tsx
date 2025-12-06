import { Chip } from '@mui/material';
import { ManualTransactionFeeItem } from '../manual-transaction-fee-tracking.types';
import { getStatusColor } from '../helpers';

interface StatusSlotProps {
  row: ManualTransactionFeeItem;
}

export const StatusSlot = ({ row }: StatusSlotProps) => {
  return <Chip label={row.StatusDescription || '-'} color={getStatusColor(row.Status)} size="small" variant="filled" />;
};

export default StatusSlot;
