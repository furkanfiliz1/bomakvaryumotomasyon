import { INavConfig } from '@types';
import { dashboardNavConfig } from 'src/pages/Dashboard/dashboard.nav-config';


export default [
  ...dashboardNavConfig,
 

  {
    icon: 'face-sad',
    title: 'Sayfa Bulunamadı',
    breadcrumbTitle: '404',
    path: '/404',
    hidden: true,
  },
  {
    icon: 'face-sad',
    title: 'Bilinmeyen Hata',
    breadcrumbTitle: 'Bilinmeyen Hata',
    path: '/error-page',
    hidden: true,
  },
] as INavConfig[];
