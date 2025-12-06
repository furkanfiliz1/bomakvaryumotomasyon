/**
 * İş Bankası Oranları (Is Bank Rates) Page Component
 * Matches legacy Rates.js exactly
 * Route: /tanimlamalar/oranlar
 */

import { PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Box } from '@mui/material';
import React from 'react';
import { useGetIsBankRatesListQuery } from '../is-bank-rates.api';
import { IsBankRatesForm } from './IsBankRatesForm';
import { IsBankRatesList } from './IsBankRatesList';

const IsBankRatesPage: React.FC = () => {
  const { data: rates = [], isLoading, error, refetch } = useGetIsBankRatesListQuery();

  // Handle errors with useErrorListener
  useErrorListener(error);

  const handleFormSuccess = () => {
    refetch();
  };

  return (
    <>
      <PageHeader title="İş Bankası Oranları" subtitle="İş Bankası oran tanımlamaları" />

      <Box mx={2}>
        {/* Create Form Section */}
        <IsBankRatesForm onSuccess={handleFormSuccess} />

        {/* List Section */}
        <IsBankRatesList items={rates} isLoading={isLoading} onRefresh={refetch} />
      </Box>
    </>
  );
};

export default IsBankRatesPage;
