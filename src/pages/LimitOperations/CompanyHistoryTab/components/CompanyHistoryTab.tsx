import { Form, Table } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useCreateActivityLogMutation } from '../company-history-tab.api';
import type { ActivityLogFilters, ActivityLogItem } from '../company-history-tab.types';
import { formatActivityLogData, getActivityLogTableHeaders } from '../helpers';
import { useActivityLogDropdownData, useActivityLogFilterForm, useActivityLogQuery } from '../hooks';
import { AddCommentDialog } from './AddCommentDialog';

interface CompanyHistoryTabProps {
  companyId: string;
}

/**
 * Company History Tab Component
 * Shows activity log/comments for a company with 100% legacy parity
 */
export const CompanyHistoryTab: React.FC<CompanyHistoryTabProps> = ({ companyId }) => {
  const [additionalFilters, setAdditionalFilters] = useState<Partial<ActivityLogFilters>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Get dropdown data
  const {
    adminUsersList,
    activityTypesList,
    statusTypesList,
    isLoading: dropdownLoading,
  } = useActivityLogDropdownData();

  // Initialize filter form
  const {
    form,
    schema,
    handleSearch: formHandleSearch,
    handleReset,
  } = useActivityLogFilterForm({
    adminUsersList,
    activityTypesList,
    statusTypesList,
    onFilterChange: setAdditionalFilters,
  });

  // Use our custom query hook for activity log data
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, refetch } = useActivityLogQuery({
    companyId: Number.parseInt(companyId),
    additionalFilters,
  });

  // Create activity log mutation
  const [createActivityLog, { isLoading: createLoading, error: createError }] = useCreateActivityLogMutation();

  // Error handling for mutation
  useErrorListener(createError);

  // Table configuration
  const tableHeaders = getActivityLogTableHeaders();
  const tableData = formatActivityLogData(data?.Items || []);

  // Handle search with current filters
  const handleSearch = () => {
    formHandleSearch(); // This will update additionalFilters
    // The useActivityLogQuery hook will automatically re-fetch due to additionalFilters change
  };

  const handleAddComment = async (commentData: { activityType: string; commentText: string }) => {
    try {
      await createActivityLog({
        activityType: commentData.activityType,
        commentText: commentData.commentText,
        companyId: Number.parseInt(companyId),
      }).unwrap();

      setShowAddDialog(false);
      refetch(); // Refresh data after adding comment
    } catch (error) {
      // Error will be handled by global error handler
      console.error('Failed to create activity log:', error);
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        {/* Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', fontWeight: 'light' }}>
              Yorumlar
            </Typography>

            <Form form={form} schema={schema} />

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleSearch} disabled={isLoading || dropdownLoading} size="small">
                Uygula
              </Button>
              <Button variant="outlined" onClick={handleReset} disabled={isLoading || dropdownLoading} size="small">
                Temizle
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => setShowAddDialog(true)}
                disabled={dropdownLoading}
                size="small">
                Ekle
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardContent>
            <Table<ActivityLogItem>
              id="company-activity-log-table"
              rowId="InsertDateTime" // Use datetime as unique ID since no ID field
              data={tableData}
              headers={tableHeaders}
              loading={isLoading || isFetching}
              error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
              pagingConfig={pagingConfig}
              sortingConfig={sortingConfig}
              notFoundConfig={{
                title: 'Kayıt bulunamadı',
                subTitle: 'Arama kriterlerinizi değiştirerek tekrar deneyiniz',
              }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Add Comment Dialog */}
      <AddCommentDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSubmit={handleAddComment}
        activityTypes={activityTypesList.map((type) => ({ Description: type.label, Value: type.value }))}
        loading={createLoading}
      />
    </>
  );
};
