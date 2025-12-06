import { AllowanceResponseModel } from '@store';
import { RowActions } from '../common/Table/types';
import { useTheme } from '@mui/material';
import { Button, Icon } from '@components';
import { useNavigate } from 'react-router-dom';

export const allowanceRowActionsBuyer: RowActions<AllowanceResponseModel>[] = [
  {
    Element: ({ row }) => {
      const theme = useTheme();
      const navigate = useNavigate();

      return (
        <Button
          id={`allowance-detail-${row?.Id}`}
          onClick={() => navigate(`/buyer/requests/detail/${row?.Id}`)}
          sx={{ mr: 1.5, color: theme.palette.neutral[600], fontWeight: 600 }}
          variant="text"
          size="medium">
          Detay <Icon icon={'chevron-right'} size={20} />
        </Button>
      );
    },
  },
];
