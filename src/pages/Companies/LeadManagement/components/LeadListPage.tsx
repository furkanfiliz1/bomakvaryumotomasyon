/**
 * Lead List Page
 * Following OperationPricing pattern for list pages with filters
 * Uses Form component with schema-based field definitions
 * Implements server-side pagination, sorting, and filtering
 */

import { Form, Icon, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Button, Card, Chip, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CallResult, MembershipStatus } from '../constants';
import { getCallResultColor, getMembershipStatusColor } from '../helpers/lead-management.helpers';
import { getLeadTableHeaders } from '../helpers/lead-table-config.helpers';
import { useLeadDropdownData, useLeadFilterForm } from '../hooks';
import useLeadQueryParams from '../hooks/useLeadQueryParams';
import { useDeleteLeadMutation, useLazyGetLeadsQuery } from '../lead-management.api';
import type { LeadFilterFormData, LeadListItem } from '../lead-management.types';

const LeadListPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  const { productTypeList, callResultList } = useLeadDropdownData();

  // State for managing filter changes - following ScoreInvoiceReports pattern
  const [additionalFilters, setAdditionalFilters] = useState<Partial<LeadFilterFormData>>({});

  // Initialize filter form with callback to update additionalFilters
  const { form, schema, handleSearch, handleReset } = useLeadFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters from filters
  const { baseQueryParams } = useLeadQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook for pagination, filtering
  const { data, error, isLoading, pagingConfig, sortingConfig, refetch } = useServerSideQuery(
    useLazyGetLeadsQuery,
    baseQueryParams,
  );

  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

  // Error handling
  useErrorListener(error);

  const handleAddLead = () => {
    navigate('/companies/leads/add');
  };

  // Handle delete - following TransactionFeeDiscountListPage pattern
  const handleDeleteClick = (lead: LeadListItem) => {
    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Silme İşlemi',
      message: 'Bu lead kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
      onClick: () => void executeDelete(lead.Id),
      catchOnCancel: true,
    });
  };

  // Execute delete operation - following TransactionFeeDiscountListPage pattern
  const executeDelete = async (leadId: number) => {
    try {
      await deleteLead({ id: leadId }).unwrap();

      // Success - refresh data
      refetch();

      // Show success message
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Lead başarıyla silindi',
        buttonTitle: 'Tamam',
      });
    } catch (error) {
      // Error handling is managed by the error listener
      console.error('Delete failed:', error);
    }
  };

  const headers = getLeadTableHeaders();

  return (
    <>
      <PageHeader title="Müşteri Adayları" subtitle="Potansiyel müşteri takip ve yönetim sistemi" />

      <Box mx={2}>
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema} />
          <Box display="flex" justifyContent="space-between" gap={2} mt={3}>
            <Button
              variant="outlined"
              startIcon={<Icon icon="user-plus-01" size={20} />}
              onClick={handleAddLead}
              id="addLeadButton">
              Yeni Lead
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={handleReset} startIcon={<Icon icon="x" size={16} />}>
                Temizle
              </Button>
              <Button variant="contained" onClick={handleSearch} startIcon={<Icon icon="search-lg" size={16} />}>
                Uygula
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Results Table */}
        <Card>
          <Table<LeadListItem>
            id="LeadsTable"
            rowId="Id"
            headers={headers}
            data={(data?.Items as LeadListItem[]) || []}
            loading={isLoading}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            notFoundConfig={{
              title: 'Müşteri adayı bulunamadı',
              subTitle: 'Henüz kayıtlı müşteri adayı bulunmamaktadır',
              buttonTitle: 'Lead Ekle',
              onClick: handleAddLead,
            }}>
            {/* Product Type Column - Display product type */}
            <Slot<LeadListItem> id="ProductType">
              {(_value, row) => {
                if (!row?.ProductType) return <Typography variant="body2">-</Typography>;

                // Find product name from dropdown data
                const productName =
                  productTypeList.find((p) => p.Value === String(row.ProductType))?.Description || row.ProductType;

                return <Typography variant="body2">{productName}</Typography>;
              }}
            </Slot>

            {/* Call Result Column - Status Chip */}
            <Slot<LeadListItem> id="LastCallResult">
              {(_value, row) => {
                if (!row?.LastCallResult) return <Typography variant="body2">-</Typography>;

                const lastCallName =
                  callResultList.find((cr) => cr.Value === String(row.LastCallResult))?.Description ||
                  row.LastCallResult;

                return (
                  <Chip
                    label={lastCallName}
                    color={getCallResultColor(row.LastCallResult as CallResult)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                );
              }}
            </Slot>

            {/* Membership Status Column - Status Chip */}
            <Slot<LeadListItem> id="MembershipCompleted">
              {(_value, row) => {
                const statusValue = row?.MembershipCompleted
                  ? MembershipStatus.COMPLETED
                  : MembershipStatus.NOT_COMPLETED;
                const statusLabel = row?.MembershipCompleted ? 'Tamamlandı' : 'Tamamlanmadı';

                return (
                  <Chip
                    label={statusLabel}
                    color={getMembershipStatusColor(statusValue)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                );
              }}
            </Slot>

            {/* Actions Column - Detail and Delete Buttons */}
            <Slot<LeadListItem> id="actions">
              {(_value, row) => {
                return (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      id={`lead-detail-button-${row?.Id}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Icon icon="eye" size={16} />}
                      onClick={() => navigate(`/companies/leads/${row?.Id}`)}>
                      Detay
                    </Button>
                    <Button
                      id={`lead-delete-button-${row?.Id}`}
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Icon icon="trash-01" size={16} />}
                      onClick={() => row && handleDeleteClick(row)}
                      disabled={isDeleting}>
                      Sil
                    </Button>
                  </Box>
                );
              }}
            </Slot>
          </Table>
        </Card>
      </Box>
    </>
  );
};

export default LeadListPage;
