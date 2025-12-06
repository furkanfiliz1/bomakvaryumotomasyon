import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { PageHeader } from '@components';
import { useTtkLimitQueryForm } from '../hooks';
import TtkLimitQuerySummary from './TtkLimitQuerySummary';
import TtkLimitQueryForm from './TtkLimitQueryForm';
import TtkLimitQueryResults from './TtkLimitQueryResults';

const TtkLimitQueryPage: React.FC = () => {
  const { form, isSearching, queryResult, stats, tcknSnapshot, vknSnapshot, handleSubmit, handleReset, fetchStats } =
    useTtkLimitQueryForm();

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <>
      <PageHeader title="TTK Limit Sorgulama" subtitle="Taksitli Ticari Kredi limitlerini sorgulayabilirsiniz." />

      <Box mx={2}>
        {/* Stats Summary */}
        <TtkLimitQuerySummary stats={stats} />

        {/* Query Form */}
        <TtkLimitQueryForm form={form} onSubmit={handleSubmit} isSearching={isSearching} onReset={handleReset} />

        {/* Query Results */}
        {queryResult && (
          <TtkLimitQueryResults result={queryResult} tcknSnapshot={tcknSnapshot} vknSnapshot={vknSnapshot} />
        )}
      </Box>
    </>
  );
};

export default TtkLimitQueryPage;
