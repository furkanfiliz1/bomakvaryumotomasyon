import { Login, Logout, NotFound } from '@pages';
import { Navigate } from 'react-router-dom';
import AuthorizedLayout from 'src/layouts/AuthorizedLayout';
import UnauthorizedLayout from 'src/layouts/UnauthorizedLayout';
import ErrorFallback from 'src/pages/common/ErrorFallback';
import { IRouteObject } from '.';
import devOnlyRouter from './dev-only-router';

import { dashboardRouter } from 'src/pages/Dashboard/dashboard.routes';

const routes: IRouteObject[] = [
  {
    path: '/',
    element: <AuthorizedLayout />,
    children: [
      // Root path redirect to home
      { path: '', element: <Navigate to="/home" replace /> },

      /**
       * Gösterge Paneli
       */
      ...dashboardRouter,

      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: 'error-page',
        element: <ErrorFallback />,
      },
      ...devOnlyRouter,
    ],
  },
  { path: '/404', element: <NotFound /> },
  {
    path: '/',
    element: <UnauthorizedLayout />,
    children: [
      { path: 'login', element: <Login /> },
      {
        path: '/login-required',
        element: <ErrorFallback />,
      },
    ],
  },
  { path: '*', element: <Navigate to="/404" replace /> },
  { path: 'logout', element: <Logout /> },
];

export default routes;
