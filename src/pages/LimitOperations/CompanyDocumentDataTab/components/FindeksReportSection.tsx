/**
 * Findeks Report Section Component
 * Following OperationPricing pattern for section components
 * Matches legacy renderFindeksData() structure exactly
 */

import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import type { FindeksData, FindeksReportOption } from '../company-document-data-tab.types';
import { isFindeksDataEmpty } from '../helpers';

interface FindeksReportSectionProps {
  findeksReports: FindeksReportOption[];
  selectedReportId: string | null;
  findeksData: FindeksData | null;
  loading: boolean;
  error: string | null;
  onReportSelect: (reportId: string) => void;
}

/**
 * Findeks Report Section matching legacy layout exactly
 */
export const FindeksReportSection: React.FC<FindeksReportSectionProps> = ({
  findeksReports,
  selectedReportId,
  findeksData,
  loading,
  error,
  onReportSelect,
}) => {
  const handleReportChange = (event: SelectChangeEvent<string>) => {
    onReportSelect(event.target.value);
  };

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardHeader title="Findeks Raporu" />
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader title="Findeks Raporu" />
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Findeks Raporu"
        subheader={findeksData?.ReportDate !== '-' ? findeksData?.ReportDate : undefined}
      />
      <CardContent>
        {/* Report Selector */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
            <InputLabel>Rapor Seçin</InputLabel>
            <Select value={selectedReportId || ''} onChange={handleReportChange} label="Rapor Seçin">
              {findeksReports.map((report) => (
                <MenuItem key={report.Id} value={String(report.Id)}>
                  {report.ReportDate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Show empty state if no data */}
        {isFindeksDataEmpty(findeksData) ? (
          <Typography variant="body1" color="text.secondary">
            Seçilen rapor için veri bulunmamaktadır.
          </Typography>
        ) : (
          <>
            {/* Company Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Ünvan:</strong> {findeksData?.Name || '-'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>VKN/TCKN:</strong> {findeksData?.TCVkn || '-'}
              </Typography>
            </Box>

            {/* Main Tables Layout - Matching Legacy Structure Exactly */}
            <Grid container spacing={2}>
              {/* Left: Limit / Risk Table with "Toplam" rowspan */}
              <Grid item xs={12} md={8}>
                <TableContainer>
                  <Table size="small" sx={{ border: 1, borderColor: 'divider' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}></TableCell>
                        <TableCell
                          colSpan={4}
                          align="center"
                          sx={{ border: 1, borderColor: 'divider', fontWeight: 'bold' }}>
                          Limit / Risk Tablosu
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}></TableCell>
                        <TableCell
                          colSpan={2}
                          align="center"
                          sx={{ border: 1, borderColor: 'divider', fontWeight: 'bold' }}>
                          Limit(TL)
                        </TableCell>
                        <TableCell
                          colSpan={2}
                          align="center"
                          sx={{ border: 1, borderColor: 'divider', fontWeight: 'bold' }}>
                          Risk(TL)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Row 1: Grup */}
                      <TableRow>
                        <TableCell
                          rowSpan={12}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            verticalAlign: 'middle',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                          }}>
                          Toplam
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Grup</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.LimitGroup || '-'}
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Grup</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.RiskGroup || '-'}
                        </TableCell>
                      </TableRow>

                      {/* Row 2: Nakdi */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Nakdi</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.LimitCash || '-'}
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Nakdi</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.RiskCash || '-'}
                        </TableCell>
                      </TableRow>

                      {/* Row 3: Gayri Nakdi */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Gayri Nakdi</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.LimitNonCash || '-'}
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Gayri Nakdi</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.RiskNonCash || '-'}
                        </TableCell>
                      </TableRow>

                      {/* Row 4: Toplam */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Toplam</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.LimitTotal || '-'}
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Diğer</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.RiskOther || '-'}
                        </TableCell>
                      </TableRow>

                      {/* Row 5: Genel Revize Vadesi */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Genel Revize Vadesi</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.LimitGeneralRevisionDueDate || '-'}
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Toplam</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.RiskTotal || '-'}
                        </TableCell>
                      </TableRow>

                      {/* Row 6: Gecikmede Hesap Sayısı */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Gecikmede Hesap Sayısı</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.NumberOfAccountsInDelayA4 || '-'}
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Gecikmeli Borç Toplamı</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.RiskOverdueAmount || '-'}
                        </TableCell>
                      </TableRow>

                      {/* Row 7: İlk Kredi Kullanım Tarihi */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>İlk Kredi Kullanım Tarihi</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.FirstCreditUsageDateA2 || '-'}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ border: 1, borderColor: 'divider' }}></TableCell>
                      </TableRow>

                      {/* Row 8: Son Kredi Kullanım Tarihi */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Son Kredi Kullanım Tarihi</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.LastCreditUsageDateA3 || '-'}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ border: 1, borderColor: 'divider' }}></TableCell>
                      </TableRow>

                      {/* Row 9: En Güncel Limit Tahsis Tarihi */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>En Güncel Limit Tahsis Tarihi</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.LimitAllocationDateA5 || '-'}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ border: 1, borderColor: 'divider' }}></TableCell>
                      </TableRow>

                      {/* Row 10: Takibe Alındığı Tarihteki Kredi Bakiyeleri */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                          Takibe Alındığı Tarihteki Kredi Bakiyeleri
                        </TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.CreditBalancesOfFollowUpC2TK || '-'}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ border: 1, borderColor: 'divider' }}></TableCell>
                      </TableRow>

                      {/* Row 11: Varlık Yönetim Şirketlerine Devredilen Ticari Borç Toplamı */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                          Varlık Yönetim Şirketlerine Devredilen Ticari Borç Toplamı
                        </TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.TotalTransferredCommercialDebt || '-'}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ border: 1, borderColor: 'divider' }}></TableCell>
                      </TableRow>

                      {/* Row 12: Limit Doluluk Oranı */}
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                          Limit Doluluk Oranı (Risk Nakdi / Limit Nakdi)
                        </TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.LimitOccupancyRate || '-'}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ border: 1, borderColor: 'divider' }}></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Right: Faktoring Table */}
              <Grid item xs={12} md={4}>
                <TableContainer>
                  <Table size="small" sx={{ border: 1, borderColor: 'divider' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          align="center"
                          sx={{ border: 1, borderColor: 'divider', fontWeight: 'bold' }}>
                          Faktoring
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Bildirim Dönemi</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.FaktoringNotificationPeriod || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Kredi Limiti</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.FaktoringCreditLimit || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>01- 12 Ay Vadeli</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.Faktoring0112MonthsTerm || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>12- 24 Ay Vadeli</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.Faktoring1224MonthsTerm || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>24+ Ay Vadeli</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.FaktoringMoreThan24MonthsTerm || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Faiz Reeskont + Komisyon</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.FaktoringInterestRediscountAndCommission || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Faiz Tahakkuku + Komisyon</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.FaktoringInterestAccrualAndCommission || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Bildirimde Bulunan Kuruluşlar</TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.FaktoringReportingOrganizations || '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                          Limit Doluluk Oranı(01-12 Ay Vadeli + 12 - 24 Ay Vadeli + 24+ ay Vadeli) / Kredi Limiti
                        </TableCell>
                        <TableCell align="center" sx={{ border: 1, borderColor: 'divider' }}>
                          {findeksData?.FaktoringLimitOccupancyRate || '-'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};
