import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import {
  useCreateFinancerRetreatMutation,
  useGetFinancerRetreatQuery,
  useUpdateFinancerRetreatMutation,
} from '../discount-operations.api';

interface ChangeProcessTabProps {
  allowanceId: number;
  isSpot?: boolean;
  isSpotWithoutInvoice?: boolean;
  onTabChange?: (index: number) => void;
  onRefresh: () => void;
}

/**
 * Change Process Tab - Manages financer retreat requests and approvals
 * Based on legacy ChangeProcessTab.js with modern React hooks and Material-UI
 * Follows OperationPricing patterns for component structure
 */
const ChangeProcessTab: React.FC<ChangeProcessTabProps> = ({
  allowanceId,
  isSpot = false,
  isSpotWithoutInvoice = false,
  onTabChange,
  onRefresh,
}) => {
  const notice = useNotice();
  const [retreatDesc, setRetreatDesc] = useState('');

  // RTK Query hooks for data fetching and mutations
  const { data: retreat, isLoading, error, refetch } = useGetFinancerRetreatQuery(allowanceId);
  const [createFinancerRetreat, { isLoading: isCreating, error: createError, isSuccess: isCreateSuccess }] =
    useCreateFinancerRetreatMutation();
  const [updateFinancerRetreat, { isLoading: isUpdating, error: updateError }] = useUpdateFinancerRetreatMutation();

  // Error handling
  useErrorListener([error, createError, updateError]);

  // Reset description when retreat changes
  useEffect(() => {
    if (retreat?.Status === 2 || !retreat) {
      setRetreatDesc('');
    }
  }, [retreat]);

  // Handle create success
  useEffect(() => {
    if (isCreateSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Talebiniz değerlendirme sürecine alınmıştır, sonuçlandığında bilgilendirme iletilecektir.',
        buttonTitle: 'Tamam',
      });
      setRetreatDesc('');
      refetch();
    }
  }, [isCreateSuccess, notice, refetch]);

  const getCreateConfirmMessage = () => {
    // retreatRequestModalQuestion / retreatRequestModalQuestionSpot
    if (isSpot) {
      return 'Kredi durumunu Finans Şirketi Geri Çekildi olarak güncellemek istediğinize emin misiniz?';
    }
    return 'İskonto durumunu Finans Şirketi Geri Çekildi olarak güncellemek istediğinize emin misiniz?';
  };

  const handleCreateRetreat = () => {
    if (!retreatDesc.trim()) {
      notice({
        variant: 'warning',
        title: 'Uyarı',
        message: 'Lütfen açıklama giriniz.',
        buttonTitle: 'Tamam',
      });
      return;
    }

    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Finans şirketi geri çekilme', // financeWithDrawal
      message: getCreateConfirmMessage(),
      buttonTitle: 'Güncelle',
      onClick: () => {
        createFinancerRetreat({
          allowanceId,
          data: { Description: retreatDesc },
        });
      },
      catchOnCancel: true,
    });
  };

  const getUpdateConfirmMessage = (isApprove: boolean) => {
    if (isApprove) {
      // retreatEvalutionModalQuestion / retreatEvalutionModalQuestionSpot
      return isSpot
        ? 'Kredi durumunu Finans Şirketi Geri Çekildi olarak güncellemek istediğinize emin misiniz?'
        : 'İskonto durumunu Finans Şirketi Geri Çekildi olarak güncellemek istediğinize emin misiniz?';
    }
    // retreatEvalutionModalQuestionRejectResponse / retreatEvalutionModalQuestionRejectResponseSpot
    return isSpot
      ? 'Kredi durumunu Finans Şirketi Geri Çekilme isteğini reddetmek istediğinize emin misiniz?'
      : 'İskonto durumunu Finans Şirketi Geri Çekilme isteğini reddetmek istediğinize emin misiniz?';
  };

  const getUpdateSuccessMessage = (isApprove: boolean) => {
    if (isApprove) {
      // retreatEvalutionModalQuestionResponse / retreatEvalutionModalQuestionResponseSpot
      return isSpot
        ? 'İşlem başarıyla gerçekleştirildi. Kredinin Finans Şirketi Geri Çekildi durumuna alma talebi onaylanmıştır.'
        : 'İşlem başarıyla gerçekleştirildi. İskontonun Finans Şirketi Geri Çekildi durumuna alma talebi onaylanmıştır.';
    }
    // retreatEvalutionModalQuestionReject / retreatEvalutionModalQuestionRejectSpot
    return isSpot
      ? 'Kredinin Finans Şirketi Geri Çekildi durumuna alma talebi reddedilmiştir.'
      : 'İskontonun Finans Şirketi Geri Çekildi durumuna alma talebi reddedilmiştir.';
  };

  const handleUpdateRetreat = (status: number) => {
    const isApprove = status === 1;

    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Finansör Geri Çekilme',
      message: getUpdateConfirmMessage(isApprove),
      buttonTitle: 'Tamam',
      onClick: () => {
        updateFinancerRetreat({
          allowanceId,
          data: { Status: status },
        })
          .unwrap()
          .then(() => {
            // Change tab first to avoid render issues when tab visibility changes
            if (isApprove && onTabChange) {
              onTabChange(0);
            }

            notice({
              variant: 'success',
              title: 'Başarılı',
              message: getUpdateSuccessMessage(isApprove),
              buttonTitle: 'Tamam',
            });

            // Refresh data after changing tab
            onRefresh();
            refetch();
          });
      },
      catchOnCancel: true,
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  const getRequestAlertMessage = () => {
    // retreatRequestDescSpot / retreatRequestDescSpotWithoutInvoice / retreatRequestDesc
    if (isSpot) {
      return 'Kredi durumunun Finans Şirketi Geri Çekildi olarak güncellenmesi talep edildikten sonra değerlendirme süreci başlamaktadır. Üst yönetim onayına yönlendirilecek ve onaylanması durumunda kredinin içerisindeki tüm faturaların ödemesi iptal edilecektir.';
    }
    if (isSpotWithoutInvoice) {
      return 'Kredi durumunun Finans Şirketi Geri Çekildi olarak güncellenmesi talep edildikten sonra değerlendirme süreci başlamaktadır. Üst yönetim onayına yönlendirilecek ve onaylanması durumunda kredini ödemesi iptal edilecektir';
    }
    return 'İskonto durumunun Finans Şirketi Geri Çekildi olarak güncellenmesi talep edildikten sonra değerlendirme süreci başlamaktadır. Üst yönetim onayına yönlendirilecek ve onaylanması durumunda iskontonun içerisindeki tüm faturaların ödemesi iptal edilecektir.';
  };

  // Show request form if no retreat exists or if it was rejected
  if (!retreat || retreat.Status === 2) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', fontWeight: 300 }}>
          Talep Süreci
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          {getRequestAlertMessage()}
        </Alert>

        <Box>
          <CustomInputLabel label="Finans Şirketi Geri Çekilme Nedeni:"></CustomInputLabel>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={retreatDesc}
            onChange={(e) => setRetreatDesc(e.target.value)}
            placeholder="Geri çekilme nedeninizi giriniz..."
            disabled={isCreating}
          />

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateRetreat}
              disabled={isCreating || !retreatDesc.trim()}>
              {isCreating ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // Show evaluation form if retreat exists and is pending (Status === 0 or 1)
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', fontWeight: 300 }}>
        Değerlendirme Süreci
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        {isSpot
          ? 'Talebin onaylanması durumunda kredi durumu Finans Şirketi Geri Çekildi olarak güncellenmektir; ret durumunda kredi durumu değişmemektedir.'
          : 'Talebin onaylanması durumunda iskonto durumu Finans Şirketi Geri Çekildi olarak güncellenmektir; ret durumunda iskonto durumu değişmemektedir.'}
      </Alert>

      <Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Finans Şirketi Geri Çekilme Nedeni:"
          value={retreat.Description}
          disabled
        />

        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button variant="outlined" color="error" onClick={() => handleUpdateRetreat(2)} disabled={isUpdating}>
            Reddet
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleUpdateRetreat(1)} disabled={isUpdating}>
            Onayla
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChangeProcessTab;
