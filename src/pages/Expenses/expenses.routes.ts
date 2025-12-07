import { IRouteObject } from 'src/router';
import ExpensesPage from './index';

export const expensesRouter = [
  {
    path: '/expenses',
    Component: ExpensesPage,
  },
] as IRouteObject[];
