/**
 * Customer Acquisition Team List Component
 * Matches legacy renderCustomerAcquisitionTeamMembersList() section exactly
 * Inline editable list with update and delete functionality
 */

import { FigoLoading, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Delete, Save } from '@mui/icons-material';
import { Box, Card, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import {
  useDeleteCustomerAcquisitionTeamMemberMutation,
  useUpdateCustomerAcquisitionTeamMemberMutation,
} from '../customer-acquisition-team.api';
import type { CustomerAcquisitionTeamMember } from '../customer-acquisition-team.types';

interface EditableTeamMember extends CustomerAcquisitionTeamMember {
  _localName: string;
}

interface CustomerAcquisitionTeamListProps {
  members: CustomerAcquisitionTeamMember[];
  isLoading: boolean;
  onRefetch: () => void;
}

export const CustomerAcquisitionTeamList: React.FC<CustomerAcquisitionTeamListProps> = ({
  members,
  isLoading,
  onRefetch,
}) => {
  const notice = useNotice();

  // Track local edits for each member
  const [editableItems, setEditableItems] = useState<EditableTeamMember[]>([]);

  // Initialize editable items when members change
  useEffect(() => {
    setEditableItems(
      members.map((item) => ({
        ...item,
        _localName: item.Name,
      })),
    );
  }, [members]);

  const [
    updateMember,
    { isLoading: isUpdating, error: updateError, isSuccess: isUpdateSuccess, reset: resetUpdateState },
  ] = useUpdateCustomerAcquisitionTeamMemberMutation();

  const [
    deleteMember,
    { isLoading: isDeleting, error: deleteError, isSuccess: isDeleteSuccess, reset: resetDeleteState },
  ] = useDeleteCustomerAcquisitionTeamMemberMutation();

  // Handle errors with useErrorListener
  useErrorListener([updateError, deleteError]);

  // Handle update success
  useEffect(() => {
    if (isUpdateSuccess) {
      notice({
        variant: 'success',
        message: 'Müşteri kazanım ekibi üyesi başarıyla güncellendi',
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
        message: 'Müşteri kazanım ekibi üyesi başarıyla silindi',
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
        message: 'Müşteri Kazanım Ekibi Üye Adı boş bırakılamaz',
      });
      return;
    }

    try {
      await updateMember({
        Id: item.Id,
        Name: item._localName.trim(),
      }).unwrap();
    } catch {
      // Error handled by useErrorListener
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMember(id).unwrap();
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
            {/* Üye Adı */}
            <Grid item xs={12} md={8}>
              <CustomInputLabel label="Müşteri Kazanım Ekibi Üye Adı" />
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
                  id={`update-team-member-btn-${item.Id}`}
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

export default CustomerAcquisitionTeamList;
