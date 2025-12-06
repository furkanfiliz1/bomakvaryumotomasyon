/**
 * Guarantor Limit Empty State Component
 * Displays empty state when no guarantor limits are available
 */

import { List } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

export const GuarantorLimitEmptyState: React.FC = () => {
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
