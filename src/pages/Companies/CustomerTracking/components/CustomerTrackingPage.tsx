import { EnterEventHandle, PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Card } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useLazyGetNewCustomerListQuery } from '../customer-tracking.api';
import type { CustomerTrackingFilters, CustomerTrackingItem } from '../customer-tracking.types';
import { getCustomerTrackingTableHeaders } from '../helpers/table-config.helpers';
import { useCustomerTrackingFilterForm } from '../hooks/useCustomerTrackingFilterForm';
import { useCustomerTrackingQueryParams } from '../hooks/useCustomerTrackingQueryParams';
import { CustomerTrackingFilters as CustomerTrackingFiltersComponent, CustomerTrackingTableSlots } from './index';

/**
 * Customer Tracking List Page Component
 * Displays new customer tracking data with filters and export
 * Matches legacy system UI and functionality exactly
 */
export const CustomerTrackingPage: React.FC = () => {
  const [additionalFilters, setAdditionalFilters] = useState<Partial<CustomerTrackingFilters>>({
    status: '1', // Default to active like legacy
  });

  // Generate query parameters and get updateParams function
  const { queryParams, updateParams, resetParams } = useCustomerTrackingQueryParams();

  // Initialize filter form following OperationPricing pattern (hook manages form and schema)
  const {
    form,
    schema,
    handleSearch: handleSearchWithData,
    handleReset: handleFormReset,
    isLoading: formLoading,
  } = useCustomerTrackingFilterForm({
    onFilterChange: (filters) => {
      setAdditionalFilters(filters);
      // Update URL parameters when filters change
      updateParams(filters);
    },
    onReset: () => {
      setAdditionalFilters({ status: '1' });
      resetParams();
    },
  });

  // Wrapper for handleSearch to work with form submission
  const handleSearch = () => {
    const formData = form.getValues();
    handleSearchWithData(formData);
  };

  // Combined reset handler
  const handleReset = () => {
    handleFormReset();
  };

  // Merge base query params with additional filters (URL params take precedence)
  const baseQueryParams = useMemo(
    () => ({
      ...additionalFilters,
      ...queryParams, // URL params override additionalFilters to ensure URL is source of truth
    }),
    [queryParams, additionalFilters],
  );

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig } = useServerSideQuery(
    useLazyGetNewCustomerListQuery,
    baseQueryParams,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  // Table configuration
  const tableHeaders = useMemo(() => getCustomerTrackingTableHeaders(), []);

  return (
    <>
      <PageHeader title="Yeni Müşteri Takip" subtitle="Yeni müşteri başvurularının takip ve analizi" />

      <Box mx={2}>
        {/* Filter Component */}
        <CustomerTrackingFiltersComponent
          form={form}
          schema={schema}
          onSearch={handleSearch}
          onReset={handleReset}
          isLoading={isLoading || isFetching || formLoading}
        />

        {/* Data Table */}
        <Card>
          <Table<CustomerTrackingItem>
            id="customer-tracking-table"
            rowId="Id"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            total={totalCount}
            notFoundConfig={{ title: 'Yeni müşteri kaydı bulunamadı' }}>
            {/* Custom cell renderers following OperationPricing pattern */}
            <Slot<CustomerTrackingItem> id="CompanyName">
              {(_, row) => <CustomerTrackingTableSlots.CompanyNameSlot companyName={row!.CompanyName} />}
            </Slot>

            <Slot<CustomerTrackingItem> id="CallResultTypeName">
              {(_, row) => <CustomerTrackingTableSlots.CallResultSlot callResultTypeName={row!.CallResultTypeName} />}
            </Slot>

            <Slot<CustomerTrackingItem> id="ProductTypes">
              {(_, row) => <CustomerTrackingTableSlots.ProductTypesSlot productTypes={row!.ProductTypes} />}
            </Slot>

            <Slot<CustomerTrackingItem> id="actions">
              {(_, row) => <CustomerTrackingTableSlots.ActionsSlot companyId={row!.Id} />}
            </Slot>
          </Table>
        </Card>
      </Box>

      <EnterEventHandle onEnterPress={handleSearch} />
    </>
  );
};

export default CustomerTrackingPage;
