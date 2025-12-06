/**
 * Customer Acquisition Team Page Component
 * Matches legacy CustomerAcquisitionTeam.js exactly
 * Route: /definitions/customer-acquisition-team
 */

import { PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useGetCustomerAcquisitionTeamListQuery } from '../customer-acquisition-team.api';
import { CustomerAcquisitionTeamForm } from './CustomerAcquisitionTeamForm';
import { CustomerAcquisitionTeamList } from './CustomerAcquisitionTeamList';

const CustomerAcquisitionTeamPage: React.FC = () => {
  const { data: members, isLoading, error, refetch } = useGetCustomerAcquisitionTeamListQuery();

  // Handle errors with useErrorListener
  useErrorListener(error);

  const handleRefetch = () => {
    refetch();
  };

  return (
    <>
      <PageHeader title="Müşteri Kazanım Ekibi" subtitle="Müşteri Kazanım Ekibi Üyesi Ekleme ve Listesi" />

      <Box mx={2}>
        {/* Create Form Section */}
        <Typography variant="subtitle1" sx={{ py: 1, fontWeight: 'bold' }}>
          Müşteri Kazanım Ekibi Üye Ekle
        </Typography>
        <CustomerAcquisitionTeamForm onSuccess={handleRefetch} />

        {/* List Section */}
        <Typography variant="subtitle1" sx={{ py: 1, fontWeight: 'bold' }}>
          Müşteri Kazanım Ekibi Üye Listesi
        </Typography>
        <CustomerAcquisitionTeamList members={members || []} isLoading={isLoading} onRefetch={handleRefetch} />
      </Box>
    </>
  );
};

export default CustomerAcquisitionTeamPage;
