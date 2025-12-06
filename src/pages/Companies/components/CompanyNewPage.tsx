import { Form, PageHeader } from '@components';
import { SaveOutlined as SaveIcon } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { useCompanyNewForm } from '../hooks';

/**
 * Company Creation Page Component
 * Following OperationPricing pattern with Material-UI layout and Form component
 * Matches legacy CompanyNew.js functionality with modern architecture
 */
export const CompanyNewPage: React.FC = () => {
  const { form, schema, onSubmit, isLoading, isFormLoading, isDistrictsLoading } = useCompanyNewForm();

  if (isFormLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <PageHeader title="Yeni Şirket Oluştur" subtitle="Şirket bilgilerini doldurun" />

      {/* Form Card */}
      <Box p={2}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <form onSubmit={onSubmit}>
              {/* Form Fields using schema-based Form component */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Form form={form as any} schema={schema} space={3} />

              {/* Districts Loading State */}
              {isDistrictsLoading && (
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    İlçeler yükleniyor...
                  </Typography>
                </Box>
              )}

              {/* Form Actions */}
              <Box display="flex" justifyContent="space-between" gap={2} mt={4}>
                <Button variant="outlined" component={Link} to="/companies" disabled={isLoading}>
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                  disabled={isLoading}
                  sx={{ minWidth: 120 }}>
                  {isLoading ? 'Oluşturuluyor...' : 'Şirketi Oluştur'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
