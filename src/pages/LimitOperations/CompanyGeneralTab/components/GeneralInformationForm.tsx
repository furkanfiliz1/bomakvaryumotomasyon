import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { History as HistoryIcon, Update as UpdateIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { CustomDatePicker } from 'src/components/common/Form/_partials/InputDatePicker';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import { CustomTextInput } from 'src/components/common/Form/_partials/components/CustomTextInput';
import { useUpdateCompanyTransferListMutation } from '../../limit-operations.api';
import type { CompanyDetailData, GroupCompany, TransferListItem } from '../company-general-tab.types';
import {
  formatCurrency,
  formatDate,
  formatGroupCompanyText,
  getCurrentIntegrator,
  getEInvoiceStatusText,
  getFigoTransferStatusText,
  getIntegratorDisplayName,
  getStartTransferDateFromAPI,
  getWithdrawalStartDate,
  hasActiveIntegrator,
  prepareCompanyTransferUpdatePayload,
} from '../helpers';

interface GeneralInformationFormProps {
  companyDetail: CompanyDetailData | undefined;
  transferList: TransferListItem[];
  groupCompanies: GroupCompany[];
  isTransferPossible: boolean;
  onShowIntegratorHistory: () => void;
  onRefresh: () => void;
}

export const GeneralInformationForm: React.FC<GeneralInformationFormProps> = ({
  companyDetail,
  transferList,
  groupCompanies,
  isTransferPossible: transferPossible,
  onShowIntegratorHistory,
  onRefresh,
}) => {
  const [updateCompanyTransferList, { isLoading: updateTransferLoading, error: updateTransferError }] =
    useUpdateCompanyTransferListMutation();

  // Notice hook for user feedback
  const notice = useNotice();

  // Error handling for mutation
  useErrorListener(updateTransferError);

  const currentIntegrator = getCurrentIntegrator(transferList);

  const [transferActive, setTransferActive] = useState(currentIntegrator?.Config?.IsActive || false);

  // Initialize with 90 days ago, following legacy pattern
  const initialDate = dayjs().subtract(90, 'days');
  const [startTransferDate, setStartTransferDate] = useState<dayjs.Dayjs | null>(() => {
    const apiDate = getStartTransferDateFromAPI(currentIntegrator);
    // If API returns a date, don't override with null, set to 90 days ago following legacy pattern
    if (apiDate) {
      return initialDate;
    }
    return initialDate;
  });

  const handleUpdateCompany = async () => {
    if (!currentIntegrator?.Id) return;

    try {
      const updateData = prepareCompanyTransferUpdatePayload(
        currentIntegrator,
        transferActive,
        startTransferDate?.toISOString() || null,
      );

      await updateCompanyTransferList({
        data: {
          ...updateData,
          StartTransferDate: updateData.StartTransferDate || undefined,
        },
        id: updateData.Id || 0,
      }).unwrap();

      // Show success notice following legacy pattern
      notice({
        variant: 'success',
        type: 'dialog',
        title: 'Başarılı',
        message: 'Güncelleme başarılı',
        buttonTitle: 'Tamam',
      });

      // Refetch all data instead of page reload
      onRefresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';

      console.log('err', errorMessage);
    }
  };

  return (
    <Card elevation={1} sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Genel Bilgiler
            </Typography>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomInputLabel label="Şirket Adı" />
                <CustomTextInput fullWidth value={companyDetail?.CompanyName || '-'} disabled />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomInputLabel label="VKN/TCKN" />
                <CustomTextInput fullWidth value={companyDetail?.Identifier || '-'} disabled />
              </Grid>

              <Grid item xs={12}>
                <CustomInputLabel label="Adres" />
                <CustomTextInput fullWidth value={companyDetail?.Address || '-'} disabled />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomInputLabel label="Şehir" />
                <CustomTextInput fullWidth value={companyDetail?.CityName || '-'} disabled />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomInputLabel label="İlçe" />
                <CustomTextInput fullWidth value={companyDetail?.CitySubdivisionName || '-'} disabled />
              </Grid>

              <Grid item xs={12} md={10}>
                <CustomInputLabel label="Entegratör" />
                <CustomTextInput fullWidth value={getIntegratorDisplayName(transferList)} disabled />
              </Grid>

              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'end', height: '100%' }}>
                  <IconButton onClick={onShowIntegratorHistory} title="Entegratör Geçmişi">
                    <HistoryIcon />
                  </IconButton>
                </Box>
              </Grid>

              {/* Only show these status fields if integrator is connected */}
              {hasActiveIntegrator(transferList) && currentIntegrator && (
                <>
                  <Grid item xs={12} md={6}>
                    <CustomInputLabel label="E-Fatura Durumu" />
                    <CustomTextInput fullWidth value={getEInvoiceStatusText(currentIntegrator)} disabled />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomInputLabel label="Figo Aktarım Durumu" />
                    <CustomTextInput fullWidth value={getFigoTransferStatusText(currentIntegrator)} disabled />
                  </Grid>
                </>
              )}

              {/* Only show transfer status controls if integrator is connected */}
              {hasActiveIntegrator(transferList) && currentIntegrator && (
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Transfer Durumu</FormLabel>
                    <RadioGroup
                      row
                      value={transferActive}
                      onChange={(e) => setTransferActive(e.target.value === 'true')}>
                      <FormControlLabel value={true} control={<Radio />} label="Aktif" />
                      <FormControlLabel value={false} control={<Radio />} label="Pasif" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              )}

              {/* Show different fields based on integrator connection status */}
              {hasActiveIntegrator(transferList) && currentIntegrator ? (
                <>
                  {/* Only show these fields if integrator Config is active */}
                  {currentIntegrator.Config?.IsActive ? (
                    <>
                      <Grid item xs={12} md={6}>
                        <CustomInputLabel label="Aktarım Oluşturma" />
                        <CustomTextInput fullWidth value={formatDate(currentIntegrator.Config?.CreatedDate)} disabled />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomInputLabel label="Son Aktarım" />
                        <CustomDatePicker
                          value={
                            currentIntegrator.Config?.LastTransferDate
                              ? dayjs(currentIntegrator.Config.LastTransferDate)
                              : null
                          }
                          disabled
                          slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomInputLabel label="İlk Aktarım" />
                        <CustomDatePicker
                          value={startTransferDate}
                          onChange={(date: unknown) => setStartTransferDate(date as dayjs.Dayjs | null)}
                          slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body2" gutterBottom>
                          Çekim mümkün mü: {transferPossible ? 'Evet' : 'Hayır'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomInputLabel label="Çekim Başlangıç Tarihi" />
                        <CustomTextInput
                          fullWidth
                          value={getWithdrawalStartDate(currentIntegrator)?.format('DD-MM-YYYY') || '-'}
                          disabled
                        />
                      </Grid>
                    </>
                  )}
                </>
              ) : (
                /* No integrator connected at all - show minimal info */
                <Grid item xs={12}>
                  <Alert severity="info">Bu şirket için entegratör bağlantısı bulunmuyor.</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <CustomInputLabel label="Ortaklık Yapısı" />
                <CustomTextInput
                  fullWidth
                  value={companyDetail?.AffiliateStructure || '-'}
                  disabled
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomInputLabel label="Faaliyet" />
                <CustomTextInput fullWidth value={companyDetail?.Activity || '-'} disabled multiline rows={3} />
              </Grid>

              <Grid item xs={12}>
                <CustomInputLabel label="Kefalet" />
                <CustomTextInput fullWidth value={companyDetail?.Bail || '-'} disabled multiline rows={3} />
              </Grid>

              <Grid item xs={12}>
                <CustomInputLabel label="Talep Edilen Limit" />
                <CustomTextInput fullWidth value={formatCurrency(companyDetail?.RequestedLimit)} disabled />
              </Grid>

              {groupCompanies && groupCompanies.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Grup Şirketleri
                  </Typography>
                  {groupCompanies.map((groupCompany) => (
                    <Box key={`${groupCompany.Id}-${groupCompany.Identifier}`} sx={{ mb: 2 }}>
                      <CustomTextInput
                        fullWidth
                        value={formatGroupCompanyText(groupCompany.Identifier, groupCompany.CompanyName)}
                        disabled
                      />
                    </Box>
                  ))}
                </Grid>
              )}

              {(!groupCompanies || groupCompanies.length === 0) && (
                <Grid item xs={12}>
                  <Alert severity="info">Bu şirket için grup şirketi bilgisi bulunmuyor.</Alert>
                </Grid>
              )}
            </Grid>

            {/* Only show update button if integrator is connected */}
            {hasActiveIntegrator(transferList) && currentIntegrator && (
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  startIcon={updateTransferLoading ? <CircularProgress size={20} /> : <UpdateIcon />}
                  onClick={handleUpdateCompany}
                  disabled={updateTransferLoading}>
                  Güncelle
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
