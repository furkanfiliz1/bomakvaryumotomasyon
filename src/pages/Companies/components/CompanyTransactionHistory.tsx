import { Alert, Box, Card, CardContent, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';
import { useGetTransactionHistoryQuery } from '../companies.api';
import CompanyRulesList from './CompanyRulesList';

interface CompanyTransactionHistoryProps {
  companyId: number;
  activityType?: number; // 1 = Alıcı (Buyer), 2 = Satıcı (Seller)
}

const CompanyTransactionHistory: React.FC<CompanyTransactionHistoryProps> = ({ companyId, activityType }) => {
  const { data: transactionHistory, isLoading, error } = useGetTransactionHistoryQuery({ companyId });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        İşlem geçmişi yüklenirken bir hata oluştu.
      </Alert>
    );
  }

  if (!transactionHistory) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        İşlem geçmişi verisi bulunamadı.
      </Alert>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Alıcı (Buyer) için sadece Kurallar göster
  if (activityType === 1) {
    return (
      <Box>
        <CompanyRulesList companyId={companyId} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        İşlem Geçmişi
      </Typography>

      <Grid container spacing={2}>
        {/* Genel İstatistikler */}
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Genel İstatistikler
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Toplam Yüklenen Fatura:</Typography>
                  <Chip label={transactionHistory.TotalNumberOfUploadedInvoice} color="info" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Toplam İşlem Sayısı:</Typography>
                  <Chip label={transactionHistory.TotalNumberOfTransaction} color="info" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Toplam Ödeme:</Typography>
                  <Chip
                    label={formatCurrency(transactionHistory.SumOfReceivedTransactionFee)}
                    color="success"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">FKF Kullanılan Miktar:</Typography>
                  <Chip label={formatCurrency(transactionHistory.FKF_UsedAmount)} color="warning" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarihler */}

        {/* TFS Bilgileri */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                TFS Kullanım Bilgileri
              </Typography>
              {transactionHistory.TFS_UsedAmount && transactionHistory.TFS_UsedAmount.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Toplam {transactionHistory.TFS_UsedAmount.length} TFS kaydı bulunmaktadır.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">İlk İşlem Tarihi:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatDate(transactionHistory.FirstTransactionDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Son İşlem Tarihi:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatDate(transactionHistory.LastTransactionDate)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {transactionHistory.TFS_UsedAmount.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          backgroundColor: 'action.hover',
                          borderRadius: 1,
                        }}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.Receiver || '-'}
                        </Typography>
                        <Chip
                          label={formatCurrency(item.Amount || 0)}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Henüz TFS kullanım verisi bulunmamaktadır.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* TFS Banka Bilgileri */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                TFS Banka Bilgileri
              </Typography>
              {transactionHistory.TFS_BankInformation && transactionHistory.TFS_BankInformation.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Toplam {transactionHistory.TFS_BankInformation.length} banka kaydı bulunmaktadır.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {transactionHistory.TFS_BankInformation.map((bankInfo, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          backgroundColor: 'action.hover',
                          borderRadius: 1,
                        }}>
                        <Typography variant="body2" fontWeight="medium">
                          {`${index + 1}. ${bankInfo || 'Bilinmeyen Banka'}`}
                        </Typography>
                        {bankInfo.Amount && (
                          <Chip
                            label={formatCurrency(bankInfo.Amount)}
                            color="secondary"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Henüz TFS banka bilgisi bulunmamaktadır.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* FKF Banka Bilgileri */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                FKF Banka Bilgileri
              </Typography>
              {transactionHistory.FKF_BankInformation && transactionHistory.FKF_BankInformation.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Toplam {transactionHistory.FKF_BankInformation.length} banka kaydı bulunmaktadır.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }} mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      Toplam Kullanım Bilgisi (FKF)
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(transactionHistory.FKF_UsedAmount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {transactionHistory.FKF_BankInformation.map((bankInfo, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          backgroundColor: 'action.hover',
                          borderRadius: 1,
                        }}>
                        <Typography variant="body2" fontWeight="medium">
                          {bankInfo.BankName || 'Bilinmeyen Banka'}
                        </Typography>
                        {bankInfo.Amount && (
                          <Chip
                            label={formatCurrency(bankInfo.Amount)}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Henüz FKF banka bilgisi bulunmamaktadır.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Alıcılar */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Alıcı Bilgileri
              </Typography>
              {transactionHistory.ReceiverNames && transactionHistory.ReceiverNames.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Toplam {transactionHistory.ReceiverNames.length} alıcı bulunmaktadır.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {transactionHistory.ReceiverNames.map((receiver, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          backgroundColor: 'action.hover',
                          borderRadius: 1,
                        }}>
                        <Typography variant="body2" fontWeight="medium">
                          {`${index + 1}. ${receiver || '-'}`}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Henüz alıcı verisi bulunmamaktadır.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyTransactionHistory;
