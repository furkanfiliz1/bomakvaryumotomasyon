/**
 * Campaign Discount Definition Page Component
 * Matches legacy CampaignDiscountDef.js exactly
 * Route: /definitions/campaign-discount-definition
 */

import { PageHeader } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLazyGetCampaignDiscountListQuery } from '../campaign-discount-definition.api';
import type { CampaignDiscountItem, CampaignDiscountSearchParams } from '../campaign-discount-definition.types';
import { DEFAULT_CAMPAIGN_TYPE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_TYPE } from '../helpers';
import { CampaignDiscountDefinitionFilters } from './CampaignDiscountDefinitionFilters';
import { CampaignDiscountDefinitionForm } from './CampaignDiscountDefinitionForm';
import { CampaignDiscountDefinitionList } from './CampaignDiscountDefinitionList';

const CampaignDiscountDefinitionPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filter params from URL
  const filterParams = useMemo((): CampaignDiscountSearchParams => {
    return {
      page: parseInt(searchParams.get('page') ?? '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10),
      sortType: searchParams.get('sortType') ?? DEFAULT_SORT_TYPE,
      Month: searchParams.get('Month') ?? undefined,
      Year: searchParams.get('Year') ?? undefined,
      campaignType: parseInt(searchParams.get('campaignType') ?? String(DEFAULT_CAMPAIGN_TYPE), 10),
    };
  }, [searchParams]);

  const { data, isLoading, error, pagingConfig, sortingConfig, refetch } = useServerSideQuery(
    useLazyGetCampaignDiscountListQuery,
    filterParams,
  );

  // Handle errors with useErrorListener
  useErrorListener(error);

  const handleFormSuccess = () => {
    refetch();
  };

  const handleSearch = (params: { Month?: string | null; Year?: string | null }) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1'); // Reset page on filter change

    if (params.Month) {
      newParams.set('Month', params.Month);
    } else {
      newParams.delete('Month');
    }

    if (params.Year) {
      newParams.set('Year', params.Year);
    } else {
      newParams.delete('Year');
    }

    setSearchParams(newParams);
  };

  return (
    <>
      <PageHeader title="Kampanya İndirim Tanımlama" subtitle="Kampanya indirim oranı tanımlama ve arama" />

      <Box mx={2}>
        {/* Create Form Section */}
        <CampaignDiscountDefinitionForm onSuccess={handleFormSuccess} />

        {/* Search/Filter Section */}
        <CampaignDiscountDefinitionFilters
          defaultMonth={filterParams.Month}
          defaultYear={filterParams.Year}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* List Section */}
        <CampaignDiscountDefinitionList
          items={(data?.Items ?? []) as CampaignDiscountItem[]}
          isLoading={isLoading}
          pagingConfig={pagingConfig}
          sortingConfig={sortingConfig}
        />
      </Box>
    </>
  );
};

export default CampaignDiscountDefinitionPage;
