/**
 * Sub Channel Page Component
 * Matches legacy SubChannel.js exactly
 * Route: /definitions/sub-channel
 */

import { PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useGetSubChannelListQuery } from '../sub-channel.api';
import { SubChannelForm } from './SubChannelForm';
import { SubChannelList } from './SubChannelList';

const SubChannelPage: React.FC = () => {
  const { data: items, isLoading, error, refetch } = useGetSubChannelListQuery();

  // Handle errors with useErrorListener
  useErrorListener(error);

  const handleRefetch = () => {
    refetch();
  };

  return (
    <>
      <PageHeader title="Alt Kanal" subtitle="Alt Kanal Ekleme ve Listesi" />

      <Box mx={2}>
        {/* Create Form Section */}
        <Typography variant="subtitle1" sx={{ py: 1, fontWeight: 'bold' }}>
          Alt Kanal Ekle
        </Typography>
        <SubChannelForm onSuccess={handleRefetch} />

        {/* List Section */}
        <Typography variant="subtitle1" sx={{ py: 1, fontWeight: 'bold' }}>
          Alt Kanal Listesi
        </Typography>
        <SubChannelList items={items || []} isLoading={isLoading} onRefetch={handleRefetch} />
      </Box>
    </>
  );
};

export default SubChannelPage;
