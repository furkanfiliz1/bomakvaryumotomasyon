import { Business as BusinessIcon } from '@mui/icons-material';
import { Box, Card, CardContent, CardHeader, Chip, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import type { ParentBranch, ParentRequest } from '../customer-request-branch-detail.types';

export interface CustomerSummaryCardProps {
  parentBranch?: ParentBranch | null;
  parentRequest?: ParentRequest | null;
  sx?: object;
}

/**
 * Customer Summary Card Component
 * Displays customer overview information matching legacy layout
 */
export const CustomerSummaryCard: React.FC<CustomerSummaryCardProps> = ({ parentBranch, parentRequest, sx }) => {
  // Status badge styling matching legacy system
  const getStatusChip = (status: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'default';

    switch (status?.toLowerCase()) {
      case 'tamamlandı':
      case 'completed':
        color = 'success';
        break;
      case 'başlandı':
      case 'started':
        color = 'warning';
        break;
      case 'başlanmadı':
      case 'not started':
        color = 'default';
        break;
      default:
        color = 'default';
    }

    return <Chip label={status} color={color} size="small" sx={{ fontWeight: 'bold' }} />;
  };

  return (
    <Card sx={sx}>
      <CardHeader
        avatar={<BusinessIcon />}
        title="Müşteri Özeti"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                VKN
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {parentBranch?.TargetCompanyIdentifier || '-'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Ünvan
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {parentBranch?.TargetCompanyTitle || '-'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Talep Tarihi
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {parentRequest?.RequestDate ? dayjs(parentRequest.RequestDate).format('DD.MM.YYYY') : '-'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Durum
              </Typography>
              <Box mt={0.5}>{getStatusChip(parentBranch?.StatusDescription || 'Başlanmadı')}</Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
