/**
 * E-Invoice Section Component
 * Following OperationPricing pattern with modern form implementation
 * Matches the image structure with schema-based form validation
 */

import { Form } from '@components';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import { CustomTextInput } from 'src/components/common/Form/_partials/components/CustomTextInput';
import type { InvoiceIntegrator, InvoiceIntegratorDetail } from '../company-document-data-tab.types';
import { useEInvoiceStatusForm, type EInvoiceStatusFormData } from '../hooks';

interface EInvoiceSectionProps {
  invoiceIntegrator: InvoiceIntegrator;
  invoiceIntegratorDetail?: InvoiceIntegratorDetail;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onUpdateInvoiceStatus?: (data: EInvoiceStatusFormData) => void;
  isUpdating?: boolean;
}

/**
 * E-Invoice Integration Section with Form - matching the image layout exactly
 */
export const EInvoiceSection: React.FC<EInvoiceSectionProps> = ({
  invoiceIntegrator,
  invoiceIntegratorDetail,
  loading,
  error,
  onRefresh,
  onUpdateInvoiceStatus,
  isUpdating = false,
}) => {
  // Initialize form hook with proper submit handler
  const { form, schema, displayData, handleSubmit } = useEInvoiceStatusForm({
    invoiceIntegratorDetail,
    invoiceIntegrator,
    onSubmit: (data: EInvoiceStatusFormData) => {
      if (onUpdateInvoiceStatus) {
        onUpdateInvoiceStatus(data);
      }
    },
  });

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardHeader
          title="e-Fatura"
          action={
            <IconButton onClick={onRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader
          title="e-Fatura"
          action={
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Alert
            severity="error"
            action={
              <Button onClick={onRefresh} size="small">
                Tekrar Dene
              </Button>
            }>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="e-Fatura"
        action={
          <IconButton onClick={onRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        }
      />
      <CardContent>
        {/* e-Fatura Durumu Section - Read-only fields matching the image */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 300, color: 'text.secondary', mb: 3 }}>
            e-Fatura Durumu
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomInputLabel label="Şirket Sektörü" />
              <CustomTextInput fullWidth value={displayData.companySector || '-'} disabled />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomInputLabel label="Oluşturma Tarihi" />
              <CustomTextInput fullWidth value={displayData.creationDate || '-'} disabled />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomInputLabel label="Fatura Entegratörü Firma" />
              <CustomTextInput fullWidth value={displayData.integratorName || '-'} disabled />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomInputLabel label="Fatura Entegratörü Durumu" />
              <CustomTextInput fullWidth value={displayData.integratorStatus || '-'} disabled />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Sonraki Çekim Tarihleri Section - Editable form fields */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 300, color: 'text.secondary', mb: 3 }}>
            Sonraki Çekim Tarihleri
          </Typography>

          <Form form={form} schema={schema} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Çekme Limiti Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 300, color: 'text.secondary', mb: 3 }}>
            Çekme Limiti
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomInputLabel label="Kalan/Toplam" />
              <CustomTextInput fullWidth value={displayData.remainingTotal} disabled />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomInputLabel label="Kalan Limit Güncelle" />
              <CustomTextInput
                fullWidth
                type="number"
                {...form.register('requestCurrentLimit')}
                error={!!form.formState.errors.requestCurrentLimit}
              />
              {form.formState.errors.requestCurrentLimit && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {form.formState.errors.requestCurrentLimit?.message}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Update Button - Small size, right aligned */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <LoadingButton
            variant="contained"
            size="large"
            loading={isUpdating}
            onClick={form.handleSubmit(handleSubmit)}>
            Güncelle
          </LoadingButton>
        </Box>
      </CardContent>
    </Card>
  );
};
