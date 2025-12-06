import { IRouteObject } from 'src/router';
import CompaniesPage from './CompaniesPage';
import { CustomerTrackingPage } from './CustomerTracking';
import { LeadAddPage, LeadDetailPage, LeadListPage } from './LeadManagement/components';
import { OpportunityAddPage, OpportunityDetailPage, OpportunityListPage } from './OpportunityManagement/components';
import {
  CompaniesDashboardPage,
  CompanyDetailPage,
  CompanyNewPage,
  CompanyRoleForm,
  CompanyUserDetailPage,
} from './components';

export const companiesRouter = [
  {
    path: 'companies',
    Component: CompaniesDashboardPage,
  },
  {
    path: 'companies/all',
    Component: CompaniesPage,
  },
  {
    path: 'companies/new',
    Component: CompanyNewPage,
  },
  {
    path: 'companies/customer-tracking',
    Component: CustomerTrackingPage,
  },
  {
    path: 'companies/leads',
    Component: LeadListPage,
  },
  {
    path: 'companies/leads/add',
    Component: LeadAddPage,
  },
  {
    path: 'companies/leads/add/:activeTab',
    Component: LeadAddPage,
  },
  {
    path: 'companies/leads/:leadId',
    Component: LeadDetailPage,
  },
  {
    path: 'companies/opportunities',
    Component: OpportunityListPage,
  },
  {
    path: 'companies/opportunities/add',
    Component: OpportunityAddPage,
  },
  {
    path: 'companies/opportunities/:opportunityId',
    Component: OpportunityDetailPage,
  },
  {
    path: 'companies/:companyId/:activeTab',
    Component: CompanyDetailPage,
  },
  {
    path: 'companies/:companyId/kullanici/:userId',
    Component: CompanyDetailPage,
  },
  {
    path: 'companies/:companyId/roller/:roleId',
    Component: CompanyRoleForm,
  },
  {
    path: 'sirketler/sirket-listesi/:companyId/kullanici/:userId',
    Component: CompanyUserDetailPage,
  },
] as IRouteObject[];
