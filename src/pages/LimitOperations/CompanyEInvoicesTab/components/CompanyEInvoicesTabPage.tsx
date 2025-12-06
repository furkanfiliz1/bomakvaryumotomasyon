/**
 * Company E-Invoices Tab Main Page Component
 * Following OperationPricing pattern for main feature page
 * Matches legacy ScoreCompanyEinvoices.js component exactly
 */

import { Alert, Box, Card, CardContent, CircularProgress } from '@mui/material';
import React from 'react';
import { hasInvoiceData } from '../helpers';
import { useCompanyEInvoicesData, useEInvoicesTableConfig } from '../hooks';
import { EInvoicesTable } from './EInvoicesTable';

interface CompanyEInvoicesTabPageProps {
  companyId: string;
}

/**
 * Main component for Company E-Invoices Tab
 * Replicates legacy ScoreCompanyEInvoices behavior exactly:
 * - Shows loading spinner during data fetch
 * - Displays empty state when no data
 * - Shows currency-grouped tables when data exists
 * - Uses identical styling and layout
 */
export const CompanyEInvoicesTabPage: React.FC<CompanyEInvoicesTabPageProps> = ({ companyId }) => {
  const { invoices, isLoading, error } = useCompanyEInvoicesData(companyId);
  const { emptyStateConfig } = useEInvoicesTableConfig();

  // Loading state with spinner (matches legacy loader-wrap styling)
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
        sx={{
          position: 'relative',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}>
          <CircularProgress />
          <Box
            sx={{
              display: 'flex',
              gap: 1,
            }}>
            <Box
              sx={{
                width: 4,
                height: 20,
                backgroundColor: 'primary.main',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: '0s',
              }}
            />
            <Box
              sx={{
                width: 4,
                height: 20,
                backgroundColor: 'primary.main',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: '0.5s',
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  // Empty state (matches legacy "Yeterli veri bulunmamaktadır" message)
  if (!hasInvoiceData(invoices)) {
    return (
      <Card sx={emptyStateConfig.cardSx}>
        <CardContent>{emptyStateConfig.message}</CardContent>
      </Card>
    );
  }

  // Main content - currency grouped tables (matches legacy .map((currency)) structure)
  return (
    <Box>
      {invoices.map((currencyInvoices) => (
        <Box key={currencyInvoices.currency}>
          {/* Main data table (matches legacy table structure) */}
          <EInvoicesTable currencyInvoices={currencyInvoices} />
        </Box>
      ))}
    </Box>
  );
};

export default CompanyEInvoicesTabPage;
