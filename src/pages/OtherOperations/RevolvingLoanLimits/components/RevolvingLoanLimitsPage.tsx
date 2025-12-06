import React from 'react';
import { Box } from '@mui/material';
import { PageHeader } from '@components';
import { useRevolvingLoanLimitsForm } from '../hooks';
import RevolvingLoanLimitsForm from './RevolvingLoanLimitsForm';
import RevolvingLoanLimitsResults from './RevolvingLoanLimitsResults';

const RevolvingLoanLimitsPage: React.FC = () => {
  const { form, schema, isSearching, queryResult, identifierSnapshot, handleSubmit, handleReset } =
    useRevolvingLoanLimitsForm();

  return (
    <>
      <PageHeader
        title="Faturalı Rotatif Kredi Limit Sorgulama"
        subtitle="Müşteri rotatif kredi limit bilgilerini sorgulayın"
      />

      <Box mx={2}>
        <RevolvingLoanLimitsForm
          form={form}
          schema={schema}
          onSubmit={handleSubmit}
          isSearching={isSearching}
          onReset={handleReset}
        />

        {queryResult && <RevolvingLoanLimitsResults results={queryResult} searchedIdentifier={identifierSnapshot} />}
      </Box>
    </>
  );
};

export default RevolvingLoanLimitsPage;
