/**
 * Guarantor Limit Table Row Component
 * Individual table row for guarantor limit details
 */

import { Delete, Info, Refresh } from '@mui/icons-material';
import { Box, IconButton, MenuItem, Select, TableCell, TableRow, Tooltip, Typography, useTheme } from '@mui/material';
import { currencyFormatter } from '@utils';
import React from 'react';
import InputCurrencyWithoutForm from '../../../../../components/common/Form/InputCurrencyWithoutForm';
import type { GuarantorCompanyListItem } from '../../company-limit-tab.types';

interface LimitDetail {
  Id: number;
  FinancerId?: number | null;
  FinancerName?: string | null;
  Ratio?: number | null;
  TotalLimit?: number | null;
  UsedLimit?: number | null;
  RemainingLimit?: number | null;
  IsHold?: boolean | null;
}

interface GuarantorLimitTableRowProps {
  limit: GuarantorCompanyListItem;
  detail: LimitDetail;
  onUpdateLimit: (limitId: number, detailId: number) => void;
  onDeleteLimit: (detailId: number) => void;
  onTotalLimitChange: (limitId: number, detailId: number, totalLimit: number) => void;
  onIsHoldChange: (limitId: number, detailId: number, isHold: boolean) => void;
  onShowRisksModal: (financerId: number, productType: number) => void;
  isLoading: boolean;
}

export const GuarantorLimitTableRow: React.FC<GuarantorLimitTableRowProps> = ({
  limit,
  detail,
  onUpdateLimit,
  onDeleteLimit,
  onTotalLimitChange,
  onIsHoldChange,
  onShowRisksModal,
  isLoading,
}) => {
  const theme = useTheme();
  return (
    <TableRow key={detail.Id}>
      <TableCell sx={{ maxWidth: 120, minWidth: 120, width: 120 }}>
        <Tooltip title={detail.FinancerName || '-'} arrow>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: detail.FinancerName ? 'help' : 'default',
            }}>
            {detail.FinancerName || '-'}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ width: 100, minWidth: 100, maxWidth: 100 }}>
        <Typography variant="body2">%{detail.Ratio || '-'}</Typography>
      </TableCell>
      <TableCell sx={{ width: 160, minWidth: 160, maxWidth: 160 }}>
        <InputCurrencyWithoutForm
          value={detail.TotalLimit || 0}
          onChange={(value: string | number) => {
            // Update state immediately like legacy implementation
            onTotalLimitChange(limit.Id, detail.Id, Number(value));
          }}
          currency="TRY"
          name={`defLimit_${detail.Id}`}
          id={`defLimit_${detail.Id}`}
          maxLength={15}
        />
      </TableCell>
      <TableCell sx={{ width: 140, minWidth: 140, maxWidth: 140 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{ flex: 1 }}
            color={detail.UsedLimit && detail.UsedLimit > 0 ? 'red' : 'text.primary'}>
            {currencyFormatter(detail.UsedLimit, 'TRY')}
          </Typography>
          {Boolean(detail.UsedLimit && detail.UsedLimit > 0) && (
            <IconButton
              size="small"
              color="info"
              onClick={() => onShowRisksModal(detail.FinancerId || 0, limit.ProductType)}
              title="Risk detaylarını görüntüle"
              sx={{ p: 0.25 }}>
              <Info fontSize="small" />
            </IconButton>
          )}
        </Box>
      </TableCell>
      <TableCell sx={{ width: 130, minWidth: 130, maxWidth: 130 }}>
        <Typography variant="body2">{currencyFormatter(detail.RemainingLimit, 'TRY')}</Typography>
      </TableCell>
      <TableCell sx={{ width: 80, minWidth: 80, maxWidth: 80 }}>
        {limit.ProductType === 3 || limit.ProductType === 4 ? (
          <Select
            value={String(detail.IsHold || false)}
            onChange={(e) => onIsHoldChange(limit.Id, detail.Id, e.target.value === 'true')}
            size="small"
            sx={{
              width: '100%',
              fontSize: '12px',
              '& .MuiInputBase-input': {
                borderRadius: 2,
                border: '1px solid',
                backgroundColor: '#fff',
                borderColor: (theme) => theme.palette.grey[300],
                padding: '4px 8px',
                fontSize: '12px',
                '&:focus, &:hover': {
                  boxShadow: (theme) => `${theme.palette.primary.main}40 0 0 0 0.2rem`,
                  borderColor: (theme) => theme.palette.primary.main,
                },
              },
              '& fieldset': {
                border: 'none !important',
              },
            }}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              style: {
                maxHeight: '200px',
              },
            }}>
            <MenuItem value="false" sx={{ fontSize: '12px' }}>
              Hayır
            </MenuItem>
            <MenuItem value="true" sx={{ fontSize: '12px' }}>
              Evet
            </MenuItem>
          </Select>
        ) : (
          <Typography variant="body2" color="text.disabled" align="left">
            -
          </Typography>
        )}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          width: 120,
          minWidth: 120,
          maxWidth: 120,
          position: 'sticky',
          right: 0,
          backgroundColor: 'white',
          zIndex: 1,
          borderLeft: '1px solid #e0e0e0',
        }}>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <IconButton
            color="info"
            onClick={() => onUpdateLimit(limit.Id, detail.Id)}
            disabled={isLoading}
            size="small"
            sx={{ border: '1px solid', borderColor: theme.palette.info.dark, borderRadius: 1 }}>
            <Refresh fontSize="small" sx={{ color: theme.palette.info.dark }} />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDeleteLimit(detail.Id)}
            disabled={isLoading}
            size="small"
            sx={{ border: '1px solid', borderColor: theme.palette.error[700], borderRadius: 1 }}>
            <Delete fontSize="small" sx={{ color: theme.palette.error[700] }} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};
