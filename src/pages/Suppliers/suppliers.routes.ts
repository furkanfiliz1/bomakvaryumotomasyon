import { IRouteObject } from 'src/router';
import SuppliersPage from './index';

export const suppliersRouter = [
  {
    path: '/suppliers',
    Component: SuppliersPage,
  },
] as IRouteObject[];
