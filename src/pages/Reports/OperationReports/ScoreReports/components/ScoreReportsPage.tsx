import { PageHeader, Slot, Table } from '@components';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrorListener, useServerSideQuery } from 'src/hooks';
import { getScoreReportsTableHeaders } from '../helpers';
import { useScoreReportsFilterForm, useScoreReportsQueryParams } from '../hooks';
import { useLazyGetScoreReportsQuery } from '../score-reports.api';
import type { ScoreReportCompany, ScoreReportsFilterForm } from '../score-reports.types';
import { ActionsSlot, IntegratorStatusSlot, ScoreReportsFilters, StatusSlot } from './';

export const ScoreReportsPage: React.FC = () => {
  // Navigation hook for routing
  const navigate = useNavigate();

  // Filter state management - following OperationPricing pattern
  const [additionalFilters, setAdditionalFilters] = useState<Partial<ScoreReportsFilterForm>>({});

  // Initialize filter form - following SupplierReports pattern
  const { form, handleSearch } = useScoreReportsFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters - following SupplierReports pattern
  const { baseQueryParams } = useScoreReportsQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook - following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, handleExport } = useServerSideQuery(
    useLazyGetScoreReportsQuery,
    baseQueryParams,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];

  // Table configuration - using helper function
  const tableHeaders = useMemo(() => getScoreReportsTableHeaders(), []);

  // Handle Excel export using useServerSideQuery built-in export
  const handleExportClick = () => {
    const customFilename = 'skor_cekim_raporlari';
    handleExport(customFilename);
  };

  // Handle row download action - matching legacy navigation pattern
  const handleDownload = (item: ScoreReportCompany) => {
    // Legacy navigation: `/figo-score/sirketler/${cmp.CompanyId}/gecmis`
    const navigationState = {
      identifier: item.CompanyIdentifier,
      id: item.CompanyId,
    };

    // Navigate to company history page with state
    navigate(`/limit-operations/companies/${item.CompanyId}/gecmis`, {
      state: JSON.stringify(navigationState),
    });
  };

  return (
    <>
      <PageHeader title="Skor Çekim Raporları" subtitle="Tedarikçi skor çekim raporları" />

      <Box sx={{ p: 3 }}>
        {/* Filters - Using custom ScoreReportsFilters component */}
        <ScoreReportsFilters form={form} onSubmit={handleSearch} isLoading={isLoading || isFetching} />

        {/* Data Table */}
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Skor Çekim Raporları</Typography>
              <Button variant="contained" onClick={handleExportClick} disabled={isLoading || isFetching}>
                Excel
              </Button>
            </Stack>

            <Table<ScoreReportCompany>
              id="score-reports-table"
              rowId="Id"
              data={tableData}
              headers={tableHeaders}
              loading={isLoading || isFetching}
              pagingConfig={pagingConfig}>
              <Slot<ScoreReportCompany> id="IntegratorStatus">
                {(_, row) => <IntegratorStatusSlot isActive={row?.IsActive ?? false} />}
              </Slot>

              <Slot<ScoreReportCompany> id="Status">
                {(_, row) => (
                  <StatusSlot
                    status={row?.Config?.IsActive ? 1 : 3}
                    statusDescription={row?.Config?.IsActive ? 'Aktif' : 'Pasif'}
                  />
                )}
              </Slot>

              <Slot<ScoreReportCompany> id="actions">
                {(_, row) => <ActionsSlot item={row!} onDownload={handleDownload} />}
              </Slot>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
