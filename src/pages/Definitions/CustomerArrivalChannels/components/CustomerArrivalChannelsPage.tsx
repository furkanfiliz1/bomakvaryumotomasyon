import { Form, LoadingButton, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  useCreateCustomerArrivalChannelMutation,
  useDeleteCustomerArrivalChannelMutation,
  useGetCustomerArrivalChannelsQuery,
  useUpdateCustomerArrivalChannelMutation,
} from '../customer-arrival-channels.api';
import type { LeadingChannel, LeadingChannelFilters } from '../customer-arrival-channels.types';
import {
  consensusToFormValue,
  formatConsensusForCreate,
  formatConsensusForUpdate,
  getConsensusChipColor,
  getConsensusDisplayLabel,
  getCustomerArrivalChannelsTableHeaders,
  isConsensusChannel,
} from '../helpers';
import {
  useCustomerArrivalChannelsDropdownData,
  useCustomerArrivalChannelsFilterForm,
  useCustomerArrivalChannelsForm,
} from '../hooks';

/**
 * Customer Arrival Channels Main Page
 * Following OperationPricing page structure with Form-based filters and inline table editing
 */
const CustomerArrivalChannelsPage: React.FC = () => {
  const notice = useNotice();

  // Local filter state
  const [filters, setFilters] = useState<LeadingChannelFilters>({});

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LeadingChannel | null>(null);

  // Get dropdown data
  const { consensusOptions } = useCustomerArrivalChannelsDropdownData();

  // API calls
  const { data: channels = [], isLoading, error: fetchError, refetch } = useGetCustomerArrivalChannelsQuery(filters);

  const [createChannel, { isLoading: isCreating, error: createError }] = useCreateCustomerArrivalChannelMutation();

  const [updateChannel, { isLoading: isUpdating, error: updateError }] = useUpdateCustomerArrivalChannelMutation();

  const [deleteChannel, { error: deleteError }] = useDeleteCustomerArrivalChannelMutation();

  // Error handling
  useErrorListener([fetchError, createError, updateError, deleteError]);

  // Filter form hook
  const {
    form: filterForm,
    schema: filterSchema,
    handleSearch: handleFilterSearch,
  } = useCustomerArrivalChannelsFilterForm({
    consensusOptions,
    onSearch: (newFilters) => {
      setFilters(newFilters);
    },
  });

  // Create form hook
  const { form: createForm, schema: createSchema } = useCustomerArrivalChannelsForm({
    consensusOptions,
    isEditing: false,
  });

  // Update form hook
  const { form: updateForm, schema: updateSchema } = useCustomerArrivalChannelsForm({
    consensusOptions,
    initialData: selectedRow,
    isEditing: true,
  });

  // Reset update form when selected row changes
  useEffect(() => {
    if (selectedRow) {
      updateForm.reset({
        Value: selectedRow.Value,
        Rate: selectedRow.Rate,
        IsConsensus: consensusToFormValue(selectedRow.IsConsensus),
      });
    }
  }, [selectedRow, updateForm]);

  // Handle create channel
  const handleCreate = async () => {
    const isValid = await createForm.trigger();
    if (!isValid) return;

    const formData = createForm.getValues() as { value: string; rate: number | null; isConsensus: string };

    try {
      await createChannel({
        value: formData.value,
        rate: formData.rate,
        isConsensus: formatConsensusForCreate(formData.isConsensus),
      }).unwrap();

      notice({
        title: 'Başarılı',
        message: 'Müşteri geliş kanalı başarıyla oluşturuldu',
        buttonTitle: 'Tamam',
      });

      // Reset form and close modal
      createForm.reset();
      setIsCreateModalOpen(false);

      // Refetch data
      refetch();
    } catch (error) {
      // Error handled by useErrorListener
      console.error('Failed to create channel:', error);
    }
  };

  // Handle open update modal
  const handleOpenUpdateModal = (row: LeadingChannel) => {
    setSelectedRow(row);
    setIsUpdateModalOpen(true);
  };

  // Handle update
  const handleUpdate = async () => {
    if (!selectedRow) {
      console.error('No row selected for update');
      return;
    }

    const isValid = await updateForm.trigger();
    if (!isValid) return;

    const formData = updateForm.getValues() as { Value: string; Rate: number | null; IsConsensus: string };

    console.log('Updating channel:', {
      id: selectedRow.Id,
      formData,
    });

    try {
      await updateChannel({
        id: selectedRow.Id,
        data: {
          Id: selectedRow.Id,
          Value: formData.Value,
          Rate: formData.Rate,
          IsConsensus: formatConsensusForUpdate(formData.IsConsensus),
        },
      }).unwrap();

      notice({
        title: 'Başarılı',
        message: 'Müşteri geliş kanalı başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });

      // Close modal and refetch data
      setIsUpdateModalOpen(false);
      setSelectedRow(null);
      refetch();
    } catch (error) {
      console.error('Failed to update channel:', error);
    }
  };

  // Handle delete channel with confirmation
  const handleDelete = async (id: number) => {
    try {
      await notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Uyarı',
        message: 'Bu kaydı silmek istediğinizden emin misiniz?',
        buttonTitle: 'Sil',
        icon: 'alert-triangle',
      });

      await deleteChannel(id).unwrap();

      notice({
        title: 'Başarılı',
        message: 'Müşteri geliş kanalı başarıyla silindi',
        buttonTitle: 'Tamam',
      });

      refetch();
    } catch (error) {
      // User cancelled or error occurred
      if (error !== 'cancel') {
        console.error('Failed to delete channel:', error);
      }
    }
  };

  // Table headers
  const headers = getCustomerArrivalChannelsTableHeaders();

  return (
    <>
      <PageHeader title="Müşteri Geliş Kanalları" subtitle="Müşteri geliş kanallarını yönetin" />

      <Box sx={{ p: 3 }}>
        {/* Filter Section with Add Button */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <strong>Filtrele</strong>
            </Box>

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Form form={filterForm as never} schema={filterSchema} space={2} />

            <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => setIsCreateModalOpen(true)}>
                Yeni Ekle
              </Button>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    filterForm.reset();
                    setFilters({});
                  }}>
                  Temizle
                </Button>
                <Button variant="contained" onClick={handleFilterSearch} disabled={isLoading}>
                  Ara
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <strong>Kanal Listesi</strong>
            </Box>

            <Table<LeadingChannel>
              id="customer-arrival-channels-table"
              rowId="Id"
              headers={headers}
              data={channels}
              loading={isLoading}
              striped={true}
              size="medium"
              notFoundConfig={{
                title: 'Kayıt bulunamadı',
                subTitle: 'Arama kriterlerinize uygun müşteri geliş kanalı bulunamadı',
              }}>
              {/* Value Column */}
              <Slot id="Value">
                {(value) => {
                  return <>{value || '-'}</>;
                }}
              </Slot>

              {/* Rate Column */}
              <Slot id="Rate">
                {(value) => {
                  return <>{value ?? '-'}</>;
                }}
              </Slot>

              {/* IsConsensus Column - Chip Display */}
              <Slot id="IsConsensus">
                {(value) => {
                  const consensusValue = isConsensusChannel(value);
                  return (
                    <Chip
                      label={getConsensusDisplayLabel(consensusValue)}
                      color={getConsensusChipColor(consensusValue)}
                      size="small"
                    />
                  );
                }}
              </Slot>

              {/* Actions Column */}
              <Slot id="actions">
                {(_, row?: LeadingChannel) => {
                  if (!row) return null;

                  return (
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" size="small" onClick={() => handleOpenUpdateModal(row)}>
                        Güncelle
                      </Button>

                      <Tooltip title="Sil">
                        <IconButton size="small" color="error" onClick={() => handleDelete(row.Id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  );
                }}
              </Slot>
            </Table>
          </CardContent>
        </Card>
      </Box>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Müşteri Geliş Kanalı Ekle</DialogTitle>
        <DialogContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={createForm as never} schema={createSchema as never} space={2} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setIsCreateModalOpen(false)} disabled={isCreating}>
            İptal
          </Button>
          <LoadingButton
            id="save-channel-button"
            variant="contained"
            onClick={handleCreate}
            loading={isCreating}
            disabled={isCreating}>
            Kaydet
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Update Modal */}
      <Dialog
        open={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedRow(null);
        }}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Müşteri Geliş Kanalını Güncelle</DialogTitle>
        <DialogContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={updateForm as never} schema={updateSchema as never} space={2} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setIsUpdateModalOpen(false);
              setSelectedRow(null);
            }}
            disabled={isUpdating}>
            İptal
          </Button>
          <LoadingButton
            id="update-channel-button"
            variant="contained"
            onClick={handleUpdate}
            loading={isUpdating}
            disabled={isUpdating}>
            Güncelle
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerArrivalChannelsPage;
