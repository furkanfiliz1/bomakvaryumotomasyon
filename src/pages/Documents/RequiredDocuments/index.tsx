import { Icon } from '@components';
import { useUser } from '@hooks';
import { Alert, Box, Card, Typography, styled, useTheme } from '@mui/material';
import React from 'react';
import useDocumentsData from 'src/hooks/useDocumentsData';
import { DocumentLabelID } from '@types';
import RequiredDocumentsList from '../_partials/RequiredDocumentsList';

const IconBox = styled(Box)(({ theme }) => ({
  width: 34,
  height: 34,
  background: theme.palette.primary[700],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
}));

const RequiredDocuments = () => {
  const theme = useTheme();
  const user = useUser();

  const { isLoading: isDocsLoading, notUploadedRequiredDocs } = useDocumentsData({
    sendercompanyId: user?.CompanyId ?? 0,
  });

  return (
    <React.Fragment>
      {notUploadedRequiredDocs.length !== 0 && !isDocsLoading && (
        <Card sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center' }}>
          <IconBox>
            <Icon icon="bell-ringing-01" size={20} color={theme.palette.common.white} />
          </IconBox>
          <Typography variant="body1" sx={{ ml: 2 }}>
            Figoparayı kullanabilmek için iletmeniz gereken <strong>{notUploadedRequiredDocs.length}</strong> belge
            bulunuyor.
          </Typography>
        </Card>
      )}
      {notUploadedRequiredDocs.length > 0 && !isDocsLoading && (
        <Alert
          variant="filled"
          color="warning"
          severity="warning"
          sx={{ mt: 2, '.MuiAlert-icon': { alignItems: 'center', fontSize: 30 } }}>
          {notUploadedRequiredDocs.map((doc) => {
            if (doc.LabelId === DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID) {
              return (
                <Typography key={doc.LabelId}>
                  <strong>Yıllık Beyanname</strong> {doc.PeriodYear} yılı olmalıdır.
                </Typography>
              );
            }

            if (doc.LabelId === DocumentLabelID.GECICI_BEYANNAME_LABEL_ID) {
              return (
                <Typography key={doc.LabelId}>
                  <strong>Geçici beyanname</strong> {doc.PeriodYear}/{doc.PeriodQuarter}. dönem olmalıdır.
                </Typography>
              );
            }

            if (doc.LabelId === DocumentLabelID.MIZAN_LABEL_ID) {
              return (
                <Typography key={doc.LabelId}>
                  <strong>Mizan</strong> {doc.PeriodYear}/{doc.PeriodQuarter}. dönem olmalıdır.
                </Typography>
              );
            }

            if (doc.LabelId === DocumentLabelID.FINDEKS_LABEL_ID) {
              return (
                <Typography key={doc.LabelId}>
                  <strong>Findeks Raporu</strong> yüklü olmalıdır.
                </Typography>
              );
            }

            return null;
          })}
        </Alert>
      )}

      <Card sx={{ p: 3, mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="inherit">
            Şirket belgelerinizi sisteme yükleyerek limitinizi arttırabilirsiniz.
          </Typography>
        </Box>
        <RequiredDocumentsList />
      </Card>
    </React.Fragment>
  );
};

export default RequiredDocuments;
