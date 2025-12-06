import { Box, Card, CardContent, FormControlLabel, Grid, Switch, Typography } from '@mui/material';
import React from 'react';
import { useGetWalletInfoQuery } from '../companies.api';

interface CompanyWalletProps {
  companyId: number;
}

const CompanyWallet: React.FC<CompanyWalletProps> = ({ companyId }) => {
  const {
    data: walletInfo,
    isLoading,
    error,
  } = useGetWalletInfoQuery(
    { companyId },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  if (isLoading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  if (error) {
    return <Typography>Veri yüklenirken hata oluştu.</Typography>;
  }

  if (!walletInfo) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Cüzdan
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Cüzdan bilgisi bulunamadı.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const formatCurrency = (amount: number, currency: string | null = 'TRY') => {
    const safeCurrency = currency || 'TRY';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: safeCurrency,
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Cüzdan
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} key={walletInfo.Id}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Cüzdan No
                  </Typography>
                  <Typography variant="h6">{walletInfo.WalletId}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Cüzdan Bakiyesi
                  </Typography>
                  <Typography variant="h6">{formatCurrency(walletInfo.Amount, walletInfo.Currency)}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Cüzdana İade Aktif Mi?
                  </Typography>
                  <FormControlLabel
                    control={<Switch checked={walletInfo.RefundToWallet} disabled color="primary" />}
                    label={walletInfo.RefundToWallet ? 'Aktif' : 'Pasif'}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyWallet;
