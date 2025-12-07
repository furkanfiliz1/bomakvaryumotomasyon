import { IRouteObject } from 'src/router';
import CustomersPage from './index';

export const customersRouter = [
  {
    path: '/customers',
    Component: CustomersPage,
  },
] as IRouteObject[];
