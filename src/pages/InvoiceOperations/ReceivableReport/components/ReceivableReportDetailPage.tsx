import { PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { getCurrencyPrefix } from '@utils';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDateValue } from '../helpers';
import { useGetReceivableReportDetailQuery } from '../receivable-report.api';
import type { ReceivableReportItem } from '../receivable-report.types';
import { AddReceivableModal as UpdateReceivableModal } from './AddReceivableModal';
import { ReceivableHistoryTable } from './ReceivableHistoryTable';

/**
 * Receivable Report Detail Page Component
 * Displays detailed information for a specific receivable report item
 * Follows OperationPricing detail page pattern
 */
const ReceivableReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Fetch receivable report detail data
  const { data, error, isLoading, refetch } = useGetReceivableReportDetailQuery(parseInt(id || '0', 10), { skip: !id });

  // Error handling
  useErrorListener(error);

  // Memoized receivable data
  const receivableData = useMemo(() => data as ReceivableReportItem | undefined, [data]);

  // Handle modal actions
  const handleUpdateReceivable = () => {
    if (receivableData) {
      setIsUpdateModalOpen(true);
    }
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleUpdateSuccess = () => {
    // Refetch data after successful update
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          Alacak detayı yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
        </Alert>
      </Box>
    );
  }

  // Not found state
  if (!receivableData) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Alacak detayı bulunamadı.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`Alacak Detayı - ${receivableData.OrderNo}`}
        subtitle="Alacak detay bilgileri ve firma bilgileri"
      />

      {/* Action Button */}

      <Grid container spacing={2} sx={{ p: 3 }}>
        {/* Main Information Card */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alacak Bilgileri
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Alacak No
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {receivableData.OrderNo}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Alacak Tutarı
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {getCurrencyPrefix(receivableData.CurrencyCode)}{' '}
                    {new Intl.NumberFormat('tr-TR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(receivableData.PayableAmount)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Onaylanmış Alacak Tutarı
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {getCurrencyPrefix(receivableData.CurrencyCode)}{' '}
                    {new Intl.NumberFormat('tr-TR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(receivableData.ApprovedPayableAmount)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Para Birimi
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {receivableData.CurrencyCode}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Vade Tarihi
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDateValue(receivableData.PaymentDueDate)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Oluşturma Tarihi
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDateValue(receivableData.IssueDate)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Yüklenme Tarihi
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDateValue(receivableData.CreatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Company Information Card */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            {/* Sender Information */}
            <Grid item xs={12}>
              <Box sx={{ pb: 2, width: '100%' }}>
                <Button variant="contained" color="primary" fullWidth onClick={handleUpdateReceivable}>
                  Alacak Güncelle
                </Button>
              </Box>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tedarikçi Bilgileri
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Firma Adı
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    {receivableData.SenderName || '-'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    VKN/TCKN
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {receivableData.SenderIdentifier || '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Receiver Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Alıcı Bilgileri
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Firma Adı
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    {receivableData.ReceiverName || '-'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    VKN/TCKN
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {receivableData.ReceiverIdentifier || '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Financer Information (if available) */}
            {receivableData.FinancerCompanyName && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Finansör Bilgileri
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Finansör Firma
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {receivableData.FinancerCompanyName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Receivable History Section */}
        <Grid item xs={12}>
          <ReceivableHistoryTable orderId={receivableData.Id} />
        </Grid>
      </Grid>

      {/* Update Receivable Modal */}
      <UpdateReceivableModal
        open={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onSuccess={handleUpdateSuccess}
        receivableData={receivableData}
      />
    </Box>
  );
};

export default ReceivableReportDetailPage;
