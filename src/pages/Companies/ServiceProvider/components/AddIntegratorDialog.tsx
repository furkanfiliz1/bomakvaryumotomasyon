import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useLazyGetIntegratorTypeQuery, usePostIntegratorsCompanyMutation } from '../service-provider.api';
import type {
  IntegratorKey,
  IntegratorParametersForm,
  NestedIntegratorOption,
  NewIntegrator,
} from '../service-provider.types';

interface AddIntegratorDialogProps {
  companyId: number;
  nestedIntegrators: NestedIntegratorOption[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const addIntegratorSchema = yup.object({
  selectedIntegratorId: yup
    .number()
    .required('Servis sağlayıcı seçimi zorunludur')
    .min(1, 'Servis sağlayıcı seçimi zorunludur'),
});

interface AddIntegratorFormData {
  selectedIntegratorId: number;
}

/**
 * Dialog component for adding new integrator to company
 * Similar to EditIntegratorDialog but for creating new integrators
 */
export const AddIntegratorDialog: React.FC<AddIntegratorDialogProps> = ({
  companyId,
  nestedIntegrators,
  open,
  onClose,
  onSuccess,
}) => {
  const [parameters, setParameters] = useState<IntegratorParametersForm>({});
  const [integratorKeys, setIntegratorKeys] = useState<IntegratorKey[]>([]);
  const [showParameters, setShowParameters] = useState(false);

  const {
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddIntegratorFormData>({
    resolver: yupResolver(addIntegratorSchema),
    defaultValues: {
      selectedIntegratorId: 0,
    },
  });

  const selectedIntegratorId = watch('selectedIntegratorId');

  const [getIntegratorType, { isLoading: isLoadingKeys }] = useLazyGetIntegratorTypeQuery();
  const [postIntegrator, { isLoading: isCreating, error: createError }] = usePostIntegratorsCompanyMutation();

  useErrorListener(createError);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
      setParameters({});
      setIntegratorKeys([]);
      setShowParameters(false);
    }
  }, [open, reset]);

  const handleContinue = async () => {
    if (selectedIntegratorId && selectedIntegratorId !== 0) {
      try {
        const response = await getIntegratorType(selectedIntegratorId).unwrap();

        // Handle both possible response structures
        const keys = response?.Keys || [];
        setIntegratorKeys(keys);
        setShowParameters(true);
      } catch (error) {
        console.error('Failed to get integrator type:', error);
        // Still show parameters section even if API fails, with empty keys
        setIntegratorKeys([]);
        setShowParameters(true);
      }
    }
  };

  const handleParameterChange = (key: string, value: string) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const parameterArray = Object.entries(parameters).map(([key, value]) => {
        let name: string;
        let subKey: string | null = null;

        if (key.indexOf('--') < 0) {
          name = key;
        } else {
          name = key.split('--')[0];
          subKey = key.split('--')[1];
        }

        return {
          Key: name,
          SubKey: subKey,
          Value: value,
        };
      });

      const newIntegrator: NewIntegrator = {
        CompanyId: companyId,
        IntegratorId: selectedIntegratorId,
        IsActive: true,
        Parameters: parameterArray,
      };

      await postIntegrator(newIntegrator).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create integrator:', error);
    }
  };

  const handleBack = () => {
    setShowParameters(false);
    setParameters({});
    setIntegratorKeys([]);
  };

  const isLoading = isLoadingKeys || isCreating;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{showParameters ? 'Parametre Bilgileri' : 'Yeni Servis Sağlayıcı Ekle'}</Typography>
      </DialogTitle>

      <DialogContent>
        {!showParameters ? (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="selectedIntegratorId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Servis Sağlayıcı"
                    error={!!errors.selectedIntegratorId}
                    helperText={errors.selectedIntegratorId?.message}
                    value={field.value || ''}
                    disabled={isLoading}>
                    <MenuItem value={0}>Seçiniz</MenuItem>
                    {nestedIntegrators.map((option) => (
                      <MenuItem key={option.Id} value={option.Id}>
                        {option.Name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {integratorKeys.map((keyItem) => {
              const paramKey = keyItem.SubKey ? `${keyItem.Key}--${keyItem.SubKey}` : keyItem.Key;

              return (
                <Grid item xs={12} md={6} key={paramKey}>
                  <TextField
                    fullWidth
                    label={keyItem.SubKey ? `${keyItem.Description} (${keyItem.SubKey})` : keyItem.Description}
                    value={parameters[paramKey] || ''}
                    onChange={(e) => handleParameterChange(paramKey, e.target.value)}
                    variant="outlined"
                    type={keyItem.Key.toLowerCase() === 'password' || keyItem.DataType === 2 ? 'password' : 'text'}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          İptal
        </Button>

        {showParameters && (
          <Button onClick={handleBack} disabled={isLoading}>
            Geri
          </Button>
        )}

        {!showParameters ? (
          <Button
            onClick={handleContinue}
            variant="contained"
            disabled={!selectedIntegratorId || selectedIntegratorId === 0 || isLoading}>
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Yükleniyor...
              </>
            ) : (
              'Devam Et'
            )}
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Kaydediliyor...
              </>
            ) : (
              'Kaydet'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
