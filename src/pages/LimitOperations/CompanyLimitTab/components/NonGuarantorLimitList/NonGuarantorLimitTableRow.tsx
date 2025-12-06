/**
 * Non-Guarantor Limit Table Row Component
 * Uses TableRow and TableCell like GuarantorLimitTableRow with non-guarantor business logic
 */

import { Delete, Info, Refresh } from '@mui/icons-material';
import { Box, IconButton, TableCell, TableRow, Theme, Tooltip, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import React from 'react';
import InputCurrencyWithoutForm from '../../../../../components/common/Form/InputCurrencyWithoutForm';
import { currencyFormatter } from '../../../../../utils/currency';
import type { NonGuarantorCompanyListItem } from '../../company-limit-tab.types';

interface NonGuarantorLimitTableRowProps {
  limit: NonGuarantorCompanyListItem;
  index: number;
  groupDescription: string;
  onUpdate: () => void;
  onDelete: () => void;
  onFieldChange: (name: string, value: unknown, index: number) => void;
  onShowErrorMessage: (message: string) => void;
  isLoading: boolean;
}

// Helper functions to reduce complexity
const getFinancialStatusText = (isFinancialStatus: boolean | null | undefined): string => {
  if (isNil(isFinancialStatus)) {
    return '-';
  }
  return isFinancialStatus ? 'Fokus Var' : 'Fokus Yok';
};

const getColumnWidth = (isInvoiceFinancing: boolean, invoiceWidth: number, normalWidth: number) => ({
  width: isInvoiceFinancing ? invoiceWidth : normalWidth,
  minWidth: isInvoiceFinancing ? invoiceWidth : normalWidth,
  maxWidth: isInvoiceFinancing ? invoiceWidth : normalWidth,
});

const renderTotalLimitCell = (
  limit: NonGuarantorCompanyListItem,
  index: number,
  onFieldChange: (name: string, value: unknown, index: number) => void,
  isLoading: boolean,
) => {
  if (limit.IsManuel) {
    return (
      <InputCurrencyWithoutForm
        value={limit.TotalLimit || 0}
        onChange={(value: string | number) => {
          onFieldChange('TotalLimit', Number(value), index);
        }}
        currency="TRY"
        name={`defLimitNonGuarantor_${limit.Id}`}
        id={`defLimitNonGuarantor_${limit.Id}`}
        maxLength={15}
        disabled={isLoading}
      />
    );
  }

  return <Typography variant="body2">{currencyFormatter(limit.TotalLimit, 'TRY')}</Typography>;
};

const renderActions = (
  limit: NonGuarantorCompanyListItem,
  onUpdate: () => void,
  onDelete: () => void,
  isLoading: boolean,
  theme: Theme,
  onShowErrorMessage?: (message: string) => void,
) => {
  if (limit.IsManuel) {
    return (
      <>
        <IconButton
          color="info"
          onClick={onUpdate}
          disabled={isLoading}
          size="small"
          sx={{ border: '1px solid', borderColor: theme.palette.info.dark, borderRadius: 1 }}>
          <Refresh fontSize="small" sx={{ color: theme.palette.info.dark }} />
        </IconButton>
        <IconButton
          color="error"
          onClick={onDelete}
          disabled={isLoading}
          size="small"
          sx={{ border: '1px solid', borderColor: theme.palette.error[700], borderRadius: 1 }}>
          <Delete fontSize="small" sx={{ color: theme.palette.error[700] }} />
        </IconButton>
      </>
    );
  }

  if (limit.ErrorMessage && limit.ErrorMessage !== '') {
    return (
      <IconButton
        size="small"
        onClick={() => onShowErrorMessage?.(limit.ErrorMessage || '')}
        sx={{ border: '1px solid', borderColor: 'text.primary', borderRadius: 1 }}>
        <Info fontSize="small" />
      </IconButton>
    );
  }

  return null;
};

export const NonGuarantorLimitTableRow: React.FC<NonGuarantorLimitTableRowProps> = ({
  limit,
  index,
  groupDescription,
  onUpdate,
  onDelete,
  onFieldChange,
  onShowErrorMessage,
  isLoading,
}) => {
  const theme = useTheme();
  const isInvoiceFinancing = groupDescription === 'Fatura Finansmanı';

  return (
    <TableRow key={limit.Id}>
      {/* Finansör */}
      <TableCell sx={getColumnWidth(isInvoiceFinancing, 140, 160)}>
        <Tooltip title={limit.FinancerName || '-'} arrow>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: limit.FinancerName ? 'help' : 'default',
            }}>
            {limit.FinancerName || '-'}
          </Typography>
        </Tooltip>
      </TableCell>

      {/* Tanımlanan Limit - Editable only if IsManuel */}
      <TableCell sx={{ width: 120, minWidth: 120, maxWidth: 120 }}>
        {renderTotalLimitCell(limit, index, onFieldChange, isLoading)}
      </TableCell>

      {/* Aktif Limit */}
      <TableCell sx={getColumnWidth(isInvoiceFinancing, 120, 140)}>
        <Typography variant="body2">{currencyFormatter(limit.AvailableLimit, 'TRY')}</Typography>
      </TableCell>

      {/* Finansör Teminatsız Limit - only for Fatura Finansmanı (ProductType 3) */}
      {isInvoiceFinancing && (
        <TableCell sx={{ width: 150, minWidth: 150, maxWidth: 150 }}>
          <Typography variant="body2">{currencyFormatter(limit.FinancerUnsecuredLimit, 'TRY')}</Typography>
        </TableCell>
      )}

      {/* Figo Toplam */}
      <TableCell sx={getColumnWidth(isInvoiceFinancing, 120, 140)}>
        <Typography variant="body2">{currencyFormatter(limit.FigoTotalLimit, 'TRY')}</Typography>
      </TableCell>

      {/* Figo Kalan */}
      <TableCell sx={getColumnWidth(isInvoiceFinancing, 120, 140)}>
        <Typography variant="body2">{currencyFormatter(limit.FigoAvailableLimit, 'TRY')}</Typography>
      </TableCell>

      {/* Hold */}
      <TableCell sx={getColumnWidth(isInvoiceFinancing, 70, 80)}>
        <Typography variant="body2">{limit.Hold ? 'İşlem Kısıtı Var' : '-'}</Typography>
      </TableCell>

      {/* Fokus */}
      <TableCell sx={getColumnWidth(isInvoiceFinancing, 70, 80)}>
        <Typography variant="body2">{getFinancialStatusText(limit.IsFinancialStatus)}</Typography>
      </TableCell>

      {/* Vade Tarihi */}
      <TableCell sx={getColumnWidth(isInvoiceFinancing, 100, 120)}>
        <Typography variant="body2">
          {limit.LimitMaturityDate ? `${dayjs(limit.LimitMaturityDate).format('DD.MM.YYYY')}` : '-'}
        </Typography>
      </TableCell>

      {/* Actions - matching legacy IsManuel logic */}
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
          {renderActions(limit, onUpdate, onDelete, isLoading, theme, onShowErrorMessage)}
        </Box>
      </TableCell>
    </TableRow>
  );
};
