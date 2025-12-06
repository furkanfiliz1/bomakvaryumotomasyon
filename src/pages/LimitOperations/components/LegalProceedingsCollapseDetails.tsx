import { HUMAN_READABLE_DATE } from '@constant';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { currencyFormatter } from '@utils';
import dayjs from 'dayjs';
import React from 'react';
import { LegalProceedingsItem } from '../limit-operations.types';

interface LegalProceedingsCollapseDetailsProps {
  row: LegalProceedingsItem;
}

/**
 * Legal Proceedings Collapse Details Component
 * Displays additional fields in collapsed row view
 * Based on legacy CompensationTableRow.js second row fields
 */
export const LegalProceedingsCollapseDetails: React.FC<LegalProceedingsCollapseDetailsProps> = ({ row }) => {
  // Format date helper function

  return (
    <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
      <Card>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Detay Bilgileri
          </Typography>

          <Grid container spacing={2}>
            {/* First Row of Details - Based on legacy CompensationTableRow.js second row */}
            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Entegratör
              </Typography>
              <Typography variant="body2">{row.Integrator || '-'}</Typography>
            </Grid>

            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Evrak Durumu
              </Typography>
              <Typography variant="body2">{row.DocumentStateDescription || '-'}</Typography>
            </Grid>

            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Hukuk Bürosu
              </Typography>
              <Typography variant="body2">{row.LawFirm || '-'}</Typography>
            </Grid>

            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Atama Tarihi Sonrası Tahsilat Tutarı
              </Typography>
              <Typography variant="body2">
                {row.CollectionAmountPostAssignmentDate
                  ? currencyFormatter(row.CollectionAmountPostAssignmentDate, 'TRY')
                  : '-'}
              </Typography>
            </Grid>

            {/* Second Row of Details */}
            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Protokol
              </Typography>

              <Typography variant="body2">{row.ProtocolDescription}</Typography>
            </Grid>

            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Finans Kurumu
              </Typography>
              <Typography variant="body2">{row.Financer || '-'}</Typography>
            </Grid>

            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Kapama Tarihi
              </Typography>
              <Typography variant="body2">
                {row.ClosingDate ? dayjs(row.ClosingDate).format(HUMAN_READABLE_DATE) : '-'}
              </Typography>
            </Grid>

            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Teminat Türü
              </Typography>
              <Typography variant="body2">{row.ProductTypeDescription}</Typography>
            </Grid>

            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Statü
              </Typography>
              <Typography variant="body2">{row.StateDescription || '-'}</Typography>
            </Grid>

            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Dava Takip Masrafı
              </Typography>
              <Typography variant="body2">
                {row.TotalExpense ? currencyFormatter(row.TotalExpense, 'TRY') : '-'}
              </Typography>
            </Grid>

            <Grid item md={2}>
              <Typography variant="body2" color="textSecondary">
                Garantörlük Oranı
              </Typography>
              <Typography variant="body2">
                {row.GuarantorRateDescription || (row.GuarantorRate ? `%${row.GuarantorRate}` : '-')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
