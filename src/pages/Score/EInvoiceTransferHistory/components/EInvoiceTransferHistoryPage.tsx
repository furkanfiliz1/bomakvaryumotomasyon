/**
 * E-Invoice Transfer History Page Component
 * Following OperationPricing implementation patterns exactly
 * Based on legacy EInvoiceTransferHistory.js component
 */

import { Slot, Table, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Card, Chip, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useLazyGetCompanyTransferHistoryQuery,
  usePutTransferInvoiceFromScoreMutation,
} from '../e-invoice-transfer-history.api';
import type {
  EInvoiceTransferHistoryItem,
  EInvoiceTransferHistoryFilters as FilterType,
} from '../e-invoice-transfer-history.types';
import {
  checkIfAllFailed,
  formatEInvoiceTransferHistoryData,
  getEInvoiceTransferHistoryTableHeaders,
  getStatusConfig,
} from '../helpers';
import {
  useEInvoiceTransferHistoryDropdownData,
  useEInvoiceTransferHistoryFilterForm,
  useEInvoiceTransferHistoryQueryParams,
} from '../hooks';
import { EInvoiceTransferHistoryFilters } from './EInvoiceTransferHistoryFilters';

/**
 * E-Invoice Transfer History Page Component
 * Following OperationPricing implementation patterns exactly
 */
export const EInvoiceTransferHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [additionalFilters, setAdditionalFilters] = useState<Partial<FilterType>>({});

  // Get dropdown data (minimal for this component)
  useEInvoiceTransferHistoryDropdownData();

  // Generate query parameters
  const { baseQueryParams, locationState } = useEInvoiceTransferHistoryQueryParams({ additionalFilters });

  // Manual transfer function for the hook
  const handleManualTransferFn = async (invoiceNumber: string) => {
    if (!locationState) return;

    try {
      const response = await transferInvoiceFromScore({
        SenderIdentifier: locationState.identifier,
        InvoiceNumber: invoiceNumber,
      }).unwrap();

      if (response.IsSuccess) {
        refetch(); // Refresh data after successful transfer
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Fatura başarıyla aktarıldı.',
        });
      }
    } catch (error) {
      // Show redirect modal on transfer error
      formHookModals
        .showRedirectToScoreModal(locationState.id.toString())
        .then((companyId) => {
          navigate(`/limit-operations/companies/${companyId}/genel`);
        })
        .catch(() => {
          // User cancelled the modal
        });
    }
  };

  // Initialize filter form
  const {
    form,
    schema,
    handleSearch,
    handleReset,
    showTransferInvoiceModal: formShowTransferModal,
    showFailedTransferModal: formShowFailedModal,
    showRedirectToScoreModal: formShowRedirectModal,
  } = useEInvoiceTransferHistoryFilterForm({
    onFilterChange: setAdditionalFilters,
    onTransfer: handleManualTransferFn,
  });

  // Store modal functions for easier access
  const formHookModals = {
    showTransferInvoiceModal: formShowTransferModal,
    showFailedTransferModal: formShowFailedModal,
    showRedirectToScoreModal: formShowRedirectModal,
  };

  // Use server-side query for transfer history
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, refetch } = useServerSideQuery(
    useLazyGetCompanyTransferHistoryQuery,
    baseQueryParams,
  );

  // Manual transfer mutation
  const [transferInvoiceFromScore, { isLoading: transferLoading, error: transferError }] =
    usePutTransferInvoiceFromScoreMutation();

  const notice = useNotice();

  // Error handling
  useErrorListener(error);
  useErrorListener(transferError);

  // Extract table data
  const tableData = formatEInvoiceTransferHistoryData(data?.Items || []);
  const totalCount = data?.TotalCount || 0;

  // Check if all invoices failed
  const isAllFailed = useMemo(() => checkIfAllFailed(data?.Items || []), [data?.Items]);

  // Table configuration
  const tableHeaders = useMemo(() => getEInvoiceTransferHistoryTableHeaders(), []);

  // Handle manual search - only triggered by Apply button
  const handleApplySearch = () => {
    handleSearch();
  };

  // Handle direct transfer button action
  const handleTransferButton = () => {
    if (isAllFailed) {
      // Show failed transfer modal if all invoices failed
      formHookModals.showFailedTransferModal();
    } else {
      // Direct transfer
      const currentNumber = form.getValues().number?.trim();
      if (currentNumber) {
        handleManualTransferFn(currentNumber);
      } else {
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'Lütfen fatura numarası giriniz.',
        });
      }
    }
  };

  // Show company info

  return (
    <>
      <Box mx={2}>
        {/* Filters */}
        <EInvoiceTransferHistoryFilters
          form={form}
          schema={schema}
          onSubmit={handleApplySearch}
          onReset={handleReset}
          onTransfer={handleTransferButton}
          isLoading={isLoading || isFetching || transferLoading}
          hasInvoiceList={tableData.length > 0}
        />

        {/* No Data Message */}
        {!isLoading && !isFetching && tableData.length === 0 && (
          <Card sx={{ p: 3, mb: 2, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Kayıt bulunamadı. Arama kriterlerinizi değiştirerek tekrar deneyiniz.
            </Typography>
          </Card>
        )}

        {/* Data Table */}
        {tableData.length > 0 && (
          <Card sx={{ p: 2 }}>
            <Table<EInvoiceTransferHistoryItem>
              id="e-invoice-transfer-history-table"
              rowId="Id"
              data={tableData}
              headers={tableHeaders}
              loading={isLoading || isFetching}
              pagingConfig={pagingConfig}
              sortingConfig={sortingConfig}
              total={totalCount}>
              {/* Created Date slot */}
              <Slot<EInvoiceTransferHistoryItem> id="CreatedDate">
                {(_, row) => <span>{row ? new Date(row.CreatedDate).toLocaleDateString('tr-TR') : '-'}</span>}
              </Slot>

              {/* Date slot */}
              <Slot<EInvoiceTransferHistoryItem> id="Date">
                {(_, row) => <span>{row ? new Date(row.Date).toLocaleDateString('tr-TR') : '-'}</span>}
              </Slot>

              {/* Status slot */}
              <Slot<EInvoiceTransferHistoryItem> id="Status">
                {(_, row) => {
                  if (!row) return <span>-</span>;

                  const config = getStatusConfig(row.Status);
                  return (
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Chip label={row.StatusDescription} color={config.variant} size="small" variant="filled" />
                      {row.Message && (
                        <Typography
                          variant="caption"
                          color={row.Status === 0 ? 'text.secondary' : 'inherit'}
                          sx={{ fontSize: '0.75rem' }}>
                          {row.Message}
                        </Typography>
                      )}
                    </Box>
                  );
                }}
              </Slot>
            </Table>
          </Card>
        )}
      </Box>
    </>
  );
};
