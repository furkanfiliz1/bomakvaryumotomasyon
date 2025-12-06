import { HUMAN_READABLE_DATE_TIME } from '@constant';
import { Box, Divider, Grid, Pagination, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { displayValueOrDash } from '../helpers/integration-reports.helpers';
import { useLazyGetIntegrationTransactionDetailsQuery } from '../integration-reports.api';
import type { IntegrationTransactionDetailItem, IntegrationTransactionItem } from '../integration-reports.types';

interface PaginationParams {
  Page: number;
  PageSize: number;
}

interface IntegrationReportsCollapseDetailsProps {
  row: IntegrationTransactionItem;
}

/**
 * Collapsible details section for integration transactions
 * Matches legacy system second row layout exactly
 * Includes pagination support for transaction details
 */
export const IntegrationReportsCollapseDetails: React.FC<IntegrationReportsCollapseDetailsProps> = ({ row }) => {
  const [getDetails, { data: detailsData }] = useLazyGetIntegrationTransactionDetailsQuery();
  const [pagination, setPagination] = React.useState<PaginationParams>({
    Page: 1,
    PageSize: 25,
  });

  // Load details when component mounts or pagination changes
  React.useEffect(() => {
    if (row.AllowanceTransactionId) {
      getDetails({
        AllowanceTransactionId: row.AllowanceTransactionId,
        Page: pagination.Page,
        PageSize: pagination.PageSize,
      });
    }
  }, [row.AllowanceTransactionId, pagination.Page, pagination.PageSize, getDetails]);

  // Get transaction details from API response (Items array structure)
  const transactionDetails = detailsData?.Items ?? [];
  const totalCount = detailsData?.TotalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pagination.PageSize);

  // Handle pagination change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setPagination((prev) => ({ ...prev, Page: page }));
  };

  // Helper function to format update date with fallback logic
  const getFormattedUpdateDate = (transactionDetail?: IntegrationTransactionDetailItem): string => {
    const primaryDate = transactionDetail?.UpdatedDate;
    const fallbackDate = row.UpdatedDate;

    if (primaryDate && dayjs(primaryDate).isValid()) {
      return dayjs(primaryDate).format(HUMAN_READABLE_DATE_TIME);
    }

    if (dayjs(fallbackDate).isValid()) {
      return dayjs(fallbackDate).format(HUMAN_READABLE_DATE_TIME);
    }

    return '-';
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
      {/* Transaction details from legacy - bottom collapse layout */}
      {transactionDetails.length > 0 ? (
        <>
          {transactionDetails.map((transactionDetail, index) => (
            <Box key={index} sx={{ mb: index < transactionDetails.length - 1 ? 3 : 0 }}>
              <Grid container>
                <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Fatura No
                  </Typography>
                  <Typography variant="body2">{displayValueOrDash(transactionDetail.InvoiceNumber)}</Typography>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Banka Statüsü
                  </Typography>
                  <Typography variant="body2">{displayValueOrDash(transactionDetail.BankStatus)}</Typography>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Eklenme Tarihi
                  </Typography>
                  <Typography variant="body2">
                    {dayjs(transactionDetail.InsertedDate).isValid()
                      ? dayjs(transactionDetail.InsertedDate).format(HUMAN_READABLE_DATE_TIME)
                      : dayjs(row.InsertedDate).isValid()
                        ? dayjs(row.InsertedDate).format(HUMAN_READABLE_DATE_TIME)
                        : '-'}
                  </Typography>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Güncellenme Tarihi
                  </Typography>
                  <Typography variant="body2">{getFormattedUpdateDate(transactionDetail)}</Typography>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Statü
                  </Typography>
                  <Typography variant="body2">{displayValueOrDash(transactionDetail.Status)}</Typography>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Açıklama
                  </Typography>
                  <Typography variant="body2">{displayValueOrDash(transactionDetail.Description)}</Typography>
                </Grid>
              </Grid>
              {index < transactionDetails.length - 1 && <Divider sx={{ mb: 1 }} />}
            </Box>
          ))}

          {/* Pagination controls - only show if there are multiple pages */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={pagination.Page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <Grid container>
          <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Fatura No
            </Typography>
            <Typography variant="body2">{displayValueOrDash(row.InvoiceNumber)}</Typography>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Banka Statüsü
            </Typography>
            <Typography variant="body2">{displayValueOrDash(row.BankStatus)}</Typography>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Eklenme Tarihi
            </Typography>
            <Typography variant="body2">
              {dayjs(row.InsertedDate).isValid() ? dayjs(row.InsertedDate).format(HUMAN_READABLE_DATE_TIME) : '-'}
            </Typography>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Güncellenme Tarihi
            </Typography>
            <Typography variant="body2">{getFormattedUpdateDate()}</Typography>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Statü
            </Typography>
            <Typography variant="body2">{displayValueOrDash(row.Status)}</Typography>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12} sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Açıklama
            </Typography>
            <Typography variant="body2">{displayValueOrDash(row.Description)}</Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
