import { EnterEventHandle, PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Button, Card, Chip, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';
import { getInvoiceTransactionTableHeaders, getRefundStatusBadgeProps, getTransferStatusBadgeProps } from '../helpers';
import { useInvoiceTransactionFilterForm } from '../hooks';
import { useLazyGetIssuedInvoicesQuery, useUpdateIssuedInvoiceMutation } from '../invoice-transaction.api';
import type {
  InvoiceTransactionFilters as IInvoiceTransactionFilters,
  InvoiceTransactionItem,
  UpdateInvoiceRequest,
} from '../invoice-transaction.types';
import { InvoiceTransactionFilters } from './InvoiceTransactionFilters';
import { ReturnInvoiceDialog } from './ReturnInvoiceDialog';

/**
 * Invoice Transaction List Page Component
 * Displays issued invoices data with filters and return invoice functionality
 * Features automatic URL search params synchronization for filter persistence
 * Based on legacy IssuedInvoices component structure
 */
export const InvoiceTransactionListPage: React.FC = () => {
  const [selectedInvoiceItem, setSelectedInvoiceItem] = useState<InvoiceTransactionItem | null>(null);
  const [additionalFilters, setAdditionalFilters] = useState<Partial<IInvoiceTransactionFilters>>({});

  // Initialize update mutation
  const [updateInvoice] = useUpdateIssuedInvoiceMutation();

  // Memoize the filter change handler to prevent unnecessary re-renders
  const handleFilterChange = useCallback((filters: Partial<IInvoiceTransactionFilters>) => {
    setAdditionalFilters(filters);
  }, []);

  // Initialize filter form
  const { form, schema, handleSubmit, handleReset } = useInvoiceTransactionFilterForm({
    onFilterChange: handleFilterChange,
  });

  // Generate query parameters - simplified approach to avoid infinite loops
  const queryParams = useMemo(
    () => ({
      page: 1,
      pageSize: 50,
      ...additionalFilters,
    }),
    [additionalFilters],
  );

  // Use the useServerSideQuery hook following established patterns
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport, refetch } = useServerSideQuery(
    useLazyGetIssuedInvoicesQuery,
    queryParams,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];

  // Table configuration
  const tableHeaders = useMemo(() => getInvoiceTransactionTableHeaders(), []);

  const handleReturnInvoiceClick = (item: InvoiceTransactionItem) => {
    setSelectedInvoiceItem(item);
  };

  const handleExportClick = () => {
    const customFilename = 'fatura_islemleri';
    handleExport(customFilename);
  };

  const handleReturnInvoiceConfirm = async (returnData: {
    ReturnInvoiceNumber?: string;
    ReturnInvoiceDate?: string;
    ReturnInvoiceAmount?: number;
  }) => {
    if (!selectedInvoiceItem) return;

    try {
      const updateData: UpdateInvoiceRequest = {
        ...selectedInvoiceItem,
        ...returnData,
      };

      await updateInvoice({ id: selectedInvoiceItem.Id, data: updateData }).unwrap();
      setSelectedInvoiceItem(null);
      refetch();
    } catch (error) {
      console.error('Failed to update return invoice:', error);
    }
  };

  return (
    <Box>
      <PageHeader title="Fatura Kesme İşlemleri" subtitle="Fatura Kesme Detayları" />

      <Box mx={2}>
        {/* Filters Section */}
        <InvoiceTransactionFilters
          form={form}
          schema={schema}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isLoading={isLoading}
          handleExportClick={handleExportClick}
          isFetching={isFetching}
        />

        {/* Table Section */}
        <Card sx={{ p: 2 }}>
          <Table<InvoiceTransactionItem>
            id="invoice-transaction-table"
            rowId="Id"
            headers={tableHeaders}
            data={tableData}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            notFoundConfig={{ title: 'Fatura işlem kaydı bulunamadı' }}
            rowActions={[
              {
                Element: ({ row }) =>
                  row ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleReturnInvoiceClick(row)}>
                      İade
                    </Button>
                  ) : null,
                isCollapseButton: false,
              },
            ]}>
            {/* Custom cell renderers for status columns */}

            <Slot<InvoiceTransactionItem> id="ReceiverCompanyName">
              {(_, row) => {
                if (!row) return null;
                return (
                  <DoubleTextCell
                    primaryText={row.ReceiverCompanyName}
                    maxWidth={180}
                    secondaryText={row.ReceiverIdentifier}
                    id="ReceiverCompanyName"
                  />
                );
              }}
            </Slot>
            <Slot<InvoiceTransactionItem> id="Status">
              {(_, row) => {
                if (!row) return null;
                const { color, label } = getRefundStatusBadgeProps(row.ReturnInvoiceNumber);
                return <Chip sx={{ width: '100%' }} label={label} color={color} size="small" />;
              }}
            </Slot>

            <Slot<InvoiceTransactionItem> id="TransferStatus">
              {(_, row) => {
                if (!row) return null;
                const { color, label } = getTransferStatusBadgeProps(row.Status);
                return (
                  <Stack spacing={1} display="flex" justifyContent="center">
                    <Chip label={label} color={color} size="small" />
                    {row.Status === 3 && row.ErrorMessage && (
                      <Tooltip title={row.ErrorMessage}>
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            textAlign: 'center',
                          }}
                          onClick={() => navigator.clipboard.writeText(row.ErrorMessage!)}>
                          Hata Mesajı
                        </Typography>
                      </Tooltip>
                    )}
                  </Stack>
                );
              }}
            </Slot>
          </Table>
        </Card>
      </Box>

      {/* Return Invoice Dialog */}
      {selectedInvoiceItem && (
        <ReturnInvoiceDialog
          open={!!selectedInvoiceItem}
          invoice={selectedInvoiceItem}
          onClose={() => setSelectedInvoiceItem(null)}
          onConfirm={handleReturnInvoiceConfirm}
        />
      )}

      <EnterEventHandle onEnterPress={handleSubmit} />
    </Box>
  );
};
