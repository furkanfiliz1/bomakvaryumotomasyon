import { Form } from '@components';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import { ProductTypes } from '@types';
import React from 'react';
import type { FinancerRatioInfoDetail } from '../financial-settings.types';
import { useRatioForm } from '../hooks/useRatioForm';

interface RatioManagementProps {
  ratios: FinancerRatioInfoDetail[];
  onAdd: (ratio: Omit<FinancerRatioInfoDetail, 'Id'>) => void;
  onRemove: (index: number) => void;
  productType: ProductTypes;
  title?: string;
}

/**
 * Ratio Management Component
 * Following reference project AddRatio.js pattern with Form component integration
 * Supports product-type specific rendering and validation
 */
const RatioManagement: React.FC<RatioManagementProps> = ({ ratios, onAdd, onRemove, productType, title }) => {
  const { form, schema, resetForm } = useRatioForm(productType);

  // Filter ratios by product type (like in AddRatio.js)
  const filteredRatios = ratios.filter((ratio) => ratio.ProductType === productType);

  const handleAdd = () => {
    const values = form.getValues();

    // Convert to numbers with parseFloat for decimal support
    const systemRatio = parseFloat(String(values.SystemRatio)) || 0;
    const financerRatio = parseFloat(String(values.FinancerRatio)) || 0;

    // Validate before adding (allow small floating point errors)
    const total = systemRatio + financerRatio;
    if (Math.abs(total - 100) > 0.01) {
      alert(`Figo Oranı + Banka Oranı toplamı 100 olmalıdır (Şu an: ${total.toFixed(2)})`);
      return;
    }

    onAdd({
      RatioValue: financerRatio,
      SystemRatio: systemRatio,
      FinancerRatio: financerRatio,
      MinAmount: values.MinAmount,
      MaxAmount: values.MaxAmount,
      CurrencyId: 1,
      ProductType: productType,
    });

    // Reset form
    resetForm();
  };

  // Determine if we should show limit columns (hidden for CHEQUES_FINANCING)
  const showLimitColumns = productType !== ProductTypes.CHEQUES_FINANCING;

  // Get product-specific title
  const getProductTitle = () => {
    if (title) return title;
    switch (productType) {
      case ProductTypes.SME_FINANCING:
        return 'Fatura Finansmanı İşlem Oranları';
      case ProductTypes.CHEQUES_FINANCING:
        return 'Çek Finansmanı İşlem Oranları';
      case ProductTypes.SUPPLIER_FINANCING:
        return 'Tedarikçi Finansmanı İşlem Oranları';
      case ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE:
        return 'Spot Kredi İşlem Oranları';
      case ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE:
        return 'Faturasız Spot Kredi İşlem Oranları';
      case ProductTypes.RECEIVABLE_FINANCING:
        return 'Alacak Finansmanı İşlem Oranları';
      case ProductTypes.COMMERCIAL_LOAN:
        return 'Ticari Kredi İşlem Oranları';
      case ProductTypes.ROTATIVE_LOAN:
        return 'Rotatif Kredi İşlem Oranları';
      default:
        return 'İşlem Oranları';
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
        {getProductTitle()}
      </Typography>

      {/* Add New Ratio Form */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={10}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={form as any} schema={schema} space={2} />
        </Grid>
        <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button fullWidth variant="contained" onClick={handleAdd} size="small">
            Ekle
          </Button>
        </Grid>
      </Grid>

      {/* Ratios List */}
      <Paper variant="outlined">
        {filteredRatios.map((ratio, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderBottom: index < filteredRatios.length - 1 ? 1 : 0,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: 'grey.100',
                borderRadius: 1,
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'text.secondary',
              }}>
              #{index + 1}
            </Box>
            <Stack direction="row" spacing={4} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Figo Oranı
                </Typography>
                <Typography variant="body2">{ratio.SystemRatio || 0} %</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Banka Oranı
                </Typography>
                <Typography variant="body2">{ratio.FinancerRatio} %</Typography>
              </Box>
              {showLimitColumns && (
                <>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      En Düşük
                    </Typography>
                    <Typography variant="body2">{ratio.MinAmount || '-'} ₺</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      En Yüksek
                    </Typography>
                    <Typography variant="body2">{ratio.MaxAmount || '-'} ₺</Typography>
                  </Box>
                </>
              )}
            </Stack>
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                // Find the actual index in the full ratios array
                const actualIndex = ratios.findIndex((r) => r === ratio);
                onRemove(actualIndex);
              }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {/* Default Ratio */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'grey.50',
          }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              bgcolor: 'grey.200',
              borderRadius: 1,
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.secondary',
            }}>
            Varsayılan
          </Box>
          <Stack direction="row" spacing={4} sx={{ flex: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Figo Oranı
              </Typography>
              <Typography variant="body2">0 %</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Banka Oranı
              </Typography>
              <Typography variant="body2">100 %</Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default RatioManagement;
