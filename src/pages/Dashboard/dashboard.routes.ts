import { IRouteObject } from 'src/router';
import DashboardPage from './DashboardPage';

export const dashboardRouter = [
  {
    path: '/home',
    Component: DashboardPage,
  },
] as IRouteObject[];
