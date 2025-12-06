/**
 * Company Limit Infos Component
 * Main form for company limit information - Şirket Limiti section
 * Matches legacy CompanyLimitInfos.js functionality exactly
 */

import { Form, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import React from 'react';
import { useCreateCompanyLimitMutation, useUpdateCompanyLimitMutation } from '../company-limit-tab.api';
import type { CompanyLimitInfosProps } from '../company-limit-tab.types';
import { cleanObjectForSubmission } from '../helpers';
import { useCompanyLimitInfosForm } from '../hooks';

/**
 * Company Limit Information Form Component
 * Displays form for editing company limit data with validation
 * Includes creation date, scores, switches, and dropdown selections
 */
export const CompanyLimitInfos: React.FC<CompanyLimitInfosProps> = ({
  companyLimitInfos,
  getCompaniesLimit,
  companyId,
}) => {
  // Form management with schema validation
  const { form, schema } = useCompanyLimitInfosForm(companyLimitInfos);

  // Notification system
  const notice = useNotice();

  // API mutations for create/update
  const [updateCompanyLimit, { isLoading: isUpdating, error: updateError }] = useUpdateCompanyLimitMutation();
  const [createCompanyLimit, { isLoading: isCreating, error: createError }] = useCreateCompanyLimitMutation();

  // Error handling for all mutation errors
  useErrorListener([createError, updateError]);

  const isLoading = isUpdating || isCreating;

  // Handle form submission
  const handleSubmit = async (formData: Record<string, unknown>) => {
    try {
      if (companyLimitInfos?.Id) {
        // Update existing limit - include Id for PUT request
        const updateData = {
          ...companyLimitInfos, // ← Base data from server
          ...formData, // ← Form data should override server data
          Id: companyLimitInfos.Id, // Required for PUT /companies/limit/${Id}
        };
        // Clean empty/null values like legacy emptyOrNullRemoveQuery
        const cleanedData = cleanObjectForSubmission(updateData);
        await updateCompanyLimit(cleanedData).unwrap();
      } else {
        // Create new limit - include CompanyId for POST request
        const postData = {
          ...formData,
          CompanyId: Number(companyId), // Required for POST /companies/limit
        };
        // Clean empty/null values like legacy emptyOrNullRemoveQuery
        const cleanedData = cleanObjectForSubmission(postData);
        await createCompanyLimit(cleanedData).unwrap();
      }

      // Show success message
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem başarıyla gerçekleştirildi',
      });

      // Refresh data
      getCompaniesLimit();
    } catch (error) {
      // Error handling is managed by useErrorListener
      console.error('Company limit save error:', error);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Şirket Limiti" />
      <CardContent>
        <Form form={form} schema={schema} space={3}>
          {/* Update Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <LoadingButton
              loading={isLoading}
              variant="contained"
              color="primary"
              onClick={form.handleSubmit(handleSubmit)}>
              Güncelle
            </LoadingButton>
          </Box>
        </Form>
      </CardContent>
    </Card>
  );
};
