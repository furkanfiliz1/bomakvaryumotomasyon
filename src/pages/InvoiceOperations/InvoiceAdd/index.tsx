import { PageHeader } from '@components';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceAddExcel from './components/InvoiceAddExcel';
import InvoiceAddManuel from './components/InvoiceAddManuel';
import InvoiceAddXml from './components/InvoiceAddXml';

const tabs = [
  {
    id: 'manuel',
    title: 'Manuel',
    component: <InvoiceAddManuel />,
  },
  {
    id: 'excel',
    title: 'Excel',
    component: <InvoiceAddExcel />,
  },
  {
    id: 'xml',
    title: 'Xml',
    component: <InvoiceAddXml />,
  },
  {
    id: 'spot-xml',
    title: 'Spot için XML',
    component: <InvoiceAddXml isSpot={true} />,
  },
];

const InvoiceAdd = () => {
  const navigate = useNavigate();

  const params = useParams();
  const initialTab = tabs.find((tab) => tab.id === params.activeTab) || tabs[0];
  const initialTabIndex = tabs.findIndex((t) => t.id === initialTab.id);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(initialTabIndex);

  // Redirect to default tab if no activeTab is specified
  if (!params.activeTab) {
    navigate(`/invoice-operations/invoice-add/${tabs[0].id}`, { replace: true });
  }

  const onTabChange = (_: React.SyntheticEvent, index: number) => {
    setActiveTabIndex(index);
    const tab = tabs[index];
    navigate(`/invoice-operations/invoice-add/${tab.id}`);
  };

  const getCurrentComponent = () => {
    const currentTab = tabs[activeTabIndex];
    return currentTab?.component || tabs[0].component;
  };

  return (
    <Box>
      <PageHeader title="Fatura Ekle" subtitle="Kobi Finansmanı Fatura Yükleme" />
      <Box sx={{ p: 3, pt: 0 }}>
        <Box sx={{ borderColor: 'divider' }}>
          <Tabs value={activeTabIndex} onChange={onTabChange} aria-label="invoice add tabs" sx={{ mb: 2 }}>
            {tabs.map((tab, index) => (
              <Tab id={tab.title} label={tab.title} key={index} />
            ))}
          </Tabs>
          {getCurrentComponent()}
        </Box>
      </Box>
    </Box>
  );
};

export default InvoiceAdd;
