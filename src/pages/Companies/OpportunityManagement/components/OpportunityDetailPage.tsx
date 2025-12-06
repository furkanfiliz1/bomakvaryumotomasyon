/**
 * Opportunity Detail Page
 * View and edit opportunity details following LeadManagement pattern
 * Uses Form component with schema-based field definitions
 * Two sections: Genel Bilgiler and Teklif Bilgileri
 */

import { Form, Icon, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Divider, Skeleton, Typography } from '@mui/material';
import yup from '@validation';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { transformFormValuesToApiFormat } from '../helpers';
import { useOpportunityForm } from '../hooks';
import { useGetOpportunityDetailQuery, useUpdateOpportunityMutation } from '../opportunity-management.api';

const OpportunityDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const { opportunityId } = useParams<{ opportunityId: string }>();

  // Fetch opportunity detail (response is PascalCase from API)
  const {
    data: opportunityDetail,
    error: detailError,
    isLoading: isLoadingDetail,
    refetch,
  } = useGetOpportunityDetailQuery(
    { id: Number(opportunityId) },
    { skip: !opportunityId, refetchOnMountOrArgChange: true },
  );

  // Initialize form for edit mode
  const { form, generalInfoSchema, offerInfoSchema } = useOpportunityForm();

  // Set form values when opportunity detail is fetched (API returns PascalCase)
  useEffect(() => {
    if (opportunityDetail) {
      // API response uses PascalCase, need to map to form field names
      const data = opportunityDetail as unknown as Record<string, unknown>;
      form.reset({
        subject: (data.Subject as string) || '',
        isReceiverInPortal: data.IsReceiverInPortal ? 'true' : 'false',
        receiverId: data.ReceiverId as number | null,
        receiverName: (data.ReceiverName as string) || '',
        customerManagerId: (data.CustomerManagerId as number) ?? '',
        description: (data.Description as string) || '',
        salesScenario: data.SalesScenario as string | null,
        statusDescription: (data.StatusDescription as string) ?? '',
        winningStatus: data.WinningStatus as string | null,
        closedDate: (data.ClosedDate as string) || '',
        lastMeetingDate: (data.LastMeetingDate as string) || '',
        productType: (data.ProductType as number) ?? '',
        currency: (data.Currency as string) || 'TRY',
        estimatedLimit: data.EstimatedLimit as number | null,
        estimatedMonthlyVolume: data.EstimatedMonthlyVolume as number | null,
        supplierCount: data.SupplierCount as number | null,
        takeRate: data.TakeRate as number | null,
        estimatedMonthlyRevenue: data.EstimatedMonthlyRevenue as number | null,
        estimatedClosingDate: (data.EstimatedClosingDate as string) || '',
        offerDate: (data.OfferDate as string) || '',
        offerQuantity: data.OfferQuantity as number | null,
        offerUnitPrice: data.OfferUnitPrice as number | null,
        offerTotalAmount: data.OfferTotalAmount as number | null,
      });
    }
  }, [opportunityDetail, form]);

  // Update mutation
  const [updateOpportunity, { isLoading: isUpdating, error: updateError }] = useUpdateOpportunityMutation();

  // Error handling
  useErrorListener(detailError);
  useErrorListener(updateError);

  // Handle form submission
  const handleSubmit = async () => {
    const data = form.getValues();
    const transformedData = transformFormValuesToApiFormat(data);

    try {
      await updateOpportunity({ id: Number(opportunityId), data: transformedData }).unwrap();

      // Refetch detail after update
      refetch();

      // Show success message
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Fırsat başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });

      // Navigate back to list
      navigate('/companies/opportunities');
    } catch (err) {
      // Error handling is managed by the error listener
      console.error('Update failed:', err);
    }
  };

  // Handle cancel/back
  const handleBack = () => {
    navigate('/companies/opportunities');
  };

  // Loading state
  if (isLoadingDetail) {
    return (
      <>
        <PageHeader title="Fırsat Detayı" subtitle="Yükleniyor..." />
        <Box mx={2}>
          <Card sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={400} />
          </Card>
        </Box>
      </>
    );
  }

  // Cast to access PascalCase properties from API
  const detail = opportunityDetail as unknown as Record<string, unknown> | undefined;

  return (
    <>
      <PageHeader
        title={(detail?.Subject as string) || 'Fırsat Detayı'}
        subtitle={detail?.ReceiverName ? `Firma: ${detail.ReceiverName as string}` : 'Fırsat detay bilgileri'}
      />

      <Box mx={2}>
        {/* Genel Bilgiler Section */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Genel Bilgiler
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Form form={form} schema={generalInfoSchema as yup.AnyObjectSchema} />
        </Card>

        {/* Teklif Bilgileri Section */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Teklif Bilgileri
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Form form={form} schema={offerInfoSchema as yup.AnyObjectSchema} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleBack} startIcon={<Icon icon="arrow-left" size={16} />}>
              Geri
            </Button>
            <LoadingButton
              variant="contained"
              onClick={form.handleSubmit(handleSubmit)}
              loading={isUpdating}
              startIcon={<Icon icon="check" size={16} />}>
              Güncelle
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default OpportunityDetailPage;
