import { isProd } from '@helpers';
import { INavConfig } from '@types';
import { designGuideRoutesList } from 'src/pages/DesignGuide/routes';

const devToolsNavConfig: INavConfig[] = !isProd
  ? [
      {
        title: 'Geliştirici Araçları',
        breadcrumbTitle: 'Geliştirici Araçları',
        path: '/dev-tools',
        icon: 'cloud-raining-02',
      },
      {
        title: 'Tasarım Klavuzu',
        breadcrumbTitle: 'Tasarım Klavuzu',
        path: '/design-guide',
        icon: 'layout-alt-04',
        children: [...designGuideRoutesList],
      },
    ]
  : [];

export default devToolsNavConfig;
