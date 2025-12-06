import { Box, Typography } from '@mui/material';
import React from 'react';
import type { InvoiceBuyerAnalysisResponse } from '../company-invoice-buyer-tab.types';

interface InvoiceBuyerHeaderProps {
  data?: InvoiceBuyerAnalysisResponse;
}

/**
 * Header component for Invoice Buyer Analysis
 * Displays summary information and statistics
 */
const InvoiceBuyerHeader: React.FC<InvoiceBuyerHeaderProps> = ({ data }) => {
  const receiversCount = data?.Receivers?.length || 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Fatura Alıcı Analizi
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Toplam {receiversCount} alıcı bilgisi
      </Typography>
    </Box>
  );
};

export default InvoiceBuyerHeader;
