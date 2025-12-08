import { IRouteObject } from 'src/router';
import TanksPage from './index';
import TankStocksPage from './TankStocksPage';

export const tanksRouter = [
  {
    path: '/tanks',
    Component: TanksPage,
  },
  {
    path: '/tank-stocks',
    Component: TankStocksPage,
  },
] as IRouteObject[];
