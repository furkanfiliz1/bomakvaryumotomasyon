import { Form, Icon, LoadingButton, useNotice } from '@components';
import { Alert, Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteUserMutation, useGetLanguagesQuery, useGetUserPositionsQuery } from '../companies.api';
import { useCompanyUserForm, usePasswordChangeRequest, usePasswordCreationRequest, useUserPermissions } from '../hooks';
import { CompanyUserNotifications, CompanyUserPermissions } from './';

interface CompanyUserDetailPageProps {
  companyIdentifier: string;
}

const CompanyUserDetailPage: React.FC<CompanyUserDetailPageProps> = ({ companyIdentifier }) => {
  const navigate = useNavigate();
  const notice = useNotice();
  const [savingPermissions, setSavingPermissions] = useState(false);

  // Get dropdown data
  const { data: userPositions = [] } = useGetUserPositionsQuery();
  const { data: languages = [] } = useGetLanguagesQuery({ IsActive: 'true' });

  // Use the form hook
  const { form, schema, handleSubmit, isEdit, userLoading, userError, updating, creating, companyId, userId } =
    useCompanyUserForm({ userPositions, languages });

  // Delete user mutation
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  // Password change request hook
  const { handlePasswordChangeRequest, isRequesting } = usePasswordChangeRequest({ userId, companyIdentifier });

  // Password creation request hook
  const { handlePasswordCreationRequest, isRequesting: isCreatingPassword } = usePasswordCreationRequest({
    userId,
    companyIdentifier,
  });

  // Use permissions hook - only for edit mode
  const {
    roles,
    loading: permissionsLoading,
    error: permissionsError,
    onAddAll,
    onRemoveAll,
    onChangeRole,
    savePermissions,
    hasChanges,
  } = useUserPermissions();

  // Handle permission save
  const handleSavePermissions = async () => {
    if (!hasChanges) return;

    setSavingPermissions(true);
    try {
      await savePermissions();
    } catch (error) {
      console.error('Failed to save permissions:', error);
    } finally {
      setSavingPermissions(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userId) return;

    try {
      await notice({
        type: 'confirm',
        variant: 'error',
        title: 'Kullanıcıyı Sil',
        message: 'Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
        buttonTitle: 'Sil',
        catchOnCancel: true,
      });

      await deleteUser({ userId: parseInt(userId) }).unwrap();

      // Show success notification
      await notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Kullanıcı başarıyla silindi.',
      });

      navigate(`/companies/${companyId}/kullanici`);
    } catch (error) {
      // User cancelled or API error occurred
      if (error !== undefined) {
        console.error('Failed to delete user:', error);
        // Show error notification for API errors
        await notice({
          variant: 'error',
          title: 'Hata',
          message: 'Kullanıcı silinirken bir hata oluştu. Lütfen tekrar deneyin.',
        });
      }
    }
  };

  if (userLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (userError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Kullanıcı bilgileri yüklenirken bir hata oluştu.
      </Alert>
    );
  }

  // Params kontrolü - breadcrumb hatası önleme
  if (!companyId || !userId) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Geçersiz URL parametreleri. Lütfen doğru sayfa linkini kullanın.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(45deg, #1976d2, #42a5f5)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Icon icon="user-01" size={32} color="white" />
            <Box>
              <Typography variant="h5" sx={{ color: 'white', mb: 0.5 }}>
                Mükellef Temsilci Bilgileri
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Kayıtlı mükelleflerin temel bilgilerini düzenleyebilirsiniz.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Form form={form} schema={schema} space={2} />

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {!isEdit ? (
                <LoadingButton
                  id="create-user"
                  type="submit"
                  variant="contained"
                  loading={creating}
                  sx={{ minWidth: 150 }}>
                  Bilgileri Kaydet
                </LoadingButton>
              ) : (
                <Box style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
                  <Box>
                    <LoadingButton
                      id="update-user"
                      type="submit"
                      variant="contained"
                      loading={updating}
                      sx={{ minWidth: 150 }}>
                      Bilgileri Güncelle
                    </LoadingButton>
                  </Box>

                  <Box display={'flex'} gap={1} flexWrap="wrap">
                    <LoadingButton
                      id="password-creation-request"
                      variant="contained"
                      color="primary"
                      loading={isCreatingPassword}
                      onClick={handlePasswordCreationRequest}
                      sx={{ minWidth: 150 }}>
                      Şifre Oluşturma Talebi
                    </LoadingButton>
                    <LoadingButton
                      id="password-change-request"
                      variant="contained"
                      color="primary"
                      loading={isRequesting}
                      onClick={handlePasswordChangeRequest}
                      sx={{ minWidth: 150 }}>
                      Şifre Değiştirme Talebi
                    </LoadingButton>
                    <LoadingButton
                      id="delete-user"
                      variant="outlined"
                      color="error"
                      loading={deleting}
                      onClick={handleDeleteUser}
                      sx={{ minWidth: 150 }}>
                      Kullanıcıyı Sil
                    </LoadingButton>
                  </Box>
                </Box>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* User Permissions - Only show in edit mode */}
      {isEdit && (
        <>
          <CompanyUserPermissions
            roles={roles}
            onAddAll={onAddAll}
            onRemoveAll={onRemoveAll}
            onChangeRole={onChangeRole}
            loading={permissionsLoading}
            error={permissionsError || undefined}
            handleSavePermissions={handleSavePermissions}
            savingPermissions={savingPermissions}
          />

          {/* Permission Save Button */}

          {/* User Notifications */}
          <CompanyUserNotifications />
        </>
      )}
    </Box>
  );
};

export default CompanyUserDetailPage;
