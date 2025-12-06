import { FigoLoading } from '@components';
import { HUMAN_READABLE_DATE_TIME } from '@constant';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Info as InfoIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import {
  useLazyGetIntegrationTransactionDetailsQuery,
  useLazyGetIntegrationTransactionsQuery,
} from '../../Reports/OperationReports/IntegrationReports/integration-reports.api';

interface IntegratorReportsTabProps {
  allowanceId: number;
  isDialog: boolean;
}

/**
 * Station Information Component
 * Shows transaction details for each integration transaction
 * Similar to TransactionHistoryTab but simpler
 */
const StationInformationSection: React.FC<{
  allowanceTransactionId: number;
}> = ({ allowanceTransactionId }) => {
  const [getDetails, { data: detailsData, isLoading: isLoadingDetails }] =
    useLazyGetIntegrationTransactionDetailsQuery();

  // Load details when component mounts
  React.useEffect(() => {
    if (allowanceTransactionId) {
      getDetails({
        AllowanceTransactionId: allowanceTransactionId,
      });
    }
  }, [allowanceTransactionId, getDetails]);

  if (isLoadingDetails) {
    return (
      <Box sx={{ mt: 2, p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          İstasyon bilgileri yükleniyor...
        </Typography>
      </Box>
    );
  }

  if (!detailsData?.Items || detailsData.Items.length === 0) {
    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          İstasyon bilgisi bulunamadı
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Header - matching screenshot style */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <InfoIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          İstasyon Bilgileri
        </Typography>
        <Chip
          label={`${detailsData.Items.length} Kayıt`}
          size="small"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontSize: '0.75rem',
            height: 20,
            '& .MuiChip-label': { px: 1 },
          }}
        />
      </Box>

      {/* Station Information Items - Table-like layout */}
      <Stack spacing={0.5}>
        {detailsData.Items.map((detail, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              bgcolor: index % 2 === 0 ? 'grey.50' : 'white',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200',
              '&:hover': { bgcolor: 'grey.100' },
            }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  EKLENME TARİHİ
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 0.5 }}>
                  {detail.InsertedDate && dayjs(detail.InsertedDate).isValid()
                    ? dayjs(detail.InsertedDate).format(HUMAN_READABLE_DATE_TIME)
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  GÜNCELLENME TARİHİ
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 0.5 }}>
                  {detail.UpdatedDate && dayjs(detail.UpdatedDate).isValid()
                    ? dayjs(detail.UpdatedDate).format(HUMAN_READABLE_DATE_TIME)
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  AÇIKLAMA
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'medium',
                    mt: 0.5,
                    fontStyle: detail.Description ? 'normal' : 'italic',
                    color: detail.Description ? 'text.primary' : 'text.secondary',
                  }}>
                  {detail.Description || 'Açıklama mevcut değil'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

/**
 * Integrator Reports Tab Component
 * Shows integration transactions for a specific allowance (cheque operation)
 * Following OffersTab card pattern exactly
 */
const IntegratorReportsTab: React.FC<IntegratorReportsTabProps> = ({ allowanceId, isDialog }) => {
  // Prepare base query parameters with AllowanceId filter - memoized to prevent infinite loop
  const baseQueryParams = useMemo(
    () => ({
      AllowanceId: allowanceId.toString(),
      PageSize: 25,
      Page: 1,
    }),
    [allowanceId],
  );

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching } = useServerSideQuery(
    useLazyGetIntegrationTransactionsQuery,
    baseQueryParams,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items ?? [];

  if (isLoading || isFetching) {
    return (
      <Box position="relative" height="200px">
        <FigoLoading />
      </Box>
    );
  }

  if (!tableData || tableData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography color="text.secondary">Entegrasyon raporu bilgisi bulunmuyor.</Typography>
      </Box>
    );
  }

  // If isDialog is true, show only StationInformationSection for the first transaction
  if (isDialog && tableData.length > 0) {
    const firstTransaction = tableData[0];
    return (
      <Box>
        <StationInformationSection allowanceTransactionId={firstTransaction.AllowanceTransactionId} />
      </Box>
    );
  }

  return (
    <Box>
      {tableData.map((transaction) => {
        const {
          AllowanceTransactionId,
          AllowanceId: transactionAllowanceId,
          AllowanceStatus = '',
          Description = '',
          Status = '',
          InsertedDate = '',
          SenderName = '',
          ReceiverName = '',
          FinancerName = '',
          InvoiceNumber = '',
          UpdatedDate = '',
        } = transaction;

        return (
          <Card
            key={AllowanceTransactionId}
            sx={{
              mb: 3,
              border: 2,
              borderColor: AllowanceStatus === 'Ödeme Alındı' ? 'success.main' : 'error.main',
            }}>
            <CardContent>
              {/* First Row */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      İskonto No
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                      {transactionAllowanceId}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      İskonto Durumu
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      <Chip label={AllowanceStatus || 'Belirtilmedi'} color="default" size="small" variant="outlined" />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Tedarikçi
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {SenderName || '-'}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Alıcı
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {ReceiverName || '-'}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Finans Şirketi
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {FinancerName || '-'}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Statü
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      <Chip label={Status || 'Belirtilmedi'} color="default" size="small" />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Eklenme Tarihi
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {InsertedDate && dayjs(InsertedDate).isValid()
                        ? dayjs(InsertedDate).format(HUMAN_READABLE_DATE_TIME)
                        : '-'}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Fatura No
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {InvoiceNumber || '-'}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Güncellenme Tarihi
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {UpdatedDate && dayjs(UpdatedDate).isValid()
                        ? dayjs(UpdatedDate).format(HUMAN_READABLE_DATE_TIME)
                        : '-'}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Açıklama
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {Description || '-'}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Station Information Section */}
              <StationInformationSection allowanceTransactionId={AllowanceTransactionId} />
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default IntegratorReportsTab;
