import { EnterEventHandle, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Card, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteCompensationTransactionMutation,
  useLazyGetCompensationTransactionsReportQuery,
} from '../compensation-transactions.api';
import type { CompensationTransactionFilters, CompensationTransactionItem } from '../compensation-transactions.types';
import { getCompensationTransactionsTableHeaders } from '../helpers/compensation-transactions-table.helpers';
import { useCompensationTransactionsDropdownData, useCompensationTransactionsFilterForm } from '../hooks';
import { useCompensationTransactionsQueryParams } from '../hooks/useCompensationTransactionsQueryParams';
import { CompensationTransactionsFilters } from './CompensationTransactionsFilters';
import { CompensationTransactionsTableSlots } from './CompensationTransactionsTableSlots';

/**
 * Compensation Transactions List Page Component
 * Based on legacy CompensationTransactions.js but following OperationPricing patterns
 */
export const CompensationTransactionsListPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const [additionalFilters, setAdditionalFilters] = useState<Partial<CompensationTransactionFilters>>({});

  // Get dropdown data including company search - following OperationPricing pattern
  const { transactionTypeList, companySearchResults, isCompanySearchLoading, searchCompaniesByNameOrIdentifier } =
    useCompensationTransactionsDropdownData();

  // Initialize filter form following OperationPricing pattern (load data inside hook)
  const { form, schema, handleSearch } = useCompensationTransactionsFilterForm({
    transactionTypeList,
    companySearchResults,
    isCompanySearchLoading,
    searchCompaniesByNameOrIdentifier,
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters
  const { baseQueryParams } = useCompensationTransactionsQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, refetch } = useServerSideQuery(
    useLazyGetCompensationTransactionsReportQuery,
    baseQueryParams,
  );
  // Delete mutation
  const [deleteCompensationTransaction, { isLoading: isDeleting }] = useDeleteCompensationTransactionMutation();

  // Error handling
  useErrorListener(error);

  const compensationTransactionsData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  const handleReset = () => {
    form.reset();
    setAdditionalFilters({});
  };

  const handleEdit = (id: number) => {
    navigate(`/limit-operations/compensation-transactions/${id}/edit`);
  };

  const handleCreate = () => {
    navigate('/limit-operations/compensation-transactions/create');
  };

  const handleDelete = (id: number) => {
    console.log('id', id);
    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Tazmin İşlemini Sil',
      message: 'Bu tazmin işlemini kalıcı olarak silmek istediğinize emin misiniz?',
      buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
      onClick: () => executeDelete(id),
      catchOnCancel: true,
    });
  };

  const executeDelete = async (id: number) => {
    try {
      await deleteCompensationTransaction(id).unwrap();

      // Success - refresh data
      refetch();

      // Show success message
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tazmin işlemi başarıyla silindi.',
        buttonTitle: 'Tamam',
      });
    } catch (error) {
      // Error handling is managed by the error listener
      console.error('Delete failed:', error);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <PageHeader title="Kanuni Takip - Muhasebe İşlemleri" subtitle="Tazmin İşlemleri İçin Muhasebe Kayıtları" />
        <Card sx={{ p: 3, color: 'error.main' }}>
          Kanuni takip muhasebe verileri yüklenirken bir hata oluştu: {error.toString()}
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Kanuni Takip - Muhasebe İşlemleri" subtitle="Tazmin İşlemleri İçin Muhasebe Kayıtları" />

      <Box mx={2}>
        {/* Filters */}
        <CompensationTransactionsFilters
          form={form}
          schema={schema}
          handleSearch={handleSearch}
          handleReset={handleReset}
          isLoading={isLoading}
          handleCreate={handleCreate}
        />
        <EnterEventHandle onEnterPress={handleSearch} />

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
            <div />
          </Stack>
          <Table
            id="compensation-transactions-table"
            rowId="Id"
            data={compensationTransactionsData}
            headers={getCompensationTransactionsTableHeaders()}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            total={totalCount}>
            <Slot<CompensationTransactionItem> id="actions">
              {(_, row) => (
                <CompensationTransactionsTableSlots.ActionsSlot
                  row={row!}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </Slot>
          </Table>
        </Card>
      </Box>
    </Box>
  );
};
