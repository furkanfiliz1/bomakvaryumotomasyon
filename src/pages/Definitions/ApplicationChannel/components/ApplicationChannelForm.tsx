/**
 * Application Channel Create Form Component
 * Matches legacy ReferralChannel.js renderCreate() section exactly
 */

import { Form, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add } from '@mui/icons-material';
import { Card, Stack } from '@mui/material';
import React from 'react';
import { useCreateApplicationChannelMutation } from '../application-channel.api';
import { useApplicationChannelForm } from '../hooks';

interface ApplicationChannelFormProps {
  onSuccess: () => void;
}

export const ApplicationChannelForm: React.FC<ApplicationChannelFormProps> = ({ onSuccess }) => {
  const notice = useNotice();
  const { form, schema, resetForm } = useApplicationChannelForm();

  const [createApplicationChannel, { isLoading: isCreating, error: createError }] =
    useCreateApplicationChannelMutation();

  // Handle errors with useErrorListener
  useErrorListener(createError);

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();

    // Validate required fields (matching legacy validation)
    if (!formData.Name || formData.Name.trim() === '') {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Başvuru Kanalı Adı boş bırakılamaz',
      });
      return;
    }

    try {
      await createApplicationChannel({
        Name: formData.Name.trim(),
      }).unwrap();
      notice({
        variant: 'success',
        message: 'Başvuru kanalı başarıyla oluşturuldu',
      });
      resetForm();
      onSuccess();
    } catch {
      // Error handled by useErrorListener
    }
  };

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Form form={form} schema={schema} childCol={2}>
        <Stack direction="row" justifyContent="flex-start" sx={{ mt: 3 }}>
          <LoadingButton
            id="create-application-channel-btn"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            loading={isCreating}
            startIcon={<Add />}>
            Ekle
          </LoadingButton>
        </Stack>
      </Form>
    </Card>
  );
};

export default ApplicationChannelForm;
