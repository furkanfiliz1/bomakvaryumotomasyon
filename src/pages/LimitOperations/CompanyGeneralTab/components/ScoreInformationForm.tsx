import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Update as UpdateIcon } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { CustomDatePicker } from 'src/components/common/Form/_partials/InputDatePicker';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import { useUpdateConnectedIntegratorListMutation } from '../../limit-operations.api';
import type { ScoreCompanyData } from '../company-general-tab.types';
import { prepareScoreCompanyUpdatePayload } from '../helpers';

interface ScoreInformationFormProps {
  scoreCompany: ScoreCompanyData | undefined;
  companyIdentifier: string;
  onRefresh: () => void;
}

/**
 * Score Information Form Component
 * Following OperationPricing pattern for form structure
 */
export const ScoreInformationForm: React.FC<ScoreInformationFormProps> = ({
  scoreCompany,
  companyIdentifier,
  onRefresh,
}) => {
  const [updateConnectedIntegratorList, { isLoading: updateIntegratorLoading, error: updateIntegratorError }] =
    useUpdateConnectedIntegratorListMutation();

  // Notice hook for user feedback
  const notice = useNotice();

  // Error handling for mutation
  useErrorListener(updateIntegratorError);

  const [nextOutgoingDate, setNextOutgoingDate] = useState<dayjs.Dayjs | null>(null);

  // Set the date when scoreCompany data is loaded
  useEffect(() => {
    if (scoreCompany?.nextOutgoingDate) {
      setNextOutgoingDate(dayjs(scoreCompany.nextOutgoingDate));
    } else {
      setNextOutgoingDate(null);
    }
  }, [scoreCompany]);

  const handleUpdateScoreCompany = async () => {
    if (!companyIdentifier || !scoreCompany) return;

    try {
      const updateData = prepareScoreCompanyUpdatePayload(scoreCompany, nextOutgoingDate?.toISOString() || null);

      await updateConnectedIntegratorList({
        data: updateData,
        identifier: companyIdentifier,
      }).unwrap();

      // Show success notice following legacy pattern
      notice({
        variant: 'success',
        type: 'dialog',
        title: 'Başarılı',
        message: 'Skor şirket güncelleme başarılı',
        buttonTitle: 'Tamam',
      });

      // Refetch all data instead of page reload (following legacy getScoreCompany pattern)
      onRefresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';

      console.error('Error updating score company:', errorMessage);
    }
  };

  if (scoreCompany && Object.keys(scoreCompany).length > 0) {
    return (
      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Skor Genel Bilgiler
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <CustomInputLabel label="Entegratör Son İndirme" />
                  <CustomDatePicker
                    value={nextOutgoingDate}
                    onChange={(date: unknown) => setNextOutgoingDate(date as dayjs.Dayjs | null)}
                    slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                  />
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  startIcon={updateIntegratorLoading ? <CircularProgress size={20} /> : <UpdateIcon />}
                  onClick={handleUpdateScoreCompany}
                  disabled={updateIntegratorLoading}>
                  Güncelle
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return null;
};
