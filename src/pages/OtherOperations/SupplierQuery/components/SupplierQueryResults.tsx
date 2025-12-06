import { Alert, Box, Card, CardContent, Divider, Typography } from '@mui/material';
import React from 'react';
import type { SupplierQueryResponse } from '../supplier-query.types';

interface SupplierQueryResultsProps {
  results: SupplierQueryResponse;
  buyerCode: string; // The searched buyer code
}

const SupplierQueryResults: React.FC<SupplierQueryResultsProps> = ({ results, buyerCode }) => {
  const { suppliers } = results;

  if (!suppliers || suppliers.length === 0) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tanımlı Tedarikçi Listesi
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Alert severity="info">&ldquo;{buyerCode}&rdquo; alıcı kodu için tanımlı tedarikçi bulunamadı.</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tanımlı Tedarikçi Listesi
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Desktop Headers - matches legacy responsive behavior */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 2,
            px: 2,
            py: 1,
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}>
          <Typography variant="body2" color="text.secondary">
            Şirket VKN
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Statü Durumu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Alt Statü Kodu
          </Typography>
        </Box>
      </Box>

      {/* Results List - matches legacy layout exactly */}
      {suppliers.map((supplier, index) => (
        <Card key={`${supplier.CompanyIdentifier}-${index}`} variant="outlined" sx={{ mb: 2, boxShadow: 1 }}>
          <CardContent sx={{ py: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 2,
                alignItems: 'center',
              }}>
              {/* Company Identifier */}
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.75rem', mb: 0.5 }}>
                  Şirket VKN
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {supplier.CompanyIdentifier}
                </Typography>
              </Box>

              {/* Status Description */}
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.75rem', mb: 0.5 }}>
                  Statü Durumu
                </Typography>
                <Typography variant="body1">{supplier.StatusCodeDescription}</Typography>
              </Box>

              {/* Subscription Code */}
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.75rem', mb: 0.5 }}>
                  Alt Statü Kodu
                </Typography>
                <Typography variant="body1">{supplier.SubscCode || '-'}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Card>
  );
};

export default SupplierQueryResults;
