import { IRouteObject } from 'src/router';
import PurchasesPage from './index';

export const purchasesRouter = [
  {
    path: '/purchases',
    Component: PurchasesPage,
  },
] as IRouteObject[];
