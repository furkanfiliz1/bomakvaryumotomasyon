import { Container } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useGetCompanyCommentsQuery } from '../company-comments.api';
import type { CompanyCommentsFilters } from '../company-comments.types';
import { useCompanyCommentsDropdownData, useCompanyCommentsQueryParams } from '../hooks';
import { AddCommentModal } from './AddCommentModal';
import { CompanyCommentsFiltersComponent } from './CompanyCommentsFilters';
import { CompanyCommentsList } from './CompanyCommentsList';

interface CompanyCommentsPageProps {
  companyId: number;
}

export const CompanyCommentsPage: React.FC<CompanyCommentsPageProps> = ({ companyId }) => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<Partial<CompanyCommentsFilters>>({});

  const pageSize = 25;

  // Generate query parameters
  const queryParams = useCompanyCommentsQueryParams({ filters, page, pageSize });

  // Debug query params changes
  React.useEffect(() => {
    console.log('Query params changed:', queryParams);
    console.log('Company ID:', companyId);
  }, [queryParams, companyId]);

  // Data fetching
  const { dropdownData, isLoading: dropdownLoading } = useCompanyCommentsDropdownData();

  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
    refetch,
  } = useGetCompanyCommentsQuery({ companyId, params: queryParams }, { skip: !companyId });

  // Event handlers
  const handleFilterChange = useCallback(
    (newFilters: Partial<CompanyCommentsFilters>) => {
      console.log('handleFilterChange called with:', newFilters);
      console.log('Current filters before update:', filters);
      setFilters(newFilters);
      // Reset to page 1 when filters change
      setPage(1);
      console.log('Filter state updated and page reset to 1');
    },
    [filters],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleAddComment = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCommentAdded = useCallback(() => {
    refetch();
  }, [refetch]);

  const comments = commentsData?.Items || [];
  const totalCount = commentsData?.TotalCount || 0;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <CompanyCommentsFiltersComponent
        onFilterChange={handleFilterChange}
        onAddComment={handleAddComment}
        isLoading={dropdownLoading || commentsLoading}
        users={dropdownData.users}
        companyStatuses={dropdownData.companyStatuses}
        activityTypes={dropdownData.activityTypes}
      />

      <CompanyCommentsList
        comments={comments}
        isLoading={commentsLoading}
        error={commentsError}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <AddCommentModal
        open={isModalOpen}
        onClose={handleModalClose}
        companyId={companyId}
        activityTypes={dropdownData.activityTypes}
        onSuccess={handleCommentAdded}
      />
    </Container>
  );
};
