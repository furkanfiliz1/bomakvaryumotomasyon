import { Form, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add, Delete, Edit } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Card, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useUserPositionsForm } from '../hooks';
import {
  useCreateUserPositionMutation,
  useDeleteUserPositionMutation,
  useGetUserPositionsQuery,
  useUpdateUserPositionMutation,
} from '../user-positions.api';
import type { UserPosition } from '../user-positions.types';

/**
 * Position Row Component
 * Each row has its own form instance for independent validation
 */
interface PositionRowProps {
  position: UserPosition;
  index: number;
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (position: UserPosition, name: string) => Promise<void>;
  onDelete: (position: UserPosition) => Promise<void>;
}

const PositionRow: React.FC<PositionRowProps> = ({ position, index, isUpdating, isDeleting, onUpdate, onDelete }) => {
  const { form, schema } = useUserPositionsForm({ Name: position.Name });

  const handleUpdate = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues();
    if (data.Name.trim() === position.Name) return;

    await onUpdate(position, data.Name.trim());
  };

  return (
    <Box
      sx={{
        py: 2,
        px: 2,
        backgroundColor: index % 2 === 0 ? 'action.hover' : 'transparent',
        borderRadius: 1,
      }}>
      <Form form={form} schema={schema} space={2} childCol={2}>
        <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="end" height="100%">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleUpdate}
            disabled={isUpdating || isDeleting}
            startIcon={<Edit />}>
            Güncelle
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(position)}
            disabled={isUpdating || isDeleting}
            sx={{ border: 1 }}
            startIcon={<Delete />}>
            Sil
          </Button>
        </Stack>
      </Form>
    </Box>
  );
};

/**
 * User Positions List Page Component
 * Manages user positions with create, update, and delete operations
 * Matches legacy UI/UX exactly with 100% parity
 * Following OperationPricing pattern for structure and error handling
 */
const UserPositionsPage: React.FC = () => {
  const notice = useNotice();

  // RTK Query hooks
  const { data: positions, error: fetchError, isLoading, refetch } = useGetUserPositionsQuery();

  // Form hook for create operation
  const { form: createForm, schema: createSchema } = useUserPositionsForm();

  const [createPosition, { error: createError, isLoading: isCreating, isSuccess: isCreateSuccess }] =
    useCreateUserPositionMutation();

  const [updatePosition, { error: updateError, isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateUserPositionMutation();

  const [deletePosition, { error: deleteError, isLoading: isDeleting, isSuccess: isDeleteSuccess }] =
    useDeleteUserPositionMutation();

  // Error handling - following OperationPricing pattern
  useErrorListener([fetchError, createError, updateError, deleteError]);

  // Success notifications - following OperationPricing pattern
  useEffect(() => {
    if (isCreateSuccess) {
      notice({
        variant: 'success',
        message: 'Pozisyon başarıyla oluşturuldu.',
      });
      createForm.reset(); // Clear form after successful creation
      refetch(); // Refetch list
    }
  }, [isCreateSuccess, notice, refetch, createForm]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notice({
        variant: 'success',
        message: 'Pozisyon başarıyla güncellendi.',
      });
      refetch(); // Refetch list
    }
  }, [isUpdateSuccess, notice, refetch]);

  useEffect(() => {
    if (isDeleteSuccess) {
      notice({
        variant: 'success',
        message: 'Pozisyon başarıyla silindi.',
      });
      refetch(); // Refetch list
    }
  }, [isDeleteSuccess, notice, refetch]);

  // Handle create with form validation
  const handleCreate = createForm.handleSubmit(async (data) => {
    try {
      await createPosition({ Name: data.Name.trim() }).unwrap();
    } catch (error) {
      // Error handled by useErrorListener
      console.error('Failed to create position:', error);
    }
  });

  // Handle update
  const handleUpdate = async (position: UserPosition, name: string) => {
    try {
      await updatePosition({
        Id: position.Id,
        Name: name,
      }).unwrap();
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  };

  // Handle delete with confirmation
  const handleDelete = async (position: UserPosition) => {
    try {
      // Show confirmation dialog - matching legacy behavior
      await notice({
        type: 'confirm',
        variant: 'error',
        title: 'Pozisyon Sil',
        message: `"${position.Name}" pozisyonunu silmek istediğinizden emin misiniz?`,
        buttonTitle: 'Sil',
        catchOnCancel: true,
      });

      // If confirmed, proceed with deletion
      await deletePosition(position.Id).unwrap();
    } catch (error) {
      // User cancelled or error occurred
      if (error !== undefined) {
        console.error('Failed to delete position:', error);
      }
    }
  };

  return (
    <>
      <PageHeader title="Kullanıcı Pozisyonları" subtitle="Kullanıcı pozisyon ve yetki tanımlamaları" />

      <Box mx={2}>
        {/* Create Section - using Form component */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pozisyon Ekle
            </Typography>
            <Form form={createForm} schema={createSchema} space={2} childCol={2}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'end',
                }}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={handleCreate}
                  loading={isCreating}
                  sx={{
                    height: '40px',
                  }}
                  startIcon={<Add />}>
                  Ekle
                </LoadingButton>
              </Box>
            </Form>
          </CardContent>
        </Card>

        {/* List Section - matching legacy exactly */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pozisyon Listesi
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Loading state */}
            {isLoading && (
              <Stack spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={60} />
                ))}
              </Stack>
            )}

            {/* Error state */}
            {fetchError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Pozisyonlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
              </Alert>
            )}

            {/* Empty state */}
            {!isLoading && !fetchError && (!positions || positions.length === 0) && (
              <Alert severity="info">Kayıt Bulunamadı</Alert>
            )}

            {/* Positions list with striped rows - each row is a separate component with its own form */}
            {!isLoading && !fetchError && positions && positions.length > 0 && (
              <Stack spacing={0}>
                {positions.map((position, index) => (
                  <PositionRow
                    key={position.Id}
                    position={position}
                    index={index}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default UserPositionsPage;
