import { IRouteObject } from 'src/router';
import FigoskorOperationsPage from './FigoskorOperationsPage';
import {
  CustomerListPage,
  CustomerRequestBranchDetailPage,
  CustomerRequestBranchListPage,
  CustomerRequestListPage,
} from './components';

export const figoskorOperationsRouter = [
  {
    path: 'figoskor-operations',
    Component: FigoskorOperationsPage,
  },
  {
    path: 'figoskor-operations/customers',
    Component: CustomerListPage,
  },
  {
    path: 'figoskor-operations/customer-requests/:customerId',
    Component: CustomerRequestListPage,
  },
  {
    path: 'figoskor-operations/customer-requests/:customerId/:requestId',
    Component: CustomerRequestBranchListPage,
  },
  {
    path: 'figoskor-operations/customer-requests/:customerId/:requestId/:branchId',
    Component: CustomerRequestBranchDetailPage,
  },
] as IRouteObject[];
