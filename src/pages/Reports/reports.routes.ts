import { IRouteObject } from 'src/router';
import ReportsPage from './ReportsPage';

// Import actual components directly to ensure proper resolution
import { BuyerLimitReportsPage } from './OperationReports/BuyerLimitReports/components/BuyerLimitReportsPage';
import { EusTrackingReportsPage } from './OperationReports/EusTrackingReports/components/EusTrackingReportsPage';
import { IntegrationReportsListPage } from './OperationReports/IntegrationReports/components/IntegrationReportsListPage';
import { ScoreInvoiceReportsPage } from './OperationReports/ScoreInvoiceReports/components/ScoreInvoiceReportsPage';
import { ScoreInvoiceTransferReportsPage } from './OperationReports/ScoreInvoiceTransferReports/components/ScoreInvoiceTransferReportsPage';
import { ScoreReportsPage } from './OperationReports/ScoreReports/components/ScoreReportsPage';
import { SupplierReportsPage } from './OperationReports/SupplierReports/components/SupplierReportsPage';

import { BankDiscountReconciliationPage } from './ReconciliationReports/BankDiscountReconciliation/components/BankDiscountReconciliationPage';
import { BankInvoiceReconciliationPage } from './ReconciliationReports/BankInvoiceReconciliation/components/BankInvoiceReconciliationPage';
import { BuyerReconciliationPage } from './ReconciliationReports/BuyerReconciliation/components/BuyerReconciliationPage';
import { GuaranteeProtocolPage } from './ReconciliationReports/GuaranteeProtocol/components/GuaranteeProtocolPage';
import { IntegratorConsensusPage } from './ReconciliationReports/IntegratorConsensus/components/IntegratorConsensusPage';
import { LeadChannelConsensusPage } from './ReconciliationReports/LeadChannelConsensus/components/LeadChannelConsensusPage';

export const reportsRouter = [
  // Main Reports Landing Page
  {
    path: 'reports',
    Component: ReportsPage,
  },

  // Operation Reports Routes
  {
    path: 'reports/integration-reports',
    Component: IntegrationReportsListPage,
  },
  {
    path: 'reports/supplier-reports',
    Component: SupplierReportsPage,
  },
  {
    path: 'reports/score-reports',
    Component: ScoreReportsPage,
  },
  {
    path: 'reports/score-invoice-reports',
    Component: ScoreInvoiceReportsPage,
  },
  {
    path: 'reports/score-invoice-transfer-reports',
    Component: ScoreInvoiceTransferReportsPage,
  },
  {
    path: 'reports/buyer-limit-reports',
    Component: BuyerLimitReportsPage,
  },
  {
    path: 'reports/eus-tracking-reports',
    Component: EusTrackingReportsPage,
  },

  // Reconciliation Reports Routes
  {
    path: 'reports/bank-invoice-reconciliation',
    Component: BankInvoiceReconciliationPage,
  },
  {
    path: 'reports/buyer-reconciliation',
    Component: BuyerReconciliationPage,
  },
  {
    path: 'reports/bank-discount-reconciliation',
    Component: BankDiscountReconciliationPage,
  },
  {
    path: 'reports/guarantee-protocol',
    Component: GuaranteeProtocolPage,
  },
  {
    path: 'reports/integrator-consensus',
    Component: IntegratorConsensusPage,
  },
  {
    path: 'reports/lead-channel-consensus',
    Component: LeadChannelConsensusPage,
  },
] as IRouteObject[];
