import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom slot for company name with truncation
 */
export const CompanyNameSlot: React.FC<{ companyName: string }> = ({ companyName }) => {
  if (!companyName) return <Typography variant="body2">-</Typography>;

  return (
    <Box sx={{ maxWidth: 250 }}>
      <Typography
        variant="body2"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={companyName}>
        {companyName}
      </Typography>
    </Box>
  );
};

/**
 * Custom slot for call result type with null handling
 */
export const CallResultSlot: React.FC<{ callResultTypeName: string | null }> = ({ callResultTypeName }) => {
  if (!callResultTypeName) {
    return (
      <Typography variant="body2" color="text.secondary">
        -
      </Typography>
    );
  }

  return <Typography variant="body2">{callResultTypeName}</Typography>;
};

/**
 * Custom slot for product types array display
 */
export const ProductTypesSlot: React.FC<{
  productTypes: Array<{ ProductType: number; ProductTypeDescription: string }> | null;
}> = ({ productTypes }) => {
  if (!productTypes || productTypes.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        -
      </Typography>
    );
  }

  // Show product descriptions, comma separated, with proper wrapping
  const productText = productTypes.map((p) => p.ProductTypeDescription).join(', ');

  return (
    <Box sx={{ maxWidth: 250 }}>
      <Typography
        variant="body2"
        sx={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.2,
        }}
        title={productText}>
        {productText}
      </Typography>
    </Box>
  );
};

/**
 * Custom slot for action buttons (Detail button)
 */
export const ActionsSlot: React.FC<{ companyId: number }> = ({ companyId }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/companies/${companyId}/genel`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button variant="outlined" size="small" onClick={handleDetailClick} sx={{ minWidth: '70px' }}>
        Detay
      </Button>
    </Box>
  );
};

// Export all slots in an object for easy access (following OperationPricing pattern)
export const CustomerTrackingTableSlots = {
  CompanyNameSlot,
  CallResultSlot,
  ProductTypesSlot,
  ActionsSlot,
};

export default CustomerTrackingTableSlots;
