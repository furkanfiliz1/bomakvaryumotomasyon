import { Form } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Tooltip } from '@mui/material';
import { AllowanceStatus } from '@store';
import { AllowanceKind } from '@types';
import { currencyFormatter } from '@utils';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AllowanceStatusDecriptionCell } from '../../../components/shared/AllowanceStatusDecriptionCell';
import { useLazySearchAllowanceInvoicesQuery } from '../discount-operations.api';
import { InvoiceFilters, useInvoiceFilterForm } from '../hooks';

interface InvoicesTabProps {
  allowanceId: number;
  Kind?: AllowanceKind;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({ allowanceId, Kind }) => {
  const navigate = useNavigate();
  const isSpot = Kind === 4;

  // Additional filters state for the form
  const [additionalFilters, setAdditionalFilters] = useState<Partial<InvoiceFilters>>({});

  // Initialize filter form
  const { form, schema, handleSearch, handleReset } = useInvoiceFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters with filters
  const queryParams = useMemo(
    () => ({
      AllowanceId: allowanceId,
      ...additionalFilters,
    }),
    [allowanceId, additionalFilters],
  );

  // Use server-side query hook for table data and pagination
  const { data, error, isLoading, isFetching, handleExport } = useServerSideQuery(
    useLazySearchAllowanceInvoicesQuery,
    queryParams,
  );

  useErrorListener(error);

  const goInvoiceDetail = (invoiceId: number) => {
    // Navigate to invoice detail page - matching the new project route structure
    navigate(`/invoice-operations/invoice-report/${invoiceId}`);
  };

  const renderInvoiceType = (invoiceType?: number, eInvoiceType?: number) => {
    if (invoiceType === 2) {
      return 'Kağıt Fatura';
    }
    if (invoiceType === 1 && eInvoiceType === 1) {
      return 'e-Fatura';
    }
    if (invoiceType === 1 && eInvoiceType === 2) {
      return 'e-Arşiv';
    }
    if (invoiceType === 1 && eInvoiceType === 3) {
      return 'e-Müstahsil';
    }
    return '';
  };

  return (
    <Box>
      {/* Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Form form={form} schema={schema}>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleSearch}>
                  Uygula
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                  Temizle
                </Button>
              </Stack>
            </Grid>
          </Form>
        </CardContent>
      </Card>

      {/* Export Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={() => handleExport(`faturalar_${allowanceId}`)}
          disabled={isLoading || isFetching || (data?.TotalCount ?? 0) === 0}>
          Excel
        </Button>
      </Box>

      {/* Card Layout for Invoices */}
      <Box>
        {isLoading || isFetching ? (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" py={4}>
                <Box>Yükleniyor...</Box>
              </Box>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" py={4}>
                <Box color="error.main">Hata: {String(error)}</Box>
              </Box>
            </CardContent>
          </Card>
        ) : !data?.Items || data.Items.length === 0 ? (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" py={4}>
                <Box color="text.secondary">Seçili kriterlere uygun fatura bulunmuyor.</Box>
              </Box>
            </CardContent>
          </Card>
        ) : (
          data.Items.map((invoice) => (
            <Card key={invoice.InvoiceId} sx={{ mb: 2 }}>
              <CardContent>
                {/* First Row */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Fatura ID
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {invoice.InvoiceId || '-'}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        {isSpot ? 'Kredi No' : 'İskonto No'}
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {invoice.AllowanceId || '-'}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Düzenlenme Tarihi
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {invoice.IssueDate ? new Date(invoice.IssueDate).toLocaleDateString('tr-TR') : '-'}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Vade Tarihi
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {invoice.PaymentDueDate ? new Date(invoice.PaymentDueDate).toLocaleDateString('tr-TR') : '-'}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Yükleme Tarihi
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {invoice.InsertDatetime ? new Date(invoice.InsertDatetime).toLocaleDateString('tr-TR') : '-'}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Vade Günü
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {invoice.DueDayCount || '-'}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Detail Button Row */}
                <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => goInvoiceDetail(invoice.InvoiceId)}
                    sx={{ minWidth: '60px' }}>
                    Detay
                  </Button>
                </Box>

                {/* Second Row */}
                <Grid container spacing={2}>
                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Alıcı Ünvan
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {invoice.ReceiverName || '-'}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Fatura Tutarı
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {invoice.PayableAmount
                          ? currencyFormatter(invoice.PayableAmount, invoice.PayableAmountCurrency)
                          : '-'}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Fatura No
                      </Box>
                      <Tooltip
                        title={invoice.InvoiceNumber || `${invoice.SerialNumber} ${invoice.SequenceNumber}`}
                        arrow>
                        <Box
                          component="div"
                          sx={{
                            fontWeight: 'medium',
                            whiteSpace: 'wrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                          }}>
                          {invoice.InvoiceNumber || `${invoice.SerialNumber} ${invoice.SequenceNumber}`}
                        </Box>
                      </Tooltip>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Statü Açıklaması
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        <AllowanceStatusDecriptionCell
                          status={invoice.Status as AllowanceStatus}
                          statusDesc={invoice.StatusDescription}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Fatura Tipi
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        <Chip
                          label={renderInvoiceType(invoice.InvoiceType, invoice.EInvoiceType)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        Valör
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {invoice.ExtraValueDay || '-'}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default InvoicesTab;
