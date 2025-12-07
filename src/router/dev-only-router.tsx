import DesignGuideRouter from 'src/pages/DesignGuide/router';
import { IRouteObject } from '.';
import { DesignGuide } from '@pages';

const devOnlyRouter: IRouteObject[] = [
  {
    path: '/design-guide',
    element: <DesignGuide />,
    children: [...DesignGuideRouter],
  },
];
export default devOnlyRouter;
