/**
 * Risks Allowance Modal Component
 * TypeScript rewrite of legacy RisksAllowanceModal.js
 * Preserves all business logic while following OperationPricing patterns
 */

import { Assessment, Close, ExpandMore, List } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import { useErrorListener } from '@hooks';
import { currencyFormatter } from '@utils';
import {
  useGetAllowanceRisksBillsQuery,
  useGetAllowanceRisksQuery,
  useLazyGetAllowanceInvoiceRisksBillsQuery,
  useLazyGetAllowanceInvoiceRisksQuery,
} from '../../company-limit-tab.api';
import type { AllowanceInvoiceRisk, AllowanceRisk, RisksAllowanceModalProps } from '../../company-limit-tab.types';

/**
 * RisksAllowanceModal Component
 * Displays allowance risks with expandable accordion for invoice/bill details
 */
export const RisksAllowanceModal: React.FC<RisksAllowanceModalProps> = ({
  open,
  onClose,
  companyId,
  selectedFinancerId,
  selectedFinancerProductType,
}) => {
  const theme = useTheme();

  // State matching legacy component
  const [selectedAccordion, setSelectedAccordion] = useState<number | null>(null);
  const [allowanceInvoicesRisks, setAllowanceInvoicesRisks] = useState<AllowanceInvoiceRisk[]>([]);
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    pageSize: 5,
    itemCount: 0,
  });

  // Determine which API service to use based on product type (matching legacy logic)
  const allowanceRisksService =
    selectedFinancerProductType === 4 ? useGetAllowanceRisksBillsQuery : useGetAllowanceRisksQuery;

  // Get allowance risks (main accordion items)
  const {
    data: allowanceRisks = [],
    isLoading: isLoadingRisks,
    error: risksError,
  } = allowanceRisksService(
    {
      financerId: selectedFinancerId,
      CompanyId: companyId,
      productType: selectedFinancerProductType,
    },
    { skip: !open || !selectedFinancerId || !companyId },
  );

  // Lazy queries for invoice details (accordion content)
  const [getAllowanceInvoiceRisks, { isLoading: isLoadingInvoices, error: invoicesError }] =
    useLazyGetAllowanceInvoiceRisksQuery();
  const [getAllowanceInvoiceRisksBills, { isLoading: isLoadingBills, error: billsError }] =
    useLazyGetAllowanceInvoiceRisksBillsQuery();

  // Error handling
  useErrorListener([risksError, invoicesError, billsError]);

  // Determine ID field name based on product type (matching legacy logic)
  const idFieldName = useMemo(() => {
    return selectedFinancerProductType === 4 ? 'BillId' : 'InvoiceId';
  }, [selectedFinancerProductType]);

  // Handle accordion click - loads invoice details for selected allowance
  const handleAccordionClick = async (allowanceId: number) => {
    if (selectedAccordion === allowanceId) {
      // Collapse if same accordion is clicked
      setSelectedAccordion(null);
      setAllowanceInvoicesRisks([]);
      setPaginationParams({ page: 1, pageSize: 5, itemCount: 0 });
      return;
    }

    setSelectedAccordion(allowanceId);

    try {
      const params = {
        page: 1,
        pageSize: paginationParams.pageSize,
        AllowanceIds: allowanceId,
      };

      // Choose appropriate service based on product type (matching legacy logic)
      const queryFunction =
        selectedFinancerProductType === 4 ? getAllowanceInvoiceRisksBills : getAllowanceInvoiceRisks;

      const response = await queryFunction(params).unwrap();

      // Extract data based on product type (matching legacy logic)
      const invoiceData = selectedFinancerProductType === 4 ? response.AllowanceBills : response.AllowanceInvoices;

      setAllowanceInvoicesRisks(invoiceData || []);
      setPaginationParams({
        page: response.Page,
        pageSize: response.PageSize,
        itemCount: response.TotalCount,
      });
    } catch (error) {
      console.error('Error loading allowance invoice risks:', error);
      setAllowanceInvoicesRisks([]);
    }
  };

  // Format date to DD.MM.YYYY format (matching legacy moment formatting)
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  // Handle pagination change
  const handlePageChange = async (_event: React.ChangeEvent<unknown>, newPage: number) => {
    if (!selectedAccordion || newPage === paginationParams.page) return;

    try {
      const params = {
        page: newPage,
        pageSize: paginationParams.pageSize,
        AllowanceIds: selectedAccordion,
      };

      const queryFunction =
        selectedFinancerProductType === 4 ? getAllowanceInvoiceRisksBills : getAllowanceInvoiceRisks;

      const response = await queryFunction(params).unwrap();

      const invoiceData = selectedFinancerProductType === 4 ? response.AllowanceBills : response.AllowanceInvoices;

      setAllowanceInvoicesRisks(invoiceData || []);
      setPaginationParams((prev) => ({
        ...prev,
        page: newPage,
      }));
    } catch (error) {
      console.error('Error loading page:', error);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedAccordion(null);
      setAllowanceInvoicesRisks([]);
      setPaginationParams({ page: 1, pageSize: 5, itemCount: 0 });
    }
  }, [open]);

  const isLoading = isLoadingRisks || isLoadingInvoices || isLoadingBills;
  const totalPages = Math.ceil(paginationParams.itemCount / paginationParams.pageSize);

  // Helper to get product type display name
  const getProductTypeDisplayName = () => {
    return selectedFinancerProductType === 4 ? 'Çek' : 'Fatura';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '60vh',
          maxHeight: '90vh',
          borderRadius: 2,
        },
      }}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Assessment color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Risk Oluşturan İskontolar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getProductTypeDisplayName()} işlemleri
              {allowanceRisks.length > 0 && (
                <Typography component="span" variant="body2" color="primary.main" sx={{ ml: 1 }}>
                  ({allowanceRisks.length} kayıt)
                </Typography>
              )}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          edge="end"
          sx={{
            backgroundColor: theme.palette.grey[100],
            '&:hover': {
              backgroundColor: theme.palette.grey[200],
            },
          }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Header with improved typography and spacing */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            backgroundColor: theme.palette.grey[50],
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} color={theme.palette.text.secondary}>
                İskonto No
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} color={theme.palette.text.secondary}>
                İskonto Tarihi
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} color={theme.palette.text.secondary}>
                İskonto Tutarı
              </Typography>
            </Box>
            <Box sx={{ width: 48 }} /> {/* Space for expand icon */}
          </Box>
        </Box>

        {/* Loading state */}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              py: 6,
              gap: 2,
            }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Veriler yükleniyor...
            </Typography>
          </Box>
        )}

        {/* Main content - allowance risks accordion */}
        {!isLoading && (
          <>
            {allowanceRisks.length > 0 ? (
              <Box sx={{ px: 3, py: 2 }}>
                {allowanceRisks.map((allowance: AllowanceRisk) => (
                  <Card
                    key={allowance.AllowanceId}
                    sx={{
                      mb: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      overflow: 'hidden',
                      '&:last-child': { mb: 0 },
                    }}>
                    <Accordion
                      expanded={selectedAccordion === allowance.AllowanceId}
                      onChange={() => handleAccordionClick(allowance.AllowanceId)}
                      sx={{
                        boxShadow: 'none',
                        '&:before': { display: 'none' },
                        '&.Mui-expanded': {
                          margin: 0,
                        },
                      }}>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          backgroundColor:
                            selectedAccordion === allowance.AllowanceId ? theme.palette.primary[100] : 'transparent',
                          '&:hover': {
                            backgroundColor: theme.palette.grey[50],
                          },
                          '& .MuiAccordionSummary-content': {
                            margin: '16px 0',
                          },
                          '& .MuiAccordionSummary-expandIconWrapper': {
                            color: theme.palette.primary.main,
                          },
                        }}>
                        <Box sx={{ display: 'flex', width: '100%', gap: 2, alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={500}>
                              {allowance.AllowanceId}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" color={theme.palette.text.secondary}>
                              {formatDate(allowance.CreatedAt)}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={700}>
                              {currencyFormatter(allowance.Amount, 'TRY')}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ p: 0, backgroundColor: theme.palette.grey[50] }}>
                        <Box sx={{ p: 3 }}>
                          {/* Invoice/Bill details header */}
                          <Box
                            sx={{
                              p: 2,
                              mb: 2,
                              backgroundColor: theme.palette.grey[100],
                              borderRadius: 1,
                            }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600} color={theme.palette.text.secondary}>
                                  {getProductTypeDisplayName()} No
                                </Typography>
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600} color={theme.palette.text.secondary}>
                                  İskontolanan Tutar
                                </Typography>
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600} color={theme.palette.text.secondary}>
                                  Vade Tarihi
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {/* Invoice/Bill details table */}
                          {allowanceInvoicesRisks.length > 0 ? (
                            <Stack spacing={1}>
                              {allowanceInvoicesRisks.map((invoice: AllowanceInvoiceRisk, index: number) => (
                                <Card
                                  key={`${invoice[idFieldName as keyof AllowanceInvoiceRisk]}_${index}`}
                                  sx={{
                                    p: 2,
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 1,
                                    '&:hover': {
                                      backgroundColor: theme.palette.grey[50],
                                    },
                                  }}>
                                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="body1" fontWeight={500}>
                                        {(invoice[idFieldName as keyof AllowanceInvoiceRisk] as number) ?? '-'}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="body1" fontWeight={600}>
                                        {currencyFormatter(invoice.Amount, 'TRY')}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="body2" color={theme.palette.text.secondary}>
                                        {formatDate(invoice.DueDate)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Card>
                              ))}

                              {/* Pagination - only show if there's more than one page */}
                              {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pt: 2 }}>
                                  <Pagination
                                    count={totalPages}
                                    page={paginationParams.page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                    sx={{
                                      '& .MuiPaginationItem-root': {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Box>
                              )}
                            </Stack>
                          ) : (
                            <Card
                              sx={{
                                textAlign: 'center',
                                py: 6,
                                backgroundColor: theme.palette.grey[50],
                                border: `1px dashed ${theme.palette.divider}`,
                                borderRadius: 2,
                              }}>
                              <Stack direction="column" alignItems="center" spacing={2}>
                                <List fontSize="large" color="disabled" />
                                <Typography variant="body2" color="text.secondary">
                                  Kayıt bulunamadı
                                </Typography>
                              </Stack>
                            </Card>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box sx={{ px: 3, py: 4 }}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    backgroundColor: theme.palette.grey[50],
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}>
                  <Stack direction="column" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.grey[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <List fontSize="large" color="disabled" />
                    </Box>
                    <Stack spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight={600} color="text.primary">
                        Kayıt Bulunamadı
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bu financer için risk ve ödenek bilgisi bulunmamaktadır.
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
