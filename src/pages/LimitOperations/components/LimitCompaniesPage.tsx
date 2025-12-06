import { Box, Button, Card, Chip, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { EnterEventHandle, Form, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Download, Search } from '@mui/icons-material';
import { PageHeader } from '../../../components/shared';
import {
  formatCompanyInfo,
  getCompaniesTableHeaders,
  getLimitStatusBadge,
  getRiskStatusBadge,
} from '../helpers/companies-table-config.helpers';
import { useCompaniesFilterForm } from '../hooks/useCompaniesFilterForm';
import { useLazyGetCompaniesScoringQuery } from '../limit-operations.api';
import type { CompaniesScoringParams, CompanyScoring } from '../limit-operations.types';
import { CompanyTableRowActions } from './CompanyTableRowActions';

const LimitCompaniesPage = () => {
  const [filters, setFilters] = useState<Partial<CompaniesScoringParams>>({});

  // Use the useServerSideQuery hook for data fetching
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport } = useServerSideQuery(
    useLazyGetCompaniesScoringQuery,
    filters,
  );

  // Initialize filter form
  const { form, schema, handleSearch, handleReset } = useCompaniesFilterForm({
    onFilterChange: setFilters,
  });

  // Form submit handler for EnterEventHandle
  const handleFormSubmit = form.handleSubmit(handleSearch);

  // Error handling
  useErrorListener(error);

  const headers = getCompaniesTableHeaders();

  const handleExportClick = () => {
    const customFilename = 'sirketler';
    handleExport(customFilename);
  };

  return (
    <>
      <PageHeader
        title="Fatura Finansman Şirketler"
        subtitle="Figoskor sürecine dahil olan firmaları listeleyebilirsiniz"
      />
      <Box mx={2}>
        {/* Filters */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1}>
                <Button variant="outlined" onClick={handleReset} startIcon={<Clear />}>
                  Temizle
                </Button>
                <Button variant="contained" onClick={handleSearch} startIcon={<Search />}>
                  Uygula
                </Button>
                <Button startIcon={<Download />} variant="contained" onClick={handleExportClick}>
                  Excel
                </Button>
              </Stack>
            </Grid>
          </Form>
        </Card>

        {/* Table */}
        <Card sx={{ p: 2 }}>
          <Table<CompanyScoring>
            id="companies-scoring-table"
            rowId="CompanyId"
            headers={headers}
            data={data?.Items || []}
            loading={isLoading || isFetching}
            error={error ? String(error) : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            rowActions={[
              {
                Element: ({ row }) => <CompanyTableRowActions row={row} />,
              },
            ]}
            actionHeaderTitle="İşlemler"
            notFoundConfig={{
              title: 'Şirket bulunamadı',
              subTitle: 'Arama kriterlerinizi değiştirmeyi deneyin',
              buttonTitle: 'Filtreleri Sıfırla',
              onClick: handleReset,
            }}>
            {/* Company Info Slot - Complex formatting needed */}
            <Slot<CompanyScoring> id="CompanyName">
              {(_, row) => {
                if (!row) return null;
                const companyInfo = formatCompanyInfo(row);
                return (
                  <Box>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }} title={companyInfo.name}>
                      {companyInfo.displayName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      VKN: {companyInfo.identifier}
                    </Typography>
                  </Box>
                );
              }}
            </Slot>

            {/* Limit Status Slot - Custom badge needed */}
            <Slot<CompanyScoring> id="IsLimitActive">
              {(value) => {
                // Convert to boolean based on the value
                let booleanValue: boolean | null = null;
                if (typeof value === 'boolean') {
                  booleanValue = value;
                } else if (typeof value === 'string') {
                  booleanValue = value === 'true' ? true : value === 'false' ? false : null;
                } else if (typeof value === 'number') {
                  booleanValue = value === 1 ? true : value === 0 ? false : null;
                }

                const badge = getLimitStatusBadge(booleanValue);
                return (
                  <Chip
                    label={badge.label}
                    color={
                      badge.color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
                    }
                    variant={badge.variant as 'filled' | 'outlined'}
                    size="small"
                    sx={{ minWidth: 80 }}
                  />
                );
              }}
            </Slot>

            {/* Risk Status Slot - Custom badge needed */}
            <Slot<CompanyScoring> id="IsRisk">
              {(value) => {
                // Convert to boolean based on the value
                let booleanValue: boolean = false;
                if (typeof value === 'boolean') {
                  booleanValue = value;
                } else if (typeof value === 'string') {
                  booleanValue = value === 'true';
                } else if (typeof value === 'number') {
                  booleanValue = value === 1;
                }

                const badge = getRiskStatusBadge(booleanValue);
                return (
                  <Chip
                    label={badge.label}
                    color={
                      badge.color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
                    }
                    variant={badge.variant as 'filled' | 'outlined'}
                    size="small"
                    sx={{ minWidth: 80 }}
                  />
                );
              }}
            </Slot>
          </Table>
        </Card>
      </Box>
      <EnterEventHandle onEnterPress={handleFormSubmit} />
    </>
  );
};

export default LimitCompaniesPage;
