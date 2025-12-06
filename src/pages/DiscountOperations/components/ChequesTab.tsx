import { FigoLoading } from '@components';
import { HUMAN_READABLE_DATE } from '@constant';
import { useErrorListener } from '@hooks';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { currencyFormatter } from '@utils';
import dayjs from 'dayjs';
import React from 'react';
import { useGetAllowanceChequesQuery } from '../discount-operations.api';

interface ChequesTabProps {
  allowanceId: number;
}

const ChequesTab: React.FC<ChequesTabProps> = ({ allowanceId }) => {
  const {
    data: chequesData,
    isLoading,
    error,
  } = useGetAllowanceChequesQuery({
    AllowanceId: allowanceId,
  });

  useErrorListener([error]);

  if (isLoading) {
    return (
      <Box position="relative" height="200px">
        <FigoLoading />
      </Box>
    );
  }

  if (!chequesData || chequesData.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        Çek bulunamadı.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {chequesData.map((cheque) => (
        <Card key={cheque.Id} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {/* First Row */}
              <Grid item xs={6} lg={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Çek No
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {cheque.BillNo || '-'}
                </Typography>
              </Grid>
              <Grid item xs={6} lg={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Keşideci Ünvanı
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {cheque.DrawerName || '-'}
                </Typography>
              </Grid>

              <Grid item xs={6} lg={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Keşideci VKN/TCKN
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {cheque.DrawerIdentifier || '-'}
                </Typography>
              </Grid>

              <Grid item xs={6} lg={1.5}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Çek Hesap No
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {cheque.ChequeAccountNo || '-'}
                </Typography>
              </Grid>

              <Grid item xs={6} lg={1.5}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Çek Tutarı
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {currencyFormatter(cheque.PayableAmount, cheque.PayableAmountCurrency)}
                </Typography>
              </Grid>
              <Grid item xs={6} lg={1.5}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Vade Tarihi
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {cheque.PaymentDueDate ? dayjs(cheque.PaymentDueDate).format(HUMAN_READABLE_DATE) : '-'}
                </Typography>
              </Grid>
              <Grid item xs={6} lg={1.5}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Banka Kodu
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {cheque.BankEftCode || '-'}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                {/* Second Row */}
                <Grid item xs={6} lg={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ciranta Ünvanı
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {cheque.ReferenceEndorserName || '-'}
                  </Typography>
                </Grid>

                <Grid item xs={6} lg={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ciranta VKN/TCKN
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {cheque.ReferenceEndorserIdentifier || '-'}
                  </Typography>
                </Grid>

                <Grid item xs={6} lg={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fatura Borçlusu Ünvanı
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {cheque.EndorserName || '-'}
                  </Typography>
                </Grid>

                <Grid item xs={6} lg={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fatura Borçlusu VKN/TCKN
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {cheque.EndorserIdentifier || '-'}
                  </Typography>
                </Grid>

                <Grid item xs={6} lg={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Statü
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {cheque.StatusDescription || '-'}
                  </Typography>
                </Grid>
                {cheque.ReferenceEndorsers && cheque.ReferenceEndorsers.length > 0 && (
                  <>
                    {cheque.ReferenceEndorsers.map((endorser, index) => (
                      <Grid item xs={6} lg={2} key={endorser.Id}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Ara Ciranta #{index + 1} VKN/TCKN
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {endorser.EndorserIdentifier}
                        </Typography>
                      </Grid>
                    ))}
                  </>
                )}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default ChequesTab;
