import { IRouteObject } from 'src/router';
import DiscountOperationsPage from './DiscountOperationsPage';
import { DiscountListPage, DiscountDetailPage } from './components';

export const discountOperationsRouter = [
  {
    path: 'iskonto-islemleri',
    Component: DiscountOperationsPage,
  },
  {
    path: 'iskonto-islemleri/:productTypeLink/:productTypeValue',
    Component: DiscountListPage,
  },
  {
    path: 'iskonto-islemleri/detay/:allowanceId',
    Component: DiscountDetailPage,
  },
] as IRouteObject[];
