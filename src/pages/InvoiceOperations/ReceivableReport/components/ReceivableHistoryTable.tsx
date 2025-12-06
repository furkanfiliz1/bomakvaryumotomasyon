import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Chip, Box, CircularProgress, Alert } from '@mui/material';
import { Table, Slot } from '@components';
import { useErrorListener } from '@hooks';
import { useGetReceivableHistoryQuery } from '../receivable-report.api';
import { getStatusChipColor } from '../helpers';
import type { ReceivableHistoryItem } from '../receivable-report.types';
import type { HeadCell } from 'src/components/common/Table/types';

interface ReceivableHistoryTableProps {
  orderId: number;
}

/**
 * Receivable History Table Component
 * Displays history data for a specific receivable order
 * Follows OperationPricing table patterns with Turkish labels matching screenshot
 */
export const ReceivableHistoryTable: React.FC<ReceivableHistoryTableProps> = ({ orderId }) => {
  // Fetch history data
  const { data: historyData, error, isLoading } = useGetReceivableHistoryQuery(orderId);

  // Error handling
  useErrorListener(error);

  // Table headers matching the screenshot
  const tableHeaders = useMemo(
    (): HeadCell[] => [
      {
        id: 'Id',
        label: 'Talep No',
        width: 100,
      },
      {
        id: 'InsertDatetime',
        label: 'Oluşturulma Tarihi',
        type: 'date',
        width: 180,
      },
      {
        id: 'StatusDescription',
        label: 'Alacak Statüsü',
        slot: true,
        width: 200,
      },
      {
        id: 'AllowanceOrderStatus',
        label: 'Talep Statüsü',
        slot: true,
        width: 200,
      },
      {
        id: 'FinancerCompanyName',
        label: 'Finansör',
        slot: true,
        width: 150,
      },
    ],
    [],
  );

  // Memoized table data
  const tableData = useMemo(() => historyData || [], [historyData]);

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Alacak tarihçesi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Alacak Tarihçesi
        </Typography>

        <Table<ReceivableHistoryItem>
          id="receivable-history-table"
          rowId="Id"
          headers={tableHeaders}
          data={tableData}
          size="small"
          hidePaging
          striped
          notFoundConfig={{
            title: 'Tarihçe bulunamadı',
            subTitle: 'Bu alacak için henüz tarihçe kaydı bulunmamaktadır.',
          }}>
          {/* Status chip slot */}
          <Slot<ReceivableHistoryItem> id="StatusDescription">
            {(_, row) => {
              if (!row?.StatusDescription) return <Typography variant="body2">-</Typography>;

              return (
                <Chip
                  label={row.StatusDescription}
                  color={getStatusChipColor(row.Status)}
                  size="small"
                  variant="filled"
                />
              );
            }}
          </Slot>

          {/* Allowance Order Status chip slot */}
          <Slot<ReceivableHistoryItem> id="AllowanceOrderStatus">
            {(_, row) => {
              if (!row?.AllowanceOrderStatus) return <Typography variant="body2">-</Typography>;

              return (
                <Chip
                  label={row.AllowanceOrderStatus}
                  color={getStatusChipColor(row.Status)}
                  size="small"
                  variant="outlined"
                />
              );
            }}
          </Slot>

          {/* Financer company name slot */}
          <Slot<ReceivableHistoryItem> id="FinancerCompanyName">
            {(_, row) => (
              <Typography variant="body2" fontWeight="medium">
                {row?.FinancerCompanyName || '-'}
              </Typography>
            )}
          </Slot>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReceivableHistoryTable;
