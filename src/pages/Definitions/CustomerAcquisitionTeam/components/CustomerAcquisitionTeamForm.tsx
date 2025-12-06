/**
 * Customer Acquisition Team Create Form Component
 * Matches legacy renderCustomerAcquisitionTeamMemberCreate() section exactly
 */

import { Form, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add } from '@mui/icons-material';
import { Card, Stack } from '@mui/material';
import React from 'react';
import { useCreateCustomerAcquisitionTeamMemberMutation } from '../customer-acquisition-team.api';
import { useCustomerAcquisitionTeamForm } from '../hooks';

interface CustomerAcquisitionTeamFormProps {
  onSuccess: () => void;
}

export const CustomerAcquisitionTeamForm: React.FC<CustomerAcquisitionTeamFormProps> = ({ onSuccess }) => {
  const notice = useNotice();
  const { form, schema, resetForm } = useCustomerAcquisitionTeamForm();

  const [createMember, { isLoading: isCreating, error: createError }] =
    useCreateCustomerAcquisitionTeamMemberMutation();

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
        message: 'Müşteri Kazanım Ekibi Üye Adı boş bırakılamaz',
      });
      return;
    }

    try {
      await createMember({
        Name: formData.Name.trim(),
      }).unwrap();
      notice({
        variant: 'success',
        message: 'Müşteri kazanım ekibi üyesi başarıyla oluşturuldu',
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
            id="create-team-member-btn"
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

export default CustomerAcquisitionTeamForm;
