import { IRouteObject } from 'src/router';
import CollectionsPage from './index';

export const collectionsRouter: IRouteObject[] = [
  {
    path: 'collections',
    element: <CollectionsPage />,
  },
];
