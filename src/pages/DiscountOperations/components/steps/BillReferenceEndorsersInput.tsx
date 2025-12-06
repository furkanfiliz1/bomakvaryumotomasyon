import { Button } from '@components';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography, useTheme } from '@mui/material';
import React, { useCallback } from 'react';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import { CustomTextInput } from 'src/components/common/Form/_partials/components/CustomTextInput';
import { BillReferenceEndorser } from './single-cheque-form.types';

interface BillReferenceEndorsersInputProps {
  endorsers: BillReferenceEndorser[];
  onChange: (endorsers: BillReferenceEndorser[]) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Bill Reference Endorsers Input Component
 * Following OperationPricing patterns for dynamic array inputs
 * Manages multiple endorser entries with add/remove functionality
 *
 * Features:
 * - Add new endorser entries
 * - Remove individual endorsers (minimum 1 required)
 * - Individual validation for each endorser
 * - Follows Material-UI design patterns
 */
export const BillReferenceEndorsersInput: React.FC<BillReferenceEndorsersInputProps> = ({
  endorsers,
  onChange,
  error,
  disabled = false,
}) => {
  // Generate unique ID for new endorsers
  const generateId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);
  const theme = useTheme();

  // Add new endorser
  const handleAddEndorser = useCallback(() => {
    const newEndorser: BillReferenceEndorser = {
      id: generateId(),
      endorserName: '',
      endorserIdentifier: '',
    };
    onChange([...endorsers, newEndorser]);
  }, [endorsers, onChange, generateId]);

  // Remove endorser by index
  const handleRemoveEndorser = useCallback(
    (index: number) => {
      if (endorsers.length <= 1) return; // Minimum 1 endorser required
      const updatedEndorsers = endorsers.filter((_, i) => i !== index);
      onChange(updatedEndorsers);
    },
    [endorsers, onChange],
  );

  // Update endorser field
  const handleEndorserChange = useCallback(
    (index: number, field: keyof Omit<BillReferenceEndorser, 'id'>, value: string) => {
      const updatedEndorsers = endorsers.map((endorser, i) =>
        i === index ? { ...endorser, [field]: value } : endorser,
      );
      onChange(updatedEndorsers);
    },
    [endorsers, onChange],
  );

  return (
    <Box>
      <Grid container spacing={0}>
        {endorsers.map((endorser, index) => (
          <Grid item lg={4} key={endorser.id} sx={{ mb: 0 }}>
            <Box key={endorser.id} sx={{ mb: 1, display: 'flex', alignItems: 'flex-start', width: '100%', gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <CustomInputLabel label="Ara Ciranta VKN/TCKN" />
                <CustomTextInput
                  id={`endorser-identifier-${index}`}
                  value={endorser.endorserIdentifier}
                  onChange={(e) => handleEndorserChange(index, 'endorserIdentifier', e.target.value)}
                  disabled={disabled}
                  placeholder="VKN/TCKN giriniz"
                  inputProps={{ maxLength: 11 }}
                />
              </Box>
              <IconButton
                onClick={() => handleRemoveEndorser(index)}
                disabled={disabled || endorsers.length <= 1}
                size="small"
                sx={{
                  visibility: endorsers.length > 1 ? 'visible' : 'hidden',
                  mt: 4, // Align with input fields
                }}>
                <DeleteIcon fontSize="small" sx={{ color: theme.palette.error[700] }} />
              </IconButton>
            </Box>
          </Grid>
        ))}
        <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            id="addEndersor"
            sx={{ width: '24px', height: '24px', minWidth: '24px' }}
            variant="outlined"
            onClick={handleAddEndorser}
            disabled={disabled}
            size="small">
            <AddIcon sx={{ fontSize: '12px' }} />
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
