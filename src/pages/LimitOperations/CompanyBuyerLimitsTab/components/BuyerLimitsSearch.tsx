/**
 * Buyer Limits Search Component
 * Following OperationPricing filters pattern exactly
 */

import { Form } from '@components';
import { LoadingButton } from '@mui/lab';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
import type { SearchBuyerLimitsParams } from '../company-buyer-limits-tab.types';
import { useBuyerLimitsSearch } from '../hooks';

interface BuyerLimitsSearchProps {
  /** Company ID for search context */
  companyId: number;

  /** Callback when search is performed */
  onSearch?: (params: SearchBuyerLimitsParams) => void;

  /** Callback when search is reset */
  onReset?: () => void;

  /** Whether search is in loading state */
  isLoading?: boolean;
}

/**
 * Search form component for buyer limits
 * Matches legacy renderBuyerSearch UI exactly
 */
export const BuyerLimitsSearch: React.FC<BuyerLimitsSearchProps> = ({
  companyId,
  onSearch,
  onReset,
  isLoading = false,
}) => {
  const { form, schema, handleSearch, handleReset } = useBuyerLimitsSearch({
    companyId,
    onSearch,
    onReset,
  });

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Alıcı Arama
        </Typography>

        <Form form={form} schema={schema}>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <LoadingButton variant="contained" onClick={handleSearch} loading={isLoading}>
              Uygula
            </LoadingButton>
            <Button variant="outlined" onClick={handleReset} disabled={isLoading}>
              Temizle
            </Button>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  );
};
