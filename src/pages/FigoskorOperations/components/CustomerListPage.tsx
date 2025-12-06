import { Clear, Search, Visibility } from '@mui/icons-material';
import { Box, Button, Card, Chip, IconButton, Stack } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnterEventHandle, Form, PageHeader, Slot, Table } from 'src/components';
import { useErrorListener, useServerSideQuery } from 'src/hooks';
import { useLazySearchFigoScoreProClientsQuery } from '../figoskor-operations.api';
import type { FigoskorCustomer, FigoskorCustomerFilters } from '../figoskor-operations.types';
import {
  buildCustomerRequestPath,
  getCustomerStatusColor,
  getCustomerTableHeaders,
  storeParentCustomer,
} from '../helpers';
import { useFigoskorOperationsDropdownData, useFigoskorOperationsFilterForm } from '../hooks';

/**
 * Customer List Page Component
 * Displays Figoskor customer list with filters and actions
 * Matches legacy CustomerList component exactly - UI and functionality 1:1 parity
 */
export const CustomerListPage: React.FC = () => {
  const navigate = useNavigate();

  // Filter state for API calls
  const [filters, setFilters] = useState<Partial<FigoskorCustomerFilters>>({});

  // Get dropdown data
  const { customerStatusOptions } = useFigoskorOperationsDropdownData();

  // Filter change handler
  const handleFilterChange = useCallback((newFilters: Partial<FigoskorCustomerFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  // Initialize filter form with useFilterFormWithUrlSync
  const { form, schema, handleSearch, handleReset } = useFigoskorOperationsFilterForm({
    customerStatusOptions,
    onFilterChange: handleFilterChange,
  });

  // Use the useServerSideQuery hook - automatically refetches when filters change
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig } = useServerSideQuery(
    useLazySearchFigoScoreProClientsQuery,
    filters,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.ClientItems || [];
  const totalCount = data?.TotalCount || 0;

  // Table configuration
  const tableHeaders = useMemo(() => getCustomerTableHeaders(), []);

  const handleViewCustomer = (customer: FigoskorCustomer) => {
    // Store customer as parentCustomer in sessionStorage for persistence - matches legacy exactly
    const parentCustomer = {
      ...customer,
      parentCustomer: customer, // Add reference to itself as parentCustomer
    };
    storeParentCustomer(parentCustomer);

    // Navigate to customer request list page with customerId parameter
    const customerRequestPath = buildCustomerRequestPath(customer.Id);
    navigate(customerRequestPath, {
      state: { customer: parentCustomer },
    });
  };

  return (
    <>
      <PageHeader title="Müşteri Listesi" subtitle="Figoskor müşteri listesi ve yönetimi" />

      <Box mx={2}>
        {/* Summary Section - matches legacy "Toplam X müşteri bulundu" */}
        <Box mb={2}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <span style={{ color: 'text.secondary' }}>Toplam {totalCount} müşteri bulundu</span>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Filter Form - matches legacy filter section exactly */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema}>
            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={handleReset} startIcon={<Clear />}>
                Temizle
              </Button>
              <Button variant="contained" onClick={handleSearch} startIcon={<Search />}>
                Uygula
              </Button>
            </Stack>
          </Form>
        </Card>

        {/* Data Table - matches legacy table structure */}
        <Card sx={{ p: 2 }}>
          <Table<FigoskorCustomer>
            id="figoskor-customer-table"
            rowId="Id"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            total={totalCount}
            notFoundConfig={{
              title: 'Görüntülenecek müşteri bulunamadı',
              subTitle: 'Arama kriterlerinizi değiştirip tekrar deneyin',
            }}>
            {/* Custom Status Slot - matches legacy badge styling */}
            <Slot<FigoskorCustomer> id="Status">
              {(_: unknown, row: FigoskorCustomer | undefined) => {
                return <Chip label={row?.StatusDescription} color={getCustomerStatusColor(row!.Status)} size="small" />;
              }}
            </Slot>

            {/* Custom Actions Slot - matches legacy action button */}
            <Slot<FigoskorCustomer> id="actions">
              {(_: unknown, row: FigoskorCustomer | undefined) => (
                <IconButton
                  onClick={() => handleViewCustomer(row!)}
                  title="Figoskor Talepleri"
                  color="primary"
                  size="small">
                  <Visibility />
                </IconButton>
              )}
            </Slot>
          </Table>
        </Card>
      </Box>

      <EnterEventHandle onEnterPress={handleSearch} />
    </>
  );
};
