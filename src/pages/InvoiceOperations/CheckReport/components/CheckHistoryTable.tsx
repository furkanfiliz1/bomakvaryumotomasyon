import { Table } from '@components';
import { Alert, Box } from '@mui/material';
import React from 'react';
import type { AllowanceItem } from '../check-report.types';

interface CheckHistoryTableProps {
  allowances: AllowanceItem[];
  loading: boolean;
  error: unknown;
}

/**
 * Check History Table Component
 * Displays the allowance history for a check following table patterns
 */
export const CheckHistoryTable: React.FC<CheckHistoryTableProps> = ({ allowances, loading, error }) => {
  // Define table headers following the table instruction patterns
  const tableHeaders = [
    {
      id: 'Id',
      label: 'İskonto No',
      align: 'left' as const,
      sortable: false,
    },
    {
      id: 'InsertDatetime',
      label: 'Oluşturulma Tarihi',
      align: 'left' as const,
      xsortable: false,
      type: 'date',
    },
    {
      id: 'StatusDescription',
      label: 'İskonto Statüsü',
      align: 'left' as const,
      sortable: false,
    },
    {
      id: 'FinancerCompanyName',
      label: 'Finansör',
      align: 'left' as const,
      sortable: false,
    },
  ];

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Çek tarihçesi yüklenirken hata oluştu.</Alert>
      </Box>
    );
  }

  return (
    <Table<AllowanceItem>
      id="check-history-table"
      rowId="Id"
      data={allowances}
      headers={tableHeaders}
      loading={loading}
      hidePaging={true}
      disableSorting={true}
      size="small"
      notFoundConfig={{ title: 'Çek tahsis kaydı bulunamadı' }}
    />
  );
};
