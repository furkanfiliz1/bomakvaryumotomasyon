import { HUMAN_READABLE_DATE_TIME } from '@constant';
import { Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useErrorListener } from 'src/hooks';
import {
  useDownloadBillDocumentMutation,
  useGetAllowanceChecksQuery,
  useGetCompanyDocumentsQuery,
  useShowCompanyDocumentMutation,
} from '../discount-operations.api';
import type { BillData, CompanyDocumentData, DocumentData } from '../discount-operations.types';

interface DocumentsTabProps {
  allowanceId: number;
  isCheque?: boolean;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ allowanceId, isCheque = false }) => {
  const [documentData, setDocumentData] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // API queries
  const {
    data: receiverDocs,
    error: companyDocsError,
    isLoading: isLoadingCompanyDocs,
  } = useGetCompanyDocumentsQuery({ allowanceId });

  const {
    data: checkInvoices,
    error: checksError,
    isLoading: isLoadingChecks,
  } = useGetAllowanceChecksQuery({ allowanceId });

  // API mutations
  const [downloadBillDocument, { isLoading: isLoadingDownload, isError: isErrorDownload }] =
    useDownloadBillDocumentMutation();
  const [showCompanyDocument, { isLoading: isLoadingShow, isError: isErrorShow }] = useShowCompanyDocumentMutation();

  // Error handling
  useErrorListener([companyDocsError, checksError, isErrorDownload, isErrorShow].filter(Boolean) as Error[]);

  const getDocumentTypeText = (documentType: number): string => {
    switch (documentType) {
      case 1:
        return 'Çek Ön Yüz Resmi';
      case 2:
        return 'Çek Arka Yüz Resmi';
      case 3:
        return 'Çek ile ilgili fatura dosyası';
      default:
        return '';
    }
  };

  const bufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCodePoint(bytes[i]);
    }
    return globalThis.btoa(binary);
  };

  const viewDocument = async (doc: CompanyDocumentData | DocumentData, type: string, bill?: BillData) => {
    try {
      if (isCheque && 'BillId' in doc && bill) {
        const response = await downloadBillDocument({
          billId: bill.BillId,
          documentId: doc.Id,
        }).unwrap();

        setDocumentData(response.Data);
        setDocumentType(type.toLowerCase());
        setShowModal(true);
      } else {
        const companyDoc = doc as CompanyDocumentData;
        if (type === 'png' || type === 'jpg' || type === 'jpeg') {
          setDocumentData(companyDoc.Data || '');
          setDocumentType(type);
          setShowModal(true);
        } else if (type === 'xml' || type === 'pdf') {
          const response = await showCompanyDocument({ documentId: doc.Id }).unwrap();
          const arrayBuffer = await response.arrayBuffer();
          const base64Data = bufferToBase64(arrayBuffer);
          setDocumentData(base64Data);
          setDocumentType('pdf');
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Error viewing document:', error);
    }
  };

  const downloadDocument = async (doc: CompanyDocumentData | DocumentData, type: string, bill?: BillData) => {
    try {
      if (isCheque && 'BillId' in doc && bill) {
        const response = await downloadBillDocument({
          billId: bill.BillId,
          documentId: doc.Id,
        }).unwrap();

        const link = document.createElement('a');
        link.href = `data:${response.Type};base64,${response.Data}`;
        link.download = response.Name || `cek_${bill.BillId}_document`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const companyDoc = doc as CompanyDocumentData;
        if (type === 'png' || type === 'jpg' || type === 'jpeg') {
          const link = document.createElement('a');
          link.href = `data:image/${type};base64,${companyDoc.Data}`;
          link.download = companyDoc.Name || 'check';
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else if (type === 'xml' || type === 'pdf') {
          const response = await showCompanyDocument({ documentId: doc.Id }).unwrap();
          const arrayBuffer = await response.arrayBuffer();
          const base64Data = bufferToBase64(arrayBuffer);
          const docName = companyDoc.LabelName ? companyDoc.LabelName : 'dokuman';

          const link = document.createElement('a');
          link.href = `data:application/pdf;base64,${base64Data}`;
          link.download = `${docName}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const renderDocItem = (doc: CompanyDocumentData, type: 'receiver' | 'sender') => (
    <Card
      key={doc.Id}
      sx={{
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 1,
        boxShadow: 1,
        mb: 3,
        p: 3,
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 2,
            mb: 2,
            borderBottom: 1,
            borderColor: 'grey.200',
          }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 3, display: 'inline' }}>
              {type === 'receiver' ? 'Gönderen' : 'Alan'}
            </Typography>
            <Typography variant="body1" sx={{ display: 'inline' }}>
              {type === 'receiver' ? doc.SenderCompanyName : doc.ReceiverCompanyName}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {dayjs(doc.InsertDatetime).format(HUMAN_READABLE_DATE_TIME)}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body1">{doc.LabelName || ''}</Typography>
            <Typography variant="body2" color="text.secondary">
              {doc.LabelDescription}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {doc.Type === 'xml' && (
              <Button size="small" variant="text" onClick={() => viewDocument(doc, doc.Type)} disabled={isLoadingShow}>
                Görüntüle
              </Button>
            )}
            <Button
              size="small"
              variant="text"
              onClick={() => downloadDocument(doc, doc.Type)}
              disabled={isLoadingDownload || isLoadingShow}>
              İndir
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );

  const renderCheckDocumentItem = (doc: DocumentData, bill: BillData) => (
    <Card
      key={doc.Id}
      sx={{
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 1,
        boxShadow: 1,
        mb: 3,
        p: 3,
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 2,
            mb: 2,
            borderBottom: 1,
            borderColor: 'grey.200',
          }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', mr: 1 }}>
              Çek No:
            </Typography>
            <Typography variant="body1" sx={{ display: 'inline' }}>
              {bill.BillNo}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body1">{doc.Name || ''}</Typography>
            <Typography variant="body2" color="text.secondary">
              {getDocumentTypeText(doc.DocumentType || 0)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="text"
              onClick={() => viewDocument(doc, doc.Type.toLowerCase(), bill)}
              disabled={isLoadingShow}>
              Görüntüle
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={() => downloadDocument(doc, doc.Type.toLowerCase(), bill)}
              disabled={isLoadingDownload || isLoadingShow}>
              İndir
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );

  // Loading state
  if (isLoadingCompanyDocs || isLoadingChecks) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Company Documents */}
      {Array.isArray(receiverDocs) && receiverDocs.length > 0 ? (
        <Box>{receiverDocs.map((doc: CompanyDocumentData) => renderDocItem(doc, 'receiver'))}</Box>
      ) : (
        <Card
          sx={{
            border: 1,
            borderColor: 'grey.300',
            borderRadius: 1,
            boxShadow: 1,
            p: 4,
            textAlign: 'center',
            mb: 3,
          }}>
          <Typography color="text.secondary">ABF Dokümanı bulunamadı.</Typography>
        </Card>
      )}

      {/* Check Documents */}
      {Array.isArray(checkInvoices) &&
        checkInvoices.length > 0 &&
        checkInvoices.map((bill: BillData) =>
          bill.Documents?.map((doc: DocumentData) => renderCheckDocumentItem(doc, bill)),
        )}

      {/* Document Viewer Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '85vh',
          },
        }}>
        <DialogContent
          sx={{
            p: 2,
            height: 750,
            overflowY: 'auto',
          }}>
          {documentType === 'pdf' ? (
            <iframe
              title="ABF Dokümanı"
              src={`data:application/pdf;base64,${documentData}`}
              width="100%"
              height="100%"
              style={{ border: 'none', borderRadius: 4 }}
            />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <img
                title="Çek Resmi"
                src={`data:image/${documentType};base64,${documentData}`}
                alt="Document"
                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 4 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} variant="text">
            Dokümanı Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsTab;
