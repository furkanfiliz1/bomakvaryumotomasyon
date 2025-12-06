import { EnterEventHandle, Form, PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Download, Search, Visibility } from '@mui/icons-material';
import { Box, Button, Card, Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';
import { useLazyGetCheckReportQuery } from '../check-report.api';
import type { CheckReportFilters, CheckReportItem } from '../check-report.types';
import { generateExportFilename, getCheckReportTableHeaders } from '../helpers';
import { useCheckReportDropdownData, useCheckReportFilterForm, useCheckReportQueryParams } from '../hooks';
import { CheckReportTableSlots } from './CheckReportTableSlots';

/**
 * Check Report List Page Component
 * Displays check report data with filters and actions
 * Matches legacy system UI and functionality exactly
 */
export const CheckReportListPage: React.FC = () => {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [additionalFilters, setAdditionalFilters] = useState<Partial<CheckReportFilters>>({});

  // Get dropdown data with dynamic branch loading and company search
  const {
    bankList,
    branchList,
    handleBankChange,
    companySearchResults,
    searchCompaniesByNameOrIdentifier,
    isCompanySearchLoading,
  } = useCheckReportDropdownData();

  // Initialize filter form
  const {
    form,
    schema,
    handleReset: formHandleReset,
    handleBankChange: onBankSelectionChange,
  } = useCheckReportFilterForm({
    bankList,
    branchList,
    companySearchResults,
    onFilterChange: setAdditionalFilters,
    onBankChange: handleBankChange,
    onCompanySearch: searchCompaniesByNameOrIdentifier,
    isCompanySearchLoading,
  });

  // Generate query parameters
  const { baseQueryParams } = useCheckReportQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, handleExport, getQuery } = useServerSideQuery(
    useLazyGetCheckReportQuery,
    baseQueryParams,
  );

  // Watch for bank selection changes to load branches and update branch field state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'bankEftCode') {
        const bankId = value.bankEftCode as string;
        onBankSelectionChange(bankId || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onBankSelectionChange]);

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  // Table configuration
  const tableHeaders = useMemo(() => getCheckReportTableHeaders(), []);

  // Custom search handler that resets page to 1
  const handleSearch = () => {
    const formData = form.getValues();
    const newFilters = formData as Partial<CheckReportFilters>;

    // Update URL parameters - reset page to 1
    setSearchParams((params) => {
      const newParams = new URLSearchParams(params);
      newParams.set('page', '1');
      return newParams;
    });

    // Update filters state for future queries
    setAdditionalFilters(newFilters);

    // Immediately fetch with new filters and page 1
    const queryParams = {
      ...baseQueryParams,
      ...newFilters,
      page: 1,
    };

    getQuery(queryParams);
  };

  // Custom reset handler that also resets URL parameters
  const handleReset = () => {
    // Update URL parameters - reset page to 1
    setSearchParams((params) => {
      const newParams = new URLSearchParams(params);
      newParams.set('page', '1');
      return newParams;
    });

    // Call form reset
    formHandleReset();
  };

  const handleExportClick = () => {
    const customFilename = generateExportFilename();
    handleExport(customFilename);
  };

  const handleDetailView = (item: CheckReportItem) => {
    navigate(`/invoice-operations/check-report/${item.Id}`);
  };

  // Inline actions component to avoid import issues
  const ActionsSlot: React.FC<{ item: CheckReportItem; onDetailClick: () => void }> = ({ onDetailClick }) => (
    <Button variant="outlined" startIcon={<Visibility />} size="small" onClick={onDetailClick}>
      Detay
    </Button>
  );

  return (
    <>
      <PageHeader title="Çek Raporu" subtitle="Çek Raporu ve Çek Düzenleme" />

      <Box mx={2}>
        {/* Filter Form */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema}>
            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={handleReset} startIcon={<Clear />}>
                Temizle
              </Button>
              <Button variant="contained" onClick={handleSearch} startIcon={<Search />}>
                Uygula
              </Button>
              <Button
                variant="contained"
                onClick={handleExportClick}
                startIcon={<Download />}
                disabled={isLoading || isFetching}>
                Excel
              </Button>
            </Stack>
          </Form>
        </Card>

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<CheckReportItem>
            id="check-report-table"
            rowId="Id"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            total={totalCount}
            notFoundConfig={{ title: 'Çek raporu bulunamadı' }}
            rowActions={[
              {
                Element: ({ row }) =>
                  row ? <ActionsSlot item={row} onDetailClick={() => handleDetailView(row)} /> : null,
                isCollapseButton: false,
              },
            ]}>
            {/* Custom cell slots for BankName and BankEftCode with truncation */}
            <Slot<CheckReportItem> id="DrawerIdentifier">
              {(_, row) => (
                <DoubleTextCell
                  primaryText={row?.DrawerIdentifier || '-'}
                  secondaryText={row?.DrawerName || '-'}
                  id={row?.Id.toString() || ''}
                />
              )}
            </Slot>
            <Slot<CheckReportItem> id="BankName">
              {(_, row) => (row ? <CheckReportTableSlots.BankNameSlot row={row} /> : '-')}
            </Slot>
            <Slot<CheckReportItem> id="BankEftCode">
              {(_, row) => (row ? <CheckReportTableSlots.BankEftCodeSlot row={row} /> : '-')}
            </Slot>
          </Table>
          <EnterEventHandle onEnterPress={handleSearch} />
        </Card>
      </Box>
    </>
  );
};
