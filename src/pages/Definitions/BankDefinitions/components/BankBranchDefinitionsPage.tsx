import { Form, PageHeader, Slot, Table, fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Add, Clear, Delete, Download, Search } from '@mui/icons-material';
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
  Stack,
  Typography,
} from '@mui/material';
import yup from '@validation';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import {
  useCreateBankDefinitionBranchMutation,
  useDeleteBankDefinitionBranchMutation,
  useLazyGetBankDefinitionBranchesQuery,
} from '../bank-definitions.api';
import type { Bank, BankBranch, BankBranchFilters } from '../bank-definitions.types';
import { getBankBranchTableHeaders } from '../helpers';
import { useBankBranchFilterForm, useBankBranchQueryParams, useBankDropdownData } from '../hooks';

/**
 * Bank Branch Definitions Page Component
 * Displays bank branches list with filters and create modal
 * Matches legacy BankBranchDefinition.js functionality exactly
 */
export const BankBranchDefinitionsPage: React.FC = () => {
  const notice = useNotice();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  // Get dropdown data
  const { bankList } = useBankDropdownData();

  // Delete mutation
  const [deleteBranch, { error: deleteError }] = useDeleteBankDefinitionBranchMutation();

  // Convert URL params to filter format
  const urlFilters = useMemo<Partial<BankBranchFilters>>(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      bankId: params.bankId || undefined,
      branchCode: params.branchCode || undefined,
      page: params.page ? Number(params.page) : 1,
      pageSize: params.pageSize ? Number(params.pageSize) : 25,
    };
  }, [searchParams]);

  // Initialize filter form with URL filters
  const { form, schema, handleSearch } = useBankBranchFilterForm({
    bankList,
    initialFilters: urlFilters,
    onFilterChange: (filters) => {
      // Update URL params when filters change
      const params: Record<string, string> = {};

      if (filters.bankId) params.bankId = filters.bankId;
      if (filters.branchCode) params.branchCode = filters.branchCode;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);

      setSearchParams(params);
    },
  });

  // Generate query parameters from URL filters
  const { baseQueryParams } = useBankBranchQueryParams({ additionalFilters: urlFilters });

  // Use the useServerSideQuery hook following RepresentativeTarget pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport, refetch } = useServerSideQuery(
    useLazyGetBankDefinitionBranchesQuery,
    baseQueryParams,
  );

  // Override pagingConfig to update URL params
  const enhancedPagingConfig = useMemo(
    () => ({
      ...pagingConfig,
      onPageChange: (newPage: number) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, page: String(newPage) });
        pagingConfig.onPageChange?.(newPage);
      },
      onPageSizeChange: (newPageSize: number) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, pageSize: String(newPageSize), page: '1' });
        pagingConfig.onPageSizeChange?.(newPageSize);
      },
    }),
    [pagingConfig, searchParams, setSearchParams],
  );

  const handleReset = () => {
    form.reset({
      bankId: '',
      branchCode: '',
    });
    // Clear all URL params
    setSearchParams({});
  };

  // Error handling
  useErrorListener([error, deleteError]);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];

  // Table configuration
  const tableHeaders = useMemo(() => getBankBranchTableHeaders(), []);

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;

    try {
      await deleteBranch(selectedDeleteId).unwrap();
      notice({
        variant: 'success',
        message: 'Şube başarıyla silindi',
      });
      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Failed to delete branch:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };

  const handleExportClick = () => {
    const customFilename = 'subeler';
    handleExport(customFilename);
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  return (
    <>
      <PageHeader title="Banka Şube Ekle" subtitle="Banka şubelerini tanımlama" />

      <Box sx={{ p: 3 }}>
        {/* Filter Section Header */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Şube Ara
        </Typography>

        {/* Filter Section */}
        <Card sx={{ p: 3, mb: 3 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={form as any} schema={schema} space={2}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateDialogOpen(true)}
                  color="primary">
                  Şube Ekle
                </Button>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleReset}
                  disabled={isLoading || isFetching}>
                  Temizle
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  disabled={isLoading || isFetching}>
                  Uygula
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportClick}
                  disabled={!tableData.length}>
                  Excel
                </Button>
              </Stack>
              {/* Action Buttons */}
            </Box>
          </Form>
        </Card>

        {/* Table */}
        <Table<BankBranch>
          id="BankBranchesTable"
          rowId="Id"
          headers={tableHeaders}
          data={tableData}
          loading={isLoading || isFetching}
          size="medium"
          striped
          pagingConfig={enhancedPagingConfig}
          sortingConfig={sortingConfig}>
          {/* Custom slot for action buttons */}
          <Slot id="actions">
            {(_value, row) => {
              const item = row as BankBranch;
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
      </Box>

      {/* Create Dialog */}
      <CreateBankBranchDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        bankList={bankList}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Şubeyi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>Bu şubeyi silmek istediğinizden emin misiniz?</DialogContentText>
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

// Create Bank Branch Dialog Component
interface CreateBankBranchDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bankList: Bank[];
}

const CreateBankBranchDialog: React.FC<CreateBankBranchDialogProps> = ({ open, onClose, onSuccess, bankList }) => {
  const notice = useNotice();

  // Create mutation
  const [createBranch, { isLoading, error }] = useCreateBankDefinitionBranchMutation();

  // Error handling
  useErrorListener([error]);

  // Form schema
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      bankId: fields
        .select(bankList || [], 'string', ['Id', 'Name'])
        .required('Banka seçimi zorunludur')
        .label('Banka Adı')
        .meta({ col: 12 }),
      code: fields.text.required('Şube kodu zorunludur').label('Şube Kodu').meta({ col: 12 }),
      name: fields.text.required('Şube adı zorunludur').label('Şube Adı').meta({ col: 12 }),
    };

    return yup.object(baseFields);
  }, [bankList]);

  // Initialize form
  const form = useForm({
    defaultValues: {
      bankId: '',
      code: '',
      name: '',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange' as const,
  });

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      await createBranch({
        bankId: data.bankId,
        code: data.code,
        name: data.name,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Şube başarıyla eklendi',
      });
      form.reset();
      onSuccess();
      onClose();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Failed to create branch:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Şube Ekle</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={form as any} schema={schema} space={2} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          İptal
        </Button>
        <Button
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={form.handleSubmit(handleSubmit as any)}
          variant="contained"
          disabled={isLoading || !form.formState.isValid}>
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BankBranchDefinitionsPage;
