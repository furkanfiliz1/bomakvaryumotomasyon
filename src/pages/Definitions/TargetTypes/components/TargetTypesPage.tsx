import { Form, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add, Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
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
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTargetTypesForm } from '../hooks/useTargetTypesForm';
import { useCreateTargetTypeMutation, useDeleteTargetTypeMutation, useGetTargetTypesQuery } from '../target-types.api';
import type { TargetType } from '../target-types.types';

/**
 * Target Types List Page Component
 * Manages target types with create and delete operations
 * Matches legacy UI/UX exactly with 100% parity
 * Following UserPositions pattern with modal for create
 */
const TargetTypesPage: React.FC = () => {
  const notice = useNotice();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Query hooks
  const { data: targetTypes, error: fetchError, isLoading, refetch } = useGetTargetTypesQuery();

  const [createTargetType, { error: createError, isLoading: isCreating, isSuccess: isCreateSuccess }] =
    useCreateTargetTypeMutation();

  const [deleteTargetType, { error: deleteError, isLoading: isDeleting, isSuccess: isDeleteSuccess }] =
    useDeleteTargetTypeMutation();

  // Form hook for create operation
  const { form: createForm, schema: createSchema } = useTargetTypesForm();

  // Error handling - following UserPositions pattern
  useErrorListener([fetchError, createError, deleteError]);

  // Success notifications - following UserPositions pattern
  useEffect(() => {
    if (isCreateSuccess) {
      notice({
        variant: 'success',
        message: 'Hedef tipi başarıyla oluşturuldu.',
      });
      createForm.reset(); // Clear form after successful creation
      setIsModalOpen(false); // Close modal
      refetch(); // Refetch list
    }
  }, [isCreateSuccess, notice, refetch, createForm]);

  useEffect(() => {
    if (isDeleteSuccess) {
      notice({
        variant: 'success',
        message: 'Hedef tipi başarıyla silindi.',
      });
      refetch(); // Refetch list
    }
  }, [isDeleteSuccess, notice, refetch]);

  // Handle create with form validation
  const handleCreate = createForm.handleSubmit(async (data) => {
    try {
      await createTargetType({
        Name: data.Name.trim(),
        Ratio: Number.parseInt(String(data.Ratio), 10), // Ensure integer
        Description: data.Description.trim(),
      }).unwrap();
    } catch (error) {
      // Error handled by useErrorListener
      console.error('Failed to create target type:', error);
    }
  });

  // Handle delete with confirmation
  const handleDelete = async (targetType: TargetType) => {
    try {
      // Show confirmation dialog - matching legacy behavior
      await notice({
        type: 'confirm',
        variant: 'error',
        title: 'Hedef Tipi Sil',
        message: `"${targetType.Name}" hedef türünü silmek istediğinizden emin misiniz?`,
        buttonTitle: 'Sil',
        catchOnCancel: true,
      });

      // If confirmed, proceed with deletion
      await deleteTargetType(targetType.Id).unwrap();
    } catch (error) {
      // User cancelled or error occurred
      if (error !== undefined) {
        console.error('Failed to delete target type:', error);
      }
    }
  };

  const handleOpenModal = () => {
    createForm.reset(); // Reset form when opening modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <PageHeader title="Hedef Tipleri" subtitle="Müşteri Temsilcisi Hedef Tipleri" />

      <Box mx={2}>
        {/* Header with Create Button */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Hedef Tipi
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary">
                  Ağırlık
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Açıklama
                </Typography>
              </Grid>
              <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleOpenModal} startIcon={<Add />}>
                  Yeni Hedef Tipi Oluştur
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Loading state */}
        {isLoading && (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent>
                  <Skeleton variant="rectangular" height={60} />
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Error state */}
        {fetchError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Hedef türleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
          </Alert>
        )}

        {/* Empty state */}
        {!isLoading && !fetchError && (!targetTypes || targetTypes.length === 0) && (
          <Card>
            <CardContent>
              <Alert severity="info">Kayıt Bulunamadı</Alert>
            </CardContent>
          </Card>
        )}

        {/* Target types list */}
        {!isLoading && !fetchError && targetTypes && targetTypes.length > 0 && (
          <Stack spacing={2}>
            {targetTypes.map((targetType) => (
              <Card key={targetType.Id}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Typography variant="body1">{targetType.Name}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="body1">{targetType.Ratio}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body1">{targetType.Description}</Typography>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(targetType)}
                        disabled={isDeleting}
                        sx={{ border: 1, borderColor: 'error.main' }}>
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* Create Modal Dialog */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Hedef Tipi Oluştur</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Yeni hedef tipi bilgilerini giriniz
            </Typography>
            <Form form={createForm} schema={createSchema} space={2} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} color="secondary" disabled={isCreating}>
            Vazgeç
          </Button>
          <LoadingButton onClick={handleCreate} variant="contained" color="primary" loading={isCreating}>
            Kaydet
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TargetTypesPage;
