import { INavConfig } from '@types';
import { dashboardNavConfig } from 'src/pages/Dashboard/dashboard.nav-config';
import { fishNavConfig } from 'src/pages/Dashboard/Fish/fish.nav-config';
import { customersNavConfig } from 'src/pages/Customers/customers.nav-config';
import { suppliersNavConfig } from 'src/pages/Suppliers/suppliers.nav-config';
import { salesNavConfig } from 'src/pages/Sales/sales.nav-config';
import { purchasesNavConfig } from 'src/pages/Purchases/purchases.nav-config';
import { tanksNavConfig } from 'src/pages/Tanks/tanks.nav-config';
import { expensesNavConfig } from 'src/pages/Expenses/expenses.nav-config';
import { usersNavConfig } from 'src/pages/Users/users.nav-config';
import { cashNavConfig } from 'src/pages/Cash/cash.nav-config';
import { collectionsNavConfig } from 'src/pages/Collections/collections.nav-config';


export default [
  ...dashboardNavConfig,
  ...salesNavConfig,
  ...collectionsNavConfig,
  ...tanksNavConfig,

  ...purchasesNavConfig,
  ...suppliersNavConfig,
  ...expensesNavConfig,
  ...cashNavConfig,

 {
    title: 'Tank',
    breadcrumbTitle: 'Tank',
    path: '/tanks',
    icon: 'database-01',
  },
  ...fishNavConfig,
  ...customersNavConfig,

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
