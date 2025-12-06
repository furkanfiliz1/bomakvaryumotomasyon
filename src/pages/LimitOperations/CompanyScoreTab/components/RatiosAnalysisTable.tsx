/**
 * Ratios Analysis Table Component
 * Displays financial ratios data in table format following OperationPricing pattern
 */

import { Alert, Box, Typography } from '@mui/material';
import React from 'react';

import type { RatiosAnalysisTableProps } from '../company-score-tab.types';

export const RatiosAnalysisTable: React.FC<RatiosAnalysisTableProps> = ({ financialAnalysisData, loading }) => {
  // Show no data state
  if (!loading && (!financialAnalysisData || financialAnalysisData.length === 0)) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Finansal oran verileri bulunamadı.
      </Alert>
    );
  }

  // Sort data by year ascending (oldest first)
  const sortedData = financialAnalysisData ? [...financialAnalysisData].sort((a, b) => a.Year - b.Year) : [];

  return (
    <Box sx={{ mb: 3, p: 3, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Hesaplama Detayları
      </Typography>

      {/* Loading state */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Yükleniyor...</Typography>
        </Box>
      )}

      {/* Render table for each year */}
      {sortedData.map((yearData) => (
        <Box key={yearData.Year} sx={{ mb: 4, pb: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            {/* Year Label - Left Side */}
            <Box sx={{ minWidth: '200px', flexShrink: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                {yearData.Year} Skor Tablosu
              </Typography>
            </Box>

            {/* Table - Right Side */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ border: '1px solid #dee2e6', borderRadius: 1, overflow: 'hidden' }}>
                <Box
                  component="table"
                  sx={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    '& th, & td': {
                      border: '1px solid #dee2e6',
                      padding: '8px 12px',
                      textAlign: 'left',
                    },
                    '& th': {
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    },
                    '& td': {
                      fontSize: '13px',
                    },
                  }}>
                  <Box component="thead">
                    <Box component="tr">
                      <Box component="th">Skorlama Kategorisi</Box>
                      <Box component="th">Rasyo</Box>
                      <Box component="th">Puan</Box>
                      <Box component="th">Ağırlık</Box>
                      <Box component="th">Trend</Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {yearData.Ratios?.map((ratio, index) => (
                      <Box component="tr" key={`${yearData.Year}-${ratio.RatioId}-${index}`}>
                        <Box component="td">
                          <Typography variant="body2">{ratio.Name}</Typography>
                        </Box>
                        <Box component="td">
                          <Typography variant="body2" fontFamily="monospace">
                            {ratio.Ratio !== null ? ratio.Ratio.toFixed(4) : 'N/A'}
                          </Typography>
                        </Box>
                        <Box component="td">
                          <Typography variant="body2" fontFamily="monospace">
                            {ratio.Point !== null ? ratio.Point.toFixed(4) : 'N/A'}
                          </Typography>
                        </Box>
                        <Box component="td">
                          <Typography variant="body2" fontFamily="monospace">
                            {ratio.Weight !== null ? ratio.Weight.toFixed(4) : 'N/A'}
                          </Typography>
                        </Box>
                        <Box component="td">
                          <Typography variant="body2" fontFamily="monospace">
                            {ratio.Trend !== null ? ratio.Trend.toFixed(4) : '0.0000'}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
