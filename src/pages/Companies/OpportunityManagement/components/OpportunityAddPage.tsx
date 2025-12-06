/**
 * Opportunity Add Page
 * Create new opportunity following LeadManagement pattern
 * Uses Form component with schema-based field definitions
 * Two sections: Genel Bilgiler and Teklif Bilgileri
 */

import { Form, Icon, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Divider, Typography } from '@mui/material';
import yup from '@validation';
import { useNavigate } from 'react-router-dom';
import { transformFormValuesToApiFormat } from '../helpers';
import { useOpportunityForm } from '../hooks';
import { useCreateOpportunityMutation } from '../opportunity-management.api';

const OpportunityAddPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // Initialize form for create mode
  const { form, generalInfoSchema, offerInfoSchema } = useOpportunityForm();

  // Create mutation
  const [createOpportunity, { isLoading: isCreating, error: createError }] = useCreateOpportunityMutation();

  // Error handling
  useErrorListener(createError);

  // Handle form submission
  const handleSubmit = async () => {
    const data = form.getValues();
    const transformedData = transformFormValuesToApiFormat(data);

    try {
      await createOpportunity({ data: transformedData }).unwrap();

      // Show success message
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Fırsat başarıyla oluşturuldu',
        buttonTitle: 'Tamam',
      });

      // Navigate back to list
      navigate('/companies/opportunities');
    } catch (err) {
      // Error handling is managed by the error listener
      console.error('Create failed:', err);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/companies/opportunities');
  };

  return (
    <>
      <PageHeader title="Yeni Fırsat Ekle" subtitle="Yeni fırsat kaydı oluşturun" />

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
            <Button variant="outlined" onClick={handleCancel} startIcon={<Icon icon="x" size={16} />}>
              İptal
            </Button>
            <LoadingButton
              variant="contained"
              onClick={form.handleSubmit(handleSubmit)}
              loading={isCreating}
              startIcon={<Icon icon="check" size={16} />}>
              Kaydet
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default OpportunityAddPage;
