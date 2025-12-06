import { Form, Table, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add as AddIcon, Business as BusinessIcon, Delete as DeleteIcon, Link as LinkIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { HeadCell } from 'src/components/common/Table/types';
import {
  useAddGroupCompanyMutation,
  useGetGroupCompaniesQuery,
  useRemoveGroupCompanyMutation,
  useUpdateGroupStatusMutation,
} from '../companies.api';
import { useCompanyGroupForm } from '../hooks/useCompanyGroupForm';

interface CompanyGroupProps {
  companyId: number;
  CompanyGroupStatus: number;
  refetchCompanies?: () => void;
}

const CompanyGroup: React.FC<CompanyGroupProps> = ({ companyId, CompanyGroupStatus, refetchCompanies }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [hasGroupCompany, setHasGroupCompany] = useState(CompanyGroupStatus === 1);

  const [updateGroupStatus, { error, isSuccess }] = useUpdateGroupStatusMutation();
  const [removeGroupCompany, { error: removeError, isSuccess: isRemoveSuccess }] = useRemoveGroupCompanyMutation();
  const [addGroupCompany] = useAddGroupCompanyMutation();
  const notice = useNotice();

  // Update local state when CompanyGroupStatus prop changes
  React.useEffect(() => {
    setHasGroupCompany(CompanyGroupStatus === 1);
  }, [CompanyGroupStatus]);

  const getCompanyGroupTableHeaders = (): HeadCell[] => [
    {
      id: 'CompanyName',
      label: 'Şirket Adı',
    },
    {
      id: 'Identifier',
      label: 'VKN/TCKN',
    },
  ];

  // Data queries
  const {
    data: groupCompaniesData,
    error: groupCompaniesError,
    isLoading: isLoadingGroupCompanies,
    refetch: refetchGroupCompanies,
  } = useGetGroupCompaniesQuery({ companyId });

  useErrorListener(error);
  useErrorListener(groupCompaniesError);
  useErrorListener(removeError);

  const groupCompanies = groupCompaniesData?.Items || [];

  // Table configuration
  const tableHeaders = useMemo(() => getCompanyGroupTableHeaders(), []);

  // Form hook'u
  const { form, schema, handleFormSubmit, handleReset } = useCompanyGroupForm({
    companyId,
    onSubmit: async (data) => {
      try {
        await addGroupCompany({
          FromCompanyId: companyId,
          ToCompanyIds: [data.companyId],
        }).unwrap();

        await refetchGroupCompanies();
        setOpenDialog(false);
      } catch (error) {
        console.error('Add group company failed:', error);
      }
    },
  });

  const handleRemoveCompany = async (groupCompanyId: number) => {
    try {
      await notice({
        type: 'confirm',
        variant: 'error',
        title: 'Grup Şirketi Kaldır',
        message: 'Bu şirketi grup şirketlerinden kaldırmak istediğinizden emin misiniz?',
        buttonTitle: 'Kaldır',
        catchOnCancel: true,
      });

      await removeGroupCompany({
        FromCompanyId: companyId.toString(),
        ToCompanyId: groupCompanyId,
      }).unwrap();

      // Refetch the data to update the list
      await refetchGroupCompanies();
    } catch (error) {
      // User cancelled or API error occurred
      if (error !== undefined) {
        console.error('Remove group company failed:', error);
      }
    }
  };

  const handleToggleGroupCompany = async (hasGroup: boolean) => {
    try {
      await updateGroupStatus({
        companyId,
        CompanyGroupStatus: hasGroup ? 1 : 0,
      }).unwrap();

      setHasGroupCompany(hasGroup);

      // Refetch companies to update the parent component
      if (refetchCompanies) {
        await refetchCompanies();
      }
    } catch (error) {
      console.error('Group status update failed:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Grup şirketi durumu başarıyla değiştirildi.',
        buttonTitle: 'Tamam',
      });
    }
  }, [isSuccess, notice]);

  useEffect(() => {
    if (isRemoveSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Grup şirketi başarıyla kaldırıldı.',
        buttonTitle: 'Tamam',
      });
    }
  }, [isRemoveSuccess, notice]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Grup Şirketi
      </Typography>

      <Grid container spacing={2}>
        {/* Grup Şirket Durumu */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="primary">
                  <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Grup Şirket Durumu
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={hasGroupCompany}
                      onChange={(e) => handleToggleGroupCompany(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={hasGroupCompany ? 'Grup şirketi var' : 'Grup şirketi yok'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <>
          {/* Grup Şirketleri Listesi */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    <LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Grup Şirketleri ({groupCompanies.length})
                  </Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                    Şirket Ekle
                  </Button>
                </Box>

                <Table
                  id="CompanyGroupTable"
                  rowId="Id"
                  headers={tableHeaders}
                  data={groupCompanies}
                  loading={isLoadingGroupCompanies}
                  hidePaging={true}
                  rowActions={[
                    {
                      Element: ({ row }) => (
                        <IconButton
                          color="error"
                          onClick={() => row && handleRemoveCompany(row.Id)}
                          title="Şirketi Kaldır">
                          <DeleteIcon />
                        </IconButton>
                      ),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </Grid>
        </>
      </Grid>

      {/* Şirket Ekleme Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Grup Şirketi Ekle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Form form={form} schema={schema} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              handleReset();
            }}>
            İptal
          </Button>
          <Button
            onClick={() => form.handleSubmit(handleFormSubmit)()}
            variant="contained"
            disabled={!form.formState.isValid}>
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyGroup;
