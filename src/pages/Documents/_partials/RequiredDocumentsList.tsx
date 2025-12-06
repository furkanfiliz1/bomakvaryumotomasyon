import { Button, Icon, Slot, Table } from '@components';
import { HUMAN_READABLE_DATE } from '@constant';
import { useDocumentsData, useUser } from '@hooks';
import { Box, Typography, styled, useTheme } from '@mui/material';
import { DocumentResponseModel, LabelResponseModel, useGetLabelsQuery } from '@store';
import { DocumentStatus } from '@types';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { RowActions } from 'src/components/common/Table/types';
import UploadModal, { UploadModalMethods } from './UploadModal';

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

export const dynamicBadgeStyle = (status?: number) => {
  if (status === 0) {
    return { color: 'warning.300', text: 'WAITING_CONTROL' };
  } else if (status === DocumentStatus.Approved || status === DocumentStatus.ConfirmedAndProcessed) {
    return {
      color: 'success.400',
      text: 'CURRENT',
    };
  } else if (
    status === DocumentStatus.Declined ||
    status === DocumentStatus.NotConfirmed ||
    status === DocumentStatus.NotProcess ||
    status === DocumentStatus.NotProcessedByPapirus
  ) {
    return {
      color: 'error.400',
      text: 'NOT_APPROVED',
    };
  } else if (status === DocumentStatus.WaitingApprove || status === DocumentStatus.WaitingProcess) {
    return {
      color: 'warning.300',
      text: 'EXPECTED_PROCESSED',
    };
  } else {
    return {
      color: 'warning.300',
      text: 'WAITING',
    };
  }
};

const headers = [
  { id: 'LabelName', label: 'BELGE ADI', slot: true, width: 450 },
  { id: 'InsertDatetime', label: 'YÜKLENME TARİHİ', slot: true },
  { id: 'Status', label: 'DURUM', slot: true },
];

// Turkish translations for status
const statusTranslations: Record<string, string> = {
  WAITING_CONTROL: 'Kontrol Bekliyor',
  CURRENT: 'Güncel',
  NOT_APPROVED: 'Onaylanmadı',
  EXPECTED_PROCESSED: 'İşleniyor',
  WAITING: 'Bekleniyor',
};

interface IProps {
  showOnlyLatestPeriodDocs?: boolean;
}

const RequiredDocumentsList = (props: IProps) => {
  const { showOnlyLatestPeriodDocs } = props;
  const theme = useTheme();
  const user = useUser();
  const uploadDocumentModalRef = useRef<UploadModalMethods>(null);

  const {
    requiredDocList,
    handleDownloadDocument,
    handleDeleteDocument,
    refetch,
    isLoading: isDocsLoading,
    requiredDocListForLatestPeriod,
  } = useDocumentsData({
    sendercompanyId: user?.CompanyId ?? 0,
  });

  const { data: labels, isLoading: isLabelsLoading } = useGetLabelsQuery(0);

  const rowActions: RowActions<DocumentResponseModel>[] = [
    {
      Element: ({ row }) => {
        return (
          <React.Fragment>
            {row?.InsertDatetime ? (
              <>
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
                  <Typography sx={{ mr: 1, color: theme.palette.neutral[600] }}>İndir</Typography>
                  <Icon icon="download-01" size={14} color={theme.palette.neutral[600]} />
                </Button>
              </>
            ) : null}
            <Button
              id={`UPLOAD-${row?.Id}`}
              onClick={() => {
                uploadDocumentModalRef.current?.open({ ...row, Id: row?.LabelId }, true);
              }}
              sx={{ mr: 1.5 }}
              variant="text"
              size="small">
              <Typography sx={{ mr: 1, color: theme.palette.neutral[600] }}>Yükle</Typography>
              <Icon icon="upload-01" size={14} color={theme.palette.neutral[600]} />
            </Button>
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <>
      <UploadModal refresh={refetch} ref={uploadDocumentModalRef} labels={labels} />

      <Table<LabelResponseModel>
        id="RequiredDocumentsList"
        rowId="Id"
        hidePaging
        loading={isDocsLoading || isLabelsLoading}
        rowActions={rowActions}
        data={showOnlyLatestPeriodDocs ? requiredDocListForLatestPeriod : requiredDocList}
        headers={headers}
        notFoundConfig={{ title: 'Zorunlu belge bulunamadı' }}>
        <Slot<DocumentResponseModel> id="LabelName">
          {(_, item) => {
            return (
              <Row sx={{ py: 2 }}>
                <Typography variant="inherit">
                  {`${item?.LabelName ?? ''} ${item?.PeriodYear || ''}${
                    item?.PeriodQuarter ? `/${item?.PeriodQuarter}` : ''
                  } `}
                </Typography>
              </Row>
            );
          }}
        </Slot>
        <Slot<DocumentResponseModel> id="InsertDatetime">
          {(_, item) => {
            return (
              <Row sx={{ py: 1 }}>
                <Typography variant="subtitle2">
                  {item?.InsertDatetime ? dayjs(item?.InsertDatetime).format(HUMAN_READABLE_DATE) : '-'}
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
    </>
  );
};

export default RequiredDocumentsList;
