import { PageHeader } from '@components';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReceivableAddExcel, ReceivableAddManuel } from './components';

const tabs = [
  {
    uid: 1,
    id: '',
    title: 'Manuel',
    component: <ReceivableAddManuel />,
  },
  {
    uid: 2,
    id: 'excel',
    title: 'Excel',
    component: <ReceivableAddExcel />,
  },
];

/**
 * Main Receivable Add Page with Tab Navigation
 * Following Portal reference pattern from ReceivablesBuyerAdd
 */
const ReceivableAddPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  // Determine initial tab based on URL parameter
  const initialTab = tabs.find((tab) => tab.id === params.activeTab) ?? tabs[0];
  const initialTabIndex = tabs.findIndex((t) => t.id === initialTab.id);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(initialTabIndex);

  const onTabChange = (_: React.SyntheticEvent, index: number) => {
    setActiveTabIndex(index);
    const tab = tabs[index];
    // Update URL to reflect active tab
    navigate(`/invoice-operations/receivable-add/${tab.id}`);
  };

  // Get component for active tab
  const getActiveComponent = () => {
    const activeTab = tabs[activeTabIndex];
    return activeTab?.component || tabs[0].component;
  };

  return (
    <>
      <PageHeader title="Alacak Ekle" subtitle="Alacak Yükleme İşlemleri" />

      <Box sx={{ borderColor: 'divider' }}>
        <Tabs value={activeTabIndex} onChange={onTabChange} aria-label="receivable add tabs">
          {tabs.map((tab) => (
            <Tab id={tab.title} label={tab.title} key={tab.uid} />
          ))}
        </Tabs>

        {getActiveComponent()}
      </Box>
    </>
  );
};

export default ReceivableAddPage;
