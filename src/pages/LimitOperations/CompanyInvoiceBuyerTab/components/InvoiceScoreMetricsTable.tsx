import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import type { InvoiceBuyerAnalysisReceiver } from '../company-invoice-buyer-tab.types';

interface InvoiceScoreMetricsTableProps {
  data: InvoiceBuyerAnalysisReceiver[];
}

/**
 * Invoice Score Metrics Table Component
 * Displays metrics analysis for each receiver
 * Matches legacy ScoreCompanyInvoiceScoreTable layout exactly
 */
const InvoiceScoreMetricsTable: React.FC<InvoiceScoreMetricsTableProps> = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Metrik Analizleri
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {data.map((receiver) => (
            <Box key={receiver.Identifier} sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2 }}>
              {/* Receiver Info Section */}
              <Box sx={{ minWidth: { lg: 300 }, flex: '0 0 auto' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Alıcı Bilgisi: {receiver.Identifier}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Skor Bilgisi: {receiver.Score}
                </Typography>
              </Box>

              {/* Metrics Table Section */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Table size="small" sx={{ border: 1, borderColor: 'divider' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Metrik Adı</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Skor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receiver.Metrics && receiver.Metrics.length > 0 ? (
                      receiver.Metrics.map((metric) => (
                        <TableRow key={metric.Name}>
                          <TableCell>{metric.Name}</TableCell>
                          <TableCell>
                            {metric.Score !== null && metric.Score !== undefined ? metric.Score : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          <Typography variant="body2" color="text.secondary">
                            Metrik bilgisi bulunmamaktadır
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvoiceScoreMetricsTable;
