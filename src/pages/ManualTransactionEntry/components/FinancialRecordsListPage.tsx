import { EnterEventHandle, Form, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener, useExport, useServerSideQuery } from '@hooks';
import { Add, Clear, Download, Search } from '@mui/icons-material';
import { Alert, Box, Button, Card, CircularProgress, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTableHeaders } from '../helpers/table-config.helpers';
import { useDropdownData, useFinancialRecordsFilterForm } from '../hooks';
import {
  useDeleteFinancialRecordMutation,
  useLazyExportFinancialRecordsQuery,
  useLazyGetFinancialRecordsQuery,
} from '../manual-transaction-entry.api';
import { FinancialRecord, FinancialRecordFilters } from '../manual-transaction-entry.types';
import { FinancialRecordsRowActions } from './FinancialRecordsRowActions';

export const FinancialRecordsListPage = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // Additional filters state for the form
  const [additionalFilters, setAdditionalFilters] = useState<Partial<FinancialRecordFilters>>({});

  // Load dropdown data
  const {
    financialRecordTypes,
    financialActivityTypes,
    processTypes,
    bankList,
    buyerList,
    customerManagerList,
    buyersCompanySearchResults,
    sellersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
    isLoading: dropdownLoading,
  } = useDropdownData();

  // Initialize filter form
  const { form, schema, handleSearch, handleReset } = useFinancialRecordsFilterForm({
    financialRecordTypes,
    financialActivityTypes,
    processTypes,
    bankList,
    buyerList,
    customerManagerList,
    buyersCompanySearchResults,
    sellersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
    onFilterChange: setAdditionalFilters,
  });

  // Generate base query parameters - ensure undefined values override previous params
  const baseQueryParams = useMemo(
    () => ({
      ReferenceNumber: additionalFilters.ReferenceNumber,
      SenderIdentifier: additionalFilters.SenderIdentifier,
      FinancerIdentifier: additionalFilters.FinancerIdentifier,
      StartDate: additionalFilters.StartDate,
      EndDate: additionalFilters.EndDate,
      Type: additionalFilters.Type,
      FinancialRecordProcessType: additionalFilters.FinancialRecordProcessType,
      BillingIdentifier: additionalFilters.BillingIdentifier,
      ReceiverIdentifier: additionalFilters.ReceiverIdentifier,
      SenderUserIds: additionalFilters.SenderUserIds,
      ReceiverUserIds: additionalFilters.ReceiverUserIds,
    }),
    [additionalFilters],
  );

  // Use the useServerSideQuery hook
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, refetch } = useServerSideQuery(
    useLazyGetFinancialRecordsQuery,
    baseQueryParams,
  );

  // Delete mutation
  const [deleteFinancialRecord] = useDeleteFinancialRecordMutation();

  // Export hook - setup export query trigger
  const [triggerExportQuery] = useLazyExportFinancialRecordsQuery();
  const { handleExport: handleExportData, isExporting } = useExport<FinancialRecordFilters>({
    triggerQuery: triggerExportQuery,
    params: baseQueryParams,
    fileName: 'gelir_gider_girisi',
  });

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  // Transform data to match expected format
  const tableData = useMemo(() => {
    if (!data?.ExtraFinancialRecords) return []; // Changed to match legacy response structure
    return data.ExtraFinancialRecords;
  }, [data]);

  // Table configuration
  const tableHeaders = useMemo(() => getTableHeaders(), []);

  // Event handlers
  const handleAddRecord = () => {
    navigate('/manual-transaction-entry/financial-records/new');
  };

  const handleEditRecord = (recordId: number) => {
    navigate(`/manual-transaction-entry/financial-records/edit/${recordId}`);
  };

  const handleDeleteRecord = async (recordId: number) => {
    try {
      await notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Kayıt Sil',
        message: 'Bu kaydı silmek istediğinizden emin misiniz?',
        buttonTitle: 'Evet, Sil',
        catchOnCancel: true,
      }).then(async () => {
        await deleteFinancialRecord(recordId).unwrap();
        refetch();
      });
    } catch (error) {
      // Error is handled by useErrorListener
    }
  };

  const handleExportRecords = () => {
    handleExportData();
  };

  // Table row actions configuration
  const tableRowActions = [
    {
      Element: ({ row }: { row?: FinancialRecord }) => (
        <FinancialRecordsRowActions row={row} onEdit={handleEditRecord} onDelete={handleDeleteRecord} />
      ),
    },
  ];

  // Loading state for dropdown data
  if (dropdownLoading) {
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
      <PageHeader title="Gelir Gider Girişi" subtitle=" Gelir Gider Girişi Detayları" />
      <Box mx={2}>
        {/* Filter Form */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" spacing={1} mt={1}>
                <Button variant="outlined" startIcon={<Add />} onClick={handleAddRecord}>
                  Ekle
                </Button>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={handleReset} startIcon={<Clear />}>
                    Temizle
                  </Button>
                  <Button variant="contained" onClick={form.handleSubmit(handleSearch)} startIcon={<Search />}>
                    Uygula
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleExportRecords}
                    disabled={isLoading || isFetching || isExporting}
                    startIcon={<Download />}>
                    {isExporting ? 'İndiriliyor...' : 'Excel'}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Form>
        </Card>

        {/* Action Bar */}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Kayıtlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyin.
          </Alert>
        )}

        {/* Data Table */}
        <Card>
          <Table
            id="financial-records-table"
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
            {/* Custom cell renderers can be added here using Slot components */}
            <Slot<FinancialRecord> id="TaxFreeAmount">
              {(_, row) => {
                if (!row?.TaxFreeAmount) return '-';
                return new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                }).format(row.TaxFreeAmount);
              }}
            </Slot>

            <Slot<FinancialRecord> id="TotalPaidAmount">
              {(_, row) => {
                if (!row?.TotalPaidAmount) return '-';
                return new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                }).format(row.TotalPaidAmount);
              }}
            </Slot>

            <Slot<FinancialRecord> id="IssueDate">
              {(_, row) => {
                if (!row?.IssueDate) return '-';
                return new Date(row.IssueDate).toLocaleDateString('tr-TR');
              }}
            </Slot>

            <Slot<FinancialRecord> id="FinancerName">{(_, row) => row?.FinancerName || '-'}</Slot>

            <Slot<FinancialRecord> id="ReferenceNumber">
              {(_, row) => {
                const referenceNumber = row?.ReferenceNumber || '-';
                return (
                  <Tooltip title={referenceNumber} arrow>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: '70px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                      }}>
                      {referenceNumber}
                    </Typography>
                  </Tooltip>
                );
              }}
            </Slot>

            <Slot<FinancialRecord> id="SenderName">{(_, row) => row?.SenderName || '-'}</Slot>

            <Slot<FinancialRecord> id="SenderCustomerManagers">{(_, row) => row?.SenderCustomerManagers || '-'}</Slot>

            <Slot<FinancialRecord> id="CurrencyName">{(_, row) => row?.CurrencyName || '-'}</Slot>

            <Slot<FinancialRecord> id="FinancialRecordProcessName">
              {(_, row) => row?.FinancialRecordProcessName || '-'}
            </Slot>
          </Table>
          <EnterEventHandle onEnterPress={handleSearch} />
        </Card>
      </Box>
    </Box>
  );
};
