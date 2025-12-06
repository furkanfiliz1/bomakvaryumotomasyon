/**
 * User Details Tab Component
 * Displays and allows editing of contact person information
 * Following OperationPricing form patterns
 */

import { Form, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { useUserDetailsForm } from '../hooks';
import { useUpdateLeadMutation } from '../lead-management.api';
import type { LeadDetail } from '../lead-management.types';

interface UserDetailsTabProps {
  leadDetail: LeadDetail;
  onUpdate: () => void;
}

export const UserDetailsTab: React.FC<UserDetailsTabProps> = ({ leadDetail, onUpdate }) => {
  const [updateLead, { isLoading, error }] = useUpdateLeadMutation();
  const notice = useNotice();

  // Initialize form with lead detail data
  const { form, schema } = useUserDetailsForm(leadDetail);

  // Error handling
  useErrorListener(error);

  const handleSubmit = async (formData: { [key: string]: unknown }) => {
    try {
      // Combine user data with existing firm data to send complete update
      const data = {
        // User fields
        FirstName: formData.FirstName as string,
        LastName: formData.LastName as string,
        EmailAddress: formData.EmailAddress as string,
        MobilePhone: formData.MobilePhone as string,
        // Firm fields from leadDetail
        TaxNumber: leadDetail.TaxNumber || '',
        CompanyName: leadDetail.CompanyName || '',
        CompanyPhone: leadDetail.CompanyPhone,
        ProductType: leadDetail.ProductType,
        CustomerManagerName: leadDetail.CustomerManagerName,
        WebsiteUrl: leadDetail.WebsiteUrl,
        SectorCode: leadDetail.SectorCode,
        CustomerManagerId: leadDetail.CustomerManagerId,
        ReceiverCompanyId: leadDetail.ReceiverCompanyId,
        CompanyActivityType: leadDetail.CompanyActivityType,
        EstablishmentYear: leadDetail.EstablishmentYear,
        DocumentSendStatus: leadDetail.DocumentSendStatus,
        Country: leadDetail.Country,
        City: leadDetail.City,
        District: leadDetail.District,
      };

      await updateLead({
        id: leadDetail.Id,
        data: data,
      }).unwrap();

      notice({
        variant: 'success',
        title: 'Güncelleme Başarılı',
        message: 'Kullanıcı bilgileri başarıyla güncellendi.',
      });

      // Refresh parent data
      onUpdate();
    } catch (error) {
      // Error handled by useErrorListener
      console.error('Failed to update lead user:', error);
    }
  };

  return (
    <Box>
      <Form form={form} schema={schema} space={2} />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <LoadingButton
          loading={isLoading}
          onClick={form.handleSubmit(handleSubmit)}
          variant="contained"
          color="primary">
          Kaydet
        </LoadingButton>
      </Box>
    </Box>
  );
};
