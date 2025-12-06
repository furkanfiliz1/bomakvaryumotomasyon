import { EnterEventHandle, Form, PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Edit, FileUpload, Search, Visibility } from '@mui/icons-material';
import { Alert, Box, Button, Card, Chip, IconButton, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateClientReportRequestMutation, useLazyGetClientReportRequestsQuery } from '../figoskor-operations.api';
import type {
  CreateFigoskorReportRequest,
  FigoskorClientRequest,
  FigoskorCustomer,
} from '../figoskor-operations.types';
import {
  buildRequestBranchPath,
  formatReferenceType,
  formatRequestDate,
  getParentCustomerFromStorage,
  getRequestStatusColor,
  getRequestTableHeaders,
  storeParentRequest,
} from '../helpers';
import {
  useFigoskorOperationsDropdownData,
  useFigoskorRequestFilterForm,
  useFigoskorRequestQueryParams,
} from '../hooks';
import CompanyExcelUpload from './CompanyExcelUpload';

interface CompanyData {
  vkn?: string;
  VKN?: string;
  unvan?: string;
  Unvan?: string;
  telefon?: string;
  Telefon?: string;
  email?: string;
  'e-mail'?: string;
  'E-mail'?: string;
  yetkiliKisiAd?: string;
  yetkiliKisiSoyad?: string;
}

/**
 * Customer Request List Page Component
 * Displays Excel upload requests for a specific customer with full upload functionality
 * Matches legacy CustomerRequestList component exactly - UI and functionality 1:1 parity
 */
