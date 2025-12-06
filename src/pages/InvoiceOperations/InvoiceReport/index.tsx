import React from 'react';
import { InvoiceReportListPage } from './components/InvoiceReportListPage';

/**
 * Invoice Report Page - Main Entry Point
 * Following OperationPricing pattern with full modular implementation
 * Now using the complete InvoiceReportListPage component with filters and conditional API calls
 */
const InvoiceReportPage: React.FC = () => {
  return <InvoiceReportListPage />;
};

export default InvoiceReportPage;
