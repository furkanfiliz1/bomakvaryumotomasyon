import { PageHeader, useNotice } from '@components';
import { Add as AddIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useRef } from 'react';
import useErrorListener from 'src/hooks/useErrorListener';
import { findMetricByType, parseMetricFormData, sortMetricsByName } from '../helpers';
import { useInvoiceScoreRatiosQueryParams } from '../hooks';
import type { InvoiceScoreRatioFormData } from '../hooks/useInvoiceScoreRatiosForm';
import {
  useCreateInvoiceScoreMetricMutation,
  useDeleteInvoiceScoreMetricMutation,
  useGetInvoiceScoreMetricsQuery,
  useUpdateInvoiceScoreMetricMutation,
} from '../invoice-score-ratios.api';
import type { InvoiceScoreMetricDefinition } from '../invoice-score-ratios.types';
import AddRatioModal, { AddRatioModalMethods } from './AddRatioModal';
import EditRatioModal, { EditRatioModalMethods } from './EditRatioModal';
import InvoiceScoreRatiosTable from './InvoiceScoreRatiosTable';

const InvoiceScoreRatiosPage: React.FC = () => {
  const { filters, updateFilters } = useInvoiceScoreRatiosQueryParams();
  const { data: metricsData, isLoading, error, refetch } = useGetInvoiceScoreMetricsQuery();
  const [createMetric, { isLoading: isCreating, error: createError }] = useCreateInvoiceScoreMetricMutation();
  const [updateMetric, { isLoading: isUpdating, error: updateError }] = useUpdateInvoiceScoreMetricMutation();
  const [deleteMetric, { error: deleteError }] = useDeleteInvoiceScoreMetricMutation();

  const addRatioModalRef = useRef<AddRatioModalMethods>(null);
  const editRatioModalRef = useRef<EditRatioModalMethods>(null);
  const editingDefinitionRef = useRef<InvoiceScoreMetricDefinition | null>(null);

  const notice = useNotice();
  useErrorListener([error, createError, updateError, deleteError]);

  const sortedMetrics = metricsData ? sortMetricsByName(metricsData) : [];
  const selectedMetric = filters.metricType ? findMetricByType(sortedMetrics, filters.metricType) : undefined;

  const handleMetricTypeChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    updateFilters({ metricType: value === 0 ? null : value });
  };

  const handleCreate = async (data: InvoiceScoreRatioFormData) => {
    if (!selectedMetric) return;

    try {
      const parsedData = parseMetricFormData(data);
      const response = await createMetric({
        Name: selectedMetric.Name,
        Type: selectedMetric.Type,
        ...parsedData,
      }).unwrap();

      if (response.Success) {
        await notice({ message: 'Rasyo tanımı başarıyla eklendi', variant: 'success' });
        refetch();
      }
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const handleEditClick = (definition: InvoiceScoreMetricDefinition) => {
    editingDefinitionRef.current = definition;
    editRatioModalRef.current?.open(definition);
  };

  const handleEditSubmit = async (data: InvoiceScoreRatioFormData) => {
    const editingDefinition = editingDefinitionRef.current;
    if (!selectedMetric || !editingDefinition) return;

    try {
      const parsedData = parseMetricFormData(data);
      const response = await updateMetric({
        Id: editingDefinition.Id,
        Name: selectedMetric.Name,
        Type: selectedMetric.Type,
        ...parsedData,
      }).unwrap();

      if (response.Success) {
        await notice({ message: 'Rasyo tanımı başarıyla güncellendi', variant: 'success' });
        editingDefinitionRef.current = null;
        refetch();
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteMetric(id).unwrap();

      if (response.Success) {
        await notice({ message: 'Rasyo tanımı başarıyla silindi', variant: 'success' });
        refetch();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <>
      <PageHeader title="Fatura Skor Rasyo Grupları" subtitle="Rasyo gruplarının tanımlamaları." />

      <Box sx={{ p: 3 }}>
        {/* Filter Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="metric-type-label">Metrik Tipi Seçin</InputLabel>
                <Select
                  labelId="metric-type-label"
                  id="metric-type-select"
                  value={filters.metricType || 0}
                  label="Metrik Tipi Seçin"
                  onChange={handleMetricTypeChange}
                  disabled={isLoading}>
                  <MenuItem value={0}>Metrik Tipi Seçin</MenuItem>
                  {sortedMetrics.map((metric) => (
                    <MenuItem key={metric.Type} value={metric.Type}>
                      {metric.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Content Section */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Rasyo Grup Detayı {selectedMetric ? `- ${selectedMetric.Name}` : ''}</Typography>
            {selectedMetric && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => addRatioModalRef.current?.open()}
                size="small">
                Ekle
              </Button>
            )}
          </Box>

          {isLoading && <Alert severity="info">Yükleniyor...</Alert>}
          {!isLoading && selectedMetric && (
            <InvoiceScoreRatiosTable
              definitions={selectedMetric.Definitions}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          )}
          {!isLoading && !selectedMetric && <Alert severity="info">Lütfen bir metrik tipi seçin</Alert>}
        </Paper>

        {/* Modals */}
        <AddRatioModal ref={addRatioModalRef} onSubmit={handleCreate} isSubmitting={isCreating} />
        <EditRatioModal ref={editRatioModalRef} onSubmit={handleEditSubmit} isSubmitting={isUpdating} />
      </Box>
    </>
  );
};

export default InvoiceScoreRatiosPage;
