import { EnterEventHandle, FigoLoading, Form, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Add, Clear, Delete as DeleteIcon, Edit, Search } from '@mui/icons-material';
import { Box, Button, Card, Stack } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getTransactionFeeDiscountTableHeaders } from '../helpers/index';
import { useDiscountFilters, useDropdownData } from '../hooks/index';
import { useDeleteCompanyDiscountMutation, useLazyGetCompanyDiscountsQuery } from '../transaction-fee-discount.api';
import { CompanyDiscount, CompanyDiscountFilters } from '../transaction-fee-discount.types';
import { ReceiverVknSlot, SenderVknSlot, StatusSlot } from './TransactionFeeDiscountTableSlots';

const TransactionFeeDiscountListPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // Additional filters state - following OperationChargeListPage pattern
  const [additionalFilters, setAdditionalFilters] = useState<CompanyDiscountFilters>({});

  // Get dropdown data for async search
  const {
    buyersCompanySearchResults,
    sellersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
  } = useDropdownData();

  // Initialize filter form - following OperationChargeListPage pattern
  const { form, schema, handleSearch, handleReset } = useDiscountFilters({
    onFilterChange: setAdditionalFilters,
    buyersCompanySearchResults,
    sellersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
  });

  // Use server-side query with filters - following OperationChargeListPage pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, refetch } = useServerSideQuery(
    useLazyGetCompanyDiscountsQuery,
    additionalFilters,
  );

  const [deleteDiscount, { isLoading: isDeleting }] = useDeleteCompanyDiscountMutation();

  // Error handling
  useErrorListener(error);

  // Handle delete - following the pattern from OperationChargeListPage
  const handleDeleteClick = (discount: CompanyDiscount) => {
    if (!discount.IsActive) return;

    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Silme İşlemi',
      message: 'İlgili kaydı silmek istediğinize emin misiniz?',
      buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
      onClick: () => executeDelete(discount.Id),
      catchOnCancel: true,
    });
  };

  // Execute delete operation - following the pattern from OperationChargeListPage
  const executeDelete = async (discountId: number) => {
    try {
      await deleteDiscount(discountId).unwrap();

      // Success - refresh data
      refetch();

      // Show success message
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Kayıt İptal Edildi',
        buttonTitle: 'Tamam',
      });
    } catch (error) {
      // Error handling is managed by the error listener
      console.error('Delete failed:', error);
    }
  };

  // Handle edit
  const handleEditClick = (discount: CompanyDiscount) => {
    navigate(`/pricing/indirim-tanimlama/${discount.Id}/duzenle`);
  };

  // Table configuration
  const tableHeaders = getTransactionFeeDiscountTableHeaders();

  // Table row actions configuration
  const tableRowActions = [
    {
      Element: ({ row }: { row?: CompanyDiscount }) => {
        if (!row || !row.IsActive) return null;

        return (
          <Box display="flex" gap={1}>
            <Button size="small" startIcon={<Edit />} variant="outlined" onClick={() => handleEditClick(row)}>
              Güncelle
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteClick(row)}>
              İptal
            </Button>
          </Box>
        );
      },
    },
  ];

  const tableData = useMemo(() => data?.Items || [], [data]);

  if (isLoading && !data) {
    return (
      <Box position="relative" height="400px">
        <FigoLoading />
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        title="İşlem Ücreti İndirim Tanımlama"
        subtitle="Yüzde ya da birim bazında işlem ücreti indirimi tanımlayın"
      />

      <Box mx={2}>
        {/* Filter Section */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form as unknown as UseFormReturn<FieldValues>} schema={schema}>
            <Stack direction="row" justifyContent="space-between" spacing={1} mt={1}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => navigate('/pricing/indirim-tanimlama/yeni')}>
                  Ekle
                </Button>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={handleReset} startIcon={<Clear />}>
                  Temizle
                </Button>
                <Button variant="contained" onClick={handleSearch} startIcon={<Search />}>
                  Uygula
                </Button>
              </Stack>
            </Stack>
          </Form>
        </Card>

        {/* Table */}
        <Card sx={{ p: 2 }}>
          <Table<CompanyDiscount>
            id="transaction-fee-discount-table"
            rowId="Id"
            headers={tableHeaders}
            data={tableData}
            loading={isLoading || isFetching}
            error={error ? String(error) : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            rowActions={tableRowActions}
            notFoundConfig={{ title: 'İşlem ücreti indirimi bulunamadı' }}>
            {/* Custom cell renderers */}
            <Slot<CompanyDiscount> id="ReceiverCompanyIdentifier">{(_, row) => <ReceiverVknSlot row={row!} />}</Slot>
            <Slot<CompanyDiscount> id="SenderCompanyIdentifier">{(_, row) => <SenderVknSlot row={row!} />}</Slot>
            <Slot<CompanyDiscount> id="IsActive">{(_, row) => <StatusSlot row={row!} />}</Slot>
          </Table>
          <EnterEventHandle onEnterPress={handleSearch} />
        </Card>
      </Box>
    </>
  );
};

export default TransactionFeeDiscountListPage;
