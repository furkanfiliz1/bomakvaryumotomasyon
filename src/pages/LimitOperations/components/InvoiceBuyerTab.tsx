import { InvoiceBuyerTabPage } from '../CompanyInvoiceBuyerTab';

interface InvoiceBuyerTabProps {
  companyId: string;
}

/**
 * Invoice Buyer Tab Component
 * Wrapper for the new InvoiceBuyerTabPage with full functionality
 * Replaces the previous placeholder implementation
 */
export const InvoiceBuyerTab = ({ companyId }: InvoiceBuyerTabProps) => {
  return <InvoiceBuyerTabPage companyId={companyId} />;
};
