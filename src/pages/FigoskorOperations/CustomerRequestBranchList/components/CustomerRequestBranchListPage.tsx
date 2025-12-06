import { EnterEventHandle, Form, PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Close, Edit, Email, Search, Send, Visibility } from '@mui/icons-material';
import { Alert, Box, Button, Card, Chip, IconButton, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLazyGetCustomerRequestBranchListQuery } from '../customer-request-branch-list.api';
import type { CustomerRequestBranchItem, ParentCustomer, ParentRequest } from '../customer-request-branch-list.types';
import {
  buildCompanyDetailPath,
  filterCompaniesWithEmails,
  formatDisplayValue,
  formatRequestDate,
  getCustomerRequestBranchListHeaders,
  getParentCustomerFromStorage,
  getParentRequestFromStorage,
  getStatusChipColor,
  storeParentBranch,
} from '../helpers';
import {
  useCustomerRequestBranchListDropdownData,
  useCustomerRequestBranchListFilters,
  useCustomerRequestBranchListQueryParams,
} from '../hooks';

// Modal components
import { BulkEmailModal } from './BulkEmailModal';
import { EmailManagementModal } from './EmailManagementModal';
import { RejectRequestModal } from './RejectRequestModal';
import { UpdateContactModal } from './UpdateContactModal';

/**
 * Customer Request Branch List Page Component
 * Displays branch-level figoskor requests with full CRUD functionality
 * Matches legacy CustomerRequestBranchList component exactly - UI and functionality 1:1 parity
 */
