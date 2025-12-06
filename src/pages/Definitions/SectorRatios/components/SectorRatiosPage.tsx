/**
 * Sector Ratios Page Component
 * Main page for managing sector ratio tallies
 * Matches legacy IndustryRatio.js exactly with OperationPricing patterns
 */

import { PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
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
import React, { useCallback, useMemo, useRef } from 'react';
import { filterRatioTalliesBySector, parseRatioTallyFormData } from '../helpers';
import { useSectorRatiosDropdownData, useSectorRatiosQueryParams } from '../hooks';
import {
  useCreateRatioTallyMutation,
  useDeleteRatioTallyMutation,
  useGetRatioTalliesQuery,
  useUpdateRatioTallyMutation,
} from '../sector-ratios.api';
import type { RatioTally, RatioTallyFormData } from '../sector-ratios.types';
import AddRatioTallyModal, { AddRatioTallyModalMethods } from './AddRatioTallyModal';
import EditRatioTallyModal, { EditRatioTallyModalMethods } from './EditRatioTallyModal';
import SectorRatiosTable from './SectorRatiosTable';

const SectorRatiosPage: React.FC = () => {
  // URL params for sector filter
  const { filters, updateFilters } = useSectorRatiosQueryParams();

  // Dropdown data
  const {
    companySectorList,
    ratioList,
    isLoading: isLoadingDropdowns,
    error: dropdownError,
  } = useSectorRatiosDropdownData();

  // API queries and mutations
  const { data: ratioTallies, isLoading: isLoadingTallies, error: talliesError, refetch } = useGetRatioTalliesQuery();
  const [createRatioTally, { isLoading: isCreating, error: createError }] = useCreateRatioTallyMutation();
  const [updateRatioTally, { isLoading: isUpdating, error: updateError }] = useUpdateRatioTallyMutation();
  const [deleteRatioTally, { isLoading: isDeleting, error: deleteError }] = useDeleteRatioTallyMutation();

  // Modal refs
  const addModalRef = useRef<AddRatioTallyModalMethods>(null);
  const editModalRef = useRef<EditRatioTallyModalMethods>(null);

  // Notice and error handling
  const notice = useNotice();
  useErrorListener([dropdownError, talliesError, createError, updateError, deleteError]);

  // Get selected sector name for display
  const selectedSector = useMemo(() => {
    return companySectorList.find((s) => s.id === filters.companySectorId);
  }, [companySectorList, filters.companySectorId]);

  // Filter ratio tallies by selected sector
  const filteredTallies = useMemo(() => {
    if (!ratioTallies) return [];
    return filterRatioTalliesBySector(ratioTallies, filters.companySectorId);
  }, [ratioTallies, filters.companySectorId]);

  // Handler for sector dropdown change
  const handleSectorChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      const value = Number(event.target.value);
      updateFilters({ companySectorId: value === 0 ? null : value });
    },
    [updateFilters],
  );

  // Handler for create
  const handleCreate = useCallback(
    async (data: RatioTallyFormData) => {
      if (!filters.companySectorId) return;

      try {
        const parsedData = parseRatioTallyFormData(data);
        const response = await createRatioTally({
          companySectorId: filters.companySectorId,
          ...parsedData,
        }).unwrap();

        if (response.isSuccess) {
          notice({ message: 'Sektör rasyosu başarıyla eklendi', variant: 'success' });
          refetch();
        }
      } catch (err) {
        console.error('Create error:', err);
      }
    },
    [filters.companySectorId, createRatioTally, notice, refetch],
  );

  // Handler for edit
  const handleEdit = useCallback((ratioTally: RatioTally) => {
    editModalRef.current?.open(ratioTally);
  }, []);

  // Handler for edit submit
  const handleEditSubmit = useCallback(
    async (data: RatioTallyFormData, ratioTally: RatioTally) => {
      try {
        const parsedData = parseRatioTallyFormData(data);
        const response = await updateRatioTally({
          id: ratioTally.id,
          companySectorId: ratioTally.companySectorId,
          ...parsedData,
        }).unwrap();

        if (response.isSuccess) {
          notice({ message: 'Sektör rasyosu başarıyla güncellendi', variant: 'success' });
          refetch();
        }
      } catch (err) {
        console.error('Update error:', err);
      }
    },
    [updateRatioTally, notice, refetch],
  );

  // Handler for delete
  const handleDelete = useCallback(
    async (id: number) => {
      try {
        const response = await deleteRatioTally(id).unwrap();

        if (response.isSuccess) {
          notice({ message: 'Sektör rasyosu başarıyla silindi', variant: 'success' });
          refetch();
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    },
    [deleteRatioTally, notice, refetch],
  );

  const isLoading = isLoadingDropdowns || isLoadingTallies;
  const isSectorSelected = filters.companySectorId && filters.companySectorId !== 0;

  return (
    <>
      <PageHeader title="Sektör Rasyoları" subtitle="Sektör rasyo tanımlamaları" />

      <Box sx={{ p: 3 }}>
        {/* Filter Section - Sector Dropdown */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="sector-select-label">Sektör Seçiniz</InputLabel>
                <Select
                  labelId="sector-select-label"
                  id="sector-select"
                  value={filters.companySectorId || 0}
                  label="Sektör Seçiniz"
                  onChange={handleSectorChange}
                  disabled={isLoadingDropdowns}>
                  <MenuItem value={0}>Sektör Seçiniz</MenuItem>
                  {companySectorList.map((sector) => (
                    <MenuItem key={sector.id} value={sector.id}>
                      {sector.sectorName}
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
            <Typography variant="h6">
              Sektör Düzenle {selectedSector ? `- ${selectedSector.sectorName}` : ''}
            </Typography>
            {isSectorSelected && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => addModalRef.current?.open()}
                size="small"
                disabled={isCreating}>
                Ekle
              </Button>
            )}
          </Box>

          {isLoading && <Alert severity="info">Yükleniyor...</Alert>}

          {!isLoading && isSectorSelected && (
            <SectorRatiosTable
              data={filteredTallies}
              isLoading={isLoadingTallies}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          )}

          {!isLoading && !isSectorSelected && <Alert severity="info">Lütfen bir sektör seçin</Alert>}
        </Paper>

        {/* Modals */}
        <AddRatioTallyModal ref={addModalRef} ratioList={ratioList} onSubmit={handleCreate} isSubmitting={isCreating} />
        <EditRatioTallyModal
          ref={editModalRef}
          ratioList={ratioList}
          onSubmit={handleEditSubmit}
          isSubmitting={isUpdating}
        />
      </Box>
    </>
  );
};

export default SectorRatiosPage;
