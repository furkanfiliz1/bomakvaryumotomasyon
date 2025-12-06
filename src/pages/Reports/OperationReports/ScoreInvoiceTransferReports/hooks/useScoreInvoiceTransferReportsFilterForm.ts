import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { fields } from 'src/components/common/Form/schemas/_common';
import * as yup from 'yup';
import { DEFAULT_SCORE_INVOICE_TRANSFER_REPORTS_FILTERS } from '../constants';
import type {
  ScoreInvoiceTransferReportsFilterForm,
  ScoreInvoiceTransferReportsFilters,
} from '../score-invoice-transfer-reports.types';

interface UseScoreInvoiceTransferReportsFilterFormProps {
  onFilterChange: (filters: Partial<ScoreInvoiceTransferReportsFilters>) => void;
}

/**
 * Hook for Score Invoice Transfer Reports filter form management
 * Following legacy ScoreInvoiceTransferReport.js patterns exactly
 */
export const useScoreInvoiceTransferReportsFilterForm = ({
  onFilterChange,
}: UseScoreInvoiceTransferReportsFilterFormProps) => {
  // Form schema following legacy ScoreInvoiceTransferReport.js - single identifier field only
  const schema = useMemo(
    () =>
      yup.object({
        identifier: fields.text.optional().label('Tedarikçi VKN').meta({ col: 6 }),
      }) as yup.ObjectSchema<ScoreInvoiceTransferReportsFilterForm>,
    [],
  );

  // Form initialization with default values - matching legacy
  const form = useForm<ScoreInvoiceTransferReportsFilterForm>({
    resolver: yupResolver(schema),
    defaultValues: DEFAULT_SCORE_INVOICE_TRANSFER_REPORTS_FILTERS,
    mode: 'onChange',
  });

  // Handle search action - following legacy ScoreInvoiceTransferReport.js pattern
  const handleSearch = (data: ScoreInvoiceTransferReportsFilterForm) => {
    const filters: Partial<ScoreInvoiceTransferReportsFilters> = {
      identifier: data.identifier?.trim() || undefined,
      page: 1, // Reset to first page on new search
    };

    onFilterChange(filters);
  };

  // Handle reset action - following legacy pattern
  const handleReset = () => {
    form.reset(DEFAULT_SCORE_INVOICE_TRANSFER_REPORTS_FILTERS);
    onFilterChange({
      identifier: undefined,
      page: 1,
    });
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
  };
};
