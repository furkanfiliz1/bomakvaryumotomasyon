import { PageHeader } from '@components';
import { Box } from '@mui/material';
import React from 'react';
import { useErrorListener } from 'src/hooks';
import {
  useBuyerLimitReportsDropdownData,
  useBuyerLimitReportsFilterForm,
  useLazyGetBuyerLimitReportsQuery,
} from '../hooks';
import { BuyerLimitReportsFilters, BuyerLimitReportsResults } from './';

export const BuyerLimitReportsPage: React.FC = () => {
  // Get dropdown data - simplified to remove selected bank tracking
  const { bankList, buyerList, bankListError, buyerListError, loadBuyersForBank } = useBuyerLimitReportsDropdownData();

  // API call for getting buyer limit report
  const [getBuyerLimitReports, { data, isLoading, error }] = useLazyGetBuyerLimitReportsQuery();

  // Initialize filter form using Form component pattern
  const { form, schema, handleSearch, handleReset, isValid } = useBuyerLimitReportsFilterForm({
    bankList,
    buyerList,
    onFilterChange: (filters) => {
      if (filters.financerIdentifier && filters.companyId) {
        getBuyerLimitReports({
          CompanyId: Number(filters.companyId),
          FinancerIdentifier: String(filters.financerIdentifier),
        });
      }
    },
    onBankChange: loadBuyersForBank, // Pass the loader function to handle bank changes
  });

  // Error handling for dropdown data and main query
  useErrorListener(bankListError as never);
  useErrorListener(buyerListError as never);
  useErrorListener(error);

  // Check if submit should be disabled - matching legacy button disabled logic
  const isSubmitDisabled = !isValid;

  return (
    <>
      <PageHeader title="Alıcı Limit Raporları" subtitle="Alıcı Limit Raporları" />

      <Box mx={2}>
        {/* Filter Form - now using Form component */}
        <BuyerLimitReportsFilters
          form={form}
          schema={schema}
          onSubmit={handleSearch}
          onReset={handleReset}
          isSubmitDisabled={isSubmitDisabled}
          isLoading={isLoading}
        />

        {/* Results Display */}
        <BuyerLimitReportsResults data={data || null} isLoading={isLoading} error={error} />
      </Box>
    </>
  );
};
