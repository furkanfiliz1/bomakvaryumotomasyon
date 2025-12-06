/**
 * Application Channel Page Component
 * Matches legacy ReferralChannel.js exactly
 * Route: /definitions/application-channel
 */

import { PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useGetApplicationChannelListQuery } from '../application-channel.api';
import { ApplicationChannelForm } from './ApplicationChannelForm';
import { ApplicationChannelList } from './ApplicationChannelList';

const ApplicationChannelPage: React.FC = () => {
  const { data: items, isLoading, error, refetch } = useGetApplicationChannelListQuery();

  // Handle errors with useErrorListener
  useErrorListener(error);

  const handleRefetch = () => {
    refetch();
  };

  return (
    <>
      <PageHeader title="Başvuru Kanalı" subtitle="Başvuru Kanalı Ekleme ve Listesi" />

      <Box mx={2}>
        {/* Create Form Section */}
        <Typography variant="subtitle1" sx={{ py: 1, fontWeight: 'bold' }}>
          Başvuru Kanalı Ekle
        </Typography>
        <ApplicationChannelForm onSuccess={handleRefetch} />

        {/* List Section */}
        <Typography variant="subtitle1" sx={{ py: 1, fontWeight: 'bold' }}>
          Başvuru Kanalı Listesi
        </Typography>
        <ApplicationChannelList items={items || []} isLoading={isLoading} onRefetch={handleRefetch} />
      </Box>
    </>
  );
};

export default ApplicationChannelPage;
