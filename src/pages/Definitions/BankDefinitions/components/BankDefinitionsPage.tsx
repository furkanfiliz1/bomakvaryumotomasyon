import { PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useCreateBankDefinitionMutation,
  useDeleteBankDefinitionMutation,
  useGetBankDefinitionsListQuery,
} from '../bank-definitions.api';
import type { Bank } from '../bank-definitions.types';
import { getBankTableHeaders } from '../helpers';

/**
 * Bank Definitions Page Component
 * Displays banks list with inline create form
 * Matches legacy BankDefinition.js functionality exactly
 */
export const BankDefinitionsPage: React.FC = () => {
  const notice = useNotice();
  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  // Fetch banks list
  const { data: banks, isLoading, error, refetch } = useGetBankDefinitionsListQuery();

  // Create mutation
  const [createBank, { isLoading: isCreating, error: createError }] = useCreateBankDefinitionMutation();

  // Delete mutation
  const [deleteBank, { error: deleteError }] = useDeleteBankDefinitionMutation();

  // Error handling
  useErrorListener([error, createError, deleteError]);

  // Table configuration
  const tableHeaders = useMemo(() => getBankTableHeaders(), []);

  const handleCreate = async () => {
    if (!bankCode.trim() || !bankName.trim()) {
      notice({
        variant: 'error',
        message: 'Lütfen tüm alanları doldurunuz',
      });
      return;
    }

    try {
      await createBank({
        code: bankCode,
        name: bankName,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Banka başarıyla eklendi',
      });

      // Reset form
      setBankCode('');
      setBankName('');

      // Refetch list
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Failed to create bank:', err);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;

    try {
      await deleteBank(selectedDeleteId).unwrap();
      notice({
        variant: 'success',
        message: 'Banka başarıyla silindi',
      });
      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Failed to delete bank:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };

  return (
    <>
      <PageHeader title="Banka Tanımları" subtitle="Banka tanımlamaları ve ayarları" />

      <Box sx={{ p: 3 }}>
        {/* Inline Create Form */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Banka Adı
              </Typography>
              <TextField
                fullWidth
                id="defBankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                disabled={isCreating}
                size="small"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Banka Kodu
              </Typography>
              <TextField
                fullWidth
                id="defBankCode"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                disabled={isCreating}
                size="small"
              />
            </Box>
            <Button variant="contained" onClick={handleCreate} disabled={isCreating} sx={{ minWidth: 120 }}>
              Ekle
            </Button>
            <Button
              component={Link}
              to="/definitions/bank-branch-definitions"
              variant="outlined"
              sx={{ minWidth: 120 }}>
              Şube Ekle
            </Button>
          </Box>
        </Card>

        {/* Banks Table */}
        <Table<Bank>
          id="BanksTable"
          rowId="Id"
          headers={tableHeaders}
          data={banks || []}
          loading={isLoading}
          size="medium"
          striped
          hidePaging>
          {/* Custom slot for action buttons */}
          <Slot id="actions">
            {(_value, row) => {
              const item = row as Bank;
              return (
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(item.Id);
                  }}
                  aria-label="Sil">
                  <Delete fontSize="small" />
                </IconButton>
              );
            }}
          </Slot>
        </Table>

        {/* Empty state */}
        {!isLoading && (!banks || banks.length === 0) && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Kayıt bulunamadı</Typography>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Bankayı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>Bu bankayı silmek istediğinizden emin misiniz?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BankDefinitionsPage;
