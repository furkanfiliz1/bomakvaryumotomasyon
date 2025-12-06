/**
 * Non-Guarantor Limit Form Component
 * Form for adding new non-guarantor limits
 * Matches legacy form structure exactly
 */

import { Form } from '@components';
import { GetApp } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ObjectSchema } from 'yup';
import type { NonGuarantorLimitFormData } from '../../helpers';

interface NonGuarantorLimitFormProps {
  form: UseFormReturn<NonGuarantorLimitFormData>;
  schema: ObjectSchema<NonGuarantorLimitFormData>;
  onSubmit: () => void;
  onGetFinancersLimit: () => void;
  isLoading: boolean;
}

/**
 * Non-Guarantor Limit Form Component
 */
export const NonGuarantorLimitForm: React.FC<NonGuarantorLimitFormProps> = ({
  form,
  schema,
  onSubmit,
  onGetFinancersLimit,
  isLoading,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Form form={form} schema={schema} space={2} childCol={5}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'end',
          }}>
          <LoadingButton variant="contained" onClick={onSubmit} loading={isLoading} sx={{ width: 'fit-content' }}>
            Limit Ekle
          </LoadingButton>

          <Button
            variant="outlined"
            onClick={onGetFinancersLimit}
            disabled={isLoading}
            startIcon={<GetApp />}
            sx={{ ml: 1, width: 'fit-content' }}>
            Limitleri Otomatik Getir
          </Button>
        </Box>
      </Form>
    </Box>
  );
};
