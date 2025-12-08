import { INavConfig } from '@types';
import { dashboardNavConfig } from 'src/pages/Dashboard/dashboard.nav-config';
import { fishNavConfig } from 'src/pages/Dashboard/Fish/fish.nav-config';
import { customersNavConfig } from 'src/pages/Customers/customers.nav-config';
import { salesNavConfig } from 'src/pages/Sales/sales.nav-config';
import { purchasesNavConfig } from 'src/pages/Purchases/purchases.nav-config';
import { expensesNavConfig } from 'src/pages/Expenses/expenses.nav-config';
import { usersNavConfig } from 'src/pages/Users/users.nav-config';


export default [
  ...dashboardNavConfig,
  ...fishNavConfig,
  ...customersNavConfig,
  ...salesNavConfig,
  ...purchasesNavConfig,
  ...expensesNavConfig,
  ...usersNavConfig,
 

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
