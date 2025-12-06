import { FigoLoading, Form } from '@components';

import { useErrorListener, useExport } from '@hooks';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, Pagination, Stack, Typography } from '@mui/material';
import { AllowanceKind } from '@types';
import { currencyFormatter } from '@utils';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllowanceReceivablesQuery, useLazyExportAllowanceReceivablessQuery } from '../discount-operations.api';
import { useReceivableFilterForm } from '../hooks';

interface ReceivableTabProps {
  allowanceId: number;
  kind?: AllowanceKind;
}

const ReceivableTab: React.FC<ReceivableTabProps> = ({ allowanceId }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    OrderNo: '',
    PayableAmount: undefined as number | undefined,
    status: '',
    page: 1,
    pageSize: 25,
  });

  const { form, schema, handleSearch, handleReset } = useReceivableFilterForm({
    onFilterChange: (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
  });

  const {
    data: receivablesData,
    isLoading,
    error,
  } = useGetAllowanceReceivablesQuery({
    AllowanceId: allowanceId,
    ...filters,
    PayableAmount: filters.PayableAmount || undefined,
  });

  // Export functionality
  const queryParams = useMemo(
    () => ({
      AllowanceId: allowanceId,
      ...filters,
      PayableAmount: filters.PayableAmount || undefined,
    }),
    [allowanceId, filters],
  );

  const [triggerExportQuery] = useLazyExportAllowanceReceivablessQuery();
  const { handleExport, isExporting } = useExport({
    triggerQuery: triggerExportQuery,
    params: queryParams,
    fileName: 'alacaklar',
  });

  useErrorListener([error]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const goInvoiceDetail = (id: number) => {
    navigate(`/invoice-operations/receivable-report/${id}`);
  };

  if (isLoading) {
    return (
      <Box position="relative" height="200px">
        <FigoLoading />
      </Box>
    );
  }

  const totalPages = receivablesData ? Math.ceil(receivablesData.length / filters.pageSize) : 0;

  return (
    <Stack spacing={2}>
      {/* Filters */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Form form={form} schema={schema}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleSearch} size="small" sx={{ flexShrink: 0 }}>
                Uygula
              </Button>
              <Button variant="outlined" onClick={handleReset} size="small" sx={{ flexShrink: 0 }}>
                Temizle
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                size="small"
                sx={{ flexShrink: 0 }}
                onClick={handleExport}
                disabled={isLoading || isExporting}>
                {isExporting ? 'İndiriliyor...' : 'Excel'}
              </Button>
            </Stack>
          </Grid>
        </Form>
      </Card>

      {/* Results */}
      {!receivablesData || receivablesData.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
          Alacak bulunamadı.
        </Typography>
      ) : (
        <>
          <Stack spacing={2}>
            {receivablesData.map((receivable) => (
              <Card key={receivable.Id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {/* First Row */}
                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Alacak ID
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {receivable.Id || '-'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Talep No
                      </Typography>
                      <Typography variant="body2">{allowanceId || '-'}</Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Düzenlenme Tarihi
                      </Typography>
                      <Typography variant="body2">
                        {dayjs(receivable.InsertDatetime).format('YYYY-MM-DD HH:mm')}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Vade Günü
                      </Typography>
                      <Typography variant="body2">
                        {receivable.DueDate ? dayjs(receivable.DueDate).format('YYYY-MM-DD') : '-'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Yükleme Tarihi
                      </Typography>
                      <Typography variant="body2">{dayjs(receivable.InsertDatetime).format('YYYY-MM-DD')}</Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Vade Tarihi
                      </Typography>
                      <Typography variant="body2">{receivable.DueDayCount || '-'}</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Grid container spacing={2}>
                      {/* Second Row */}
                      <Grid item xs={12} md={2}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Alıcı Unvan
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {receivable.ReceiverName || '-'}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Alacak Tutarı
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {currencyFormatter(receivable.PayableAmount, receivable.PayableAmountCurrency)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Alacak No
                        </Typography>
                        <Typography variant="body2">{receivable.OrderNo || '-'}</Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Alacak Durumu
                        </Typography>
                        <Typography variant="body2">{receivable.StatusDesc || '-'}</Typography>
                      </Grid>

                      <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => goInvoiceDetail(receivable.OrderId)}
                          sx={{ minWidth: 'auto', px: 2 }}>
                          Detay
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
              <Pagination
                count={totalPages}
                page={filters.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Stack>
  );
};

export default ReceivableTab;
