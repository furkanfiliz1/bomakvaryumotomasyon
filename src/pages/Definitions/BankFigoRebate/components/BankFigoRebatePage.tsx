/**
 * Bank Figo Rebate Page Component
 * Matches legacy BankFigoRebate.js exactly
 * Route: /definitions/bank-figo-rebate
 */

import { PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Box } from '@mui/material';
import React from 'react';
import { useGetBankFigoRebatesQuery } from '../bank-figo-rebate.api';
import { BankFigoRebateForm } from './BankFigoRebateForm';
import { BankFigoRebateList } from './BankFigoRebateList';

const BankFigoRebatePage: React.FC = () => {
  const { data: rebates, isLoading, error, refetch } = useGetBankFigoRebatesQuery();

  // Handle errors with useErrorListener
  useErrorListener(error);

  const handleRefetch = () => {
    refetch();
  };

  return (
    <>
      <PageHeader title="Banka-Figo Rebate" subtitle="Banka Figo Rebate Tanımlamaları" />

      <Box mx={2}>
        {/* Create Form - matches legacy renderPost() */}
        <BankFigoRebateForm onSuccess={handleRefetch} />

        {/* List with inline edit - matches legacy renderList() */}
        <BankFigoRebateList rebates={rebates || []} isLoading={isLoading} onRefetch={handleRefetch} />
      </Box>
    </>
  );
};

export default BankFigoRebatePage;
