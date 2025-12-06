import { Icon, LoadingButton } from '@components';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from '@mui/material';
import React from 'react';
import { CompanyRole } from '../companies.types';

interface CompanyUserPermissionsProps {
  roles: CompanyRole[];
  onAddAll: () => void;
  onRemoveAll: () => void;
  onChangeRole: (roleId: number, checked: boolean) => void;
  loading?: boolean;
  error?: string;
  handleSavePermissions: () => Promise<void>;
  savingPermissions: boolean;
}

const CompanyUserPermissions: React.FC<CompanyUserPermissionsProps> = ({
  roles,
  onAddAll,
  onRemoveAll,
  onChangeRole,
  loading = false,
  error,
  handleSavePermissions,
  savingPermissions,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ mt: 3 }}>
      {/* Header */}
      <Card
        sx={{
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          color: 'white',
          borderRadius: '4px 4px 0 0',
        }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Icon icon="lock-01" size={32} color="white" />
            <Box>
              <Typography variant="h5" sx={{ color: 'white', mb: 0.5 }}>
                Yetkiler
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Kullanıcının erişebileceği sistem yetkilerini belirleyebilirsiniz.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Content */}
      <CardContent sx={{ p: 4 }}>
        {/* Action Buttons */}
        <Box sx={{ mb: 4 }}>
          <Button variant="outlined" onClick={onAddAll} sx={{ mr: 2 }}>
            Tümünü Aç
          </Button>
          <Button variant="outlined" onClick={onRemoveAll}>
            Tümünü Kapat
          </Button>
        </Box>

        {/* Roles Grid */}
        <Grid container spacing={2}>
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={4} key={role.Id}>
              <Box
                sx={{
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.selected || false}
                      onChange={(e) => onChangeRole(role.Id, e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {role.Name}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    width: '100%',
                    m: 0,
                    alignItems: 'center',
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            id="save-permissions"
            variant="contained"
            color="primary"
            loading={savingPermissions}
            onClick={handleSavePermissions}
            sx={{ minWidth: 150 }}>
            Güncelle
          </LoadingButton>
        </Box>

        {roles.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
            color="text.secondary">
            <Icon icon="shield-off" size={48} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Yetki Bulunamadı
            </Typography>
            <Typography variant="body2">Bu şirket için tanımlanmış yetki bulunmamaktadır.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyUserPermissions;
