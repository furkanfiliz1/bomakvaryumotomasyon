import { Box, Button, Card } from '@mui/material';
import { forwardRef, useImperativeHandle } from 'react';

import { Form } from '@components';
import { Clear, Download, Search } from '@mui/icons-material';
import { useReceivableReportFilterForm } from '../hooks';
import { ReceivableReportFilterProps, ReceivableReportFiltersRef } from '../receivable-report.types';

export const ReceivableReportFilters = forwardRef<ReceivableReportFiltersRef, ReceivableReportFilterProps>(
  ({ onFilterChange, onExport, buyerList = [], currencyList = [], isLoading = false }, ref) => {
    const { form, schema, resetForm, getFormValues, handleSearch } = useReceivableReportFilterForm({
      buyerList,
      currencyList,
      onFilterChange,
    });

    const handleReset = () => {
      resetForm();
    };

    useImperativeHandle(ref, () => ({
      reset: handleReset,
      getValues: getFormValues,
    }));

    return (
      <Card sx={{ mb: 2, p: 2 }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form form={form as any} schema={schema as any} space={1} childCol={3} />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" onClick={handleReset} disabled={isLoading} startIcon={<Clear />}>
            Temizle
          </Button>
          <Button variant="contained" onClick={handleSearch} disabled={isLoading} startIcon={<Search />}>
            Uygula
          </Button>
          <Button variant="contained" onClick={onExport} disabled={isLoading} startIcon={<Download />}>
            Excel
          </Button>
        </Box>
      </Card>
    );
  },
);

ReceivableReportFilters.displayName = 'ReceivableReportFilters';

export default ReceivableReportFilters;
