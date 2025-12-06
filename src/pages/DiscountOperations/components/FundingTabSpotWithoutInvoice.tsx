import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider, Alert } from '@mui/material';
import { currencyFormatter } from '@utils';
import { FigoLoading } from '@components';
import { useErrorListener } from '@hooks';
import { useGetOrderFundingQuery } from '../discount-operations.api';

interface FundingTabSpotWithoutInvoiceProps {
  allowanceId: number;
}

const FundingTabSpotWithoutInvoice: React.FC<FundingTabSpotWithoutInvoiceProps> = ({ allowanceId }) => {
  const { data: fundingData, isLoading, error } = useGetOrderFundingQuery(allowanceId);

  // Error handling
  useErrorListener([error]);

  if (isLoading) {
    return (
      <Box position="relative" height="200px">
        <FigoLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Hata: Fonlama bilgileri yüklenirken bir sorun oluştu.
      </Alert>
    );
  }

  if (!fundingData || fundingData.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">Fonlanmamış spot kredi bulunuyor.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {fundingData.map((rate, index) => (
        <Card key={rate.FinancerIdentifier || index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {rate.CompanyName}
            </Typography>

            {rate.Orders && rate.Orders.length > 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                      Banka Fonlama Oranı
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      %{rate.Orders[0].FinancerRate}
                    </Typography>
                    <Typography variant="body2">
                      {currencyFormatter(rate.Orders[0].FinancerAmount, rate.Orders[0].CurrencyName)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                      Figo Fonlama Oranı
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      %{rate.Orders[0].SystemRate}
                    </Typography>
                    <Typography variant="body2">
                      {currencyFormatter(rate.Orders[0].SystemAmount, rate.Orders[0].CurrencyName)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}

            <Divider sx={{ my: 2 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default FundingTabSpotWithoutInvoice;
