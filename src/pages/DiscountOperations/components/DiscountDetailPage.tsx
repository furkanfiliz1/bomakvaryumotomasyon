import { useErrorListener } from '@hooks';
import { Box, Card, Container, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/shared';
import { getDiscountDetailTabs } from '../helpers/discount-detail.helpers';
import { getPageTitle, getProductTypeFlags, getProductTypeFromFlags } from '../helpers/product-type.helpers';
import { useDiscountDetailData } from '../hooks/useDiscountDetailData';
import { DiscountDetailTabContent } from './DiscountDetailTabContent';

const DiscountDetailPage: React.FC = () => {
  const { allowanceId } = useParams<{ allowanceId: string }>();
  const [tabIndex, setTabIndex] = useState(0);

  // Use the custom hook to manage data fetching
  const { allowanceTypeData, allowanceKind, allowanceNotifyBuyer, allowanceDetail, isLoading, error, refetch } =
    useDiscountDetailData({ allowanceId });

  // Error handling
  useErrorListener(error ? [error as Error] : []);

  // Get product type flags from helpers
  const productFlags = getProductTypeFlags(allowanceKind, allowanceNotifyBuyer);
  const productType = getProductTypeFromFlags(productFlags);

  // Get page title from helpers

  const pageTitle = getPageTitle(productFlags);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Typography>Yükleniyor...</Typography>
      </Container>
    );
  }

  if (error || (!allowanceTypeData && !isLoading)) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Typography color="error">Hata: Veri yüklenirken bir sorun oluştu.</Typography>
      </Container>
    );
  }

  // Get available tabs based on product type and business rules
  const availableTabs = getDiscountDetailTabs(productFlags, allowanceNotifyBuyer, allowanceTypeData?.Status ?? 0);

  return (
    <>
      <PageHeader title={pageTitle} subtitle={`Talep No: ${allowanceDetail?.Id || allowanceId}`} />

      <Box mx={2}>
        {/* Tab Section */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="discount detail tabs"
              variant="scrollable"
              scrollButtons="auto">
              {availableTabs.map((tab) => (
                <Tab key={tab.index} label={tab.label} />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Tab Content */}
            <DiscountDetailTabContent
              tabIndex={availableTabs[tabIndex]?.index || 0}
              allowanceId={allowanceId || ''}
              allowanceKind={allowanceKind}
              productFlags={productFlags}
              productType={productType}
              allowanceTypeData={allowanceTypeData}
              setTabIndex={setTabIndex}
              refetch={refetch}
            />
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default DiscountDetailPage;
