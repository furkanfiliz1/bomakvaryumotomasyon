import { PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Button, Card } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  generateScoreInvoiceTransferReportsExcelFilename,
  getScoreInvoiceTransferReportsTableHeaders,
} from '../helpers';

import { History } from '@mui/icons-material';
import {
  useScoreInvoiceTransferReportsDropdownData,
  useScoreInvoiceTransferReportsFilterForm,
  useScoreInvoiceTransferReportsQueryParams,
} from '../hooks';
import { useLazyGetScoreInvoiceTransferReportsQuery } from '../score-invoice-transfer-reports.api';
import type {
  ScoreInvoiceTransferReportsFilters as FilterType,
  ScoreInvoiceTransferReportItem,
} from '../score-invoice-transfer-reports.types';
import { ScoreInvoiceTransferReportsFilters } from './ScoreInvoiceTransferReportsFilters';

/**
 * Score Invoice Transfer Reports Page Component
 * Following OperationPricing implementation patterns exactly
 */
export const ScoreInvoiceTransferReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [additionalFilters, setAdditionalFilters] = useState<Partial<FilterType>>({});

  // No dropdown data needed - legacy has only text input field
  useScoreInvoiceTransferReportsDropdownData();

  // Initialize filter form - following legacy ScoreInvoiceTransferReport.js pattern
  const { form, schema, handleSearch, handleReset } = useScoreInvoiceTransferReportsFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters - following OperationPricing pattern
  const { baseQueryParams } = useScoreInvoiceTransferReportsQueryParams({ additionalFilters });

  // Use server-side query - following OperationPricing pattern
  const {
    data,
    error,
    isLoading,
    isFetching,
    pagingConfig,
    sortingConfig,
    handleExport: handleServerSideExport,
  } = useServerSideQuery(useLazyGetScoreInvoiceTransferReportsQuery, baseQueryParams);

  // Error handling - following OperationPricing pattern
  useErrorListener(error);

  // Extract table data - following OperationPricing pattern
  const tableData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  // Table configuration - following OperationPricing pattern
  const tableHeaders = useMemo(() => getScoreInvoiceTransferReportsTableHeaders(), []);

  // Export handler - following legacy ScoreInvoiceTransferReport.js pattern
  const handleExport = () => {
    const currentIdentifier = form.getValues().identifier;
    const filename = generateScoreInvoiceTransferReportsExcelFilename(currentIdentifier);
    handleServerSideExport(filename);
  };

  return (
    <>
      <PageHeader
        title="FigoSkor Özel Entegratör Fatura Çekim Raporu"
        subtitle="Tedarikçiler adına çekilen faturaların günlük bazda özeti"
      />
      <Box mx={2}>
        {/* Filters - Following DiscountOperations pattern */}
        <ScoreInvoiceTransferReportsFilters
          form={form}
          schema={schema}
          handleExport={handleExport}
          onSubmit={handleSearch}
          onReset={handleReset}
          isLoading={isLoading || isFetching}
        />

        {/* Data Table - Following Integration Reports Excel button pattern */}
        <Card sx={{ p: 2 }}>
          <Table<ScoreInvoiceTransferReportItem>
            id="score-invoice-transfer-reports-table"
            rowId="Id" // Use Id as unique key matching API response
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            total={totalCount}>
            {/* Supplier Name + Identifier slot */}
            <Slot<ScoreInvoiceTransferReportItem> id="CompanyName">
              {(_, row) => (
                <div>
                  <div>{row?.CompanyName || '-'}</div>
                  <small style={{ color: '#666' }}>{row?.CompanyIdentifier || '-'}</small>
                </div>
              )}
            </Slot>

            {/* Integrator Name + Identifier slot */}
            <Slot<ScoreInvoiceTransferReportItem> id="Name">
              {(_, row) => (
                <div>
                  <div>{row?.Name || '-'}</div>
                  <small style={{ color: '#666' }}>{row?.Identifier || '-'}</small>
                </div>
              )}
            </Slot>

            {/* Integrator Status slot */}
            <Slot<ScoreInvoiceTransferReportItem> id="IsActive">
              {(_, row) => <span>{row?.IsActive ? 'Aktif' : 'Pasif'}</span>}
            </Slot>

            {/* Start Transfer Date slot */}
            <Slot<ScoreInvoiceTransferReportItem> id="StartTransferDate">
              {(_, row) => {
                const date = row?.Config?.StartTransferDate;
                if (!date || date === '0001-01-01T00:00:00') return <span>-</span>;
                return <span>{new Date(date).toLocaleDateString('tr-TR')}</span>;
              }}
            </Slot>

            {/* Last Transfer Date slot */}
            <Slot<ScoreInvoiceTransferReportItem> id="LastTransferDate">
              {(_, row) => {
                const date = row?.Config?.LastTransferDate;
                if (!date || date === '0001-01-01T00:00:00') return <span>-</span>;
                return <span>{new Date(date).toLocaleDateString('tr-TR')}</span>;
              }}
            </Slot>

            {/* Created Date slot */}
            <Slot<ScoreInvoiceTransferReportItem> id="CreatedDate">
              {(_, row) => {
                const date = row?.Config?.CreatedDate;
                if (!date || date === '0001-01-01T00:00:00') return <span>-</span>;
                return <span>{new Date(date).toLocaleDateString('tr-TR')}</span>;
              }}
            </Slot>

            {/* Config IsActive (Transfer Status) slot */}
            <Slot<ScoreInvoiceTransferReportItem> id="ConfigIsActive">
              {(_, row) => <span>{row?.Config?.IsActive ? 'Aktif' : 'Pasif'}</span>}
            </Slot>

            {/* Details button slot */}
            <Slot<ScoreInvoiceTransferReportItem> id="details">
              {(_, row) => (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<History />}
                  onClick={() => {
                    if (!row) return;

                    // Navigate to E-Invoice Transfer History page
                    // Following legacy navigation pattern from ScoreReports
                    const navigationState = {
                      identifier: row.CompanyIdentifier,
                      id: row.CompanyId,
                      transferId: row.Id,
                    };

                    navigate(`/limit-operations/companies/${row.CompanyId}/gecmis`, {
                      state: JSON.stringify(navigationState),
                    });
                  }}>
                  Geçmiş
                </Button>
              )}
            </Slot>
          </Table>
        </Card>
      </Box>
    </>
  );
};
