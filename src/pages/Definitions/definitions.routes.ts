import { IRouteObject } from 'src/router';
import DefinitionsPage from './DefinitionsPage';

// Import components using the barrel export pattern
// Ordered to match the old project sequence exactly
import ApplicationChannelPage from './ApplicationChannel/components';
import BankBranchDefinitionsBulkUploadPage from './BankBranchDefinitionsBulkUploadPage/components/BankBranchDefinitionsBulkUploadPage';
import BankBuyerRatesPage from './BankBuyerRates/components/BankBuyerRatesPage';
import { BankBranchDefinitionsPage } from './BankDefinitions';
import BankDefinitionsPage from './BankDefinitions/components/BankDefinitionsPage';
import BankFigoRebatePage from './BankFigoRebate/components';
import CampaignDiscountDefinitionPage from './CampaignDiscountDefinition/components';
import {
  CompanyRepresentativeHistoryPage,
  CompanyRepresentativeSettingsPage,
} from './CompanyRepresentativeSettings/components';
import { CompanyRepresentativeSettingsPageV2 } from './CompanyRepresentativeSettingsV2/components';
import CustomerAcquisitionTeamPage from './CustomerAcquisitionTeam/components';
import CustomerArrivalChannelsPage from './CustomerArrivalChannels/components';
import IntegratorReconciliationChartsPage from './IntegratorReconciliationCharts/components/IntegratorReconciliationChartsPage';
import IntegratorsPage, { IntegratorFormPage } from './Integrators/components';
import InvoiceFinancialScorePage from './InvoiceFinancialScore/components';
import InvoiceScoreRatiosPage from './InvoiceScoreRatios/components';
import IsBankRatesPage from './IsBankRates/components';
import RepresentativeTargetEntryPage from './RepresentativeTargetEntry/components';
import SectorRatiosPage from './SectorRatios/components';
import SubChannelPage from './SubChannel/components';
import TargetTypesPage from './TargetTypes/components/TargetTypesPage';
import UserPositionsPage from './UserPositions/components/UserPositionsPage';

export const definitionsRouter = [
  {
    path: 'definitions',
    Component: DefinitionsPage,
  },
  // Routes ordered to match the old project sequence exactly
  {
    path: 'definitions/customer-arrival-channels',
    Component: CustomerArrivalChannelsPage,
  },
  {
    path: 'definitions/integrator-reconciliation-charts',
    Component: IntegratorReconciliationChartsPage,
  },
  {
    path: 'definitions/user-positions',
    Component: UserPositionsPage,
  },
  {
    path: 'definitions/target-types',
    Component: TargetTypesPage,
  },
  {
    path: 'definitions/representative-target-entry',
    Component: RepresentativeTargetEntryPage,
  },
  {
    path: 'definitions/bank-definitions',
    Component: BankDefinitionsPage,
  },
  {
    path: 'definitions/bank-branch-definitions',
    Component: BankBranchDefinitionsPage,
  },
  {
    path: 'definitions/bank-buyer-rates',
    Component: BankBuyerRatesPage,
  },
  {
    path: 'definitions/invoice-financial-score',
    Component: InvoiceFinancialScorePage,
  },
  {
    path: 'definitions/invoice-score-ratios',
    Component: InvoiceScoreRatiosPage,
  },
  {
    path: 'definitions/sector-ratios',
    Component: SectorRatiosPage,
  },
  {
    path: 'definitions/company-representative-settings',
    Component: CompanyRepresentativeSettingsPage,
  },
  {
    path: 'definitions/company-representative-settings-v2',
    Component: CompanyRepresentativeSettingsPageV2,
  },
  {
    path: 'definitions/company-representative/:companyId/history/:companyCustomerManagerId',
    Component: CompanyRepresentativeHistoryPage,
  },
  {
    path: 'definitions/integrators',
    Component: IntegratorsPage,
  },
  {
    path: 'definitions/integrators/add',
    Component: IntegratorFormPage,
  },
  {
    path: 'definitions/integrators/edit/:id',
    Component: IntegratorFormPage,
  },
  {
    path: 'definitions/bank-figo-rebate',
    Component: BankFigoRebatePage,
  },
  {
    path: 'definitions/customer-acquisition-team',
    Component: CustomerAcquisitionTeamPage,
  },
  {
    path: 'definitions/application-channel',
    Component: ApplicationChannelPage,
  },
  {
    path: 'definitions/sub-channel',
    Component: SubChannelPage,
  },
  {
    path: 'definitions/campaign-discount-definition',
    Component: CampaignDiscountDefinitionPage,
  },
  {
    path: 'definitions/is-bank-rates',
    Component: IsBankRatesPage,
  },
  {
    path: 'definitions/bank-branch-definitions-bulk-upload',
    Component: BankBranchDefinitionsBulkUploadPage,
  },
] as IRouteObject[];
