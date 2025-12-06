/**
 * E-Invoices Summary Card Component
 * Following OperationPricing pattern for summary display
 * Shows total counts and summary information per currency
 */

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import type { CurrencyInvoices } from '../company-einvoices-tab.types';
import { formatNumber, getTotalRecordCount } from '../helpers';

interface EInvoicesSummaryCardProps {
  currencyInvoices: CurrencyInvoices;
}

/**
 * Summary card showing key metrics for a currency's invoice data
 * Provides overview before detailed table
 */
export const EInvoicesSummaryCard: React.FC<EInvoicesSummaryCardProps> = ({ currencyInvoices }) => {
  const totalRecords = getTotalRecordCount([currencyInvoices]);
  const totalOutgoing = currencyInvoices.amounts.reduce((sum, inv) => sum + inv.outgoingCount, 0);
  const totalIncoming = currencyInvoices.amounts.reduce((sum, inv) => sum + inv.incomingCount, 0);

  return (
    <Card sx={{ marginBottom: 2, backgroundColor: '#f8f9fa' }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Para Birimi
            </Typography>
            <Typography variant="h6" fontWeight="600">
              {currencyInvoices.currency}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box textAlign="center">
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Toplam Dönem
              </Typography>
              <Typography variant="h6" fontWeight="600">
                {formatNumber(totalRecords)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box textAlign="center">
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Toplam Giden
              </Typography>
              <Typography variant="h6" fontWeight="600" color="primary.main">
                {formatNumber(totalOutgoing)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box textAlign="center">
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Toplam Gelen
              </Typography>
              <Typography variant="h6" fontWeight="600" color="success.main">
                {formatNumber(totalIncoming)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EInvoicesSummaryCard;
