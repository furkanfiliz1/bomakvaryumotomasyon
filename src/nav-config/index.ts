import { INavConfig } from '@types';
import { companiesNavConfig } from 'src/pages/Companies/companies.nav-config';
import { dashboardNavConfig } from 'src/pages/Dashboard/dashboard.nav-config';
import { definitionsNavConfig } from 'src/pages/Definitions/definitions.nav-config';
import { discountOperationsNavConfig } from 'src/pages/DiscountOperations/discount-operations.nav-config';
import { figoskorOperationsNavConfig } from 'src/pages/FigoskorOperations/figoskor-operations.nav-config';
import { invoiceOperationsNavConfig } from 'src/pages/InvoiceOperations/invoice-operations.nav-config';
import { limitOperationsNavConfig } from 'src/pages/LimitOperations/limit-operations.nav-config';
import { manualTransactionEntryNavConfig } from 'src/pages/ManualTransactionEntry/manual-transaction-entry.nav-config';
import { otherOperationsNavConfig } from 'src/pages/OtherOperations/other-operations.nav-config';
import { pricingNavConfig } from 'src/pages/Pricing/pricing.nav-config';
import { reportsNavConfig } from 'src/pages/Reports/reports.nav-config';
import { settingsNavConfig } from 'src/pages/Settings/settings.nav-config';
import devToolsNavConfig from './dev-tools-nav-config';

export default [
  ...dashboardNavConfig,
  ...companiesNavConfig,
  ...limitOperationsNavConfig,
  ...pricingNavConfig,
  ...invoiceOperationsNavConfig,
  ...discountOperationsNavConfig,
  ...manualTransactionEntryNavConfig,
  ...reportsNavConfig,
  ...settingsNavConfig,
  ...definitionsNavConfig,
  ...figoskorOperationsNavConfig,
  ...otherOperationsNavConfig,

  {
    title: 'Duyurular',
    breadcrumbTitle: 'Duyurular',
    path: '/announcements',
    icon: 'announcement-01',
    hidden: true,
  },

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
  ...devToolsNavConfig,
] as INavConfig[];
