import React, { useMemo } from 'react';
import { Alert, CircularProgress, Box } from '@mui/material';
import { Table, Slot } from '@components';
import type { CompanyComment } from '../company-comments.types';
import { getCompanyCommentsTableHeaders } from '../helpers';
import { UserNameSlot, CommentTextSlot, ActivityStatusSlot } from './CompanyCommentsTableSlots';

interface CompanyCommentsListProps {
  comments: CompanyComment[];
  isLoading: boolean;
  error?: unknown;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const CompanyCommentsList: React.FC<CompanyCommentsListProps> = ({
  comments,
  isLoading,
  error,
  totalCount,
  page,
  pageSize,
  onPageChange,
}) => {
  // Memoize table headers
  const tableHeaders = useMemo(() => getCompanyCommentsTableHeaders(), []);

  // Create pagination config for server-side pagination
  const pagingConfig = useMemo(
    () => ({
      page,
      rowsPerPage: pageSize,
      total: totalCount,
      onPageChange: (newPage: number) => onPageChange(newPage + 1), // Table uses 0-based, we use 1-based
      onRowsPerPageChange: () => {}, // Not used in this case
    }),
    [page, pageSize, totalCount, onPageChange],
  );

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Yorumlar yüklenirken bir hata oluştu.
      </Alert>
    );
  }

  return (
    <Table<CompanyComment>
      id="company-comments-table"
      rowId="Id"
      headers={tableHeaders}
      data={comments}
      loading={isLoading}
      error={error ? 'Yorumlar yüklenirken bir hata oluştu' : undefined}
      pagingConfig={pagingConfig}
      hidePaging={totalCount <= pageSize}
      notFoundConfig={{
        title: 'Henüz yorum bulunmuyor',
        subTitle: 'Bu şirket için henüz hiç yorum eklenmemiş.',
      }}>
      {/* Custom cell slots */}
      <Slot<CompanyComment> id="UserName">{(_, row) => (row ? <UserNameSlot row={row} /> : '-')}</Slot>

      <Slot<CompanyComment> id="CommentText">{(_, row) => (row ? <CommentTextSlot row={row} /> : '-')}</Slot>

      <Slot<CompanyComment> id="ActivityStatus">{(_, row) => (row ? <ActivityStatusSlot row={row} /> : '-')}</Slot>
    </Table>
  );
};
