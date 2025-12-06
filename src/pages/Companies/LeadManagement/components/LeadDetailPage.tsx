/**
 * Lead Detail Page Component
 * Displays lead details with tabs for different information sections
 * Following OperationPricing and DiscountDetailPage patterns
 */

import { PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Card, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetLeadDetailQuery } from '../lead-management.api';
import { CallHistoryTab, FirmaDetailsTab, UserDetailsTab } from './index';

const tabs = [
  {
    id: 'firma',
    title: 'Firma Bilgileri',
  },
  {
    id: 'kullanici',
    title: 'Kullanıcı Bilgileri',
  },
  {
    id: 'gorusme',
    title: 'Telefon Görüşmesi',
  },
];

export const LeadDetailPage: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const [tabIndex, setTabIndex] = useState(0);

  // Fetch lead detail data
  const {
    data: leadDetail,
    error,
    isLoading,
    refetch,
  } = useGetLeadDetailQuery({ id: Number(leadId) }, { skip: !leadId });

  // Error handling
  useErrorListener(error);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    if (!leadDetail) return null;

    switch (tabIndex) {
      case 0:
        return <FirmaDetailsTab leadDetail={leadDetail} onUpdate={refetch} />;
      case 1:
        return <UserDetailsTab leadDetail={leadDetail} onUpdate={refetch} />;
      case 2:
        return (
          <CallHistoryTab leadId={Number(leadId)} customerManagerId={leadDetail?.CustomerManagerId || undefined} />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <PageHeader
        title={leadDetail?.CompanyName || 'Lead Detayı'}
        subtitle={leadDetail?.TaxNumber ? `VKN: ${leadDetail.TaxNumber}` : 'Lead detay bilgileri'}
      />

      <Box sx={{ mx: 2, mb: 2 }}>
        <Card sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, p: 0 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="lead detail tabs">
            {tabs.map((tab) => (
              <Tab id={tab.id} label={tab.title} key={tab.id} />
            ))}
          </Tabs>
        </Card>
      </Box>

      <Box sx={{ mx: 2 }}>
        <Card sx={{ p: 3 }}>
          {isLoading ? <Box sx={{ textAlign: 'center', py: 4 }}>Yükleniyor...</Box> : <Box>{renderTabContent()}</Box>}
        </Card>
      </Box>
    </Box>
  );
};
