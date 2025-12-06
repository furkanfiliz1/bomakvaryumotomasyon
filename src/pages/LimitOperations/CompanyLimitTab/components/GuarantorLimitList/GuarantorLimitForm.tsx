/**
 * Guarantor Limit Form Component
 * Form component for adding new guarantor limits
 */

import { Form } from '@components';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { GuarantorLimitFormData, GuarantorLimitFormSchema } from '../../helpers';

interface GuarantorLimitFormProps {
  form: UseFormReturn<GuarantorLimitFormData>;
  schema: GuarantorLimitFormSchema;
  onSubmit: () => void;
  isLoading: boolean;
}

export const GuarantorLimitForm: React.FC<GuarantorLimitFormProps> = ({ form, schema, onSubmit, isLoading }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Form form={form} schema={schema} space={2} childCol={3}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'end',
          }}>
          <LoadingButton
            variant="contained"
            onClick={onSubmit}
            loading={isLoading}
            sx={{ width: '100px', height: '40px' }}>
            Limit Ekle
          </LoadingButton>
        </Box>
      </Form>
    </Box>
  );
};
