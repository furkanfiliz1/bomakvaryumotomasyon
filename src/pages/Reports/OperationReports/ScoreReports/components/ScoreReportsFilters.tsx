import { Form } from '@components';
import { Refresh, Search } from '@mui/icons-material';
import { Box, Button, Paper } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SchemaField } from 'src/components/common/Form/enums';
import { fields } from 'src/components/common/Form/schemas/_common';
import * as yup from 'yup';

// Form schema matching legacy ScoreInvoiceTransferReport
const scoreReportsFiltersSchema = yup.object({
  identifier: fields.text.optional().label('Tedarikçi Kimlik Numarası').meta({
    col: 12,
    field: SchemaField.InputText,
    placeholder: 'Tedarikçi kimlik numarası giriniz...',
  }),
});

export interface ScoreReportsFiltersForm {
  identifier: string;
}

interface ScoreReportsFiltersProps {
  form: UseFormReturn<ScoreReportsFiltersForm>;
  onSubmit: (data: ScoreReportsFiltersForm) => void;
  isLoading?: boolean;
}

export const ScoreReportsFilters: React.FC<ScoreReportsFiltersProps> = ({ form, onSubmit, isLoading = false }) => {
  const handleReset = () => {
    form.reset({ identifier: '' });
    onSubmit({ identifier: '' });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form form={form} schema={scoreReportsFiltersSchema} space={2} childCol={12} />

        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button type="button" variant="outlined" startIcon={<Refresh />} onClick={handleReset} disabled={isLoading}>
            Temizle
          </Button>
          <Button type="submit" variant="contained" startIcon={<Search />} disabled={isLoading}>
            {isLoading ? 'Aranıyor...' : 'Uygula'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
