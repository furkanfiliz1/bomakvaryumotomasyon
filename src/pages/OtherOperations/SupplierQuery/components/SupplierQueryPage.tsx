import React from 'react';
import { Box } from '@mui/material';
import { PageHeader } from '@components';
import { useSupplierQueryForm } from '../hooks';
import SupplierQueryForm from './SupplierQueryForm';
import SupplierQueryResults from './SupplierQueryResults';

const SupplierQueryPage: React.FC = () => {
  const { form, schema, isSearching, queryResult, buyerCodeSnapshot, handleSubmit, handleReset } =
    useSupplierQueryForm();

  return (
    <>
      <PageHeader
        title="Alıcıya Tanımlı Tedarikçi Sorgusu"
        subtitle="Alıcı koduna göre tanımlı tedarikçi bilgilerini sorgulayın"
      />

      <Box mx={2}>
        <SupplierQueryForm
          form={form}
          schema={schema}
          onSubmit={handleSubmit}
          isSearching={isSearching}
          onReset={handleReset}
        />

        {queryResult && <SupplierQueryResults results={queryResult} buyerCode={buyerCodeSnapshot} />}
      </Box>
    </>
  );
};

export default SupplierQueryPage;
