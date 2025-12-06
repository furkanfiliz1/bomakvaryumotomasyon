import { Slot, Table } from '@components';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import React, { forwardRef, useImperativeHandle } from 'react';

import { useGetCompanyOperationChargeQuery } from '../operation-charge.api';
import type { CompanyOperationChargeHistoryItem } from '../operation-charge.types';

// Utility formatters
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface ChargeHistoryTableProps {
  operationChargeId: number;
  transactionType?: string;
}

export interface ChargeHistoryTableRef {
  refetch: () => void;
}

/**
 * Charge History Table Component
 * Displays the operation charge amounts as history with proper formatting
 */
export const ChargeHistoryTable = forwardRef<ChargeHistoryTableRef, ChargeHistoryTableProps>(
  ({ operationChargeId, transactionType = '2' }, ref) => {
    const { data, isLoading, error, refetch } = useGetCompanyOperationChargeQuery(operationChargeId);

    // Expose refetch method through ref
    useImperativeHandle(
      ref,
      () => ({
        refetch: () => {
          void refetch();
        },
      }),
      [refetch],
    );
    // Transform OperationChargeAmounts array to table format (matching OperationChargeDetailListItem logic)
    const historyData: CompanyOperationChargeHistoryItem[] = React.useMemo(() => {
      if (!data?.OperationChargeAmounts || data.OperationChargeAmounts.length === 0) return [];

      return data.OperationChargeAmounts.map((charge) => ({
        MinAmount: charge.MinAmount || 0,
        MaxAmount: charge.MaxAmount || 0,
        MinDueDay: charge.MinDueDay || 0,
        MaxDueDay: charge.MaxDueDay || 0,
        MinScore: charge.MinScore || 0,
        MaxScore: charge.MaxScore || 0,
        TransactionFee: charge.TransactionFee || 0,
        PercentFee: charge.PercentFee || 0,
        UpdateDate: charge.SysLastUpdate || charge.InsertDatetime || charge.CreatedAt,
      }));
    }, [data]);

    // Determine column visibility based on transaction type (matching OperationChargeAmountsTable logic)
    const isAmountType = transactionType === '2';

    // Define table headers based on amount type
    const tableHeaders = React.useMemo(() => {
      const baseHeaders = [
        {
          id: 'MinScore',
          label: 'Min Skor',
          slot: true,
        },
        {
          id: 'MaxScore',
          label: 'Max Skor',
          slot: true,
        },
        {
          id: 'TransactionFee',
          label: 'İşlem Ücreti (Birim)',
          slot: true,
        },
        {
          id: 'PercentFee',
          label: 'İşlem Ücreti (%)',
          slot: true,
        },
        {
          id: 'UpdateDate',
          label: 'Güncellenme Tarihi',
          slot: true,
        },
      ];

      if (isAmountType) {
        return [
          {
            id: 'MinAmount',
            label: 'Minimum Tutar',
            slot: true,
          },
          {
            id: 'MaxAmount',
            label: 'Maksimum Tutar',
            slot: true,
          },
          ...baseHeaders,
        ];
      } else {
        return [
          {
            id: 'MinDueDay',
            label: 'Min Vade Günü',
          },
          {
            id: 'MaxDueDay',
            label: 'Max Vade Günü',
          },
          ...baseHeaders,
        ];
      }
    }, [isAmountType]);

    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box>
          <Alert severity="error">Geçmiş işlemler yüklenirken hata oluştu.</Alert>
        </Box>
      );
    }

    return (
      <Table<CompanyOperationChargeHistoryItem>
        id="charge-history-table"
        rowId="UpdateDate"
        data={historyData}
        headers={tableHeaders}
        size="medium"
        striped
        hidePaging
        disableSorting={false}>
        <Slot<CompanyOperationChargeHistoryItem> id="MinAmount">
          {(_, row) => <Typography variant="body2">{row?.MinAmount ? formatCurrency(row.MinAmount) : '-'}</Typography>}
        </Slot>

        <Slot<CompanyOperationChargeHistoryItem> id="MaxAmount">
          {(_, row) => <Typography variant="body2">{row?.MaxAmount ? formatCurrency(row.MaxAmount) : '-'}</Typography>}
        </Slot>

        <Slot<CompanyOperationChargeHistoryItem> id="MinScore">
          {(_, row) => {
            const value = row?.MinScore;
            if (value === null || value === undefined) return <Typography variant="body2">0</Typography>;
            return <Typography variant="body2">{value.toString()}</Typography>;
          }}
        </Slot>

        <Slot<CompanyOperationChargeHistoryItem> id="MaxScore">
          {(_, row) => {
            const value = row?.MaxScore;
            if (value === null || value === undefined) return <Typography variant="body2">0</Typography>;
            return <Typography variant="body2">{value.toString()}</Typography>;
          }}
        </Slot>

        <Slot<CompanyOperationChargeHistoryItem> id="TransactionFee">
          {(_, row) => (
            <Typography variant="body2">{row?.TransactionFee ? formatCurrency(row.TransactionFee) : '-'}</Typography>
          )}
        </Slot>

        <Slot<CompanyOperationChargeHistoryItem> id="PercentFee">
          {(_, row) => <Typography variant="body2">{row?.PercentFee ? `%${row.PercentFee}` : '-'}</Typography>}
        </Slot>

        <Slot<CompanyOperationChargeHistoryItem> id="MinDueDay">
          {(_, row) => {
            const value = row?.MinDueDay;
            if (value === null || value === undefined) return <Typography variant="body2">0</Typography>;
            return <Typography variant="body2">{value.toString()}</Typography>;
          }}
        </Slot>

        <Slot<CompanyOperationChargeHistoryItem> id="MaxDueDay">
          {(_, row) => {
            const value = row?.MaxDueDay;
            if (value === null || value === undefined) return <Typography variant="body2">0</Typography>;
            return <Typography variant="body2">{value.toString()}</Typography>;
          }}
        </Slot>

        <Slot<CompanyOperationChargeHistoryItem> id="UpdateDate">
          {(_, row) => <Typography variant="body2">{row?.UpdateDate ? formatDate(row.UpdateDate) : '-'}</Typography>}
        </Slot>
      </Table>
    );
  },
);

ChargeHistoryTable.displayName = 'ChargeHistoryTable';
