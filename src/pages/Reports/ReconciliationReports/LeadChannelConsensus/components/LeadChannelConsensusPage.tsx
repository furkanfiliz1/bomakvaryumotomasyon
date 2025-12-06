import { PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Card } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { getLeadChannelConsensusTableHeaders } from '../helpers';
import { useLeadChannelConsensusDropdownData, useLeadChannelConsensusFilterForm } from '../hooks';
import { useLazyGetLeadChannelConsensusReportQuery } from '../lead-channel-consensus.api';
import type {
  LeadChannelConsensusFilters,
  LeadChannelConsensusItem,
  LeadChannelConsensusQueryParams,
} from '../lead-channel-consensus.types';
import { LeadChannelConsensusFilters as FiltersComponent } from './LeadChannelConsensusFilters';
import { ConnectionStatusSlot } from './LeadChannelConsensusTableSlots';

/**
 * Lead Channel Consensus Page Component
 * Following IntegratorConsensus pattern exactly with 100% legacy feature parity
 *
 * Legacy URL: /raporlar/figoscore-lead-mutabakat
 * API: /definitions/leadingChannels/report
 */

export const LeadChannelConsensusPage: React.FC = () => {
  // Dropdown data hook following OperationPricing pattern
  const { leadChannelOptions } = useLeadChannelConsensusDropdownData();

  const [additionalFilters, setAdditionalFilters] = useState<Partial<LeadChannelConsensusFilters>>({});

  // Form hook following GuaranteeProtocol pattern
  const { form, schema, handleSubmit, handleReset } = useLeadChannelConsensusFilterForm({
    onFilterChange: setAdditionalFilters,
    leadChannelOptions,
  });

  // Convert filters to query parameters
  const queryParams = useMemo(
    (): LeadChannelConsensusQueryParams => ({
      LeadChannelId: additionalFilters.LeadChannelId || undefined,
      StartDate: additionalFilters.StartDate ? additionalFilters.StartDate.toISOString().split('T')[0] : undefined,
      EndDate: additionalFilters.EndDate ? additionalFilters.EndDate.toISOString().split('T')[0] : undefined,
    }),
    [additionalFilters],
  );

  // Server-side query hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, getQuery, handleExport } =
    useServerSideQuery(
      useLazyGetLeadChannelConsensusReportQuery,
      queryParams,
      { lazyQuery: true }, // Make it lazy so we control when to fetch
    );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  // Table headers configuration
  const tableHeaders = useMemo(() => getLeadChannelConsensusTableHeaders(), []);

  // Search handler - manually trigger the API call
  const handleSearch = useCallback(() => {
    const formData = form.getValues();

    // Validate form data
    if (!formData.LeadChannelId || !formData.StartDate || !formData.EndDate) {
      console.log('Form validation failed - missing required fields');
      return;
    }

    console.log('Triggering search with data:', formData);

    // Call the form submit handler to update filters
    handleSubmit(formData);

    // Process form data directly and trigger API call immediately
    const searchParams: LeadChannelConsensusQueryParams = {
      LeadChannelId: Number(formData.LeadChannelId),
      StartDate: formData.StartDate,
      EndDate: formData.EndDate,
    };

    console.log('API call parameters:', searchParams);
    getQuery(searchParams);
  }, [handleSubmit, form, getQuery]);

  // Excel export handler
  const handleExcelExport = useCallback(() => {
    const formData = form.getValues();

    // Validate form data before export
    if (formData.LeadChannelId && formData.StartDate && formData.EndDate) {
      // Find the selected lead channel name
      const selectedChannel = leadChannelOptions.find((option) => option.value === Number(formData.LeadChannelId));
      const channelName = selectedChannel ? selectedChannel.label : formData.LeadChannelId;

      // Use lead channel name instead of ID: {ChannelName}_lead_kanal_mutabakatı
      const fileName = `${channelName}_lead_kanal_mutabakatı`;
      handleExport(fileName);
    }
  }, [form, handleExport, leadChannelOptions]);

  return (
    <>
      <PageHeader
        title="Figoskor Lead Kanalı Mutabakatı"
        subtitle="Bu raporda lead kanalı bazında mutabakat detayları görüntülenebilir."
      />

      <Box mx={2}>
        {/* Filter Component */}
        <FiltersComponent
          form={form}
          schema={schema}
          onSearch={handleSearch}
          onReset={handleReset}
          isLoading={isFetching || isLoading}
          handleExcelExport={handleExcelExport}
        />

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<LeadChannelConsensusItem>
            id="lead-channel-consensus-table"
            rowId="AllowanceId"
            data={tableData}
            headers={tableHeaders}
            loading={isFetching || isLoading}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            total={totalCount}
            notFoundConfig={{ title: 'Kanal uzlaştırma verisi bulunamadı' }}>
            {/* Custom cell renderer for integrator connection status column */}
            <Slot<LeadChannelConsensusItem> id="IsIntegratorConnect">
              {(_, row) => <ConnectionStatusSlot isConnected={row?.IsIntegratorConnect ?? null} />}
            </Slot>
          </Table>
        </Card>
      </Box>
    </>
  );
};
