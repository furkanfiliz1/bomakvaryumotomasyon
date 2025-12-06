/**
 * İş Bankası Oranları List Component
 * Matches legacy Rates.js renderList() section with inline editing
 */

import { LoadingButton, useNotice } from '@components';
import { MONTHS } from '@constant';
import { useErrorListener } from '@hooks';
import { Delete, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useCallback, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { DEFAULT_CURRENCY_ID } from '../helpers';
import { useDeleteIsBankRateMutation, useUpdateIsBankRateMutation } from '../is-bank-rates.api';
import type { IsBankRateItem } from '../is-bank-rates.types';

interface IsBankRatesListProps {
  items: IsBankRateItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const IsBankRatesList: React.FC<IsBankRatesListProps> = ({ items, isLoading, onRefresh }) => {
  const notice = useNotice();
  const [editableRates, setEditableRates] = useState<Map<number, string>>(new Map());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<number | null>(null);

  const [updateIsBankRate, { isLoading: isUpdating, error: updateError }] = useUpdateIsBankRateMutation();
  const [deleteIsBankRate, { isLoading: isDeleting, error: deleteError }] = useDeleteIsBankRateMutation();

  // Handle errors with useErrorListener
  useErrorListener(updateError);
  useErrorListener(deleteError);

  const handleBuyingRateChange = useCallback((id: number, value: string) => {
    setEditableRates((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, value);
      return newMap;
    });
  }, []);

  const handleUpdate = async (rate: IsBankRateItem) => {
    const editedRate = editableRates.get(rate.Id) ?? String(rate.BuyingRate);
    const buyingRateValue = Number.parseFloat(editedRate.replace(',', '.'));

    if (Number.isNaN(buyingRateValue)) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Geçerli bir alış kuru giriniz',
      });
      return;
    }

    try {
      await updateIsBankRate({
        Id: rate.Id,
        Year: rate.Year,
        Month: rate.Month,
        BuyingRate: buyingRateValue,
        CurrencyId: DEFAULT_CURRENCY_ID,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Kur başarıyla güncellendi',
      });

      onRefresh();
    } catch {
      // Error handled by useErrorListener
    }
  };

  const handleDeleteClick = (id: number) => {
    setRateToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (rateToDelete === null) return;

    try {
      await deleteIsBankRate({ id: rateToDelete }).unwrap();

      notice({
        variant: 'success',
        message: 'Kur başarıyla silindi',
      });

      setDeleteConfirmOpen(false);
      setRateToDelete(null);
      onRefresh();
    } catch {
      // Error handled by useErrorListener
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setRateToDelete(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Yükleniyor...
        </Typography>
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Liste bulunmamaktadır.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 5 }}>
      {items.map((rate) => {
        const editedValue = editableRates.get(rate.Id);
        const currentValue = editedValue ?? String(rate.BuyingRate);

        return (
          <Card key={rate.Id} sx={{ mb: 1, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Year - Disabled */}
              <Grid item xs={12} md={2}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                  Yıl
                </Typography>
                <TextField fullWidth size="small" value={rate.Year} disabled inputProps={{ readOnly: true }} />
              </Grid>

              {/* Month - Disabled */}
              <Grid item xs={12} md={2}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                  Ay
                </Typography>
                <Autocomplete
                  size="small"
                  options={MONTHS}
                  getOptionLabel={(option) => option.name}
                  value={MONTHS.find((m) => m.id === rate.Month) || null}
                  disabled
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>

              {/* BuyingRate - Editable */}
              <Grid item xs={12} md={2}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                  Alış Kuru
                </Typography>
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  size="small"
                  value={currentValue}
                  onValueChange={(values) => handleBuyingRateChange(rate.Id, values.value)}
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={4}
                />
              </Grid>

              {/* Update Button */}
              <Grid item xs={6} md={1}>
                <Box sx={{ mt: 2.5 }}>
                  <LoadingButton
                    id={`update-rate-${rate.Id}`}
                    variant="contained"
                    color="info"
                    size="small"
                    loading={isUpdating}
                    onClick={() => handleUpdate(rate)}
                    startIcon={<Save />}>
                    Güncelle
                  </LoadingButton>
                </Box>
              </Grid>

              {/* Delete Button */}
              <Grid item xs={6} md={1}>
                <Box sx={{ mt: 2.5 }}>
                  <LoadingButton
                    id={`delete-rate-${rate.Id}`}
                    variant="contained"
                    color="error"
                    size="small"
                    loading={isDeleting && rateToDelete === rate.Id}
                    onClick={() => handleDeleteClick(rate.Id)}
                    startIcon={<Delete />}>
                    Sil
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Card>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText>Bu kuru silmek istediğinize emin misiniz?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Vazgeç
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IsBankRatesList;
