import { IRouteObject } from 'src/router';

// Import components from their new modular locations
import OtherOperationsPage from './OtherOperationsPage';
import { LimitsToPassivePage } from './LimitsToPassive';
import { SupplierQueryPage } from './SupplierQuery';
import { SpotLoanLimitsPage } from './SpotLoanLimits';
import { RevolvingLoanLimitsPage } from './RevolvingLoanLimits';
import { TtkLimitQueryPage } from './TtkLimitQuery';

export const otherOperationsRouter = [
  {
    path: 'other-operations',
    Component: OtherOperationsPage,
  },
  {
    path: 'other-operations/limitleri-pasife-al',
    Component: LimitsToPassivePage,
  },
  {
    path: 'other-operations/supplier-query',
    Component: SupplierQueryPage,
  },
  {
    path: 'other-operations/spot-loan-limits',
    Component: SpotLoanLimitsPage,
  },
  {
    path: 'other-operations/revolving-loan-limits',
    Component: RevolvingLoanLimitsPage,
  },
  {
    path: 'other-operations/ttk-limit-sorgulama',
    Component: TtkLimitQueryPage,
  },
] as IRouteObject[];
