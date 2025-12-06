import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { ScoreReportsFilterForm } from '../score-reports.types';

// Validation schema for Score Reports filter form - matching legacy
const scoreReportsFilterSchema = yup.object({
  identifier: yup.string().default(''),
});

interface UseScoreReportsFilterFormProps {
  onFilterChange: (filters: Partial<ScoreReportsFilterForm>) => void;
}

/**
 * Hook for managing Score Reports filter form
 * Following OperationPricing and SupplierReports pattern
 * Exact match with legacy ScoreInvoiceTransferReport form behavior
 */
export const useScoreReportsFilterForm = ({ onFilterChange }: UseScoreReportsFilterFormProps) => {
  const form = useForm<ScoreReportsFilterForm>({
    resolver: yupResolver(scoreReportsFilterSchema),
    defaultValues: {
      identifier: '',
    },
    mode: 'onChange',
  });

  // Handle form submission - matching legacy search behavior
  const handleSearch = useCallback(
    (data: ScoreReportsFilterForm) => {
      onFilterChange(data);
    },
    [onFilterChange],
  );

  // Handle form clear - matching legacy clear behavior
  const handleClear = useCallback(() => {
    const defaultValues = { identifier: '' };
    form.reset(defaultValues);
    onFilterChange(defaultValues);
  }, [form, onFilterChange]);

  return {
    form,
    schema: scoreReportsFilterSchema,
    handleSearch,
    handleClear,
  };
};
