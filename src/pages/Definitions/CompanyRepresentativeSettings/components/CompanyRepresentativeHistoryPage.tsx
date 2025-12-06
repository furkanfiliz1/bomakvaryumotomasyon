/**
 * Company Representative History Page
 * Matches legacy CustomerManagerHistory functionality exactly
 * Following OperationPricing patterns
 */

import { Box, Card, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../../components/shared/PageHeader';
import { HUMAN_READABLE_DATE } from '../../../../constant';
import { useErrorListener } from '../../../../hooks';

// Local imports following OperationPricing patterns
import { useGetCompanyCustomerManagerHistoryQuery } from '../company-representative-settings.api';
import type { CompanyCustomerManagerHistoryItem } from '../company-representative-settings.types';

/**
 * Company Representative History Page Component
 * Displays history of company customer manager assignments
 * Matches legacy system UI and functionality exactly
 */
const CompanyRepresentativeHistoryPage: React.FC = () => {
  const { companyId } = useParams<{
    companyId: string;
  }>();

  // Get history data
  const { data, error, isLoading } = useGetCompanyCustomerManagerHistoryQuery(
    {
      companyId: companyId ? Number(companyId) : undefined,
    },
    {
      skip: !companyId,
    },
  );

  // Error handling
  useErrorListener(error);

  const historyList = data?.HistoryList || [];
  const companyInfo = historyList[0]; // First item contains company info

  const renderHistoryItem = (item: CompanyCustomerManagerHistoryItem) => {
    return (
      <Card key={item.Id} sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
              Müşteri Temsilcisi
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {item.ManagerName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
              Ürün
            </Typography>
            <Typography variant="body1">{item.ProductTypeDescription}</Typography>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
              Finansör
            </Typography>
            <Typography variant="body1">{item.FinancerCompanyName || '-'}</Typography>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
              Alıcı
            </Typography>
            <Typography variant="body1">{item.BuyerCompanyName || '-'}</Typography>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
              Geçerlilik Başlangıç Tarihi
            </Typography>
            <Typography variant="body1">
              {item.StartDate ? dayjs(item.StartDate).format(HUMAN_READABLE_DATE) : '-'}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <Card sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" color="textSecondary">
        Geçmiş Kayıt Bulunamadı
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        Bu şirket için müşteri temsilcisi geçmişi mevcut değil
      </Typography>
    </Card>
  );

  return (
    <>
      <PageHeader title="Müşteri Temsilcisi Geçmişi" subtitle="Geçmiş Atama Kayıtları" />

      <Box mx={2}>
        {/* Company Information */}
        {companyInfo && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {companyInfo.CompanyName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {companyInfo.CompanyIdentifier}
            </Typography>
          </Box>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography>Veriler yükleniyor...</Typography>
          </Card>
        )}

        {/* History List */}
        {!isLoading && <>{historyList.length > 0 ? <>{historyList.map(renderHistoryItem)}</> : renderEmptyState()}</>}
      </Box>
    </>
  );
};

export default CompanyRepresentativeHistoryPage;
