import { CompanyScoreTabPage } from '../CompanyScoreTab';

interface CompanyScoreTabProps {
  companyId: string;
}

/**
 * Company Score Tab Wrapper Component
 * Uses the new modular CompanyScoreTab feature following OperationPricing pattern
 */
export const CompanyScoreTab = ({ companyId }: CompanyScoreTabProps) => {
  return <CompanyScoreTabPage companyId={companyId} />;
};
