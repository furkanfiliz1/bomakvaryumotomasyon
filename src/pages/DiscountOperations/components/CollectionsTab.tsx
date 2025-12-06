import { FigoLoading, Form, useNotice } from '@components';
import { HUMAN_READABLE_DATE } from '@constant';
import { useErrorListener } from '@hooks';
import { Delete, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { AllowanceKind } from '@types';
import { currencyFormatter } from '@utils';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  useDeleteCollectionDetailLineMutation,
  useGetCollectionsQuery,
  useUpdateCollectionDetailMutation,
} from '../discount-operations.api';
import type { CollectionPaymentDetail, UpdateCollectionDetailRequest } from '../discount-operations.types';
import { useCollectionForm } from '../hooks';

interface CollectionsTabProps {
  allowanceId: number;
  kind: AllowanceKind;
}

const CollectionsTab: React.FC<CollectionsTabProps> = ({ allowanceId, kind }) => {
  const notice = useNotice();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<CollectionPaymentDetail | null>(null);

  const { data: collectionsData, isLoading, error, refetch } = useGetCollectionsQuery(allowanceId);

  const [updateCollectionDetail, { isLoading: isUpdating, error: updateError }] = useUpdateCollectionDetailMutation();
  const [deleteCollectionDetailLine, { isLoading: isDeleting }] = useDeleteCollectionDetailLineMutation();

  // Collection form hook
  const { form, schema, resetForm } = useCollectionForm();

  // Error handling
  useErrorListener([error, updateError]);

  if (isLoading) {
    return (
      <Box position="relative" height="200px">
        <FigoLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Hata: Tahsilat bilgileri yüklenirken bir sorun oluştu.
      </Alert>
    );
  }

  if (!collectionsData) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">Tahsilat bilgisi bulunamadı.</Typography>
        </CardContent>
      </Card>
    );
  }

  const handleAddCollection = (detail: CollectionPaymentDetail) => {
    setSelectedDetail(detail);
    resetForm(detail);
    setOpenDialog(true);
  };

  const handleSaveCollection = form.handleSubmit(async (formData) => {
    if (!selectedDetail || !collectionsData) return;

    try {
      const updateRequest: UpdateCollectionDetailRequest = {
        ...selectedDetail,
        ChargedAmount: formData.chargedAmount,
        ChargedAmountDate: formData.chargedAmountDate,
      };

      await updateCollectionDetail({
        allowanceId,
        paymentId: collectionsData.Id,
        detailId: selectedDetail.Id,
        detail: updateRequest,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Tahsilat başarıyla kaydedildi',
      });
      setOpenDialog(false);
      setSelectedDetail(null);
      refetch();
    } catch (err) {
      console.log('err', err);
    }
  });

  const handleDeleteCollection = async (detailLineId: number) => {
    try {
      await notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Tahsilat Silme Onayı',
        message: 'Bu tahsilat kaydını silmek istediğinizden emin misiniz?',
        buttonTitle: 'Evet, Sil',
        catchOnCancel: true,
      });

      await deleteCollectionDetailLine({
        allowanceId,
        allowancePaymentDetailLineId: detailLineId,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Tahsilat başarıyla silindi',
      });
      refetch();
    } catch (err) {
      if (err !== 'cancel') {
        notice({
          variant: 'error',
          message: 'Tahsilat silinirken bir hata oluştu',
        });
      }
    }
  };

  return (
    <Box>
      {/* Payment Details */}
      {collectionsData.AllowancePaymentDetails.map((detail) => (
        <Card key={detail.Id} sx={{ mb: 2 }}>
          <CardContent>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="body2" color="text.secondary">
                      {kind === AllowanceKind.CHEQUE ? 'Çek ID' : 'Fatura ID'}
                    </Typography>
                    <Typography variant="body1">
                      {kind === AllowanceKind.CHEQUE ? detail.BillId : detail.InvoiceId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      {kind === AllowanceKind.CHEQUE ? 'Çek No' : 'Fatura No'}
                    </Typography>
                    <Typography variant="body1">
                      {kind === AllowanceKind.CHEQUE
                        ? detail.BillNumber || detail.BillNo || '-'
                        : detail.InvoiceNumber || detail.GetInvoiceNumber || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="body2" color="text.secondary">
                      {kind === AllowanceKind.CHEQUE ? 'Çek Tutarı' : 'Fatura Tutarı'}
                    </Typography>
                    <Typography variant="body1">
                      {detail.PayableAmount
                        ? currencyFormatter(detail.PayableAmount, detail.PayableAmountCurrency)
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary">
                      Tahsilat Tarihi
                    </Typography>
                    <Typography variant="body1">
                      {detail.ChargedAmountDate ? dayjs(detail.ChargedAmountDate).format(HUMAN_READABLE_DATE) : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary">
                      Tahsil Edilen Tutar
                    </Typography>
                    <Typography variant="body1">
                      {currencyFormatter(detail.ChargedAmount, detail.PayableAmountCurrency)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddCollection(detail)}
                      disabled={isUpdating}>
                      Tahsilat
                    </Button>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Tahsilat Detayları
                </Typography>
                {detail.AllowancePaymentDetailLines.length === 0 ? (
                  <Typography color="text.secondary">Henüz tahsilat kaydı bulunmamaktadır.</Typography>
                ) : (
                  detail.AllowancePaymentDetailLines.map((line, index) => (
                    <Box
                      key={line.Id}
                      sx={{
                        p: 2,
                        mb: 1,
                        backgroundColor: index % 2 === 0 ? 'grey.50' : 'white',
                        borderRadius: 1,
                      }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">
                            Tahsilat Tarihi
                          </Typography>
                          <Typography variant="body2">
                            {line.ChargedAmountDate
                              ? dayjs(line.ChargedAmountDate).format(HUMAN_READABLE_DATE)
                              : dayjs(line.CreatedAt).format(HUMAN_READABLE_DATE)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <Typography variant="body2" color="text.secondary">
                            Tahsilat Tutarı
                          </Typography>
                          <Typography variant="body2">
                            {currencyFormatter(line.ChargedAmount, detail.PayableAmountCurrency)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteCollection(line.Id)}
                            disabled={isDeleting}>
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                )}
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      ))}

      {/* Collection Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {kind === AllowanceKind.CHEQUE ? 'Çek' : kind === AllowanceKind.RECEIVABLE ? 'Alacak' : 'Fatura'} Tahsilatı
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {kind === AllowanceKind.CHEQUE ? 'Çek ID' : 'Fatura ID'}
              </Typography>
              <Typography variant="body1">
                {kind === AllowanceKind.CHEQUE ? selectedDetail?.BillId : selectedDetail?.InvoiceId}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {kind === AllowanceKind.CHEQUE ? 'Çek No' : 'Fatura No'}
              </Typography>
              <Typography variant="body1">
                {kind === AllowanceKind.CHEQUE
                  ? selectedDetail?.BillNumber || selectedDetail?.BillNo || '-'
                  : selectedDetail?.InvoiceNumber || selectedDetail?.GetInvoiceNumber || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Para Birimi
              </Typography>
              <Typography variant="body1">{selectedDetail?.PayableAmountCurrency || 'TRY'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Form form={form} schema={schema} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button variant="contained" onClick={handleSaveCollection} disabled={isUpdating}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollectionsTab;
