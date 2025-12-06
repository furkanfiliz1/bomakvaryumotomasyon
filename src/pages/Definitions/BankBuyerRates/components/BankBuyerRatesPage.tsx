import { Form, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add, Clear, Delete, Search, Update } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useCreateBankBuyerRateCommissionMutation,
  useDeleteBankBuyerRateCommissionMutation,
  useLazyGetBankBuyerRateCommissionsQuery,
  useUpdateBankBuyerRateCommissionMutation,
} from '../bank-buyer-rates.api';
import type { BankBuyerCommission, BankBuyerRatesFilters } from '../bank-buyer-rates.types';
import {
  formatAmountValue,
  formatRateValue,
  getBankBuyerRatesTableHeaders,
  getFinancerCompanyName,
  getReceiverCompanyName,
  parseToNumber,
} from '../helpers';
import {
  useBankBuyerRatesCreateForm,
  useBankBuyerRatesDropdownData,
  useBankBuyerRatesFilterForm,
  useBankBuyerRatesQueryParams,
} from '../hooks';

/**
 * Bank Buyer Rates Page Component
 * Displays bank-buyer commission rates with create, update, delete functionality
 * Matches legacy BankBuyerRate.js functionality exactly with 1:1 parity
 */
export const BankBuyerRatesPage: React.FC = () => {
  const notice = useNotice();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Editable rows state
  const [editableCommissions, setEditableCommissions] = useState<BankBuyerCommission[]>([]);

  // Get dropdown data
  const { buyerList, financerList, isBuyersLoading, isFinancersLoading } = useBankBuyerRatesDropdownData();

  // API mutations
  const [createCommission, { isLoading: isCreating, error: createError }] = useCreateBankBuyerRateCommissionMutation();
  const [updateCommission, { error: updateError }] = useUpdateBankBuyerRateCommissionMutation();
  const [deleteCommission, { error: deleteError }] = useDeleteBankBuyerRateCommissionMutation();

  // Convert URL params to filter format
  const urlFilters = useMemo<Partial<BankBuyerRatesFilters>>(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      ReceiverCompanyId: params.ReceiverCompanyId ? Number(params.ReceiverCompanyId) : undefined,
      FinancerCompanyId: params.FinancerCompanyId ? Number(params.FinancerCompanyId) : undefined,
    };
  }, [searchParams]);

  // Initialize filter form with URL filters
  const {
    form: filterForm,
    schema: filterSchema,
    handleSearch,
  } = useBankBuyerRatesFilterForm({
    buyerList,
    financerList,
    initialFilters: urlFilters,
    onFilterChange: (filters) => {
      // Update URL params when filters change
      const params: Record<string, string> = {};

      if (filters.ReceiverCompanyId) params.ReceiverCompanyId = String(filters.ReceiverCompanyId);
      if (filters.FinancerCompanyId) params.FinancerCompanyId = String(filters.FinancerCompanyId);

      setSearchParams(params);
      // Trigger search
      refetch();
    },
  });

  // Initialize create form
  const { form: createForm, schema: createSchema } = useBankBuyerRatesCreateForm({
    buyerList,
    financerList,
  });

  // Generate query parameters from URL filters
  const { baseQueryParams } = useBankBuyerRatesQueryParams({ additionalFilters: urlFilters });

  // Fetch commissions list
  const [triggerQuery, { data: commissions, isLoading, isFetching, error }] = useLazyGetBankBuyerRateCommissionsQuery();

  // Fetch on mount and when filters change
  React.useEffect(() => {
    triggerQuery(baseQueryParams);
  }, [triggerQuery, baseQueryParams]);

  // Update editable state when data changes
  React.useEffect(() => {
    if (commissions) {
      setEditableCommissions(commissions);
    }
  }, [commissions]);

  // Refetch function
  const refetch = () => {
    triggerQuery(baseQueryParams);
  };

  // Error handling
  useErrorListener([error, createError, updateError, deleteError]);

  // Table configuration
  const tableHeaders = useMemo(() => getBankBuyerRatesTableHeaders(), []);

  const handleReset = () => {
    filterForm.reset({
      ReceiverCompanyId: null,
      FinancerCompanyId: null,
    });
    // Clear all URL params
    setSearchParams({});
    // Refetch all
    triggerQuery({});
  };

  // Handle create
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreate = async (data: any) => {
    if (!data.receiverCompanyId && !data.financerCompanyId) {
      notice({
        variant: 'error',
        message: 'Lütfen en az bir şirket seçiniz',
      });
      return;
    }

    try {
      await createCommission({
        isConsensus: data.isConsensus === 1,
        receiverCompanyId: data.receiverCompanyId,
        financerCompanyId: data.financerCompanyId,
        rate: parseToNumber(data.rate),
        amount: parseToNumber(data.amount),
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Banka oran kaydı başarıyla eklendi',
      });

      // Reset create form
      createForm.reset();
      setCreateDialogOpen(false);

      // Refetch list
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Failed to create commission:', err);
    }
  };

  // Handle update
  const handleUpdate = async (index: number) => {
    const item = editableCommissions[index];

    try {
      await updateCommission({
        Id: item.Id,
        SenderCompanyId: item.SenderCompanyId,
        ReceiverCompanyId: item.ReceiverCompanyId,
        FinancerCompanyId: item.FinancerCompanyId,
        Rate: item.Rate,
        Amount: item.Amount,
        IsConsensus: item.IsConsensus,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Kayıt başarıyla güncellendi',
      });

      // Refetch list
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Failed to update commission:', err);
    }
  };

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;

    try {
      await deleteCommission(selectedDeleteId).unwrap();
      notice({
        variant: 'success',
        message: 'Kayıt başarıyla silindi',
      });
      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Failed to delete commission:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };

  // Update editable field
  const updateEditableField = (index: number, field: keyof BankBuyerCommission, value: unknown) => {
    const updated = [...editableCommissions];
    updated[index] = { ...updated[index], [field]: value };
    setEditableCommissions(updated);
  };

  const isLoadingData = isLoading || isFetching || isBuyersLoading || isFinancersLoading;

  return (
    <>
      <PageHeader title="Banka-Alıcı Oran Girişi" subtitle="Banka ve alıcı bazında gelir oranı girişi tanımlamaları." />

      <Box sx={{ p: 3 }}>
        {/* Filter Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Oran Ara
        </Typography>

        <Card sx={{ p: 3, mb: 3 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={filterForm as any} schema={filterSchema} space={2}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateDialogOpen(true)}
                  color="primary">
                  Oran Ekle
                </Button>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button variant="outlined" startIcon={<Clear />} onClick={handleReset} disabled={isLoadingData}>
                  Temizle
                </Button>
                <Button variant="contained" startIcon={<Search />} onClick={handleSearch} disabled={isLoadingData}>
                  Ara
                </Button>
              </Stack>
            </Box>
          </Form>
        </Card>

        {/* Action Buttons */}

        {/* Editable List Table */}
        {editableCommissions && editableCommissions.length > 0 ? (
          <Table<BankBuyerCommission>
            id="BankBuyerRatesTable"
            rowId="Id"
            headers={tableHeaders}
            data={editableCommissions}
            loading={isLoadingData}
            size="medium"
            striped
            hidePaging>
            {/* Receiver Company Slot */}
            <Slot id="ReceiverCompanyId">
              {(_value, row) => {
                const item = row as BankBuyerCommission;
                return <Typography variant="body2">{getReceiverCompanyName(item, buyerList)}</Typography>;
              }}
            </Slot>

            {/* Financer Company Slot */}
            <Slot id="FinancerCompanyId">
              {(_value, row) => {
                const item = row as BankBuyerCommission;
                return <Typography variant="body2">{getFinancerCompanyName(item, financerList)}</Typography>;
              }}
            </Slot>

            {/* Rate Slot - Editable */}
            <Slot id="Rate">
              {(_value, row) => {
                const item = row as BankBuyerCommission;
                const index = editableCommissions.findIndex((c) => c.Id === item.Id);
                return (
                  <TextField
                    fullWidth
                    size="small"
                    value={formatRateValue(editableCommissions[index]?.Rate)}
                    onChange={(e) => updateEditableField(index, 'Rate', parseToNumber(e.target.value))}
                  />
                );
              }}
            </Slot>

            {/* Amount Slot - Editable */}
            <Slot id="Amount">
              {(_value, row) => {
                const item = row as BankBuyerCommission;
                const index = editableCommissions.findIndex((c) => c.Id === item.Id);
                return (
                  <TextField
                    fullWidth
                    size="small"
                    value={formatAmountValue(editableCommissions[index]?.Amount)}
                    onChange={(e) => updateEditableField(index, 'Amount', parseToNumber(e.target.value))}
                  />
                );
              }}
            </Slot>

            {/* IsConsensus Slot - Editable */}
            <Slot id="IsConsensus">
              {(_value, row) => {
                const item = row as BankBuyerCommission;
                const index = editableCommissions.findIndex((c) => c.Id === item.Id);
                return (
                  <Select
                    fullWidth
                    size="small"
                    value={editableCommissions[index]?.IsConsensus ? '1' : '0'}
                    onChange={(e) => updateEditableField(index, 'IsConsensus', e.target.value === '1')}>
                    <MenuItem value="1">Evet</MenuItem>
                    <MenuItem value="0">Hayır</MenuItem>
                  </Select>
                );
              }}
            </Slot>

            {/* Actions Slot */}
            <Slot id="actions">
              {(_value, row) => {
                const item = row as BankBuyerCommission;
                const index = editableCommissions.findIndex((c) => c.Id === item.Id);
                return (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Update />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(index);
                      }}>
                      Güncelle
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item.Id);
                      }}>
                      Sil
                    </Button>
                  </Box>
                );
              }}
            </Slot>
          </Table>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">{isLoadingData ? 'Yükleniyor...' : 'Kayıt bulunamadı'}</Typography>
          </Box>
        )}
      </Box>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Banka Oran Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Form form={createForm as any} schema={createSchema} space={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={isCreating}>
            İptal
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={createForm.handleSubmit(handleCreate as any)}
            variant="contained"
            disabled={isCreating || !createForm.formState.isValid}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Kaydı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>Bu kaydı silmek istediğinizden emin misiniz?</DialogContentText>
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

export default BankBuyerRatesPage;
