import { Form, useNotice } from '@components';
import { Alert, Box, Button, Card, CardContent, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGetApplicationSubChannelByCompanyIdQuery, useUpdateLeadingChannelMutation } from '../companies.api';
import { useCompanyLeadingChannelForm } from '../hooks';

interface LeadingChannelFormData {
  LeadingChannelId?: number | string | null;
}

interface CompanyLeadingChannelProps {
  companyId?: number;
}

const CompanyLeadingChannel: React.FC<CompanyLeadingChannelProps> = ({ companyId }) => {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const notice = useNotice();

  // Form management
  const { form, schema } = useCompanyLeadingChannelForm();

  // Fetch application sub channels for the specific company
  const { data: applicationSubChannels } = useGetApplicationSubChannelByCompanyIdQuery(
    { companyId: companyId || 0 },
    { skip: !companyId },
  );

  // Mutation for updating leading channel
  const [updateLeadingChannel, { isLoading: isUpdating }] = useUpdateLeadingChannelMutation();

  // Set the selected value when applicationSubChannels data is loaded
  React.useEffect(() => {
    if (applicationSubChannels) {
      // Use the first applicationSubChannel as the selected value
      form.setValue('LeadingChannelId', applicationSubChannels.toString(), { shouldDirty: false });
    }
  }, [applicationSubChannels, form]);

  const onSubmit = async (values: LeadingChannelFormData) => {
    if (!companyId) return;

    try {
      setUpdateError(null);

      // Convert null to empty string as requested
      let leadingChannelId: number | string;

      if (values.LeadingChannelId === null || values.LeadingChannelId === undefined || values.LeadingChannelId === '') {
        leadingChannelId = ''; // Send empty string instead of null
      } else if (typeof values.LeadingChannelId === 'string') {
        leadingChannelId = parseInt(values.LeadingChannelId);
      } else {
        leadingChannelId = values.LeadingChannelId;
      }

      await updateLeadingChannel({
        companyId,
        LeadingChannelId: leadingChannelId,
      }).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Geliş kanalı başarıyla güncellendi.',
        buttonTitle: 'Tamam',
      });
    } catch (error) {
      console.error('Update failed:', error);
      setUpdateError('Geliş kanalı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Geliş Kanalı
      </Typography>

      {updateError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {updateError}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Form form={form} schema={schema} onSubmit={form.handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
                {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
              </Button>
            </Box>
          </Form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyLeadingChannel;
