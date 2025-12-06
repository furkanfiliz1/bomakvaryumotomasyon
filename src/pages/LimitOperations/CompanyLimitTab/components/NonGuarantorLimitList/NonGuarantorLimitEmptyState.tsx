/**
 * Non-Guarantor Limit Empty State Component
 * Displays empty state when no non-guarantor limits are found
 * Matches legacy design patterns
 */

import { List } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

/**
 * Non-Guarantor Limit Empty State Component
 */
export const NonGuarantorLimitEmptyState: React.FC = () => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#EAECEF' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <List fontSize="large" color="action" />
        <Typography variant="body2" color="text.secondary">
          Tercih edilen bankalarla ilgili belirlenen bir limit bulunmamaktadır.
        </Typography>
      </Box>
    </Paper>
  );
};
