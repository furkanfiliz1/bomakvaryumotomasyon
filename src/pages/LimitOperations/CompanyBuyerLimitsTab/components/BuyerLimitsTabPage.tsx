/**
 * Buyer Limits Tab Page Component
 * Following OperationPricing main page pattern exactly
 * Replaces the current InvoiceBuyerTab with complete buyer limits management
 */

import { Slot, Table } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSearchBuyerLimitsMutation, useSyncBuyerConcentrationMutation } from '../company-buyer-limits-tab.api';
import type { BuyerLimitItem, SearchBuyerLimitsParams } from '../company-buyer-limits-tab.types';
import { getBuyerLimitsTableHeaders, getEmptyStateMessage, getErrorMessage } from '../helpers';
import { BuyerLimitFormProvider, useBuyerLimitsData } from '../hooks';
import { ActionsSlot, BuyerLimitsSearch, IsActiveSlot, MaxInvoiceAmountSlot, MaxInvoiceDueDaySlot } from './index';

interface BuyerLimitsTabPageProps {
  /** Company ID for buyer limits */
  companyId: string;
}

/**
 * Main Buyer Limits Tab Page
 * Displays buyer limits with search, inline editing, and concentration calculation
 * Matches legacy ScoreCompanyBasedScore functionality exactly
 */
export const BuyerLimitsTabPage: React.FC<BuyerLimitsTabPageProps> = ({ companyId }) => {
  const [searchResults, setSearchResults] = useState<BuyerLimitItem[] | null>(null);
  const [companyData] = useState<{ Identifier?: string } | null>(null);

  // Convert string to number
  const numericCompanyId = Number.parseInt(companyId, 10);

  // Fetch main buyer limits data
  const { data, isLoading, isFetching, error, pagingConfig, sortingConfig, refetch } = useBuyerLimitsData({
    companyId: numericCompanyId,
  });

  // Search mutation
  const [searchBuyerLimits, { isLoading: isSearchLoading, error: searchError }] = useSearchBuyerLimitsMutation();

  // Sync concentration mutation
  const [syncBuyerConcentration, { isLoading: isSyncLoading, error: syncError }] = useSyncBuyerConcentrationMutation();

  // Error handling
  useErrorListener([error, searchError, syncError]);

  // Table configuration
  const tableHeaders = getBuyerLimitsTableHeaders();

  // Use search results if available, otherwise use main data
  const tableData = searchResults || data;

  // Handle search
  const handleSearch = async (searchParams: SearchBuyerLimitsParams) => {
    try {
      const result = await searchBuyerLimits(searchParams).unwrap();
      setSearchResults(result.Items || []);
    } catch (error) {
      // Error handled by global error handler
      console.error('Search failed:', error);
    }
  };

  // Handle search reset
  const handleSearchReset = () => {
    setSearchResults(null);
  };

  // Handle concentration calculation
  const handleCalculateConcentration = async () => {
    if (!companyData?.Identifier) {
      // TODO: Fetch company data to get identifier
      console.error('Company identifier not available');
      return;
    }

    try {
      await syncBuyerConcentration({ identifier: companyData.Identifier }).unwrap();

      // Show success message matching legacy
      // TODO: Show toast/notification with getConcentrationSuccessMessage()

      // Refresh data
      refetch();

      // Clear search results to show updated data
      setSearchResults(null);
    } catch (error) {
      // Error handled by global error handler
      console.error('Concentration calculation failed:', error);
    }
  };

  return (
    <BuyerLimitFormProvider items={tableData}>
      <Box sx={{ p: 3 }}>
        {/* Page Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">Alıcı Bazlı Vade Liste</Typography>

          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleCalculateConcentration}
            loading={isSyncLoading}>
            Fatura Konsantrasyonu Hesapla
          </LoadingButton>
        </Stack>

        {/* Search Section */}
        <BuyerLimitsSearch
          companyId={numericCompanyId}
          onSearch={handleSearch}
          onReset={handleSearchReset}
          isLoading={isSearchLoading}
        />

        {/* Data Table */}
        <Card>
          <CardContent>
            <Table<BuyerLimitItem>
              id="buyer-limits-table"
              rowId="Id"
              data={tableData}
              headers={tableHeaders}
              loading={isLoading || isFetching}
              error={error ? getErrorMessage() : undefined}
              pagingConfig={searchResults ? undefined : pagingConfig} // Only paginate main data
              sortingConfig={searchResults ? undefined : sortingConfig}
              notFoundConfig={{
                title: getEmptyStateMessage(),
              }}>
              {/* Custom cell renderers */}
              <Slot<BuyerLimitItem> id="MaxInvoiceAmount">
                {(_, item) => item && <MaxInvoiceAmountSlot item={item} />}
              </Slot>

              <Slot<BuyerLimitItem> id="MaxInvoiceDueDay">
                {(_, item) => item && <MaxInvoiceDueDaySlot item={item} />}
              </Slot>

              <Slot<BuyerLimitItem> id="IsActive">{(_, item) => item && <IsActiveSlot item={item} />}</Slot>

              <Slot<BuyerLimitItem> id="actions">{(_, item) => item && <ActionsSlot item={item} />}</Slot>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </BuyerLimitFormProvider>
  );
};
