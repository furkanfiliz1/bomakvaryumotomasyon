import { Documents, Login, Logout, NotFound, TwoFactorAuthentication } from '@pages';
import { Navigate } from 'react-router-dom';
import AuthorizedLayout from 'src/layouts/AuthorizedLayout';
import UnauthorizedLayout from 'src/layouts/UnauthorizedLayout';
import ErrorFallback from 'src/pages/common/ErrorFallback';
import { IRouteObject } from '.';
import devOnlyRouter from './dev-only-router';

import { companiesRouter } from 'src/pages/Companies/companies.routes';
import { dashboardRouter } from 'src/pages/Dashboard/dashboard.routes';
import { definitionsRouter } from 'src/pages/Definitions/definitions.routes';
import { discountOperationsRouter } from 'src/pages/DiscountOperations/discount-operations.routes';
import { figoskorOperationsRouter } from 'src/pages/FigoskorOperations/figoskor-operations.routes';
import { invoiceOperationsRouter } from 'src/pages/InvoiceOperations/invoice-operations.routes';
import { limitOperationsRouter } from 'src/pages/LimitOperations/limit-operations.routes';
import { manualTransactionEntryRouter } from 'src/pages/ManualTransactionEntry/manual-transaction-entry.routes';
import { otherOperationsRouter } from 'src/pages/OtherOperations/other-operations.routes';
import { pricingRouter } from 'src/pages/Pricing/pricing.routes';
import { reportsRouter } from 'src/pages/Reports/reports.routes';
import { scoreRouter } from 'src/pages/Score/score.routes.tsx';
import { settingsRouter } from 'src/pages/Settings/settings.routes';

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

      ...companiesRouter,

      /**
       * Definitions
       */
      ...definitionsRouter,

      /**
       * Discount Operations
       */
      ...discountOperationsRouter,

      /**
       * Figoskor Operations
       */
      ...figoskorOperationsRouter,

      /**
       * Invoice Operations
       */
      ...invoiceOperationsRouter,

      /**
       * Limit Operations
       */
      ...limitOperationsRouter,

      /**
       * Manual Transaction Entry
       */
      ...manualTransactionEntryRouter,

      /**
       * Other Operations
       */
      ...otherOperationsRouter,

      /**
       * Pricing
       */
      ...pricingRouter,

      /**
       * Reports
       */
      ...reportsRouter,

      /**
       * Score
       */
      ...scoreRouter,

      /**
       * Settings
       */
      ...settingsRouter,

      { path: 'documents/:activeTab?', element: <Documents /> },
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
      { path: 'two-factor', element: <TwoFactorAuthentication /> },
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
