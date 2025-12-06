import { Form, PageHeader, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Download, ExpandLess, ExpandMore, Search } from '@mui/icons-material';
import { Box, Button, Card, IconButton, Stack, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { getOperationReportsTableHeaders } from '../helpers/integration-reports-table.helpers';
import { useIntegrationReportsFilterForm, useIntegrationReportsQueryParams } from '../hooks';
import { useLazyGetIntegrationTransactionsQuery } from '../integration-reports.api';
import type { IntegrationReportsFilters, IntegrationTransactionItem } from '../integration-reports.types';
import { IntegrationReportsCollapseDetails } from './IntegrationReportsCollapseDetails';

/**
 * Toggle button component for expand/collapse actions
 */
interface RowToggleButtonProps {
  row?: IntegrationTransactionItem;
  isCollapseOpen?: boolean;
  toggleCollapse?: () => void;
  index?: number;
}

const RowToggleButton: React.FC<RowToggleButtonProps> = ({ toggleCollapse, isCollapseOpen }) => {
  if (!toggleCollapse) return null;

  return (
    <Tooltip title={isCollapseOpen ? 'Detayları Gizle' : 'Detayları Göster'}>
      <IconButton size="small" onClick={toggleCollapse} color="primary">
        {isCollapseOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

/**
 * Collapse content component wrapper
 */
const IntegrationReportsCollapse = ({ row }: { row: IntegrationTransactionItem }) => (
  <IntegrationReportsCollapseDetails row={row} />
);

/**
 * Main Integration Reports list page component
 * Provides 100% feature/UI parity with legacy implementation
 * Following OperationPricing pattern exactly
 */
export const IntegrationReportsListPage: React.FC = () => {
  const [additionalFilters, setAdditionalFilters] = useState<Partial<IntegrationReportsFilters>>({});

  // Initialize filter form following OperationPricing pattern
  const { form, schema, handleSearch, handleClear } = useIntegrationReportsFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters
  const { baseQueryParams } = useIntegrationReportsQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport } = useServerSideQuery(
    useLazyGetIntegrationTransactionsQuery,
    baseQueryParams,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items ?? [];
  const totalCount = data?.TotalCount ?? 0;

  // Table headers configuration
  const tableHeaders = getOperationReportsTableHeaders();

  // Handle modal operations
  const handleExportClick = () => {
    const customFilename = 'entegrasyon_raporlari';
    handleExport(customFilename);
  };

  return (
    <>
      <PageHeader title="Entegrasyon Raporları" subtitle="Entegrasyon işlemlerinin raporlarını görüntüleyin" />

      <Box mx={2}>
        {/* Filter Form */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema}>
            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={handleClear} startIcon={<Clear />}>
                Temizle
              </Button>
              <Button variant="contained" onClick={handleSearch} startIcon={<Search />}>
                Uygula
              </Button>

              <Button
                variant="contained"
                onClick={handleExportClick}
                disabled={isLoading || isFetching}
                startIcon={<Download />}>
                Excel
              </Button>
            </Stack>
          </Form>
        </Card>

        {/* Data Table */}
        <Card>
          <Table<IntegrationTransactionItem>
            id="integration-reports-table"
            rowId="AllowanceTransactionId"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            total={totalCount}
            rowActions={[
              {
                Element: RowToggleButton,
                isCollapseButton: true,
              },
            ]}
            CollapseComponent={IntegrationReportsCollapse}
          />
        </Card>
      </Box>
    </>
  );
};
