import { IRouteObject } from 'src/router';
import SalesPage from './index';

export const salesRouter = [
  {
    path: '/sales',
    Component: SalesPage,
  },
] as IRouteObject[];
