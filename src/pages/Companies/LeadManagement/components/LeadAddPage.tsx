/**
 * Lead Add Page
 * Following OperationPricing pattern with tab navigation
 * Tabs: Manuel Ekle, Excel ile Ekle
 */

import { PageHeader } from '@components';
import { Box, Card, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LeadAddExcel, LeadAddManuel } from '.';

type TabValue = 'manuel' | 'excel';

const LeadAddPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeTab } = useParams<{ activeTab?: string }>();

  // Active tab from URL or default to 'manuel'
  const [currentTab, setCurrentTab] = useState<TabValue>((activeTab as TabValue) || 'manuel');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
    navigate(`/companies/leads/add/${newValue}`, { replace: true });
  };

  return (
    <>
      <PageHeader
        title="Yeni Lead Ekle"
        subtitle="Müşteri adayı bilgilerini manuel olarak veya Excel ile ekleyebilirsiniz"
      />

      <Box sx={{ p: 3 }}>
        <Card>
          <Tabs value={currentTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tab label="Manuel Ekle" value="manuel" />
            <Tab label="Excel ile Ekle" value="excel" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {currentTab === 'manuel' && <LeadAddManuel />}
            {currentTab === 'excel' && <LeadAddExcel />}
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default LeadAddPage;
