/**
 * Campaign Discount Definition Filters Component
 * Matches legacy CampaignDiscountDef.js renderSearch() section exactly
 */

import { Button, Form, LoadingButton } from '@components';
import { Search } from '@mui/icons-material';
import { Box, Card, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useCampaignDiscountDefinitionFilters } from '../hooks';

interface CampaignDiscountDefinitionFiltersProps {
  defaultMonth?: string | null;
  defaultYear?: string | null;
  onSearch: (params: { Month?: string | null; Year?: string | null }) => void;
  isLoading?: boolean;
}

export const CampaignDiscountDefinitionFilters: React.FC<CampaignDiscountDefinitionFiltersProps> = ({
  defaultMonth,
  defaultYear,
  onSearch,
  isLoading,
}) => {
  const { form, schema } = useCampaignDiscountDefinitionFilters({
    defaultMonth,
    defaultYear,
  });

  // Sync form with URL params when they change
  useEffect(() => {
    form.setValue('Month', defaultMonth ?? '');
    form.setValue('Year', defaultYear ?? '');
  }, [defaultMonth, defaultYear, form]);

  const handleSearch = () => {
    const formData = form.getValues();
    onSearch({
      Month: formData.Month ? String(formData.Month) : null,
      Year: formData.Year ? String(formData.Year) : null,
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ py: 1, fontWeight: 'bold' }}>
        Kampanya Arama
      </Typography>
      <Card sx={{ mb: 2, p: 2 }}>
        <Box>
          <Form form={form} schema={schema} childCol={2}>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
              <LoadingButton
                id="search-campaign-discount-btn"
                variant="outlined"
                color="primary"
                onClick={handleSearch}
                loading={isLoading}
                startIcon={<Search />}>
                Uygula
              </LoadingButton>

              <Button
                id="reset-campaign-discount-filters-btn"
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={() => {
                  form.reset();
                  onSearch({ Month: null, Year: null });
                }}>
                Temizle
              </Button>
            </Box>
          </Form>
        </Box>
      </Card>
    </Box>
  );
};

export default CampaignDiscountDefinitionFilters;
