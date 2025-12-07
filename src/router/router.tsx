import { Login, Logout, NotFound } from '@pages';
import { Navigate } from 'react-router-dom';
import AuthorizedLayout from 'src/layouts/AuthorizedLayout';
import UnauthorizedLayout from 'src/layouts/UnauthorizedLayout';
import ErrorFallback from 'src/pages/common/ErrorFallback';
import { IRouteObject } from '.';
import devOnlyRouter from './dev-only-router';

import { dashboardRouter } from 'src/pages/Dashboard/dashboard.routes';
import { fishRouter } from 'src/pages/Dashboard/Fish/fish.routes';
import { customersRouter } from 'src/pages/Customers/customers.routes';
import { salesRouter } from 'src/pages/Sales/sales.routes';
import { purchasesRouter } from 'src/pages/Purchases/purchases.routes';
import { expensesRouter } from 'src/pages/Expenses/expenses.routes';

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

      /**
        Balıklar
       */
      ...fishRouter,

      /**
        Müşteriler
       */
      ...customersRouter,

      /**
        Satışlar
       */
      ...salesRouter,

      /**
        Alışlar
       */
      ...purchasesRouter,

      /**
        Giderler
       */
      ...expensesRouter,

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
