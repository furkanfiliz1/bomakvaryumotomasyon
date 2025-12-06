/**
 * Sub Channel Create Form Component
 * Matches legacy SubChannel.js renderSubChannelCreate() section exactly
 */

import { Form, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add } from '@mui/icons-material';
import { Box, Card, Stack } from '@mui/material';
import React from 'react';
import { useGetApplicationChannelListQuery } from '../../ApplicationChannel/application-channel.api';
import { useSubChannelForm } from '../hooks';
import { useCreateSubChannelMutation } from '../sub-channel.api';

interface SubChannelFormProps {
  onSuccess: () => void;
}

export const SubChannelForm: React.FC<SubChannelFormProps> = ({ onSuccess }) => {
  const notice = useNotice();

  // Fetch channels for dropdown
  const { data: channels = [], isLoading: isLoadingChannels } = useGetApplicationChannelListQuery();

  const { form, schema, resetForm } = useSubChannelForm({ channels });

  const [createSubChannel, { isLoading: isCreating, error: createError }] = useCreateSubChannelMutation();

  // Handle errors with useErrorListener
  useErrorListener(createError);

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();

    // Validate required fields (matching legacy validation)
    if (!formData.Name || formData.Name.trim() === '' || !formData.ChannelId || formData.ChannelId === '') {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Alt Kanal Adı ve Başvuru Kanalı boş bırakılamaz',
      });
      return;
    }

    try {
      await createSubChannel({
        Name: formData.Name.trim(),
        ChannelId: String(formData.ChannelId),
      }).unwrap();
      notice({
        variant: 'success',
        message: 'Alt kanal başarıyla oluşturuldu',
      });
      resetForm();
      onSuccess();
    } catch {
      // Error handled by useErrorListener
    }
  };

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Box>
        <Form form={form} schema={schema} childCol={2}>
          <Stack direction="row" justifyContent="flex-start" sx={{ mt: 3 }}>
            <LoadingButton
              id="create-sub-channel-btn"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              loading={isCreating || isLoadingChannels}
              startIcon={<Add />}>
              Ekle
            </LoadingButton>
          </Stack>
        </Form>
      </Box>
    </Card>
  );
};

export default SubChannelForm;
