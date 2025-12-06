/**
 * Limit Dashboard Component
 * Displays limit information with progress bars and amounts
 * Matches legacy LimitDashboard.js functionality exactly
 */

import { Box, Card, CardContent, LinearProgress, Typography } from '@mui/material';
import React from 'react';
import type { LimitDashboardProps } from '../company-limit-tab.types';
import { formatCurrency, translateProductTypeName } from '../helpers';

/**
 * Limit Dashboard Component
 * Shows limit cards with progress bars for each guarantor company
 * Matches legacy dashboard display exactly
 */
export const LimitDashboard: React.FC<LimitDashboardProps> = ({ dashboardData, productTypes }) => {
  if (!dashboardData || dashboardData.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Dashboard verisi bulunamadı
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
      {dashboardData.map((dashboard, index) => {
        // Calculate progress percentage
        const progressValue = dashboard.Amount > 0 ? (dashboard.RemainingLimit / dashboard.Amount) * 100 : 0;

        return (
          <Card key={index} sx={{ boxShadow: 1 }}>
            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Typography variant="h6" gutterBottom>
                {dashboard.ProductType
                  ? `${translateProductTypeName(dashboard.ProductType, productTypes)} Limiti`
                  : 'Limit'}
              </Typography>

              {/* Remaining Limit Section */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Kalan Limit
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {formatCurrency(dashboard.RemainingLimit || 0)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 300 }}>
                    {formatCurrency(dashboard.Amount || 0)}
                  </Typography>
                </Box>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(progressValue, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#17a2b8', // Info color matching legacy
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              {/* Used Limit (Risk) Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Riskler:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'red', // Danger color matching legacy
                  }}>
                  {formatCurrency(dashboard.UsedLimit || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
