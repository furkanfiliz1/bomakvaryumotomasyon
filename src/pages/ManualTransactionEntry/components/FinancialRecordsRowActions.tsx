import { Delete, Edit } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { FinancialRecord } from '../manual-transaction-entry.types';

interface FinancialRecordsRowActionsProps {
  row?: FinancialRecord;
  onEdit: (recordId: number) => void;
  onDelete: (recordId: number) => void;
}

export const FinancialRecordsRowActions = ({ row, onEdit, onDelete }: FinancialRecordsRowActionsProps) => {
  if (!row?.Id) return null;

  return (
    <Stack direction="row" spacing={1}>
      <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => onEdit(row.Id!)}>
        Güncelle
      </Button>

      <Button size="small" variant="outlined" color="error" startIcon={<Delete />} onClick={() => onDelete(row.Id!)}>
        Sil
      </Button>
    </Stack>
  );
};
