import { CompanyGeneralTabPage } from '../CompanyGeneralTab';

interface CompanyGeneralTabProps {
  companyId: string;
}

/**
 * Company General Tab Wrapper Component
 * Uses the new modular CompanyGeneralTab feature following OperationPricing pattern
 */
export const CompanyGeneralTab = ({ companyId }: CompanyGeneralTabProps) => {
  return <CompanyGeneralTabPage companyId={companyId} />;
};
