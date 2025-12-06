// Product Type Tabs Component - Following OperationPricing UI patterns exactly

import { Box, Button } from '@mui/material';
import React from 'react';
import type { ProductType } from '../company-score-rules.types';
import { getProductTypeOptions } from '../helpers';

interface ProductTypeTabsProps {
  selectedProductType: ProductType;
  onProductTypeChange: (productType: ProductType) => void;
  screenWidth?: number;
}

/**
 * Product Type Tabs Component
 * Matches legacy button group for product type selection exactly
 */
export const ProductTypeTabs: React.FC<ProductTypeTabsProps> = ({
  selectedProductType,
  onProductTypeChange,
  screenWidth = 1200,
}) => {
  const productTypeOptions = getProductTypeOptions();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: screenWidth >= 1094 ? 3 : 2.5,
        flexWrap: 'wrap',
      }}>
      {productTypeOptions.map((option) => (
        <Button
          key={option.id}
          variant={selectedProductType === option.id ? 'contained' : 'outlined'}
          color={selectedProductType === option.id ? 'info' : 'inherit'}
          onClick={() => onProductTypeChange(option.id as ProductType)}
          sx={{
            minWidth: 120,
            textTransform: 'none',
          }}>
          {option.label}
        </Button>
      ))}
    </Box>
  );
};
