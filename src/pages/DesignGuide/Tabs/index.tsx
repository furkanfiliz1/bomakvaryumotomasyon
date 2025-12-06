import { Alert, Card, Tab, Tabs, Typography, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { BadgeFilter } from '@components';
import { useState } from 'react';

const DesignGuideFilterTabs = () => {
  const theme = useTheme();

  const TabsBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const TabsBoxTitle = styled(Typography)(() => ({
    marginBottom: theme.spacing(1),
  }));

  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const BadgeFilterItems = [
    { id: 0, title: 'Tab 1' },
    { id: 1, title: 'Tab 2' },
    { id: 2, title: 'Tab 3' },
  ];

  const tabs = [
    {
      id: 'Tab 1',
      title: 'Tab 1',
    },
    {
      id: 'Tab 2',
      title: 'Tab 2',
    },
    {
      id: 'Tab 3',
      title: 'Tab 3',
    },
  ];

  const onTabChange = (_: React.SyntheticEvent, index: number) => {
    setActiveTabIndex(index);
  };
  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Tabs" muiLink="https://mui.com/material-ui/react-tabs/" />

      <Tabs value={activeTabIndex} onChange={onTabChange} aria-label="allowance tabs" variant="scrollable">
        {tabs.map((tab, index) => (
          <Tab id={tab.title} label={tab.title} key={index} />
        ))}
      </Tabs>
      <TabsBox sx={{ marginBlock: 2 }}>
        <TabsBoxTitle>Badge Filter</TabsBoxTitle>

        <Alert sx={{ marginBlock: 2 }} variant="filled" color="info" severity="info">
          Çek İşlemleri -&gt; Çek cüzdanı Sayfasında çek akışında
          <br />
          Ayarlar -&gt; Oranlar -&gt; detay sayfasında Hesaplama yöntemi gibi olanlarla kullanılıyor.
        </Alert>
        <BadgeFilter tabs={BadgeFilterItems} onChange={(e) => console.log(e)} />
      </TabsBox>
    </Card>
  );
};

export default DesignGuideFilterTabs;