export const CustomerRequestBranchListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId, requestId } = useParams<{ customerId: string; requestId: string }>();

  // Component state management
  const [parentCustomer, setParentCustomer] = useState<ParentCustomer | null>(null);
  const [parentRequest, setParentRequest] = useState<ParentRequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequestBranchItem | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Get dropdown data for filters
  const { statusOptions } = useCustomerRequestBranchListDropdownData();

  // URL query parameters management
  const { queryParams, updateParams, resetParams } = useCustomerRequestBranchListQueryParams();

  // Initialize filter form
  const { form, schema, handleSearch } = useCustomerRequestBranchListFilters({
    statusOptions,
    onFilterChange: updateParams,
    initialValues: queryParams,
  });

  // Memoize final query params with requestId
  const finalQueryParams = useMemo(() => {
    if (!requestId || requestId === 'undefined') {
      return { requestId: '', page: 1, pageSize: 20, sort: 'Id', sortType: 'Desc' as const };
    }
    return { requestId, ...queryParams };
  }, [requestId, queryParams]);

  // Server-side query for branch requests
  const { data, error, isLoading, isFetching, pagingConfig, refetch } = useServerSideQuery(
    useLazyGetCustomerRequestBranchListQuery,
    finalQueryParams,
    { lazyQuery: !requestId || requestId === 'undefined' },
  );

  // Note: Mutations are handled within each modal component for better encapsulation

  // Error handling (modal-specific errors are handled within each modal)
  useErrorListener([error]);

  // Extract table data (memoized to prevent useCallback dependency issues)
  const tableData = useMemo(() => data?.TargetCompanyItems || [], [data?.TargetCompanyItems]);
  const totalCount = data?.TotalCount || 0;

  // Table configuration
  const tableHeaders = useMemo(() => getCustomerRequestBranchListHeaders(), []);

  // Load parent customer and request from various sources
  useEffect(() => {
    let customer = location.state?.customer;
    let request = location.state?.request;

    if (!customer) {
      customer = getParentCustomerFromStorage();
    }

    if (!request) {
      request = getParentRequestFromStorage();
    }

    if (customer) {
      setParentCustomer(customer);
    }

    if (request) {
      setParentRequest(request);
    }

    // If no customer found, navigate back to customer list
    if (!customer) {
      navigate('/figoskor-operations/customers');
    }
  }, [location.state, navigate]);

  // Reset handler - clear filters and URL parameters
  const handleReset = useCallback(() => {
    form.reset();
    resetParams();
  }, [form, resetParams]);

  const handleView = useCallback(
    (request: CustomerRequestBranchItem) => {
      // Store branch for navigation persistence
      storeParentBranch(request);

      // Navigate to company detail page
      const detailPath = buildCompanyDetailPath(customerId!, requestId!, request.Id.toString());

      navigate(detailPath, {
        state: {
          customer: parentCustomer,
          request: parentRequest,
          branch: request,
        },
      });
    },
    [customerId, requestId, navigate, parentCustomer, parentRequest],
  );

  // Action handlers
  const handleUpdateContact = useCallback((request: CustomerRequestBranchItem) => {
    setSelectedRequest(request);
    setShowUpdateModal(true);
  }, []);

  const handleSendEmail = useCallback((request: CustomerRequestBranchItem) => {
    setSelectedRequest(request);
    setShowEmailModal(true);
  }, []);

  const handleReject = useCallback((request: CustomerRequestBranchItem) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  }, []);

  const handleBulkEmail = useCallback(() => {
    const companiesWithEmails = filterCompaniesWithEmails(tableData);

    if (companiesWithEmails.length === 0) {
      // Show warning - no companies with emails
      alert('Bu sayfada email adresi bulunan bayi bulunmamaktadır.');
      return;
    }

    setShowBulkEmailModal(true);
  }, [tableData]);

  // Modal close handlers
  const handleModalSuccess = useCallback(() => {
    // Refresh data after successful operations
    refetch();
  }, [refetch]);

  // Render customer info header
  const renderCustomerInfo = () => {
    if (!parentCustomer || !parentRequest) return null;

    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" gutterBottom>
              📋 {parentCustomer.CompanyName} - Bayi Figoskor Talepleri
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Typography variant="body2">
                <strong>Ana Firma:</strong> {parentCustomer.CompanyName}
              </Typography>
              <Typography variant="body2">
                <strong>VKN:</strong> {parentCustomer.Identifier}
              </Typography>
              <Typography variant="body2">
                <strong>Talep ID:</strong> {parentRequest.Id}
              </Typography>
              <Typography variant="body2">
                <strong>Talep Tarihi:</strong> {formatRequestDate(parentRequest.RequestDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bu sayfada {parentCustomer.CompanyName} firmasının bayilerine ait figoskor talepleri görüntülenmektedir.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Alert>
    );
  };

  return (
    <>
      <PageHeader title="Bayi Figoskor Talepleri" subtitle="Bayi talep listesi ve yönetimi" />

      <Box mx={2}>
        {/* Customer Info Section */}
        {renderCustomerInfo()}

        {/* Summary and Bulk Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Toplam {totalCount} talep bulundu
          </Typography>

          <Button variant="contained" startIcon={<Send />} onClick={handleBulkEmail} disabled={tableData.length === 0}>
            Tüm Bayilere Email Gönder
          </Button>
        </Box>

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
            </Stack>
          </Form>
        </Card>

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<CustomerRequestBranchItem>
            id="customer-request-branch-table"
            rowId="Id"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            total={totalCount}
            notFoundConfig={{
              title: 'Bayi talebi bulunamadı',
              subTitle: 'Arama kriterlerinizi değiştirip tekrar deneyin.',
            }}>
            {/* Custom cell renderers */}
            <Slot<CustomerRequestBranchItem> id="RequestDate">
              {() => (
                <Typography variant="body2" fontWeight="bold">
                  {formatRequestDate(parentRequest?.RequestDate)}
                </Typography>
              )}
            </Slot>

            <Slot<CustomerRequestBranchItem> id="Status">
              {(_, row) => (
                <Chip
                  label={row!.StatusDescription || 'Bilinmiyor'}
                  color={getStatusChipColor(row!.Status)}
                  size="small"
                />
              )}
            </Slot>

            <Slot<CustomerRequestBranchItem> id="ContactPerson">
              {(_, row) => <Typography variant="body2">{formatDisplayValue(row!.ContactPerson)}</Typography>}
            </Slot>

            <Slot<CustomerRequestBranchItem> id="Phone">
              {(_, row) => <Typography variant="body2">{formatDisplayValue(row!.Phone)}</Typography>}
            </Slot>

            <Slot<CustomerRequestBranchItem> id="MailAddress">
              {(_, row) => <Typography variant="body2">{formatDisplayValue(row!.MailAddress)}</Typography>}
            </Slot>

            <Slot<CustomerRequestBranchItem> id="actions">
              {(_, row) => (
                <Box display="flex" gap={0.5}>
                  <IconButton
                    onClick={() => handleView(row!)}
                    title="Görüntüle"
                    size="small"
                    sx={{
                      color: 'primary.700',
                      '&:hover': {
                        backgroundColor: 'primary.100',
                        color: 'primary.800',
                      },
                    }}>
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleUpdateContact(row!)}
                    title="İletişim Bilgilerini Güncelle"
                    size="small"
                    sx={{
                      color: 'warning.700',
                      '&:hover': {
                        backgroundColor: 'warning.100',
                        color: 'warning.800',
                      },
                    }}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleSendEmail(row!)}
                    title="Email Gönder"
                    size="small"
                    sx={{
                      color: 'info.main',
                      '&:hover': {
                        backgroundColor: 'info.lighter',
                        color: 'info.dark',
                      },
                    }}>
                    <Email />
                  </IconButton>
                  {row!.Status !== 4 && (
                    <IconButton
                      onClick={() => handleReject(row!)}
                      title="Firmayı Reddet"
                      size="small"
                      sx={{
                        color: 'error.700',
                        '&:hover': {
                          backgroundColor: 'error.100',
                          color: 'error.800',
                        },
                      }}>
                      <Close />
                    </IconButton>
                  )}
                </Box>
              )}
            </Slot>
          </Table>
        </Card>
      </Box>

      {/* Modal Components */}
      {showUpdateModal && selectedRequest && parentCustomer && parentRequest && (
        <UpdateContactModal
          open={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          selectedRequest={selectedRequest}
          parentCustomer={parentCustomer}
          parentRequest={parentRequest}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Additional Modal Components */}
      {showEmailModal && selectedRequest && parentCustomer && parentRequest && (
        <EmailManagementModal
          open={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          selectedRequest={selectedRequest}
          parentCustomer={parentCustomer}
          parentRequest={parentRequest}
          onSuccess={handleModalSuccess}
        />
      )}

      {showBulkEmailModal && parentCustomer && parentRequest && (
        <BulkEmailModal
          open={showBulkEmailModal}
          onClose={() => setShowBulkEmailModal(false)}
          requests={tableData}
          parentCustomer={parentCustomer}
          parentRequest={parentRequest}
          onSuccess={handleModalSuccess}
        />
      )}

      {showRejectModal && selectedRequest && (
        <RejectRequestModal
          open={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          selectedRequest={selectedRequest}
          onSuccess={handleModalSuccess}
        />
      )}

      <EnterEventHandle onEnterPress={handleSearch} />
    </>
  );
};