export const CustomerRequestListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [parentCustomer, setParentCustomer] = useState<FigoskorCustomer | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [selectedRequestForUpdate, setSelectedRequestForUpdate] = useState<FigoskorClientRequest | null>(null);

  // Load parent customer from router state or sessionStorage
  useEffect(() => {
    let customer = location.state?.customer;

    if (!customer) {
      customer = getParentCustomerFromStorage();
    }

    if (customer) {
      setParentCustomer(customer);
    } else {
      // If no customer found, navigate back to customer list
      navigate('/figoskor-operations/customers');
    }
  }, [location.state, navigate]);

  // Get dropdown data for filters
  const { requestStatusOptions } = useFigoskorOperationsDropdownData();

  // URL query parameters management - follows CustomerTracking pattern
  const { queryParams, updateParams, resetParams } = useFigoskorRequestQueryParams();

  // Initialize filter form with URL parameters
  const { form, schema, handleSearch } = useFigoskorRequestFilterForm({
    requestStatusOptions,
    onFilterChange: updateParams,
    initialValues: queryParams,
  });

  // Reset handler - clear URL parameters and form
  const handleReset = () => {
    form.reset();
    resetParams();
  };

  // Memoize final query params with customerId from parentCustomer
  const finalQueryParams = useMemo(() => {
    if (!parentCustomer?.Id) {
      // Return default params to prevent API call without valid customerId
      return { customerId: '', page: 1, pageSize: 20, sort: 'Id', sortType: 'Desc' as const };
    }
    return { customerId: String(parentCustomer.Id), ...queryParams };
  }, [parentCustomer?.Id, queryParams]);

  // Server-side query for requests - only call if parentCustomer exists
  const { data, error, isLoading, isFetching, pagingConfig, refetch } = useServerSideQuery(
    useLazyGetClientReportRequestsQuery,
    finalQueryParams,
    { lazyQuery: !parentCustomer?.Id },
  );

  // Mutation for creating/updating requests
  const [createRequest, { isLoading: isCreating, error: isCreatingError }] = useCreateClientReportRequestMutation();

  // Error handling
  useErrorListener([isCreatingError, error]);

  // Extract table data from useServerSideQuery result
  const tableData = data?.ClientReportRequestItems || [];
  const totalCount = data?.TotalCount || 0;

  console.log('CustomerRequestListPage render - tableData:', tableData);

  // Table configuration
  const tableHeaders = useMemo(() => getRequestTableHeaders(), []);

  const handleViewRequest = useCallback(
    (request: FigoskorClientRequest) => {
      if (!parentCustomer?.Id) return;

      // Store request as parentRequest for persistence
      const parentRequest = {
        ...request,
        parentRequest: request,
      };
      storeParentRequest(parentRequest);

      // Navigate to branch list page
      const branchPath = buildRequestBranchPath(String(parentCustomer.Id), request.Id.toString());
      navigate(branchPath, {
        state: {
          customer: parentCustomer,
          request: parentRequest,
        },
      });
    },
    [navigate, parentCustomer],
  );

  const handleUpdateRequest = useCallback((request: FigoskorClientRequest) => {
    setSelectedRequestForUpdate(request);
    setUpdateMode(true);
    setShowUploadModal(true);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    // Reset upload modal state
    setShowUploadModal(false);
    setUpdateMode(false);
    setSelectedRequestForUpdate(null);

    // Refresh the data
    refetch();
  }, [refetch]);

  const handleExcelUpload = useCallback(() => {
    setUpdateMode(false);
    setSelectedRequestForUpdate(null);
    setShowUploadModal(true);
  }, []);

  // Excel data submission handler
  const handleCompanyDataSubmit = useCallback(
    async (
      companyData: CompanyData[],
      requestDate: string,
      showReference: boolean,
    ): Promise<{ success: boolean; message: string }> => {
      try {
        if (!parentCustomer?.Id) {
          throw new Error('Ana şirket bilgisi bulunamadı.');
        }

        if (!companyData || companyData.length === 0) {
          throw new Error('Yüklenecek şirket verisi bulunamadı.');
        }

        // Transform company data to match API format
        const targetCompanies = companyData.map((company, index) => {
          const identifier = company.VKN || company.vkn || '';
          const title = company.Unvan || company.unvan || '';

          if (!identifier) {
            throw new Error(`${index + 1}. satırda VKN bilgisi eksik.`);
          }

          if (!title) {
            throw new Error(`${index + 1}. satırda Ünvan bilgisi eksik.`);
          }

          return {
            TargetCompanyIdentifier: identifier,
            TargetCompanyTitle: title,
            Phone: company.Telefon || company.telefon || '',
            MailAddress: company['E-mail'] || company.email || company['e-mail'] || '',
            ContactPerson: `${company.yetkiliKisiAd || ''} ${company.yetkiliKisiSoyad || ''}`.trim(),
          };
        });

        // Prepare request body
        const requestBody: CreateFigoskorReportRequest = {
          ClientCompanyId: parentCustomer.Id,
          RequestDate: requestDate,
          ShowReference: updateMode ? selectedRequestForUpdate!.ShowReference : showReference,
          TargetCompanies: targetCompanies,
        };

        // Add Id for update mode
        if (updateMode && selectedRequestForUpdate) {
          requestBody.Id = selectedRequestForUpdate.Id;
        }

        // Make API call
        await createRequest(requestBody).unwrap();

        const actionText = updateMode ? 'güncellendi' : 'oluşturuldu';
        return {
          success: true,
          message: `${companyData.length} şirket için figoskor talebi başarıyla ${actionText}.`,
        };
      } catch (error) {
        console.log('Error in handleCompanyDataSubmit:', error);
        throw error; // Re-throw error to be handled by the caller
      }
    },
    [parentCustomer, updateMode, selectedRequestForUpdate, createRequest],
  );

  // Render customer info header
  const renderCustomerInfo = () => {
    if (!parentCustomer) return null;

    const customerName = parentCustomer.CompanyName || 'Bilinmiyor';
    const customerVkn = parentCustomer.Identifier || 'N/A';

    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" gutterBottom>
              📁 {customerName} - Figoskor Talep Listesi
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Typography variant="body2">
                <strong>Ana Firma:</strong> {customerName}
              </Typography>
              <Typography variant="body2">
                <strong>VKN:</strong> {customerVkn}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bu sayfada {customerName} firması için yapılan Excel yüklemeleri görüntülenmektedir.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Alert>
    );
  };

  return (
    <>
      <PageHeader title="Figoskor İşlemleri" subtitle="Figoskor talep listesi ve yönetimi" />

      <Box mx={2}>
        {/* Customer Info Section */}
        {renderCustomerInfo()}

        {/* Summary and Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Toplam {totalCount} talep bulundu
          </Typography>

          <Button variant="contained" startIcon={<FileUpload />} onClick={handleExcelUpload} disabled={isCreating}>
            Şirket Listesi Yükle
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
          <Table<FigoskorClientRequest>
            id="figoskor-request-table"
            rowId="Id"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            total={totalCount}
            notFoundConfig={{ title: 'Müşteri talebi bulunamadı' }}>
            {/* Custom cell renderers */}
            <Slot<FigoskorClientRequest> id="RequestDate">
              {(_, row) => (
                <Typography variant="body2" fontWeight="bold">
                  {formatRequestDate(row!.RequestDate)}
                </Typography>
              )}
            </Slot>

            <Slot<FigoskorClientRequest> id="TargetCompanyCount">
              {(_, row) => (
                <Typography variant="body1" color="primary" fontWeight="bold">
                  {row!.TargetCompanyCount} Firma
                </Typography>
              )}
            </Slot>

            <Slot<FigoskorClientRequest> id="ShowReference">
              {(_, row) => (
                <Chip
                  label={formatReferenceType(row!.ShowReference)}
                  color={row!.ShowReference ? 'success' : 'default'}
                  size="small"
                />
              )}
            </Slot>

            <Slot<FigoskorClientRequest> id="Status">
              {(_, row) => (
                <Chip
                  label={row!.StatusDescription || 'Bilinmiyor'}
                  color={getRequestStatusColor(row!.Status)}
                  size="small"
                />
              )}
            </Slot>

            <Slot<FigoskorClientRequest> id="actions">
              {(_, row) => (
                <Box display="flex" gap={1}>
                  <IconButton
                    onClick={() => handleViewRequest(row!)}
                    title="Firma Listesini Görüntüle"
                    color="primary"
                    size="small">
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleUpdateRequest(row!)}
                    title="Talebi Güncelle"
                    color="warning"
                    size="small">
                    <Edit />
                  </IconButton>
                </Box>
              )}
            </Slot>
          </Table>
        </Card>
      </Box>

      {/* Company Excel Upload Modal */}
      <CompanyExcelUpload
        open={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUpdateMode(false);
          setSelectedRequestForUpdate(null);
        }}
        onDataSubmit={handleCompanyDataSubmit}
        onSuccess={handleUploadSuccess}
        updateMode={updateMode}
        selectedRequest={selectedRequestForUpdate || undefined}
      />

      <EnterEventHandle onEnterPress={handleSearch} />
    </>
  );
};

export default CustomerRequestListPage;
