import { RouteTabs } from '@components';

import React from 'react';
import { useParams } from 'react-router-dom';
import OtherDocuments from './OtherDocuments';
import RequiredDocuments from './RequiredDocuments';

const routePages = [
  {
    title: 'Gerekli Belgeler',
    path: '/documents',
    activeTab: 'required',
    component: <RequiredDocuments />,
  },
  {
    title: 'Diğer Belgeler',
    path: '/documents/other',
    activeTab: 'other',
    component: <OtherDocuments />,
  },
];

const Documents = () => {
  const params = useParams();

  const Component = () =>
    routePages.find((item) => item?.activeTab === params?.activeTab)?.component || routePages[0].component;

  return (
    <React.Fragment>
      <RouteTabs sx={{ mb: 2 }} pages={routePages} />
      <Component />
    </React.Fragment>
  );
};

export default Documents;
