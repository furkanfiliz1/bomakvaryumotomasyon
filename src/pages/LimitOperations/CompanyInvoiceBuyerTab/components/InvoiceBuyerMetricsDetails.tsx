import { Box, Typography } from '@mui/material';
import React from 'react';
import type { InvoiceBuyerAnalysisReceiver } from '../company-invoice-buyer-tab.types';

interface InvoiceBuyerMetricsDetailsProps {
  receiver: InvoiceBuyerAnalysisReceiver;
}

/**
 * Component for displaying detailed metrics of a receiver
 * Used in expandable table rows
 */
const InvoiceBuyerMetricsDetails: React.FC<InvoiceBuyerMetricsDetailsProps> = ({ receiver }) => {
  const hasMetrics = receiver.Metrics && receiver.Metrics.length > 0;

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default' }}>
      <Typography variant="subtitle2" gutterBottom>
        Metrik Detayları
      </Typography>
      {hasMetrics ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {receiver.Metrics.map((metric) => (
            <Box key={metric.Name} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant="body2">{metric.Name}:</Typography>
              <Typography variant="body2" fontWeight={500}>
                {metric.Score}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Metrik bilgisi bulunmamaktadır
        </Typography>
      )}
    </Box>
  );
};

export default InvoiceBuyerMetricsDetails;
