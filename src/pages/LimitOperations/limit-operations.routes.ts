import { IRouteObject } from 'src/router';
import {
  CompensationTransactionsListPage,
  CreateCompensationTransactionPage,
  UpdateCompensationTransactionPage,
} from './CompensationTransactions';
import LimitOperationsPage from './LimitOperationsPage';
import {
  AddLegalProceedingCompensationPage,
  LimitCompaniesPage,
  LimitCompanyDetailPage,
  LimitDashboardPage,
  LimitLegalProceedingsPage,
  UpdateCompensationPage,
} from './components';

export const limitOperationsRouter = [
  {
    path: 'limit-operations',
    Component: LimitOperationsPage,
  },
  {
    path: 'limit-operations/companies',
    Component: LimitCompaniesPage,
  },
  {
    path: 'limit-operations/companies/:companyId/:activeTab?',
    Component: LimitCompanyDetailPage,
  },
  {
    path: 'limit-operations/dashboard',
    Component: LimitDashboardPage,
  },
  {
    path: 'limit-operations/legal-proceedings',
    Component: LimitLegalProceedingsPage,
  },
  {
    path: 'limit-operations/legal-proceedings/add',
    Component: AddLegalProceedingCompensationPage,
  },
  {
    path: 'limit-operations/legal-proceedings/:id/edit',
    Component: UpdateCompensationPage,
  },
  {
    path: 'limit-operations/legal-proceedings/compensation-transactions',
    Component: CompensationTransactionsListPage,
  },
  {
    path: 'limit-operations/compensation-transactions/create',
    Component: CreateCompensationTransactionPage,
  },
  {
    path: 'limit-operations/compensation-transactions/:id/edit',
    Component: UpdateCompensationTransactionPage,
  },
] as IRouteObject[];
