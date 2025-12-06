import { Icon, useNotice } from '@components';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCompanyRoleMutation, useDeleteCompanyRoleMutation, useGetCompanyRolesQuery } from '../companies.api';
import { CompanyRole } from '../companies.types';

interface CompanyRolesProps {
  companyId: number;
}

const CompanyRoles: React.FC<CompanyRolesProps> = ({ companyId }) => {
  const navigate = useNavigate();
  const notice = useNotice();
  const {
    data: roles,
    isLoading,
    error,
    refetch,
  } = useGetCompanyRolesQuery(
    { companyId },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [deleteCompanyRole] = useDeleteCompanyRoleMutation();
  const [createCompanyRole] = useCreateCompanyRoleMutation();

  // State for add role popup
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [roleName, setRoleName] = useState('');

  const handleEditRole = (roleId: number) => {
    navigate(`/companies/${companyId}/roller/${roleId}`);
  };

  const handleAddNewRole = () => {
    setIsAddRoleDialogOpen(true);
  };

  const handleDeleteRole = async (roleId: number, roleName: string) => {
    try {
      await notice({
        type: 'confirm',
        variant: 'error',
        title: 'Rol Sil',
        message: `"${roleName}" rolünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
        buttonTitle: 'Sil',
        catchOnCancel: true,
      });

      await deleteCompanyRole({
        companyId,
        roleId,
      }).unwrap();

      // Refetch the roles to update the list
      await refetch();
    } catch (error) {
      // User cancelled or API error occurred
      if (error !== undefined) {
        console.error('Delete role failed:', error);
      }
    }
  };

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      return;
    }

    try {
      const response = await createCompanyRole({
        companyId,
        data: {
          CompanyId: companyId,
          Name: roleName.trim(),
        },
      }).unwrap();

      // Close dialog and reset form
      setIsAddRoleDialogOpen(false);
      setRoleName('');

      // Show success notification
      notice({
        type: 'dialog',
        variant: 'success',
        title: 'Başarılı',
        message: `"${roleName.trim()}" rolü başarıyla eklendi.`,
      });

      // Navigate to the newly created role's detail page
      if (response.Id) {
        refetch();
      }
    } catch (error) {
      console.error('Create role failed:', error);
    }
  };

  const handleCloseDialog = () => {
    setIsAddRoleDialogOpen(false);
    setRoleName('');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Roller yüklenirken bir hata oluştu.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with Add New Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" gutterBottom>
          Şirket Rolleri {roles && `(${roles.length})`}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Icon icon="plus" size={20} />}
          onClick={handleAddNewRole}
          sx={{ minWidth: 140 }}>
          Yeni Ekle
        </Button>
      </Box>

      {/* Roles Content */}
      {!roles || roles.length === 0 ? (
        <Card>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              py={4}
              sx={{
                border: '2px dashed',
                borderColor: 'warning.main',
                borderRadius: 2,
                backgroundColor: 'warning.50',
              }}>
              <Icon icon="info-circle" size={48} color="warning" />
              <Typography variant="h6" color="warning.main" mt={2}>
                Rol bulunamadı
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Bu şirkete ait henüz rol oluşturulmamış.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {roles.map((role: CompanyRole) => (
            <Grid item xs={12} key={role.Id}>
              <Card
                elevation={2}
                sx={{
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-1px)',
                  },
                }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box flex={1}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'primary.main',
                        }}>
                        {role.Name}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Chip label="Genel Rol" size="small" color={'default'} variant="outlined" />
                      </Box>

                      {role.Description && (
                        <Typography variant="body2" color="textSecondary" mt={1}>
                          {role.Description}
                        </Typography>
                      )}
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton onClick={() => handleEditRole(role.Id)} color="primary" size="small" title="Düzenle">
                        <Icon icon="edit-02" size={20} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteRole(role.Id, role.Name)}
                        color="error"
                        size="small"
                        title="Sil">
                        <Icon icon="trash-02" size={20} />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Rol Ekle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rol Adı"
            fullWidth
            variant="outlined"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateRole();
              }
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            İptal
          </Button>
          <Button onClick={handleCreateRole} variant="contained" color="primary" disabled={!roleName.trim()}>
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyRoles;
