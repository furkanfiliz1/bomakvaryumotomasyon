import React from 'react';
import { Box, Card } from '@mui/material';
import { Form, LoadingButton, useNotice } from '@components';
import { useCreateReceivableForm } from '../hooks';
import { useCreateReceivableMutation } from '../receivable-add.api';
import { transformFormDataToRequest } from '../helpers';
import { useErrorListener } from '@hooks';

/**
 * Manual Receivable Add Component
 * Following Portal reference pattern from ReceivablesBuyerAddManuel
 */
const ReceivableAddManuel: React.FC = () => {
  const { createReceivableForm: form, createReceivableSchema } = useCreateReceivableForm();
  const notice = useNotice();

  const [createReceivable, { error, isLoading }] = useCreateReceivableMutation();
  useErrorListener(error);
  const handleCreateReceivable = async () => {
    const values = form.getValues();

    // Transform form data using helper function
    const receivableData = transformFormDataToRequest(values);

    try {
      const res = await createReceivable([receivableData]);

      if ('data' in res) {
        // Success feedback using notice hook
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Alacak başarıyla oluşturuldu',
          buttonTitle: 'Tamam',
        });
        form.reset(); // Reset form after successful creation
      }
    } catch (error) {
      console.error('Alacak oluşturma hatası:', error);
    }
  };

  return (
    <Card sx={{ p: 2, m: 3 }}>
      <Form form={form} schema={createReceivableSchema}>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <LoadingButton
            loading={isLoading}
            onClick={form.handleSubmit(handleCreateReceivable)}
            color="primary"
            variant="contained"
            id="createReceivableButton">
            Alacak Ekle
          </LoadingButton>
        </Box>
      </Form>
    </Card>
  );
};

export default ReceivableAddManuel;
