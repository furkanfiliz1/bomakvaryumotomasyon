import { EnterEventHandle, Form } from '@components';
import { Add, Clear, Search } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import type { ActivityType, AdminUser, CompanyCommentsFilters, CompanyStatus } from '../company-comments.types';
import { useCompanyCommentsFilterForm } from '../hooks';

interface CompanyCommentsFiltersProps {
  onFilterChange: (filters: Partial<CompanyCommentsFilters>) => void;
  onAddComment: () => void;
  isLoading?: boolean;
  users: AdminUser[];
  companyStatuses: CompanyStatus[];
  activityTypes: ActivityType[];
}

export const CompanyCommentsFiltersComponent: React.FC<CompanyCommentsFiltersProps> = ({
  onFilterChange,
  onAddComment,
  isLoading = false,
  users,
  companyStatuses,
  activityTypes,
}) => {
  const { form, schema, handleSearch, resetFilters } = useCompanyCommentsFilterForm({
    users,
    companyStatuses,
    activityTypes,
    onFilterChange,
  });

  // Following OperationPricing pattern: handleSubmit ensures form validation passes before executing
  const handleFormSubmit = () => {
    // Get current form state
    const isValid = form.formState.isValid;

    if (isValid) {
      handleSearch();
    } else {
      console.warn('Form validation failed, cannot execute search');
      // Force validation check for debugging
      form.trigger().then((result) => {
        if (result) {
          console.log('Manual validation passed, executing search');
          handleSearch();
        }
      });
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Şirket Yorumları</Typography>
          <Box>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={onAddComment} disabled={isLoading}>
              Yorum Ekle
            </Button>
          </Box>
        </Box>

        <Form form={form} schema={schema} space={2}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" startIcon={<Clear />} onClick={resetFilters} disabled={isLoading}>
              Temizle
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Search />}
              onClick={handleFormSubmit}
              disabled={isLoading}>
              Uygula
            </Button>
          </Box>
        </Form>
      </CardContent>
      <EnterEventHandle onEnterPress={form.handleSubmit(handleSearch)} />
    </Card>
  );
};
