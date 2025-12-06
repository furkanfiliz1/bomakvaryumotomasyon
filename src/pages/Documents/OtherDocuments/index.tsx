import { Button, Icon, Slot, Table } from '@components';
import { useAppSelector } from '@hooks';
import { Box, Card, Typography, styled, useTheme } from '@mui/material';
import { DocumentResponseModel, LabelResponseModel, useGetLabelsQuery } from '@store';
import React, { useRef } from 'react';
import { RowActions } from 'src/components/common/Table/types';
import UploadModal, { UploadModalMethods } from '../_partials/UploadModal';
import useDocumentsData from 'src/hooks/useDocumentsData';
import { MONTHS } from '@constant';
import { dynamicBadgeStyle } from '../_partials/RequiredDocumentsList';

// Turkish translations for status
const statusTranslations: Record<string, string> = {
  WAITING_CONTROL: 'Kontrol Bekliyor',
  CURRENT: 'Güncel',
  NOT_APPROVED: 'Onaylanmadı',
  EXPECTED_PROCESSED: 'İşleniyor',
  WAITING: 'Bekleniyor',
};

const StyledBadge = styled(Box)(() => ({
  display: 'inline-block',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2px 8px',
  borderRadius: 4,
  width: 125,
  textAlign: 'center',
}));

const Row = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const headers = [
  { id: 'Name', label: 'BELGE ADI', slot: true, width: 450 },
  { id: 'InsertDatetime', label: 'YÜKLENME TARİHİ', type: 'date' },
  { id: 'Status', label: 'DURUM', slot: true },
];

const OtherDocuments = () => {
  const { user } = useAppSelector((state) => state.auth);
  const theme = useTheme();
  const uploadDocumentModalRef = useRef<UploadModalMethods>(null);

  const { notRequiredDocList, handleDeleteDocument, handleDownloadDocument, refetch } = useDocumentsData({
    sendercompanyId: user?.CompanyId ?? 0,
  });
  const { data: labels, isLoading } = useGetLabelsQuery(0);

  const rowActions: RowActions<DocumentResponseModel>[] = [
    {
      Element: ({ row }) => {
        return (
          <React.Fragment>
            <Button
              id={`DELETE-${row?.Id}`}
              onClick={() => row && handleDeleteDocument(row)}
              sx={{ mr: 1.5 }}
              variant="text"
              size="small">
              <Typography sx={{ mr: 1, color: theme.palette.neutral[600] }}>Sil</Typography>
              <Icon icon="trash-04" size={14} color={theme.palette.neutral[600]} />
            </Button>

            <Button
              id={`DOWNLOAD-${row?.Id}`}
              onClick={() => row && handleDownloadDocument(row)}
              sx={{ mr: 1.5 }}
              variant="text"
              size="small">
              <Typography id="DOWNLOAD" sx={{ mr: 1, color: theme.palette.neutral[600] }}>
                İndir
              </Typography>
              <Icon icon="download-01" size={14} color={theme.palette.neutral[600]} />
            </Button>
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <UploadModal refresh={refetch} ref={uploadDocumentModalRef} labels={labels} />

      <Card sx={{ p: 3, mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="inherit">
            Şirket belgelerinizi sisteme yükleyerek limitinizi arttırabilirsiniz.
          </Typography>
          <Button
            id="UPLOAD_DOCUMENT"
            onClick={() => uploadDocumentModalRef.current?.open()}
            variant="contained"
            size="medium">
            Doküman Yükle
          </Button>
        </Box>
        <Table<LabelResponseModel>
          id="otherDocumentsTable"
          rowId="Id"
          hidePaging
          loading={isLoading}
          rowActions={rowActions}
          data={notRequiredDocList || []}
          notFoundConfig={{ title: 'Yüklenmiş belge bulunmamaktadır.' }}
          headers={headers}>
          <Slot<DocumentResponseModel> id="Name">
            {(_, item) => {
              return (
                <Row sx={{ py: 2 }}>
                  <Typography variant="inherit">
                    {`${item?.PeriodYear ? item?.PeriodYear + ' ' : ''}
                    ${item?.PeriodMonth ? MONTHS.find((m) => m.id === item?.PeriodMonth)?.name : ''}
                    ${item?.PeriodQuarter ? item?.PeriodQuarter + '. ' : ''}
                    ${item?.LabelName} 
                    `}
                  </Typography>
                </Row>
              );
            }}
          </Slot>

          <Slot<DocumentResponseModel> id="Status">
            {(_, item) => {
              const _item = dynamicBadgeStyle(item?.Status);
              return (
                <StyledBadge sx={{ backgroundColor: _item.color }}>
                  <Typography variant="caption" color="neutral.800">
                    {statusTranslations[_item.text] || _item.text}
                  </Typography>
                </StyledBadge>
              );
            }}
          </Slot>
        </Table>
      </Card>
    </React.Fragment>
  );
};

export default OtherDocuments;
