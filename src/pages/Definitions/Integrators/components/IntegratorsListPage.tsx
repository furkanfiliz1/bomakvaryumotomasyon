/**
 * Integrators List Page
 * Displays all integrators with nested accordion structure
 */

import { PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Stack } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sortIntegratorsByName } from '../helpers';
import { useGetNestedIntegratorsQuery } from '../integrators.api';
import IntegratorsTable from './IntegratorsTable';

const IntegratorsListPage: React.FC = () => {
  const navigate = useNavigate();

  // Fetch nested integrators
  const {
    data: integrators = [],
    isLoading,
    error,
  } = useGetNestedIntegratorsQuery(undefined, { refetchOnMountOrArgChange: true });

  // Handle errors
  useErrorListener([error]);

  // Sort integrators by name
  const sortedIntegrators = sortIntegratorsByName(integrators);

  const handleAddNew = () => {
    navigate('/definitions/integrators/add');
  };

  return (
    <>
      <PageHeader
        title="Entegratörler"
        subtitle="Entegratör tanımlamaları ve ayarları"
        rightContent={
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={handleAddNew}>
              Entegratör Ekle
            </Button>
          </Stack>
        }
      />

      <Box p={2}>
        <IntegratorsTable data={sortedIntegrators} isLoading={isLoading} />
      </Box>
    </>
  );
};

export default IntegratorsListPage;
