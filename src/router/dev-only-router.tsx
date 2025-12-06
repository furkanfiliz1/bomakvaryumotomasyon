import DesignGuideRouter from 'src/pages/DesignGuide/router';
import { IRouteObject } from '.';
import { DesignGuide, DevTools } from '@pages';
import { isProd } from '@helpers';

const devOnlyRouter: IRouteObject[] = !isProd
  ? [
      {
        path: 'dev-tools',
        element: <DevTools />,
      },
      {
        path: '/design-guide',
        element: <DesignGuide />,
        children: [...DesignGuideRouter],
      },
    ]
  : [];

export default devOnlyRouter;
