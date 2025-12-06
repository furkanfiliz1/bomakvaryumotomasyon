import { PageHeader } from '@components';
import { Edit as EditIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { currencyFormatter } from '@utils';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { InvoiceEditModal, InvoiceHistoryTable } from '.';
import { useGetInvoiceDetailQuery, useGetInvoiceHistoriesQuery } from '../../invoice-operations.api';
import type { InvoiceItem } from '../../invoice-operations.types';

// Date formatting utility
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('tr-TR');
};

export const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const invoiceId = Number(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: invoice,
    isLoading: invoiceLoading,
    error: invoiceError,
    refetch: refetchInvoice,
  } = useGetInvoiceDetailQuery(invoiceId, {
    skip: !invoiceId,
  });

  const {
    data: invoiceHistories = [],
    isLoading: historiesLoading,
    error: historiesError,
    refetch: refetchHistories,
  } = useGetInvoiceHistoriesQuery(invoiceId, {
    skip: !invoiceId,
  });

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleInvoiceUpdate = () => {
    refetchInvoice();
    refetchHistories();
  };

  const getInvoiceType = (invoice: InvoiceItem): string => {
    if (invoice.Type === 2) {
      return 'Kağıt Fatura';
    }
    if (invoice.Type === 1 && invoice.EInvoiceType === 1) {
      return 'e-Fatura';
    }
    if (invoice.Type === 1 && invoice.EInvoiceType === 2) {
      return 'e-Arşiv';
    }
    if (invoice.Type === 1 && invoice.EInvoiceType === 3) {
      return 'e-Müstahsil';
    }
    return '';
  };

  const getInvoiceStatus = (invoice: InvoiceItem): string => {
    const isDelete = invoice.IsDeleted ? 'Silindi' : 'Silinmedi';
    const isActive = invoice.Status === 1 ? 'Aktif' : 'Pasif';
    return `${isActive} ve ${isDelete}`;
  };

  const getGibStatusChip = (invoice: InvoiceItem) => {
    if (invoice.IsGibApproved === null) {
      return <Chip label="Bilinmiyor" color="default" size="small" />;
    }
    return (
      <Chip
        label={invoice.IsGibApproved ? 'GİB Onaylı' : 'GİB Hatası'}
        color={invoice.IsGibApproved ? 'success' : 'error'}
        size="small"
      />
    );
  };

  if (invoiceLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (invoiceError || !invoice) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Fatura detayları yüklenirken hata oluştu.</Alert>
      </Box>
    );
  }

  return (
    <>
      <PageHeader title="Fatura Detayı" subtitle="Fatura bilgileri ve işlem geçmişi" />

      <Box sx={{ p: 3, pt: 1 }}>
        <Grid container spacing={2}>
          {/* Main Invoice Details */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                {/* Supplier and Receiver Info */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Tedarikçi Bilgileri
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {invoice.SenderName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      VKN
                    </Typography>
                    <Typography variant="body1">{invoice.SenderIdentifier}</Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Alıcı Bilgileri
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {invoice.ReceiverName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      VKN
                    </Typography>
                    <Typography variant="body1">{invoice.ReceiverIdentifier}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Invoice Details */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Fatura No
                      </Typography>
                      <Typography variant="body1">
                        {invoice.InvoiceNumber
                          ? invoice.InvoiceNumber
                          : `${invoice.SerialNumber} - ${invoice.SequenceNumber}`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Fatura ID
                      </Typography>
                      <Typography variant="body1">{invoice.Id}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Kesim Tarihi
                      </Typography>
                      <Typography variant="body1">{formatDate(invoice.IssueDate)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Vade Tarihi
                      </Typography>
                      <Typography variant="body1">
                        {invoice.PaymentDueDate ? formatDate(invoice.PaymentDueDate) : '-'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Invoice Type and Status */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Fatura Tipi
                      </Typography>
                      <Typography variant="body1">{getInvoiceType(invoice)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Fatura Durumu
                      </Typography>
                      <Typography variant="body1">{getInvoiceStatus(invoice)}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* UUID and Hash Code for e-Invoice */}
                {invoice.Type === 1 && (invoice.EInvoiceType === 1 || invoice.ProfileId === 'TICARIFATURA') && (
                  <>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            UUID
                          </Typography>
                          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                            {invoice.UuId || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Fatura Hash Kodu
                          </Typography>
                          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                            {invoice.HashCode || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar with Actions and Summary */}
          <Grid item xs={12} lg={4}>
            {/* Edit Action */}
            <Box sx={{ mb: 3 }}>
              <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEditClick} fullWidth>
                Faturayı Düzenle
              </Button>
            </Box>

            {/* Amount Summary */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6">Fatura Tutarı</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {currencyFormatter(invoice.PayableAmount || 0, invoice.PayableAmountCurrency)}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body1">Onaylanan Tutar</Typography>
                  <Typography variant="body1">
                    {currencyFormatter(invoice.ApprovedPayableAmount || 0, invoice.PayableAmountCurrency)}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body1">İskontolanabilir Tutar</Typography>
                  <Typography variant="body1">
                    {currencyFormatter(invoice.RemainingAmount || 0, invoice.PayableAmountCurrency)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
                  <Typography variant="h6">Yükleme Tarihi</Typography>
                  <Typography variant="h6">{formatDate(invoice.InsertedDate)}</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* GIB Status */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mr: 2 }}>
                    GİB Durumu
                  </Typography>
                  {getGibStatusChip(invoice)}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  {invoice.IsGibApproved === null ? (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body2" gutterBottom>
                        {invoice.GibMessage || '-'}
                      </Typography>
                      {invoice.GibApproveDate && (
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(invoice.GibApproveDate)}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Invoice History Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Fatura Geçmişi
          </Typography>
          <InvoiceHistoryTable histories={invoiceHistories} loading={historiesLoading} error={historiesError} />
        </Box>
      </Box>

      {/* Invoice Edit Modal */}
      <InvoiceEditModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        invoice={invoice}
        onUpdate={handleInvoiceUpdate}
      />
    </>
  );
};
