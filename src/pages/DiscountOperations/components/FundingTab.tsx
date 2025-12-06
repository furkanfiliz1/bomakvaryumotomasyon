import { FigoLoading } from '@components';
import { useErrorListener } from '@hooks';
import { Alert, Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { AllowanceKind } from '@types';
import { currencyFormatter } from '@utils';
import React from 'react';
import { useGetAllowanceFundingQuery, useGetBillFundingQuery } from '../discount-operations.api';

interface FundingTabProps {
  allowanceId: number;
  kind?: AllowanceKind;
  isSpotWithoutInvoice?: boolean;
  isSpot?: boolean;
  isReceivable?: boolean;
}

const FundingTab: React.FC<FundingTabProps> = ({ allowanceId, kind, isSpotWithoutInvoice }) => {
  // Call both hooks but skip based on conditions
  const {
    data: invoiceFundingData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useGetAllowanceFundingQuery(allowanceId, {
    skip: kind === AllowanceKind.CHEQUE,
  });

  const {
    data: billFundingData,
    isLoading: billLoading,
    error: billError,
  } = useGetBillFundingQuery(allowanceId, {
    skip: kind !== AllowanceKind.CHEQUE,
  });

  // Use the appropriate data based on kind
  const fundingData = kind === AllowanceKind.CHEQUE ? billFundingData : invoiceFundingData;
  const isLoading = kind === AllowanceKind.CHEQUE ? billLoading : invoiceLoading;
  const error = kind === AllowanceKind.CHEQUE ? billError : invoiceError;

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
          <Typography color="text.secondary">Bu iskonto talebi fonlanmamıştır.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {fundingData.map((rate, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {rate.FinancerName}
            </Typography>

            {/* Invoice Funding Details */}
            {rate.Invoices?.map((invoice) => (
              <Box key={invoice.Id} sx={{ mb: 2 }}>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  {!isSpotWithoutInvoice && (
                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold" color="text.secondary">
                          Fatura No
                        </Typography>
                        <Typography variant="body2">{invoice.InvoiceNumber}</Typography>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        Banka Fonlama Oranı
                      </Typography>
                      <Typography variant="body2">%{invoice.FinancerRate}</Typography>
                      <Typography variant="body2">
                        {currencyFormatter(invoice.FinancerAmount, invoice.CurrencyName)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        Figo Fonlama Oranı
                      </Typography>
                      <Typography variant="body2">%{invoice.SystemRate}</Typography>
                      <Typography variant="body2">
                        {currencyFormatter(invoice.SystemAmount, invoice.CurrencyName)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            ))}

            {/* Bill Funding Details */}
            {rate.Bills?.map((bill) => (
              <Box key={bill.Id} sx={{ mb: 2 }}>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        {kind === AllowanceKind.CHEQUE ? 'Çek No' : 'Fatura No'}
                      </Typography>
                      <Typography variant="body2">{bill.Number}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        Banka Fonlama Oranı
                      </Typography>
                      <Typography variant="body2">%{bill.FinancerRate}</Typography>
                      <Typography variant="body2">
                        {currencyFormatter(bill.FinancerAmount, bill.CurrencyName)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        Figo Fonlama Oranı
                      </Typography>
                      <Typography variant="body2">%{bill.SystemRate}</Typography>
                      <Typography variant="body2">{currencyFormatter(bill.SystemAmount, bill.CurrencyName)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default FundingTab;
