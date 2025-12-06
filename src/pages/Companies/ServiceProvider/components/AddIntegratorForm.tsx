import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardContent, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useLazyGetIntegratorTypeQuery, usePostIntegratorsCompanyMutation } from '../service-provider.api';
import type { IntegratorParametersForm, NestedIntegratorOption, NewIntegrator } from '../service-provider.types';

interface AddIntegratorFormProps {
  companyId: number;
  nestedIntegrators: NestedIntegratorOption[];
  onSuccess: () => void;
  onCancel: () => void;
}

const addIntegratorSchema = yup.object({
  selectedIntegratorId: yup.number().required('Servis sağlayıcı seçimi zorunludur'),
});

interface AddIntegratorFormData {
  selectedIntegratorId: number;
}

/**
 * Form component for adding new integrator to company
 * Matches legacy component's add integrator functionality
 */
export const AddIntegratorForm: React.FC<AddIntegratorFormProps> = ({
  companyId,
  nestedIntegrators,
  onSuccess,
  onCancel,
}) => {
  const [parameters, setParameters] = useState<IntegratorParametersForm>({});
  const [showParameters, setShowParameters] = useState(false);

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<AddIntegratorFormData>({
    resolver: yupResolver(addIntegratorSchema),
    defaultValues: {
      selectedIntegratorId: 0,
    },
  });

  const selectedIntegratorId = watch('selectedIntegratorId');

  const [getIntegratorType, { data: integratorKeys, isLoading: isLoadingKeys }] = useLazyGetIntegratorTypeQuery();
  const [postIntegrator, { isLoading: isCreating }] = usePostIntegratorsCompanyMutation();

  const handleContinue = async () => {
    if (selectedIntegratorId && selectedIntegratorId !== 0) {
      try {
        await getIntegratorType(selectedIntegratorId).unwrap();
        setShowParameters(true);
      } catch (error) {
        console.error('Failed to get integrator type:', error);
      }
    }
  };

  const handleParameterChange = (key: string, value: string) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateIntegrator = async () => {
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
    } catch (error) {
      console.error('Failed to create integrator:', error);
    }
  };

  const handleCancel = () => {
    setShowParameters(false);
    setParameters({});
    onCancel();
  };

  if (isLoadingKeys) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Yeni Servis Sağlayıcı Ekle
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
                  disabled={showParameters}>
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

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" height="100%">
              <Button
                variant={showParameters ? 'outlined' : 'contained'}
                color={showParameters ? 'secondary' : 'primary'}
                onClick={showParameters ? handleCancel : handleContinue}
                disabled={!selectedIntegratorId || selectedIntegratorId === 0}
                fullWidth>
                {showParameters ? 'İptal' : 'Devam Et'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {showParameters && integratorKeys?.Keys && (
          <>
            <Box mt={3} mb={2}>
              <Typography variant="subtitle1" color="primary">
                Parametre Bilgileri
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {integratorKeys.Keys.map((keyItem) => {
                const paramKey = keyItem.SubKey ? `${keyItem.Key}--${keyItem.SubKey}` : keyItem.Key;

                return (
                  <Grid item xs={12} md={6} key={paramKey}>
                    <TextField
                      fullWidth
                      label={keyItem.SubKey ? `${keyItem.Description} (${keyItem.SubKey})` : keyItem.Description}
                      value={parameters[paramKey] || ''}
                      onChange={(e) => handleParameterChange(paramKey, e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                );
              })}

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  <Button variant="outlined" onClick={handleCancel} disabled={isCreating}>
                    İptal
                  </Button>
                  <Button variant="contained" onClick={handleCreateIntegrator} disabled={isCreating}>
                    {isCreating ? <CircularProgress size={20} /> : 'Kaydet'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};
