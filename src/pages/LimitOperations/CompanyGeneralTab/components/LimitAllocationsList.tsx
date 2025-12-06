import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
// Update the import to match the actual exported type name, or export LimitAllocation from the types file
import { InputCurrencyWithoutForm } from '@components';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import { CustomTextInput } from 'src/components/common/Form/_partials/components/CustomTextInput';
import type { LimitAllocation } from '../company-general-tab.types'; // <-- Change 'LimitAllocation' to the correct exported type if needed
import { formatCurrency } from '../helpers';

interface LimitAllocationsListProps {
  limitAllocations: LimitAllocation[] | undefined;
}

/**
 * Limit Allocations List Component
 * Following OperationPricing pattern for data display
 */
export const LimitAllocationsList: React.FC<LimitAllocationsListProps> = ({ limitAllocations }) => {
  if (!limitAllocations || limitAllocations.length === 0) {
    return null;
  }

  return (
    <Card elevation={1} sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Limit Tahsis Bilgileri
            </Typography>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={2}>
              {limitAllocations.map((allocation) => (
                <Grid item xs={12} key={allocation.Id}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomInputLabel label="Limit Tahsis Tipi" />
                        <CustomTextInput fullWidth value={allocation.TypeDescription || ''} disabled />
                      </Grid>

                      <Grid item xs={12}>
                        <CustomInputLabel label="Açıklama" />
                        <CustomTextInput fullWidth value={allocation.Description || ''} disabled multiline rows={2} />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomInputLabel label="Ürün" />
                        <CustomTextInput fullWidth value={allocation.ProductTypeDescription || ''} disabled />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomInputLabel label="Finansör" />
                        <CustomTextInput fullWidth value={allocation.FinancierCompany || ''} disabled />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomInputLabel label="Talep Edilen Limit" />
                        <InputCurrencyWithoutForm
                          onChange={() => {}}
                          currency="TRY"
                          name="RequestedLimit"
                          key="RequestedLimit"
                          value={formatCurrency(allocation.RequestedLimit)}
                          disabled
                          id="RequestedLimit"
                          maxLength={20}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
