/**
 * Sub Channel List Component
 * Matches legacy SubChannel.js renderSubChannelList() section exactly
 * Inline editable list with update and delete functionality
 */

import { FigoLoading, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Delete, Save } from '@mui/icons-material';
import { Box, Card, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import { useDeleteSubChannelMutation, useUpdateSubChannelMutation } from '../sub-channel.api';
import type { SubChannelItem } from '../sub-channel.types';

interface EditableSubChannel extends SubChannelItem {
  _localName: string;
}

interface SubChannelListProps {
  items: SubChannelItem[];
  isLoading: boolean;
  onRefetch: () => void;
}

export const SubChannelList: React.FC<SubChannelListProps> = ({ items, isLoading, onRefetch }) => {
  const notice = useNotice();

  // Track local edits for each item
  const [editableItems, setEditableItems] = useState<EditableSubChannel[]>([]);

  // Initialize editable items when items change
  useEffect(() => {
    setEditableItems(
      items.map((item) => ({
        ...item,
        _localName: item.Name,
      })),
    );
  }, [items]);

  const [
    updateSubChannel,
    { isLoading: isUpdating, error: updateError, isSuccess: isUpdateSuccess, reset: resetUpdateState },
  ] = useUpdateSubChannelMutation();

  const [
    deleteSubChannel,
    { isLoading: isDeleting, error: deleteError, isSuccess: isDeleteSuccess, reset: resetDeleteState },
  ] = useDeleteSubChannelMutation();

  // Handle errors with useErrorListener
  useErrorListener([updateError, deleteError]);

  // Handle update success
  useEffect(() => {
    if (isUpdateSuccess) {
      notice({
        variant: 'success',
        message: 'Alt kanal başarıyla güncellendi',
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
        message: 'Alt kanal başarıyla silindi',
      });
      resetDeleteState();
      onRefetch();
    }
  }, [isDeleteSuccess, notice, onRefetch, resetDeleteState]);

  const handleNameChange = (index: number, value: string) => {
    setEditableItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], _localName: value };
      return updated;
    });
  };

  const handleUpdate = async (index: number) => {
    const item = editableItems[index];

    // Validate required fields (matching legacy validation)
    if (!item._localName || item._localName.trim() === '') {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Alt Kanal Adı boş bırakılamaz',
      });
      return;
    }

    try {
      await updateSubChannel({
        Id: item.Id,
        Name: item._localName.trim(),
        ChannelId: item.ChannelId,
      }).unwrap();
    } catch {
      // Error handled by useErrorListener
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSubChannel(id).unwrap();
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
    <Box>
      {editableItems.map((item, index) => (
        <Card
          key={item.Id}
          sx={{
            p: 2,
            mb: 1,
            backgroundColor: index % 2 === 0 ? 'action.hover' : 'background.paper',
          }}>
          <Grid container spacing={2} alignItems="center">
            {/* Başvuru Kanalı (Read-only) */}
            <Grid item xs={12} md={2}>
              <CustomInputLabel label="Başvuru Kanalı" />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {item.ChannelName}
              </Typography>
            </Grid>

            {/* Alt Kanal Adı */}
            <Grid item xs={12} md={6}>
              <CustomInputLabel label="Alt Kanal Adı" />
              <TextField
                value={item._localName}
                onChange={(e) => handleNameChange(index, e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                <LoadingButton
                  id={`update-sub-channel-btn-${item.Id}`}
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
  );
};

export default SubChannelList;
