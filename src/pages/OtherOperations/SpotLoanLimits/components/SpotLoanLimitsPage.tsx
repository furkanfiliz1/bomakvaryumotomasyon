import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { PageHeader } from '@components';
import { useSpotLoanLimitsForm } from '../hooks';
import SpotLoanLimitsSummary from './SpotLoanLimitsSummary';
import SpotLoanLimitsForm from './SpotLoanLimitsForm';
import SpotLoanLimitsResults from './SpotLoanLimitsResults';

const SpotLoanLimitsPage: React.FC = () => {
  const {
    form,
    schema,
    isSearching,
    queryResult,
    stats,
    tcknSnapshot,
    vknSnapshot,
    handleSubmit,
    handleReset,
    fetchStats,
  } = useSpotLoanLimitsForm();

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <>
      <PageHeader
        title="Faturalı Spot Kredi Limit Sorgulama"
        subtitle="Faturalı spot kredi limitlerini sorgulayabilirsiniz."
      />

      <Box mx={2}>
        {/* Stats Summary */}
        <SpotLoanLimitsSummary stats={stats} />

        {/* Query Form */}
        <SpotLoanLimitsForm
          form={form}
          schema={schema}
          onSubmit={handleSubmit}
          isSearching={isSearching}
          onReset={handleReset}
        />

        {/* Query Results */}
        {queryResult && (
          <SpotLoanLimitsResults result={queryResult} tcknSnapshot={tcknSnapshot} vknSnapshot={vknSnapshot} />
        )}
      </Box>
    </>
  );
};

export default SpotLoanLimitsPage;
