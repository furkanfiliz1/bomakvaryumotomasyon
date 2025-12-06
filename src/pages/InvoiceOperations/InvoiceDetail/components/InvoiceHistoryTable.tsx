import { Table } from '@components';
import { Alert, Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import type { HeadCell } from 'src/components/common/Table/types';
import type { InvoiceHistory } from '../../invoice-operations.types';

interface InvoiceHistoryTableProps {
  histories: InvoiceHistory[];
  loading: boolean;
  error: unknown;
}

export const InvoiceHistoryTable: React.FC<InvoiceHistoryTableProps> = ({ histories, loading, error }) => {
  // Table headers for invoice history
  const tableHeaders: HeadCell[] = [
    { id: 'AllowanceId', label: 'İskonto No' },
    { id: 'InsertDateTime', label: 'Oluşturma Tarihi', type: 'date' },
    { id: 'AllowanceInvoiceStatusDescription', label: 'Fatura Statüsü' },
    { id: 'AllowanceStatusDescription', label: 'İskonto Statüsü' },
    { id: 'FinancerCompanyName', label: 'Finansör' },
  ];

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">Fatura geçmişi yüklenirken hata oluştu.</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!histories.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
            Bu fatura için işlem geçmişi bulunamadı.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Table
          id="invoice-history-table"
          rowId="AllowanceId"
          headers={tableHeaders}
          data={histories}
          loading={loading}
          hidePaging={histories.length <= 10}
        />
      </CardContent>
    </Card>
  );
};
