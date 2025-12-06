import { useNotice } from '@components';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Box, Button, Chip, Collapse, Divider, Grid, IconButton, Paper, Switch, Typography } from '@mui/material';
import React from 'react';
import { getIntegratorTypeLabel } from '../helpers/service-provider.helpers';
import { useDeleteIntegratorMutation, usePutCompanyStatusUpdateMutation } from '../service-provider.api';
import type { CompanyIntegrator } from '../service-provider.types';

interface IntegratorDetailsRowProps {
  integrator: CompanyIntegrator;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onEdit: (integrator: CompanyIntegrator) => void;
  onSuccess: () => void;
}

/**
 * Individual integrator row component with expandable details
 * Matches legacy renderIntegrators method functionality
 */
export const IntegratorDetailsRow: React.FC<IntegratorDetailsRowProps> = ({
  integrator,
  isExpanded,
  onToggleExpand,
  onEdit,
  onSuccess,
}) => {
  const notice = useNotice();
  const [updateStatus, { isLoading: isUpdatingStatus }] = usePutCompanyStatusUpdateMutation();
  const [deleteIntegrator, { isLoading: isDeleting }] = useDeleteIntegratorMutation();

  const handleStatusChange = async () => {
    try {
      await updateStatus({
        Id: integrator.Id,
        IsActive: integrator.IsActive ? 0 : 1,
        CompanyId: integrator.CompanyId,
      }).unwrap();
      onSuccess();
      notice({
        variant: 'success',
        title: 'Durum Güncellendi',
        message: `Entegratör ${integrator.IsActive ? 'Pasif' : 'Aktif'} duruma getirildi.`,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = () => {
    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Entegratör Sil',
      message: 'Bu entegratörü silmek istediğinizden emin misiniz?',
      buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
      onClick: executeDelete,
      catchOnCancel: true,
    });
  };

  const executeDelete = async () => {
    try {
      await deleteIntegrator(integrator.Id).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to delete integrator:', error);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}>
      {/* Main row content */}
      <Box p={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={1}>
            <IconButton onClick={() => onToggleExpand(integrator.Id)} size="small">
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="body2" color="textSecondary">
              İsim
            </Typography>
            <Typography variant="body1">{integrator.Name}</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="body2" color="textSecondary">
              Durum
            </Typography>
            <Chip
              label={integrator.IsActive ? 'Aktif' : 'Pasif'}
              color={integrator.IsActive ? 'success' : 'error'}
              size="small"
            />
          </Grid>

          <Grid item xs={2}>
            <Typography variant="body2" color="textSecondary">
              Tür
            </Typography>
            <Typography variant="body1">{getIntegratorTypeLabel(integrator.Type)}</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="body2" color="textSecondary">
              Aktif/Pasif
            </Typography>
            <Switch checked={integrator.IsActive} onChange={handleStatusChange} disabled={isUpdatingStatus} />
          </Grid>

          <Grid item xs={3}>
            <Box display="flex" gap={1}>
              <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => onEdit(integrator)}>
                Düzenle
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={isDeleting}>
                Sil
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Expanded details */}
      <Collapse in={isExpanded}>
        <Divider />
        <Box p={2} bgcolor="grey.50">
          <Typography variant="subtitle2" gutterBottom>
            Parametre Detayları
          </Typography>
          <Grid container spacing={2}>
            {integrator.CompanyIntegratorParams?.map((param, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Typography variant="body2" color="textSecondary" component="div">
                  {param.Description}
                  {param.SubKey && ` (${param.SubKey})`}
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    wordBreak: 'break-word',
                    fontSize: '0.875rem',
                    bgcolor: 'background.paper',
                    p: 1,
                    borderRadius: 1,
                    mt: 0.5,
                  }}>
                  {param.Value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};
