import React from 'react';
import { Box, TextField, Grid, Typography } from '@mui/material';
import type { IntegratorKey, IntegratorParametersForm as IIntegratorParametersForm } from '../service-provider.types';

interface IntegratorParametersFormProps {
  keys: IntegratorKey[];
  parameters: IIntegratorParametersForm;
  onChange: (key: string, value: string) => void;
}

/**
 * Form component for integrator parameters
 * Extracted from legacy renderAddParametres method
 */
export const IntegratorParametersForm: React.FC<IntegratorParametersFormProps> = ({ keys, parameters, onChange }) => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom color="primary">
        Parametre Bilgileri
      </Typography>

      <Grid container spacing={2}>
        {keys.map((keyItem) => {
          const paramKey = keyItem.SubKey ? `${keyItem.Key}--${keyItem.SubKey}` : keyItem.Key;

          return (
            <Grid item xs={12} md={6} key={paramKey}>
              <TextField
                fullWidth
                label={keyItem.SubKey ? `${keyItem.Description} (${keyItem.SubKey})` : keyItem.Description}
                value={parameters[paramKey] || ''}
                onChange={(e) => onChange(paramKey, e.target.value)}
                variant="outlined"
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
