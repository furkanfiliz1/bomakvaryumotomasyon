import { PageHeader } from '@components';
import React from 'react';
import { ReceivableReportListPage } from './components';

const ReceivableReportPage: React.FC = () => {
  return (
    <>
      <PageHeader title="Alacak Raporu" subtitle="Alacak Raporu ve Alacak Düzenleme" />
      <ReceivableReportListPage />
    </>
  );
};

export default ReceivableReportPage;
