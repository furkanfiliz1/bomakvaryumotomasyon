import { Form } from '@components';
import { Clear, Search } from '@mui/icons-material';
import { Button, Card, Stack } from '@mui/material';
import React from 'react';
import type {
  EusFormulaType,
  EusStatusType,
  EusTrackingFilterChangeHandler,
  MonthYearOption,
} from '../eus-tracking-reports.types';
import { useEusTrackingFilterForm } from '../hooks/useEusTrackingFilterForm';

/**
 * EUS Tracking Filters Component
 * Following BuyerLimitReports and other Form component patterns exactly
 */

interface EusTrackingFiltersProps {
  eusFormulaTypes: EusFormulaType[];
  eusStatusTypes: EusStatusType[];
  monthOptions: MonthYearOption[];
  yearOptions: MonthYearOption[];
  onFilterChange: EusTrackingFilterChangeHandler;
  isLoading?: boolean;
}

export const EusTrackingFilters: React.FC<EusTrackingFiltersProps> = ({
  eusFormulaTypes,
  eusStatusTypes,
  monthOptions,
  yearOptions,
  onFilterChange,
  isLoading = false,
}) => {
  const { form, schema, handleSearch, handleReset } = useEusTrackingFilterForm({
    eusFormulaTypes,
    eusStatusTypes,
    monthOptions,
    yearOptions,
    onFilterChange,
  });

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      {/* Form Component with Schema - following BuyerLimitReports pattern */}
      <Form form={form} schema={schema} />
      {/* Action Buttons - matching established button layout */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
        <Button variant="outlined" onClick={handleReset} disabled={isLoading} startIcon={<Clear />}>
          Temizle
        </Button>
        <Button variant="contained" onClick={handleSearch} disabled={isLoading} startIcon={<Search />}>
          Uygula
        </Button>
      </Stack>
    </Card>
  );
};
