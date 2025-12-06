import { AllowanceResponseModel } from '@store';
import { RowActions } from '../common/Table/types';
import { useTheme } from '@mui/material';
import { Button, Icon } from '@components';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { AllowanceKind } from '@types';

export const onClick = (row: AllowanceResponseModel | undefined, navigate: NavigateFunction) => {
  if (row?.Kind === AllowanceKind.CHEQUE) {
    navigate(`/allowances/cheques/detail/${row?.Id}`);
  }
  if (
    row?.Kind === AllowanceKind.INVOICE ||
    row?.Kind === AllowanceKind.SPOT_WITHOUT_INVOICE ||
    row?.Kind === AllowanceKind.ROTATIVE_LOAN
  ) {
    navigate(`/allowances/invoices/detail/${row?.Id}`);
  }
  if (row?.Kind === AllowanceKind.RECEIVABLE) {
    navigate(`/allowances/receivables/detail/${row?.Id}`);
  }
  if (row?.Kind === AllowanceKind.COMMERCIAL_LOAN) {
    navigate(`/allowances/commercial-loan/detail/${row?.Id}`);
  }
  if (row?.Kind === AllowanceKind.SPOT_WITH_INVOICE) {
    navigate(`/allowances/spot-loan/detail/${row?.Id}`);
  }
};

export const allowanceRowActions: RowActions<AllowanceResponseModel>[] = [
  {
    Element: ({ row }) => {
      const theme = useTheme();
      const navigate = useNavigate();

      const id =
        row?.Kind === AllowanceKind.CHEQUE
          ? `allowance-cheque-detail-${row?.Id}`
          : `allowance-invoice-detail-${row?.Id}`;

      return (
        <Button
          id={id}
          onClick={() => onClick(row, navigate)}
          sx={{ mr: 1.5, color: theme.palette.neutral[600], fontWeight: 600 }}
          variant="text"
          size="medium">
          Detay <Icon icon={'chevron-right'} size={20} />
        </Button>
      );
    },
  },
];
