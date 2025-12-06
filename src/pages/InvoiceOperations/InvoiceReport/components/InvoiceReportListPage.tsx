import { EnterEventHandle, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Alert, Box, Button, Card, Stack } from '@mui/material';
import { currencyFormatter } from '@utils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HeadCell } from 'src/components/common/Table/types';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';
import { useInvoiceReportDropdownData } from '../hooks/useInvoiceReportDropdownData';
import { useInvoiceReportQueryParams } from '../hooks/useInvoiceReportQueryParams';
import { useDeleteInvoicesMutation, useLazyGetInvoicesQuery } from '../invoice-report.api';
import type { InvoiceItem, InvoiceSearchRequest } from '../invoice-report.types';
import { BulkUpdateModal } from './BulkUpdateModal';
import { InvoiceReportFilters, type InvoiceReportFiltersRef } from './InvoiceReportFilters';

export const InvoiceReportListPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const filtersRef = useRef<InvoiceReportFiltersRef>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<InvoiceItem[]>([]);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);

  // Use URL parameters hook similar to CompaniesTable
  const { apiParams, updateSearchParams } = useInvoiceReportQueryParams();

  // Get dropdown data with seller search functionality
  const dropdownData = useInvoiceReportDropdownData();

  // Check if we should automatically trigger API call (like original InvoiceUploadReport.js)
  const [shouldCallApi, setShouldCallApi] = useState(false);

  // Check URL params on mount - if startDate or senderIdentifier exists, trigger API call
  useEffect(() => {
    const hasStartDate = apiParams.startDate;
    const hasSenderIdentifier = apiParams.senderIdentifier;
    if (hasStartDate || hasSenderIdentifier) {
      setShouldCallApi(true);
    } else {
      // If no special parameters exist, don't make API call (this handles reset case)
      setShouldCallApi(false);
    }
  }, [apiParams.startDate, apiParams.senderIdentifier]);

  // Use useServerSideQuery for better data management and export functionality
  const {
    data: invoiceData,
    isLoading,
    error,
    refetch,
    handleExport,
    pagingConfig,
  } = useServerSideQuery(useLazyGetInvoicesQuery, apiParams, { lazyQuery: !shouldCallApi });

  // Delete mutation
  const [deleteInvoices, { isLoading: isDeleting }] = useDeleteInvoicesMutation();

  // Error handling
  useErrorListener(error);

  // Helper function to format payable amount text
  const formatPayableAmountText = useCallback((row?: InvoiceItem): string => {
    if (row?.ApprovedPayableAmount) {
      return currencyFormatter(row.ApprovedPayableAmount, row.PayableAmountCurrency);
    }
    if (row?.PayableAmount) {
      return currencyFormatter(row.PayableAmount, row.PayableAmountCurrency);
    }
    return '-';
  }, []);

  // Table headers configuration
  const tableHeaders: HeadCell[] = useMemo(
    () => [
      { id: 'InvoiceNumber', label: 'Fatura No', slot: true },
      { id: 'ReceiverName', label: 'Alıcı', slot: true },
      { id: 'SenderName', label: 'Tedarikçi', slot: true },
      { id: 'PayableAmount', label: 'İskontolanabilir Tutar', slot: true },

      { id: 'InsertedDate', label: 'Yükleme Tarihi', type: 'date' },

      { id: 'IssueDate', label: 'Fatura Tarihi', type: 'date' },
      { id: 'PaymentDueDate', label: 'Vade Tarihi', type: 'date' },
    ],
    [],
  );

  // Handle Excel export using useServerSideQuery's handleExport functionality
  const handleExportExcel = useCallback(() => {
    handleExport('Fatura_Raporu');
  }, [handleExport]);

  // Handle filter changes - pass updateSearchParams directly
  const handleFilterChange = useCallback(
    (filters: Record<string, unknown>) => {
      updateSearchParams(filters as Partial<InvoiceSearchRequest>);
      setShouldCallApi(true); // Enable API calls when filters are manually applied
    },
    [updateSearchParams],
  );

  // Handle Enter key press to trigger form search
  const handleEnterKeySearch = useCallback(() => {
    filtersRef.current?.triggerSearch();
  }, []);

  // Navigate to invoice detail
  const handleViewDetail = useCallback(
    (invoiceId: number) => {
      navigate(`/invoice-operations/invoice-report/${invoiceId}`);
    },
    [navigate],
  );

  // Handle row selection for bulk operations
  const handleRowSelection = useCallback((rows: InvoiceItem[]) => {
    setSelectedInvoices(rows);
  }, []);

  // Execute delete operation
  const executeDelete = useCallback(async () => {
    try {
      const selectedIds = selectedInvoices.map((invoice) => invoice.Id);
      const response = await deleteInvoices(selectedIds).unwrap();

      if (response.IsSuccess) {
        // Success - refresh data and clear selection
        refetch();
        setSelectedInvoices([]);

        // Show success message
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Faturalar başarıyla silindi.',
          buttonTitle: 'Tamam',
        });
      } else {
        // Handle partial or complete failure
        const failedInvoices = response.FailedInvoiceList || [];
        const errorMessages = failedInvoices
          .map(
            (failed: { InvoiceNumber: string; ErrorMessage: string }) =>
              `${failed.InvoiceNumber}: ${failed.ErrorMessage}`,
          )
          .join('\n');

        // Check if this was a partial success (some invoices were deleted)
        const failedIds = failedInvoices.map((failed) => failed.InvoiceId);
        const totalRequested = selectedInvoices.length;
        const totalFailed = failedInvoices.length;
        const successfullyDeleted = totalRequested - totalFailed;

        let title = 'Silme İşlemi Başarısız';
        let message = '';

        if (successfullyDeleted > 0) {
          title = 'Kısmi Silme İşlemi';
          message = `${successfullyDeleted} fatura başarıyla silindi, ${totalFailed} fatura silinemedi:\n\n${errorMessages}`;
        } else {
          message =
            failedInvoices.length > 0
              ? `Aşağıdaki faturalar silinemedi:\n\n${errorMessages}`
              : response.Message || 'Faturalar silinirken bir hata oluştu.';
        }

        notice({
          variant: successfullyDeleted > 0 ? 'warning' : 'error',
          title,
          message,
          buttonTitle: 'Tamam',
        });

        // Clear selection for successfully deleted invoices
        if (successfullyDeleted > 0) {
          const remainingSelection = selectedInvoices.filter((invoice) => failedIds.includes(invoice.Id));
          setSelectedInvoices(remainingSelection);
        }

        // Refresh data to show current state
        refetch();
      }
    } catch (error) {
      // Network or other errors - handled by error listener
      console.error('Delete failed:', error);
    }
  }, [selectedInvoices, deleteInvoices, refetch, notice, setSelectedInvoices]);

  // Handle bulk delete with confirmation dialog
  const handleBulkDelete = useCallback(() => {
    if (selectedInvoices.length === 0) return;

    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Faturaları Sil',
      message: `${selectedInvoices.length} adet faturayı silmek istediğinize emin misiniz?`,
      buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
      onClick: executeDelete,
      catchOnCancel: true,
    });
  }, [selectedInvoices.length, isDeleting, notice, executeDelete]);

  // Handle bulk update modal
  const handleBulkUpdate = useCallback(() => {
    if (selectedInvoices.length === 0) return;
    setShowBulkUpdateModal(true);
  }, [selectedInvoices.length]);

  const handleBulkUpdateClose = useCallback(() => {
    setShowBulkUpdateModal(false);
  }, []);

  const handleBulkUpdateSuccess = useCallback(() => {
    refetch();
    setSelectedInvoices([]);
  }, [refetch]);

  // Row actions for invoice table
  const rowActions = useMemo(
    () => [
      {
        Element: ({ row }: { row?: InvoiceItem }) => {
          if (!row) return null;

          return (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<VisibilityIcon />}
              onClick={() => handleViewDetail(row.Id)}>
              Detay
            </Button>
          );
        },
      },
    ],
    [handleViewDetail],
  );

  return (
    <>
      <PageHeader title="Fatura Raporu" subtitle="Fatura Raporu ve Fatura Düzenleme" />

      <Box mx={2}>
        <InvoiceReportFilters
          ref={filtersRef}
          {...dropdownData}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
          handleExportExcel={handleExportExcel}
        />

        {/* Error Message Display */}
        {invoiceData?.Items?.some((invoice: InvoiceItem) => invoice.errorMessage) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Box component="div">
              {invoiceData.Items.filter((invoice: InvoiceItem) => invoice.errorMessage).map(
                (invoice: InvoiceItem, index: number) => (
                  <Box
                    key={invoice.Id || index}
                    sx={{
                      mb: index < invoiceData.Items!.filter((i: InvoiceItem) => i.errorMessage).length - 1 ? 1 : 0,
                    }}>
                    <strong>{invoice.InvoiceNumber}:</strong> {invoice.errorMessage}
                  </Box>
                ),
              )}
            </Box>
          </Alert>
        )}

        <Card sx={{ p: 2 }}>
          {/* Action Buttons - only show when API has been called */}
          {shouldCallApi && (
            <Stack direction="row" spacing={1} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={selectedInvoices.length === 0 || isDeleting}
                  startIcon={<DeleteIcon />}
                  sx={{ mr: 1 }}
                  onClick={handleBulkDelete}>
                  {`Seçilenleri Sil (${selectedInvoices.length})`}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={selectedInvoices.length === 0}
                  startIcon={<EditIcon />}
                  onClick={handleBulkUpdate}>
                  {`Seçilenleri Toplu Güncelle (${selectedInvoices.length})`}
                </Button>
              </Box>
            </Stack>
          )}
          <Box sx={{ p: 0 }}>
            <Table
              id="invoice-report-table"
              rowId="Id"
              headers={tableHeaders}
              data={invoiceData?.Items || []}
              loading={isLoading}
              rowActions={rowActions}
              checkbox
              onCheckboxSelect={handleRowSelection}
              pagingConfig={pagingConfig}>
              <Slot<InvoiceItem> id="InvoiceNumber">
                {(_, row, index) => {
                  return (
                    <DoubleTextCell
                      maxWidth={300}
                      primaryText={row?.InvoiceNumber || '-'}
                      secondaryText={row?.ProfileId || '-'}
                      id={`invoiceId-${index}`}
                    />
                  );
                }}
              </Slot>
              <Slot<InvoiceItem> id="ReceiverName">
                {(_, row, index) => {
                  return (
                    <DoubleTextCell
                      maxWidth={300}
                      primaryText={row?.ReceiverName || '-'}
                      secondaryText={row?.ReceiverIdentifier || '-'}
                      id={`invoiceId-${index}`}
                    />
                  );
                }}
              </Slot>
              <Slot<InvoiceItem> id="SenderName">
                {(_, row, index) => {
                  return (
                    <DoubleTextCell
                      maxWidth={300}
                      primaryText={row?.SenderName || '-'}
                      secondaryText={row?.SenderIdentifier || '-'}
                      id={`invoiceId-${index}`}
                    />
                  );
                }}
              </Slot>
              <Slot<InvoiceItem> id="PayableAmount">
                {(_, row, index) => {
                  return (
                    <DoubleTextCell
                      maxWidth={300}
                      primaryText={
                        row?.RemainingAmount ? currencyFormatter(row?.RemainingAmount, row.PayableAmountCurrency) : '-'
                      }
                      secondaryText={formatPayableAmountText(row)}
                      id={`invoiceId-${index}`}
                    />
                  );
                }}
              </Slot>
            </Table>
            <EnterEventHandle onEnterPress={handleEnterKeySearch} />
          </Box>
        </Card>
      </Box>

      {/* Bulk Update Modal */}
      <BulkUpdateModal
        open={showBulkUpdateModal}
        onClose={() => {
          handleBulkUpdateClose();
        }}
        selectedInvoices={selectedInvoices}
        onBulkUpdate={handleBulkUpdateSuccess}
      />
    </>
  );
};
