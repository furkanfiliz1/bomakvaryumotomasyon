import { FigoLoading } from '@components';
import { useErrorListener } from '@hooks';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { AllowanceKind } from '@types';
import { currencyFormatter } from '@utils';
import React, { useState } from 'react';
import { useGetAllowanceFundingQuery } from '../discount-operations.api';

interface RevolvingCreditTabProps {
  allowanceId: number;
  kind: AllowanceKind;
}

const RevolvingCreditTab: React.FC<RevolvingCreditTabProps> = ({ allowanceId, kind }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<number | null>(null);
  const [creditAmount, setCreditAmount] = useState('');

  const {
    data: revolvingCreditData,
    isLoading,
    error,
  } = useGetAllowanceFundingQuery(allowanceId, { skip: kind !== AllowanceKind.ROTATIVE_LOAN });

  // Error handling
  useErrorListener([error]);

  const handleUseCredit = (creditId: number) => {
    setSelectedCredit(creditId);
    setOpenDialog(true);
  };

  const handleConfirmUse = () => {
    console.log('Rotatif kredi kullanımı:', {
      creditId: selectedCredit,
      amount: creditAmount,
    });
    // TODO: Rotatif kredi kullanım implementasyonu
    setOpenDialog(false);
    setCreditAmount('');
    setSelectedCredit(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCreditAmount('');
    setSelectedCredit(null);
  };

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
        Hata: Rotatif kredi bilgileri yüklenirken bir sorun oluştu.
      </Alert>
    );
  }

  if (!revolvingCreditData || revolvingCreditData.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">Rotatif kredi bilgisi bulunamadı.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {revolvingCreditData.map((credit, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {credit.FinancerName}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Credit Information */}
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Kredi Limiti
                  </Typography>
                  <Typography variant="body2">
                    {credit.Invoices?.[0]
                      ? currencyFormatter(credit.Invoices[0].FinancerAmount, credit.Invoices[0].CurrencyName)
                      : 'Bilgi Yok'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Kullanılan Tutar
                  </Typography>
                  <Typography variant="body2">
                    {credit.Invoices?.[0]
                      ? currencyFormatter(credit.Invoices[0].SystemAmount, credit.Invoices[0].CurrencyName)
                      : 'Bilgi Yok'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Kullanılabilir Tutar
                  </Typography>
                  <Typography variant="body2">
                    {credit.Invoices?.[0]
                      ? currencyFormatter(
                          credit.Invoices[0].FinancerAmount - credit.Invoices[0].SystemAmount,
                          credit.Invoices[0].CurrencyName,
                        )
                      : 'Bilgi Yok'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box display="flex" alignItems="center" height="100%">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleUseCredit(credit.Id)}
                    disabled={
                      !credit.Invoices?.[0] || credit.Invoices[0].FinancerAmount - credit.Invoices[0].SystemAmount <= 0
                    }>
                    Kredi Kullan
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Rate Information */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Banka Faiz Oranı
                  </Typography>
                  <Typography variant="body2">%{credit.Invoices?.[0]?.FinancerRate || 0}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Figo Faiz Oranı
                  </Typography>
                  <Typography variant="body2">%{credit.Invoices?.[0]?.SystemRate || 0}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {/* Use Credit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Rotatif Kredi Kullan</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Kullanmak istediğiniz kredi tutarını girin:
          </Typography>
          <TextField
            fullWidth
            label="Kredi Tutarı"
            type="number"
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
            sx={{ mt: 1 }}
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            İptal
          </Button>
          <Button
            onClick={handleConfirmUse}
            variant="contained"
            disabled={!creditAmount || parseFloat(creditAmount) <= 0}>
            Kullan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RevolvingCreditTab;
