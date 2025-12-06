import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { usePutIntegratorsCompanyMutation } from '../service-provider.api';
import type { CompanyIntegrator, CompanyIntegratorParam, UpdateIntegratorRequest } from '../service-provider.types';

interface EditIntegratorDialogProps {
  integrator: CompanyIntegrator;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Dialog for editing existing integrator parameters
 * Matches legacy renderUpdateIntegrator modal functionality
 */
export const EditIntegratorDialog: React.FC<EditIntegratorDialogProps> = ({ integrator, open, onClose, onSuccess }) => {
  const [editData, setEditData] = useState<CompanyIntegrator>(integrator);
  const [updateIntegrator, { isLoading, error: updateError }] = usePutIntegratorsCompanyMutation();
  const notice = useNotice();

  useErrorListener(updateError);

  // Update internal state when integrator prop changes
  useEffect(() => {
    setEditData(integrator);
  }, [integrator]);

  const handleParameterChange = (index: number, field: keyof CompanyIntegratorParam, value: string) => {
    setEditData((prev) => ({
      ...prev,
      CompanyIntegratorParams: prev.CompanyIntegratorParams.map((param, i) =>
        i === index ? { ...param, [field]: value } : param,
      ),
    }));
  };

  const handleActiveChange = (isActive: boolean) => {
    setEditData((prev) => ({
      ...prev,
      IsActive: isActive,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updateRequest: UpdateIntegratorRequest = {
        CompanyIntegratorId: editData.Id,
        CompanyId: editData.CompanyId,
        IntegratorId: editData.IntegratorId,
        IsActive: editData.IsActive ? 1 : 0,
        Parameters: editData.CompanyIntegratorParams.map((param) => ({
          Key: param.Key,
          SubKey: param.SubKey || null,
          Value: param.Value,
        })),
      };

      await updateIntegrator({
        data: updateRequest,
        id: editData.Id,
      }).unwrap();

      onSuccess();
      onClose();

      notice({
        variant: 'success',
        title: 'Entegratör Güncellendi',
        message: 'Entegratör başarıyla güncellendi.',
      });
    } catch (error) {
      console.error('Failed to update integrator:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' },
      }}>
      <DialogTitle>
        <Typography variant="h6">Entegratör Düzenle: {integrator.Name}</Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {editData.CompanyIntegratorParams?.map((param, index) => (
            <Grid item xs={12} md={6} key={index}>
              <TextField
                fullWidth
                label={param.SubKey ? `${param.Description} (${param.SubKey})` : param.Description}
                value={param.Value || ''}
                onChange={(e) => handleParameterChange(index, 'Value', e.target.value)}
                variant="outlined"
                multiline={!!(param.Value && param.Value.length > 50)}
                rows={param.Value && param.Value.length > 50 ? 3 : 1}
              />
            </Grid>
          ))}

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={<Switch checked={editData.IsActive} onChange={(e) => handleActiveChange(e.target.checked)} />}
              label="Aktif"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          İptal
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Güncelleniyor...
            </>
          ) : (
            'Güncelle'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
