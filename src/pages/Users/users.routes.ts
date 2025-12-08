import { IRouteObject } from 'src/router';
import UsersPage from '.';

export const usersRouter = [
  {
    path: '/users',
    Component: UsersPage,
  },
] as IRouteObject[];
