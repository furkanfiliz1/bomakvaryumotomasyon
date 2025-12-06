import { useState } from 'react';
import XMLGenerator from './XML/XMLGenerator';
import { Tab, Tabs } from '@mui/material';

const DevTools = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveIndex(newValue);
  };

  return (
    <>
      <div style={{ marginBottom: 15 }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Single+Day&display=swap" rel="stylesheet" />

        <p style={{ fontFamily: 'Single Day', fontSize: '18px' }}>
          Bu sayfa canlı portalde görünmeyecek. Sadece test ve geliştirmelerde yardımcı olabilmesi için eklendi. No
          worries
        </p>
        <Tabs value={activeIndex} onChange={handleTabChange}>
          <Tab label="XML" />
        </Tabs>
      </div>

      {activeIndex === 0 && <XMLGenerator />}
    </>
  );
};

export default DevTools;
