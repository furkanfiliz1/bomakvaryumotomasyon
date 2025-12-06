import { EnterEventHandle, Form, PageHeader, Slot, Table, useNotice } from '@components';
import { HUMAN_READABLE_CLOCK, HUMAN_READABLE_DATE } from '@constant';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Download, Search } from '@mui/icons-material';
import { Box, Button, Card, Stack } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';
import { getOperationPricingTableHeaders } from '../helpers';
import {
  useOperationPricingDropdownData,
  useOperationPricingFilterForm,
  useOperationPricingQueryParams,
} from '../hooks';
import { useLazyGetOperationPricingReportQuery, useRefundPaymentMutation } from '../operation-pricing.api';
import type { OperationPricingFilters, OperationPricingItem } from '../operation-pricing.types';
import {
  OperationPricingCollapseDetails,
  OperationPricingSummary,
  OperationPricingTableSlots,
  RefundDialog,
} from './index';

/**
 * Operation Pricing List Page Component
 * Displays operation pricing data with filters and actions
 * Matches legacy system UI and functionality exactly
 */
export const OperationPricingListPage: React.FC = () => {
  const notice = useNotice();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedRefundItem, setSelectedRefundItem] = useState<OperationPricingItem | null>(null);

  // Get dropdown data
  const { customerManagerList, productTypeList } = useOperationPricingDropdownData();

  // Initialize refund mutation - matching legacy API exactly
  const [refundPayment, { error: refundError, isSuccess }] = useRefundPaymentMutation();

  // Convert URL params to filter format
  const urlFilters = useMemo<Partial<OperationPricingFilters>>(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      CompanyIdentifier: params.CompanyIdentifier || undefined,
      CompanyName: params.CompanyName || undefined,
      status: params.status ? Number(params.status) : undefined,
      referenceId: params.referenceId || undefined,
      productType: params.productType || undefined,
      startPaymentDate: params.startPaymentDate || dayjs().format('YYYY-MM-DD'),
      endPaymentDate: params.endPaymentDate || dayjs().format('YYYY-MM-DD'),
      UserIds: params.UserIds ? params.UserIds.split(',').map((id) => Number(id)) : undefined,
      page: params.page ? Number(params.page) : 1,
      pageSize: params.pageSize ? Number(params.pageSize) : undefined,
      sort: params.sort || undefined,
      sortType: params.sortType || undefined,
    };
  }, [searchParams]);

  // Initialize filter form with URL filters
  const { form, schema, handleSearch } = useOperationPricingFilterForm({
    customerManagerList,
    productTypeList,
    initialFilters: urlFilters,
    onFilterChange: (filters) => {
      // Update URL params when filters change
      const params: Record<string, string> = {};

      if (filters.CompanyIdentifier) params.CompanyIdentifier = filters.CompanyIdentifier;
      if (filters.CompanyName) params.CompanyName = filters.CompanyName;
      if (filters.status !== undefined) params.status = String(filters.status);
      if (filters.referenceId) params.referenceId = filters.referenceId;
      if (filters.productType) params.productType = filters.productType;
      if (filters.startPaymentDate) params.startPaymentDate = filters.startPaymentDate;
      if (filters.endPaymentDate) params.endPaymentDate = filters.endPaymentDate;
      if (filters.UserIds?.length) params.UserIds = filters.UserIds.join(',');
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      if (filters.sort) params.sort = filters.sort;
      if (filters.sortType) params.sortType = filters.sortType;

      setSearchParams(params);
    },
  }); // Generate query parameters from URL filters
  const { baseQueryParams } = useOperationPricingQueryParams({ additionalFilters: urlFilters });

  // Use the useServerSideQuery hook following DiscountOperations pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport, refetch } = useServerSideQuery(
    useLazyGetOperationPricingReportQuery,
    baseQueryParams,
  );

  // Override pagingConfig to update URL params
  const enhancedPagingConfig = useMemo(
    () => ({
      ...pagingConfig,
      onPageChange: (newPage: number) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, page: String(newPage) });
        pagingConfig.onPageChange?.(newPage);
      },
      onPageSizeChange: (newPageSize: number) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, pageSize: String(newPageSize), page: '1' });
        pagingConfig.onPageSizeChange?.(newPageSize);
      },
    }),
    [pagingConfig, searchParams, setSearchParams],
  );

  // Override sortingConfig to update URL params
  const enhancedSortingConfig = useMemo(
    () => ({
      ...sortingConfig,
      onSort: (field: string, order: 'asc' | 'desc') => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, sort: field, sortType: order });
        sortingConfig.onSort?.(field, order);
      },
    }),
    [sortingConfig, searchParams, setSearchParams],
  );

  const handleReset = () => {
    form.reset();
    // Clear all URL params
    setSearchParams({});
  };

  // Error handling
  useErrorListener([error, refundError]);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  // Table configuration
  const tableHeaders = useMemo(() => getOperationPricingTableHeaders(), []);

  const handleRefundClick = (item: OperationPricingItem) => {
    setSelectedRefundItem(item);
  };

  const handleExportClick = () => {
    const customFilename = 'operasyon_ucretlendirme';
    handleExport(customFilename);
  };

  const handleRefundConfirm = async (reason: string) => {
    if (!selectedRefundItem) return;

    try {
      // Request body format exactly matching the provided example: {"OrderNumber":"2025092562548","RefundReason":"Zaman Aşımı"}
      const refundData = {
        OrderNumber: selectedRefundItem.OrderNumber,
        RefundReason: reason, // reason is already the string description like "Zaman Aşımı"
      };

      // Both legacy functions use the same endpoint /payments/refundPayment
      // The distinction between multi and single was at the endpoint level in legacy
      // Using the main refundPayment API to match legacy _updateOperationChargePaymentCraftgateMulti
      await refundPayment(refundData).unwrap();

      setSelectedRefundItem(null);
      // Refresh data after successful refund
      refetch();
    } catch (error) {
      // Error will be handled by the global error handler (rtkQueryErrorHandler)
      // and displayed via the notification system
    }
  };

  const handleRefundCancel = () => {
    setSelectedRefundItem(null);
  };

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        message: 'İade işlemi başarıyla gerçekleştirildi.',
      });
    }
  }, [isSuccess, notice]);

  return (
    <>
      <PageHeader title="Operasyon Ücretlendirme" subtitle="İşlem Başı Ödenen ve İade Edilen İşlem Ücretleri" />

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
                disabled={isLoading || isFetching}
                startIcon={<Download />}>
                Excel
              </Button>
            </Stack>
          </Form>
        </Card>

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<OperationPricingItem>
            id="operation-pricing-table"
            rowId="Id"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={enhancedPagingConfig}
            sortingConfig={enhancedSortingConfig}
            total={totalCount}
            notFoundConfig={{ title: 'Operasyon ücretlendirme verisi bulunamadı' }}
            rowActions={[
              {
                Element: ({ toggleCollapse, isCollapseOpen }) => (
                  <OperationPricingTableSlots.CollapseToggleSlot
                    toggleCollapse={toggleCollapse}
                    isCollapseOpen={isCollapseOpen}
                  />
                ),
                isCollapseButton: true,
              },
              {
                Element: ({ row }) =>
                  row ? (
                    <OperationPricingTableSlots.ActionsSlot item={row} onRefundClick={() => handleRefundClick(row)} />
                  ) : null,
                isCollapseButton: false,
              },
            ]}
            CollapseComponent={({ row }) => <OperationPricingCollapseDetails row={row} refetch={refetch} />}>
            {/* Custom cell renderers following DiscountOperations pattern */}
            <Slot<OperationPricingItem> id="PaymentDate">
              {(_, row, index) => (
                <DoubleTextCell
                  maxWidth={300}
                  primaryText={dayjs(row?.PaymentDate).format(HUMAN_READABLE_DATE) || '-'}
                  secondaryText={dayjs(row?.PaymentDate).format(HUMAN_READABLE_CLOCK) || '-'}
                  id={`invoiceId-${index}`}
                />
              )}
            </Slot>
            <Slot<OperationPricingItem> id="Status">
              {(_, row) => (
                <OperationPricingTableSlots.StatusSlot
                  status={row!.Status}
                  statusDescription={row!.StatusDescription}
                  paymentTypeDescription={row!.PaymentTypeDescription}
                />
              )}
            </Slot>
          </Table>
        </Card>

        {/* Summary Section */}
        <OperationPricingSummary data={data} />
      </Box>

      {/* Refund Dialog */}
      {selectedRefundItem && (
        <RefundDialog
          open={!!selectedRefundItem}
          item={selectedRefundItem}
          onConfirm={handleRefundConfirm}
          onCancel={handleRefundCancel}
        />
      )}
      <EnterEventHandle onEnterPress={handleSearch} />
    </>
  );
};
