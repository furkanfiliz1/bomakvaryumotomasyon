import { Form, LoadingButton, Slot, Table, useNotice } from '@components';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useErrorListener, useServerSideQuery } from '../../../hooks';
import {
  useCreateCompanyCodeMutation,
  useDeleteCompanyCodeMutation,
  useGetCompanyByIdQuery,
  useGetCurrenciesQuery,
  useGetFinancierCompaniesByTypeQuery,
  useLazyGetCompanyCodesQuery,
  useUpdateCompanyCodeMutation,
} from '../companies.api';
import type { Company, CompanyCode } from '../companies.types';
import { getCompanyCodesTableHeaders } from '../helpers/company-codes-table.helpers';
import { formatCompanyCodeForSubmit } from '../helpers/company-codes.helpers';
import { useCompanyCodeForm, useCompanyCodeSearchForm } from '../hooks';

const CompanyCodesTab: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const notice = useNotice();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<CompanyCode | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<number | null>(null);
  const [additionalFilters, setAdditionalFilters] = useState<{
    CompanyName?: string;
    SenderIdentifier?: string;
    Code?: string;
  }>({});

  // Search form
  const { form: searchForm, schema: searchSchema } = useCompanyCodeSearchForm();

  // Queries
  const { data: companyData } = useGetCompanyByIdQuery({ companyId: companyId! }, { skip: !companyId });

  // Server-side query with pagination and sorting
  const queryParams = useMemo(
    () => ({
      ReceiverCompanyId: Number.parseInt(companyId || '0', 10),
      ...additionalFilters,
    }),
    [companyId, additionalFilters],
  );

  const {
    data: codesData,
    isLoading,
    error: codesError,
    pagingConfig,
    sortingConfig,
    handleExport,
    refetch,
  } = useServerSideQuery(useLazyGetCompanyCodesQuery, queryParams);

  const { data: financierCompaniesData } = useGetFinancierCompaniesByTypeQuery();
  const { data: currenciesData } = useGetCurrenciesQuery();

  // Mutations
  const [createCode, { isLoading: isCreating, error: createError }] = useCreateCompanyCodeMutation();
  const [updateCode, { isLoading: isUpdating, error: updateError }] = useUpdateCompanyCodeMutation();
  const [deleteCode, { isLoading: isDeleting, error: deleteError }] = useDeleteCompanyCodeMutation();

  useErrorListener([codesError, createError, updateError, deleteError]);

  const company = companyData;
  const isBuyer = company?.ActivityType === 1;
  const isFinancier = company?.ActivityType === 3;

  // Create a dummy company for form initialization if company is not loaded
  const formCompany: Company = company || {
    Id: 0,
    Identifier: '',
    Type: 0,
    CompanyName: '',
    Status: 0,
    InsertDateTime: '',
    ActivityType: 0,
    Address: '',
    Phone: '',
    Verify: 0,
    MailAddress: '',
    CustomerManagerName: '',
    CustomerName: '',
    CustomerMail: '',
  };

  // Form for creating new code
  const { form: createForm, schema: createSchema } = useCompanyCodeForm({
    company: formCompany,
    financierCompanies: financierCompaniesData,
    currencies: currenciesData || [],
  });

  // Form for updating existing code
  const { form: updateForm, schema: updateSchema } = useCompanyCodeForm({
    initialData: selectedCode
      ? {
          Code: selectedCode.Code,
          SenderIdentifier: selectedCode.SenderIdentifier,
          FinancerCompanyId: selectedCode.FinancerCompanyId,
          CurrencyId: selectedCode.CurrencyId,
        }
      : undefined,
    company: formCompany,
    financierCompanies: financierCompaniesData,
    currencies: currenciesData || [],
  });

  // Reset update form when selected code changes
  useEffect(() => {
    if (selectedCode) {
      updateForm.reset({
        Code: selectedCode.Code,
        SenderIdentifier: selectedCode.SenderIdentifier,
        FinancerCompanyId: selectedCode.FinancerCompanyId || null,
        CurrencyId: selectedCode.CurrencyId || (isFinancier ? 1 : null),
      });
    }
  }, [selectedCode, updateForm, isFinancier]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!company) return;
    try {
      const formData = data as {
        Code: string;
        SenderIdentifier: string;
        FinancerCompanyId?: number | null;
        CurrencyId?: number | null;
      };
      await createCode(formatCompanyCodeForSubmit(formData, company.Identifier)).unwrap();
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şirket kodu başarıyla oluşturuldu',
        buttonTitle: 'Tamam',
      });
      createForm.reset();
      setCreateModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Create code error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Şirket kodu oluşturulurken bir hata oluştu',
        buttonTitle: 'Tamam',
      });
    }
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    createForm.reset();
  };

  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!selectedCode || !company) return;

    try {
      const formData = data as {
        Code: string;
        SenderIdentifier: string;
        FinancerCompanyId?: number | null;
        CurrencyId?: number | null;
      };
      await updateCode({
        id: selectedCode.Id,
        data: {
          ...selectedCode,
          ...formatCompanyCodeForSubmit(formData, company.Identifier),
        },
      }).unwrap();
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şirket kodu başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });
      setUpdateModalOpen(false);
      setSelectedCode(null);
      updateForm.reset();
      refetch();
    } catch (error) {
      console.error('Update code error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Şirket kodu güncellenirken bir hata oluştu',
        buttonTitle: 'Tamam',
      });
    }
  };

  const handleDelete = async () => {
    if (!codeToDelete) return;

    try {
      await deleteCode({ id: codeToDelete }).unwrap();
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şirket kodu başarıyla silindi',
        buttonTitle: 'Tamam',
      });
      setDeleteDialogOpen(false);
      setCodeToDelete(null);
      refetch();
    } catch (error) {
      console.error('Delete code error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Şirket kodu silinirken bir hata oluştu',
        buttonTitle: 'Tamam',
      });
    }
  };

  const handleSearch = () => {
    const formData = searchForm.getValues();
    setAdditionalFilters({
      CompanyName: formData.CompanyName || undefined,
      SenderIdentifier: formData.SenderIdentifier || undefined,
      Code: formData.Code || undefined,
    });
  };

  const handleReset = () => {
    searchForm.reset();
    setAdditionalFilters({
      CompanyName: undefined,
      SenderIdentifier: undefined,
      Code: undefined,
    });
  };

  const handleExportClick = () => {
    handleExport('sirket-kodlari');
  };

  // Table headers
  const tableHeaders = useMemo(() => getCompanyCodesTableHeaders(isBuyer, isFinancier), [isBuyer, isFinancier]);

  const openUpdateModal = (code: CompanyCode) => {
    setSelectedCode(code);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedCode(null);
    updateForm.reset();
  };

  const openDeleteDialog = (id: number) => {
    setCodeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCodeToDelete(null);
  };

  if (!company) {
    return <Typography>Şirket yükleniyor...</Typography>;
  }

  return (
    <Box>
      {/* Search Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Şirket Kodu Ara
          </Typography>
          <Form form={searchForm} schema={searchSchema} childCol={12} space={2} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
              Yeni Ekle
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleReset}>
                Temizle
              </Button>
              <Button variant="contained" onClick={handleSearch}>
                Ara
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* List Section */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Tanımlı Kodlar</Typography>
            <Button startIcon={<FileDownloadIcon />} variant="outlined" onClick={handleExportClick}>
              Excel İndir
            </Button>
          </Box>

          <Table<CompanyCode>
            id="company-codes-table"
            rowId="Id"
            headers={tableHeaders}
            data={codesData?.Items || []}
            loading={isLoading}
            error={codesError ? 'Veriler yüklenirken hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            notFoundConfig={{
              title: 'Şirket kodu bulunamadı',
              subTitle: 'Arama kriterlerinize uygun şirket kodu bulunmamaktadır',
            }}>
            {/* Actions Slot */}
            <Slot<CompanyCode> id="actions">
              {(_value, row) => {
                if (!row) return null;
                return (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" onClick={() => openUpdateModal(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => openDeleteDialog(row.Id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                );
              }}
            </Slot>
          </Table>
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={createModalOpen} onClose={closeCreateModal} maxWidth="md" fullWidth>
        <DialogTitle>Şirket Kodu Tanımla</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Form form={createForm} schema={createSchema} childCol={12} space={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateModal}>İptal</Button>
          <LoadingButton
            id="create-code-btn"
            loading={isCreating}
            variant="contained"
            onClick={createForm.handleSubmit(handleCreate)}
            disabled={!company}>
            Oluştur
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={updateModalOpen} onClose={closeUpdateModal} maxWidth="md" fullWidth>
        <DialogTitle>Şirket Kodu Güncelle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Form form={updateForm} schema={updateSchema} childCol={12} space={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateModal}>İptal</Button>
          <LoadingButton
            id="update-code-btn"
            loading={isUpdating}
            variant="contained"
            onClick={updateForm.handleSubmit(handleUpdate)}
            disabled={!company}>
            Güncelle
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>
          <Typography>Bu şirket kodunu silmek istediğinizden emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>İptal</Button>
          <LoadingButton
            id="delete-code-btn"
            loading={isDeleting}
            variant="contained"
            color="error"
            onClick={handleDelete}>
            Sil
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyCodesTab;
