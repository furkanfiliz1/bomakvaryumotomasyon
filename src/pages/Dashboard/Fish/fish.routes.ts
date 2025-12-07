import { IRouteObject } from 'src/router';
import CategoriesPage from './CategoriesPage';
import FishesPage from './FishesPage';

export const fishRouter = [
  {
    path: '/fish/categories',
    Component: CategoriesPage,
  },
  {
    path: '/fish/species',
    Component: FishesPage,
  },
] as IRouteObject[];
