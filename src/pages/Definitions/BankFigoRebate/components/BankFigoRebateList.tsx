/**
 * Bank Figo Rebate List Component
 * Matches legacy renderList() section exactly
 * Inline editable list with update and delete functionality
 */

import { FigoLoading, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Delete, Save } from '@mui/icons-material';
import { Box, Card, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider, trTR } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/tr';
import React, { useEffect, useState } from 'react';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import { useDeleteBankFigoRebateMutation, useUpdateBankFigoRebateMutation } from '../bank-figo-rebate.api';
import type { BankFigoRebateItem } from '../bank-figo-rebate.types';
import { formatDateForApi } from '../helpers';

interface EditableRebateItem extends BankFigoRebateItem {
  _localStartDate: Dayjs | null;
  _localFinishDate: Dayjs | null;
  _localRate: string;
}

interface BankFigoRebateListProps {
  rebates: BankFigoRebateItem[];
  isLoading: boolean;
  onRefetch: () => void;
}

export const BankFigoRebateList: React.FC<BankFigoRebateListProps> = ({ rebates, isLoading, onRefetch }) => {
  const notice = useNotice();

  // Track local edits for each rebate item
  const [editableItems, setEditableItems] = useState<EditableRebateItem[]>([]);

  // Initialize editable items when rebates change
  useEffect(() => {
    setEditableItems(
      rebates.map((item) => ({
        ...item,
        _localStartDate: item.StartDate ? dayjs(item.StartDate) : null,
        _localFinishDate: item.FinishDate ? dayjs(item.FinishDate) : null,
        _localRate: String(item.Rate),
      })),
    );
  }, [rebates]);

  const [
    updateRebate,
    { isLoading: isUpdating, error: updateError, isSuccess: isUpdateSuccess, reset: resetUpdateState },
  ] = useUpdateBankFigoRebateMutation();

  const [
    deleteRebate,
    { isLoading: isDeleting, error: deleteError, isSuccess: isDeleteSuccess, reset: resetDeleteState },
  ] = useDeleteBankFigoRebateMutation();

  // Handle errors with useErrorListener
  useErrorListener([updateError, deleteError]);

  // Handle update success
  useEffect(() => {
    if (isUpdateSuccess) {
      notice({
        variant: 'success',
        message: 'Kayıt Başarı ile Güncellendi',
      });
      resetUpdateState();
      onRefetch();
    }
  }, [isUpdateSuccess, notice, onRefetch, resetUpdateState]);

  // Handle delete success
  useEffect(() => {
    if (isDeleteSuccess) {
      notice({
        variant: 'success',
        message: 'Kayıt Başarı ile Silindi',
      });
      resetDeleteState();
      onRefetch();
    }
  }, [isDeleteSuccess, notice, onRefetch, resetDeleteState]);

  const handleStartDateChange = (index: number, date: Dayjs | null) => {
    setEditableItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], _localStartDate: date };
      return updated;
    });
  };

  const handleFinishDateChange = (index: number, date: Dayjs | null) => {
    setEditableItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], _localFinishDate: date };
      return updated;
    });
  };

  const handleRateChange = (index: number, value: string) => {
    setEditableItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], _localRate: value };
      return updated;
    });
  };

  const handleUpdate = async (index: number) => {
    const item = editableItems[index];

    // Validate required fields (matching legacy validation)
    if (!item._localStartDate || !item._localRate) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Finansör, Tarih Aralığı veya Oran girmek zorunludur',
      });
      return;
    }

    try {
      await updateRebate({
        Id: item.Id,
        FinancerCompanyId: item.FinancerCompanyId,
        StartDate: formatDateForApi(item._localStartDate.format('YYYY-MM-DD')) as string,
        FinishDate: item._localFinishDate ? formatDateForApi(item._localFinishDate.format('YYYY-MM-DD')) : null,
        Rate: parseFloat(item._localRate),
        FinancerCompanyName: item.FinancerCompanyName,
      }).unwrap();
    } catch {
      // Error handled by useErrorListener
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRebate(id).unwrap();
    } catch {
      // Error handled by useErrorListener
    }
  };

  if (isLoading) {
    return (
      <Card sx={{ p: 2 }}>
        <FigoLoading />
      </Card>
    );
  }

  if (!editableItems || editableItems.length === 0) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography>Liste bulunmamaktadır.</Typography>
      </Card>
    );
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="tr"
      localeText={trTR.components.MuiLocalizationProvider.defaultProps.localeText}>
      <Box>
        {editableItems.map((item, index) => (
          <Card key={item.Id} sx={{ p: 2, mb: 1 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Finans Şirketi (Read-only) */}
              <Grid item xs={12} md={3}>
                <CustomInputLabel label="Finans Şirketi" />
                <TextField
                  value={item.FinancerCompanyName}
                  disabled
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Tarih Aralığı */}
              <Grid item xs={6} md={2}>
                <CustomInputLabel label="Başlangıç Tarihi" />
                <DatePicker
                  value={item._localStartDate}
                  onChange={(date) => handleStartDateChange(index, date)}
                  format="DD.MM.YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6} md={2}>
                <CustomInputLabel label="Bitiş Tarihi" />
                <DatePicker
                  value={item._localFinishDate}
                  onChange={(date) => handleFinishDateChange(index, date)}
                  format="DD.MM.YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              {/* Oran */}
              <Grid item xs={6} md={2}>
                <CustomInputLabel label="Oran" />
                <TextField
                  type="number"
                  value={item._localRate}
                  onChange={(e) => handleRateChange(index, e.target.value)}
                  fullWidth
                  size="small"
                  inputProps={{ step: '0.01' }}
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={6} md={3}>
                <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'end', mt: 3 }}>
                  <LoadingButton
                    id={`update-rebate-btn-${item.Id}`}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleUpdate(index)}
                    loading={isUpdating}
                    startIcon={<Save />}>
                    Güncelle
                  </LoadingButton>
                  <Tooltip title="Sil">
                    <IconButton color="error" size="small" onClick={() => handleDelete(item.Id)} disabled={isDeleting}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Box>
    </LocalizationProvider>
  );
};

export default BankFigoRebateList;
