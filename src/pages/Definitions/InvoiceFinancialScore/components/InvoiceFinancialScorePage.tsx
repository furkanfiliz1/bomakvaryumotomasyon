/**
 * Invoice Financial Score Page
 * Concentration metrics management with inline editing
 * 100% parity with legacy InvoiceFinancialScore.js
 */

import { Form, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Divider, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import { useInvoiceFinancialScoreCreateForm } from '../hooks';
import {
  useCreateInvoiceFinancialScoreMetricMutation,
  useDeleteInvoiceFinancialScoreMetricMutation,
  useGetInvoiceFinancialScoreMetricsQuery,
  useUpdateInvoiceFinancialScoreMetricMutation,
} from '../invoice-financial-score.api';
import type { ConcentrationMetric } from '../invoice-financial-score.types';

const InvoiceFinancialScorePage: React.FC = () => {
  const notice = useNotice();

  // Fetch metrics list
  const { data: metrics = [], isLoading, error: fetchError, refetch } = useGetInvoiceFinancialScoreMetricsQuery();

  // Mutations
  const [createMetric, { isLoading: isCreating, error: createError }] = useCreateInvoiceFinancialScoreMetricMutation();
  const [updateMetric, { error: updateError }] = useUpdateInvoiceFinancialScoreMetricMutation();
  const [deleteMetric, { error: deleteError }] = useDeleteInvoiceFinancialScoreMetricMutation();

  // Error handling
  useErrorListener([fetchError, createError, updateError, deleteError]);

  // Create form
  const { form, schema } = useInvoiceFinancialScoreCreateForm();

  // Local state for inline editing
  const [editingMetrics, setEditingMetrics] = useState<Record<number, ConcentrationMetric>>({});

  // Handle create metric
  const handleCreate = async (data: {
    minFinancialScore: number | null;
    maxFinancialScore: number | null;
    minInvoiceScore: number | null;
  }) => {
    if (data.minFinancialScore === null || data.maxFinancialScore === null || data.minInvoiceScore === null) {
      notice({
        variant: 'error',
        message: 'Tüm alanları doldurunuz',
      });
      return;
    }

    try {
      await createMetric({
        MinFinancialScore: data.minFinancialScore,
        MaxFinancialScore: data.maxFinancialScore,
        MinInvoiceScore: data.minInvoiceScore,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Kayıt başarıyla oluşturuldu',
      });
      form.reset();
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Create metric error:', err);
    }
  };

  // Handle inline field change
  const handleFieldChange = (id: number, field: keyof ConcentrationMetric, value: string) => {
    const numValue = Number.parseInt(value, 10);
    setEditingMetrics((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || metrics.find((m) => m.id === id)!),
        [field]: Number.isNaN(numValue) ? 0 : numValue,
      },
    }));
  };

  // Handle update metric
  const handleUpdate = async (id: number) => {
    const metricToUpdate = editingMetrics[id];
    if (!metricToUpdate) {
      notice({
        variant: 'error',
        message: 'Değişiklik yapılmadı',
      });
      return;
    }

    try {
      await updateMetric(metricToUpdate).unwrap();
      notice({
        variant: 'success',
        message: 'Kayıt başarıyla güncellendi',
      });
      setEditingMetrics((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Update metric error:', err);
    }
  };

  // Handle delete metric
  const handleDelete = async (id: number) => {
    try {
      await notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Silme Onayı',
        message: 'Bu kaydı silmek istediğinize emin misiniz?',
        buttonTitle: 'Sil',
        catchOnCancel: true,
      });

      await deleteMetric(id).unwrap();
      notice({
        variant: 'success',
        message: 'Kayıt başarıyla silindi',
      });
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Delete metric error:', err);
    }
  };

  // Get current metric value (edited or original)
  const getMetricValue = (metric: ConcentrationMetric, field: keyof ConcentrationMetric): string | number => {
    const value = editingMetrics[metric.id]?.[field] ?? metric[field];
    return field === 'insertDatetime' ? (value as string) : (value as number);
  };

  return (
    <>
      <PageHeader title="Fatura Skor - Mali Skor" subtitle="Tüm fatura ve mali skorlara göre tanımlamalar." />

      <Box sx={{ p: 3 }}>
        {/* Create Section */}
        <Typography variant="h6" sx={{ py: 2 }}>
          Skor Oluştur
        </Typography>
        <Card sx={{ p: 3, mb: 3 }}>
          <Box>
            <Form form={form} schema={schema} childCol={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={isCreating}
                  onClick={form.handleSubmit(handleCreate)}>
                  Oluştur
                </LoadingButton>
              </Box>
            </Form>
          </Box>
        </Card>

        <Divider sx={{ my: 3 }} />

        {/* List Section */}
        <Typography variant="h6" sx={{ py: 2 }}>
          Skor Listesi
        </Typography>
        <Card>
          {isLoading && (
            <Box sx={{ p: 3 }}>
              <Typography>Yükleniyor...</Typography>
            </Box>
          )}

          {!isLoading && metrics.length === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography>Tanımlı skor bulunamadı</Typography>
            </Box>
          )}

          {!isLoading &&
            metrics.length > 0 &&
            metrics.map((metric) => (
              <Box key={metric.id} sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Grid container spacing={2} alignItems="end">
                  <Grid item xs={12} lg={3}>
                    <CustomInputLabel label="Min Finansal Skor" />
                    <TextField
                      fullWidth
                      type="number"
                      value={getMetricValue(metric, 'minFinancialScore')}
                      onChange={(e) => handleFieldChange(metric.id, 'minFinancialScore', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <CustomInputLabel label="Max Finansal Skor" />
                    <TextField
                      fullWidth
                      type="number"
                      value={getMetricValue(metric, 'maxFinancialScore')}
                      onChange={(e) => handleFieldChange(metric.id, 'maxFinancialScore', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <CustomInputLabel label="Minimum Fatura Skoru" />
                    <TextField
                      fullWidth
                      type="number"
                      value={getMetricValue(metric, 'minInvoiceScore')}
                      onChange={(e) => handleFieldChange(metric.id, 'minInvoiceScore', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} lg={1}>
                    <Button variant="contained" color="primary" onClick={() => handleUpdate(metric.id)} fullWidth>
                      Güncelle
                    </Button>
                  </Grid>
                  <Grid item xs={12} lg={1}>
                    <Button variant="contained" color="error" onClick={() => handleDelete(metric.id)} fullWidth>
                      Sil
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
        </Card>
      </Box>
    </>
  );
};

export default InvoiceFinancialScorePage;
