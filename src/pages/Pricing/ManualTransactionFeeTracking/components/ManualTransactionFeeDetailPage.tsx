import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PageHeader } from '../../../../components/shared';

/**
 * Manual Transaction Fee Detail Page Component
 * Displays detailed information for a manual transaction fee tracking record
 */
const ManualTransactionFeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <PageHeader title="Manuel İşlem Ücreti Detayı" subtitle={`Manuel işlem ücreti detayları - ID: ${id}`} />

      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              İşlem Detayları
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detay sayfası implementasyonu devam ediyor...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ManualTransactionFeeDetailPage;
