import { Form } from '@components';
import { Add, Clear, Search } from '@mui/icons-material';
import { Box, Button, Card, Stack } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AnyObject, ObjectSchema } from 'yup';
import { OperationChargeFiltersFormData } from '../hooks/useOperationChargeFilters';

interface OperationChargeFiltersProps {
  form: UseFormReturn<OperationChargeFiltersFormData>;
  schema: ObjectSchema<OperationChargeFiltersFormData, AnyObject>;
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

/**
 * Filter form component matching legacy OperationChargeList.js filter structure exactly
 * Uses Form component with schema-based approach following project patterns
 */
const OperationChargeFilters: React.FC<OperationChargeFiltersProps> = ({
  form,
  schema,
  onApply,
  onReset,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Form form={form} schema={schema}>
        <Stack direction="row" justifyContent="space-between" spacing={1} mt={1}>
          <Button
            variant="outlined"
            onClick={() => navigate('/pricing/islem-basi-ucretlendirme/yeni')}
            id="add"
            startIcon={<Add />}>
            Ücretlendirme Ekle
          </Button>
          <Box>
            <Button variant="outlined" onClick={onReset} disabled={isLoading} startIcon={<Clear />}>
              Temizle
            </Button>
            <Button variant="contained" onClick={onApply} disabled={isLoading} startIcon={<Search />} sx={{ ml: 1 }}>
              Uygula
            </Button>
          </Box>
        </Stack>
      </Form>
    </Card>
  );
};

export default OperationChargeFilters;
