import { IRouteObject } from 'src/router';
import CashPage from './index';

export const cashRouter: IRouteObject[] = [
  {
    path: 'cash',
    element: <CashPage />,
  },
];
