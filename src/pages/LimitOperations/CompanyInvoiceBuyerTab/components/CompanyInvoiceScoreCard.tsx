import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import type { InvoiceBuyerAnalysisResponse } from '../company-invoice-buyer-tab.types';

interface CompanyInvoiceScoreCardProps {
  companyName?: string;
  identifier?: string;
  data?: InvoiceBuyerAnalysisResponse;
}

/**
 * Company Invoice Score Card Component
 * Displays company information and score statistics
 * Matches legacy ScoreCompanyInvoiceScoreCard layout exactly
 */
const CompanyInvoiceScoreCard: React.FC<CompanyInvoiceScoreCardProps> = ({ companyName, identifier, data }) => {
  const minScore = data?.MinInvoiceScore || 0;
  const maxScore = data?.MaxInvoiceScore || 0;
  const avgScore = data?.AverageInvoiceScore || 0;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          {/* Company Information Section */}
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h6" gutterBottom>
              Firma Bilgileri
            </Typography>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {companyName || 'Şirket Adı'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {identifier || 'Şirket Tanımlayıcısı'}
            </Typography>
          </Grid>

          {/* Score Statistics Section */}
          <Grid item xs={12} md={6} lg={8}>
            <Grid container spacing={2} justifyContent="flex-end">
              {/* Min Score */}
              <Grid item xs={4} sm={3} md={2}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 2,
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.2)',
                      py: 0.5,
                      px: 1,
                    }}>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }} color={'white'}>
                      Min Skor
                    </Typography>
                  </Box>
                  <Box sx={{ py: 2, px: 1 }}>
                    <Typography variant="h5" fontWeight="bold">
                      {minScore}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Max Score */}
              <Grid item xs={4} sm={3} md={2}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 2,
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.2)',
                      py: 0.5,
                      px: 1,
                    }}>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }} color={'white'}>
                      Max Skor
                    </Typography>
                  </Box>
                  <Box sx={{ py: 2, px: 1 }}>
                    <Typography variant="h5" fontWeight="bold">
                      {maxScore}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Average Score */}
              <Grid item xs={4} sm={3} md={2}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 2,
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.2)',
                      py: 0.5,
                      px: 1,
                    }}>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }} color={'white'}>
                      Ort. Skor
                    </Typography>
                  </Box>
                  <Box sx={{ py: 2, px: 1 }}>
                    <Typography variant="h5" fontWeight="bold">
                      {avgScore.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyInvoiceScoreCard;
