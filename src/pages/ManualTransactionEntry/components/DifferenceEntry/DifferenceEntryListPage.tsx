import { EnterEventHandle, PageHeader, Slot, Table } from '@components';
import { useErrorListener, useExport, useServerSideQuery } from '@hooks';
import { Edit } from '@mui/icons-material';
import { Alert, Box, Button, Card, CircularProgress, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetDifferenceEntryProcessTypesQuery,
  useGetDifferenceEntryStatusQuery,
  useGetDifferenceEntryTypesQuery,
  useLazyExportDifferenceEntriesQuery,
  useLazySearchDifferenceEntriesQuery,
} from '../../difference-entry.api';
import { DifferenceEntry, DifferenceEntryFilters as DifferenceEntryFiltersType } from '../../difference-entry.types';
import DifferenceEntryFiltersComponent from './DifferenceEntryFilters';
import { useDifferenceEntryFilterForm } from './hooks';

export const DifferenceEntryListPage = () => {
  const navigate = useNavigate();

  // Filter states based on legacy implementation
  const [filters, setFilters] = useState<Partial<DifferenceEntryFiltersType>>({
    DeficiencyStatus: 1, // Default status from legacy
    page: 1,
    pageSize: 25,
  });

  // Load dropdown data
  const { data: differenceEntryTypes = [], isLoading: typesLoading } = useGetDifferenceEntryTypesQuery();
  const { data: statusList = [], isLoading: statusLoading } = useGetDifferenceEntryStatusQuery();
  const { data: processTypes = [], isLoading: processTypesLoading } = useGetDifferenceEntryProcessTypesQuery();

  // Filter form hook
  const {
    form: filterForm,
    schema: filterSchema,
    handleSearch,
    handleReset,
  } = useDifferenceEntryFilterForm({
    differenceEntryTypes,
    statusList,
    processTypes,
    onFilterChange: (newFilters: Partial<DifferenceEntryFiltersType>) => {
      setFilters((prev: Partial<DifferenceEntryFiltersType>) => ({ ...prev, ...newFilters }));
    },
  });

  // Use the useServerSideQuery hook for data fetching and pagination
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, refetch } = useServerSideQuery(
    useLazySearchDifferenceEntriesQuery,
    filters,
  );

  // Export hook - setup export query trigger
  const [triggerExportQuery] = useLazyExportDifferenceEntriesQuery();
  const { handleExport: handleExportData, isExporting } = useExport<DifferenceEntryFiltersType>({
    triggerQuery: triggerExportQuery,
    params: filters,
    fileName: 'farklilik_girisi',
  });

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];

  // Table headers based on legacy implementation
  const tableHeaders = useMemo(
    () => [
      {
        id: 'DeficiencyTypeDescription',
        label: 'Farklılık Tipi',
        isSortDisabled: false,
      },
      {
        id: 'CompanyIdentifier',
        label: 'VKN',
        isSortDisabled: false,
      },
      {
        id: 'CompanyName',
        label: 'Ünvan',
        isSortDisabled: false,
      },
      {
        id: 'ProductTypeDescription',
        label: 'Süreç',
        isSortDisabled: false,
      },
      {
        id: 'CreatedAt',
        label: 'İşlem Tarihi',
        isSortDisabled: false,

        type: 'date',
      },
      {
        id: 'ExpectedDueDate',
        label: 'Beklenen Vade Tarih',
        isSortDisabled: false,

        type: 'date',
      },
      {
        id: 'DeficiencyStatusDescription',
        label: 'Durum',
        isSortDisabled: false,
      },
    ],
    [],
  );

  // Event handlers
  const handleAddRecord = () => {
    navigate('/manual-transaction-entry/difference-entry/new');
  };

  const handleEditRecord = (recordId: number) => {
    navigate(`/manual-transaction-entry/difference-entry/edit/${recordId}`);
  };

  const handleExportRecords = () => {
    handleExportData();
  };

  const handleApplyFilters = () => {
    handleSearch();
    refetch();
  };

  // Format date for display
  const formatDateForDisplay = (date: string) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('tr-TR');
    } catch {
      return '-';
    }
  };

  // Table row actions configuration
  const tableRowActions = [
    {
      Element: ({ row }: { row?: DifferenceEntry }) => (
        <Button
          size="small"
          startIcon={<Edit />}
          variant="outlined"
          onClick={() => row?.Id && handleEditRecord(row.Id)}>
          Güncelle
        </Button>
      ),
    },
  ];

  // Loading state for dropdown data
  if (typesLoading || statusLoading || processTypesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            Sayfa yükleniyor...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <PageHeader title="Farklılık Girişi" subtitle="Farklılık Girişi Detayları" />
      <Box mx={2}>
        {/* Filter Form */}
        <DifferenceEntryFiltersComponent
          form={filterForm}
          schema={filterSchema}
          onApply={handleApplyFilters}
          onReset={handleReset}
          isLoading={isLoading || isFetching}
          isExporting={isExporting}
          handleAddRecord={handleAddRecord}
          handleExportRecords={handleExportRecords}
        />

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Kayıtlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyin.
          </Alert>
        )}

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table
            id="difference-entry-table"
            rowId="Id"
            headers={tableHeaders}
            data={tableData}
            loading={isLoading || isFetching}
            error={error ? String(error) : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            rowActions={tableRowActions}
            notFoundConfig={{
              title: 'Kayıt bulunamadı',
              subTitle: 'Arama kriterlerinizi değiştirip tekrar deneyiniz.',
            }}>
            {/* Date formatters */}
            <Slot<DifferenceEntry> id="CreatedAt">
              {(_, row) => {
                if (!row?.CreatedAt) return '-';
                return formatDateForDisplay(row.CreatedAt);
              }}
            </Slot>

            <Slot<DifferenceEntry> id="ExpectedDueDate">
              {(_, row) => {
                if (!row?.ExpectedDueDate) return '-';
                return formatDateForDisplay(row.ExpectedDueDate);
              }}
            </Slot>
          </Table>
        </Card>
        <EnterEventHandle onEnterPress={handleSearch} />
      </Box>
    </Box>
  );
};
