/**
 * Guarantor Limit Header Component
 * Displays product type name and summary information
 */

import { Box, Typography } from '@mui/material';
import { currencyFormatter } from '@utils';
import React from 'react';
import type { GuarantorCompanyListItem } from '../../company-limit-tab.types';
import { translateProductTypeName } from '../../helpers';

interface GuarantorLimitHeaderProps {
  limit: GuarantorCompanyListItem;
}

export const GuarantorLimitHeader: React.FC<GuarantorLimitHeaderProps> = ({ limit }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 600 }}>
        {limit.ProductType ? `${translateProductTypeName(limit.ProductType)} Listesi` : ''}
      </Typography>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Toplam Limit
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {currencyFormatter(limit.Amount, 'TRY')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Riskler
          </Typography>
          <Typography
            variant="body2"
            fontWeight="bold"
            color={limit.UsedLimit && limit.UsedLimit > 0 ? 'red' : 'text.primary'}>
            {currencyFormatter(limit.UsedLimit, 'TRY')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Kalan Limit
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {currencyFormatter(limit.RemainingLimit, 'TRY')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
