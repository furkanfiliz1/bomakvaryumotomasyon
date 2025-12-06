import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import type { BillReferenceEndorser, CheckEditFormData } from '../helpers/check-edit-form.schema';

/**
 * Component for managing dynamic list of bill reference endorsers (Ara Ciranta VKN/TCKN)
 * Following OperationPricing patterns for dynamic form arrays
 */
export const BillReferenceEndorserList: React.FC = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CheckEditFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'billReferenceEndorsersList',
  });

  const handleAdd = () => {
    const newEndorser: BillReferenceEndorser = {
      id: `endorser-${Date.now()}`,
      endorserIdentifier: '',
    };
    append(newEndorser);
  };

  const handleRemove = (index: number) => {
    // Keep at least one field
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Ara Ciranta Bilgileri
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field, index) => {
          const fieldError = errors.billReferenceEndorsersList?.[index]?.endorserIdentifier;

          return (
            <Grid item lg={4} key={field.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CustomInputLabel label="Ara Ciranta VKN/TCKN"></CustomInputLabel>
                <TextField
                  {...register(`billReferenceEndorsersList.${index}.endorserIdentifier` as const)}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                  error={!!fieldError}
                  helperText={fieldError?.message}
                  inputProps={{
                    maxLength: 11,
                  }}
                />
              </Box>

              {fields.length > 1 && (
                <IconButton onClick={() => handleRemove(index)} color="error" size="small" sx={{ ml: 1 }}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Grid>
          );
        })}
      </Grid>

      <Button startIcon={<AddIcon />} onClick={handleAdd} variant="outlined" size="small" sx={{ mt: 1 }}>
        Ara Ciranta Ekle
      </Button>
    </Box>
  );
};
