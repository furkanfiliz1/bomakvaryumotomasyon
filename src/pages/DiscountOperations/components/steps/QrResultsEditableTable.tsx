import { Slot, Table, useNotice } from '@components';
import { HUMAN_READABLE_DATE } from '@constant';
import {
  Clear as ClearIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { forwardRef, Ref, useCallback, useImperativeHandle, useState } from 'react';
import { NumericFormat } from 'react-number-format';

import type { HeadCell } from 'src/components/common/Table/types';
import { useUploadSingleBillMutation } from '../../discount-operations.api';
import { getDummyQrResults } from './dummy-qr-data';
import { QrRowEditDialog } from './QrRowEditDialog';
import { ChequeDocument, SingleChequeUploadRequest } from './single-cheque-form.types';

export interface QrResultsEditableTableMethods {
  saveBulkCheques: () => Promise<void>;
  clearTable: () => void;
}

enum DocumentType {
  FRONT_IMAGE = 1,
  BACK_IMAGE = 2,
  INVOICE_FILE = 3,
}

interface QrResult {
  BillNo: string;
  AccountNo: string;
  BankName: string;
  BankBranchName: string;
  BankBranchCode: string;
  BankCode: string;
  DrawerName: string;
  DrawerIdentifier: string;
  MersisNo?: string;
  BarcodeText?: string;
  ErrorMessage: string | null;
  ImageIndex: number;
  // Additional editable fields
  drawerName?: string;
  drawerIdentifier?: string;
  placeOfIssue?: string;
  billNo?: string;
  accountNo?: string;
  bankName?: string;
  bankBranchName?: string;
  payableAmount?: number;
  paymentDueDate?: Dayjs | string;
  // Row-specific document uploads
  frontImage?: File | null;
  backImage?: File | null;
  invoiceFile?: File | null;
  // Endorser information
  referenceEndorserName?: string;
  referenceEndorserIdentifier?: string;
  endorserName?: string;
  endorserIdentifier?: string;
  billReferenceEndorsers?: { id: string; endorserName: string; endorserIdentifier: string }[];
}

interface QrResultsEditableTableProps {
  qrResults: QrResult[];
  setQrResults: React.Dispatch<React.SetStateAction<QrResult[]>>;
  companyId?: number;
  onSuccess?: () => void;
  pdfFile?: File | null;
  isQrProcessing?: boolean;
}

interface EditableRow extends QrResult {
  id: number;
}

// Define table headers for QR results
const getQrResultsTableHeaders = (): HeadCell[] => [
  { id: 'drawerName', label: 'Keşideci Adı*', slot: true, isSortDisabled: true },
  { id: 'drawerIdentifier', label: 'VKN/TCKN*', slot: true, isSortDisabled: true },
  { id: 'placeOfIssue', label: 'Keşide Yeri', slot: true, isSortDisabled: true },
  { id: 'billNo', label: 'Çek No*', slot: true, isSortDisabled: true },
  { id: 'accountNo', label: 'Hesap No*', slot: true, isSortDisabled: true },
  { id: 'bankName', label: 'Banka Adı*', slot: true, isSortDisabled: true },
  { id: 'bankBranchName', label: 'Şube Adı*', slot: true, isSortDisabled: true },
  { id: 'payableAmount', label: 'Tutar*', slot: true, isSortDisabled: true },
  { id: 'paymentDueDate', label: 'Vade Tarihi*', slot: true, type: 'date', isSortDisabled: true },
  { id: 'frontImage', label: 'Ön', slot: true, width: 40, isSortDisabled: true },
  { id: 'backImage', label: 'Arka', slot: true, width: 40, isSortDisabled: true },
  { id: 'invoiceFile', label: 'Fat', slot: true, width: 40, isSortDisabled: true },
];

const QrResultsEditableTableComponent = (
  { qrResults, setQrResults, companyId, onSuccess, pdfFile, isQrProcessing = false }: QrResultsEditableTableProps,
  ref: Ref<QrResultsEditableTableMethods>,
) => {
  const theme = useTheme();
  const notice = useNotice();
  const [uploadSingleBill] = useUploadSingleBillMutation();

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<QrResult | null>(null);

  // Expose saveBulkCheques method to parent via ref
  useImperativeHandle(ref, () => ({
    saveBulkCheques,
    clearTable: () => {
      setQrResults([]);
    },
  }));

  // Bulk save state
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  // Handle edit row
  const handleEditRow = useCallback(
    (rowId: number) => {
      const row = qrResults[rowId - 1]; // rowId is 1-based, array is 0-based
      if (row) {
        setEditingRow(row);
        setEditDialogOpen(true);
      }
    },
    [qrResults],
  );

  // Handle save edited row
  const handleSaveEditedRow = useCallback(
    (updatedRow: QrResult) => {
      if (!editingRow) return;

      // Find the index of the editing row in the original qrResults array
      const rowIndex = qrResults.findIndex((item) => item === editingRow);
      if (rowIndex !== -1) {
        setQrResults((prev) => {
          const newResults = [...prev];
          newResults[rowIndex] = updatedRow;
          return newResults;
        });
      }
      setEditDialogOpen(false);
      setEditingRow(null);
    },
    [qrResults, editingRow, setQrResults],
  );

  // Handle close edit dialog
  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditingRow(null);
  }, []);

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove data:image/png;base64, prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Convert files to ChequeDocument format
  const convertFilesToDocuments = async (files: File[], documentType: DocumentType): Promise<ChequeDocument[]> => {
    const documents: ChequeDocument[] = [];

    for (const file of files) {
      try {
        const base64Data = await convertToBase64(file);
        documents.push({
          name: file.name,
          type: file.type.split('/')[1] || 'jpg',
          data: base64Data,
          documentType: documentType,
        });
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }

    return documents;
  };

  // Convert QrResult to SingleChequeUploadRequest
  const convertQrResultToUploadRequest = async (
    qrResult: QrResult,
    companyId: number,
  ): Promise<SingleChequeUploadRequest> => {
    const allDocuments: ChequeDocument[] = [];

    // Front image file
    if (qrResult.frontImage) {
      const frontDocs = await convertFilesToDocuments([qrResult.frontImage], DocumentType.FRONT_IMAGE);
      allDocuments.push(...frontDocs);
    }

    // Back image file
    if (qrResult.backImage) {
      const backDocs = await convertFilesToDocuments([qrResult.backImage], DocumentType.BACK_IMAGE);
      allDocuments.push(...backDocs);
    }

    // Invoice files
    if (qrResult.invoiceFile) {
      const invoiceDocs = await convertFilesToDocuments([qrResult.invoiceFile], DocumentType.INVOICE_FILE);
      allDocuments.push(...invoiceDocs);
    }

    return {
      drawerName: qrResult.drawerName || qrResult.DrawerName || null,
      drawerIdentifier: qrResult.drawerIdentifier || qrResult.DrawerIdentifier || '',
      placeOfIssue: qrResult.placeOfIssue || '',
      bankEftCode: qrResult.BankCode || '',
      bankBranchEftCode: qrResult.BankBranchCode || '',
      no: qrResult.billNo || qrResult.BillNo || '',
      billPaymentType: 1, // Default value
      chequeAccountNo: qrResult.accountNo || qrResult.AccountNo || '',
      payableAmount: (qrResult.payableAmount || 0).toString(),
      paymentDueDate: qrResult.paymentDueDate
        ? typeof qrResult.paymentDueDate === 'string'
          ? qrResult.paymentDueDate
          : dayjs(qrResult.paymentDueDate).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      referenceEndorserName: qrResult.referenceEndorserName || '',
      referenceEndorserIdentifier: qrResult.referenceEndorserIdentifier || '',
      endorserName: qrResult.endorserName || '',
      endorserIdentifier: qrResult.endorserIdentifier || '',
      payableAmountCurrency: 'TRY',
      type: 1,
      companyId,
      billDocumentList: allDocuments,
      billReferenceEndorsersList: (qrResult.billReferenceEndorsers || []).filter(
        (endorser) => endorser.endorserIdentifier && endorser.endorserIdentifier.trim() !== '',
      ),
      ImageIndex: qrResult.ImageIndex,
    };
  };

  // Bulk save cheques (based on legacy saveBulkCheques function)
  const saveBulkCheques = async () => {
    if (qrResults.length === 0) {
      notice({
        variant: 'warning',
        title: 'Uyarı',
        message: 'Kaydedilecek çek bulunamadı',
        buttonTitle: 'Tamam',
      });
      return;
    }

    setIsBulkSaving(true);
    setBulkProgress({ current: 0, total: qrResults.length });

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const successfulIndices: number[] = []; // Track successfully saved cheques

    try {
      // Process each cheque sequentially (asynchronously row by row like legacy)
      for (let i = 0; i < qrResults.length; i++) {
        const qrResult = qrResults[i];

        setBulkProgress({ current: i + 1, total: qrResults.length });

        try {
          // Convert QrResult to upload request format
          const billData = await convertQrResultToUploadRequest(qrResult, companyId || 301);

          // Create MultipleBillDocument if pdfFile exists and row doesn't have individual documents
          let multipleBillDocument = null;
          const hasIndividualDocuments = qrResult.frontImage;

          if (pdfFile && !hasIndividualDocuments) {
            const pdfBase64 = await convertToBase64(pdfFile);
            multipleBillDocument = {
              DocumentType: 1,
              data: pdfBase64,
              dataUrl: undefined,
              file: undefined,
              imagePath: undefined,
              name: pdfFile.name,
              type: 'pdf',
            };
          }

          // Upload single cheque
          await uploadSingleBill({
            BillList: [billData],
            MultipleBillDocument: hasIndividualDocuments ? null : multipleBillDocument,
            isMultipleBill: hasIndividualDocuments ? false : true,
          }).unwrap();

          successCount++;
          successfulIndices.push(i);
        } catch (error) {
          errorCount++;

          // API'den gelen hata mesajını düzgün bir şekilde parse et
          let errorMessage = 'Bilinmeyen hata';

          if (error && typeof error === 'object') {
            // RTK Query error yapısını kontrol et
            if ('data' in error && error.data) {
              const errorData = error.data as {
                FriendlyMessage?: string;
                Title?: string;
                message?: string;
              };

              // API'den gelen FriendlyMessage'ı kullan
              if (errorData.FriendlyMessage) {
                errorMessage = errorData.FriendlyMessage;
              } else if (errorData.Title) {
                errorMessage = errorData.Title;
              } else if (errorData.message) {
                errorMessage = errorData.message;
              }
            } else if ('message' in error && error.message) {
              errorMessage = error.message as string;
            }
          }

          const chequeIdentifier = qrResult.billNo || qrResult.BillNo || `Sıra ${i + 1}`;
          errors.push(`${chequeIdentifier}: ${errorMessage}`);
          console.error(`Error uploading cheque ${i + 1}:`, error);
        }
      }

      // Show result message
      if (errorCount === 0) {
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: `Tüm çekler başarıyla kaydedildi. (${successCount} adet)`,
          buttonTitle: 'Tamam',
        });

        // Remove successfully saved cheques from the list
        setQrResults([]);

        if (onSuccess) {
          onSuccess();
        }
      } else {
        const message =
          successCount > 0
            ? `${successCount} çek başarıyla kaydedildi, ${errorCount} çekte hata oluştu.`
            : `Tüm çeklerde hata oluştu. (${errorCount} adet)`;

        notice({
          variant: successCount > 0 ? 'warning' : 'error',
          title: successCount > 0 ? 'Kısmi Başarı' : 'Hata',
          message: (
            <Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {message}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Detaylı Hatalar:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, textAlign: 'left' }}>
                {errors.map((err, idx) => (
                  <Typography key={idx} component="li" variant="body2" sx={{ mb: 0.5 }}>
                    <strong>#{idx + 1}</strong> {err}
                  </Typography>
                ))}
              </Box>
            </Box>
          ),
          buttonTitle: 'Tamam',
        });

        // Remove only successfully saved cheques from the list
        if (successfulIndices.length > 0) {
          setQrResults((prev) => prev.filter((_, index) => !successfulIndices.includes(index)));
        }
      }
    } catch (error) {
      console.error('Bulk save error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Toplu kaydetme sırasında beklenmeyen bir hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setIsBulkSaving(false);
      setBulkProgress({ current: 0, total: 0 });
    }
  };

  // Convert QR results to table data format
  console.log('qrResults', qrResults);
  const tableData: EditableRow[] = qrResults.map((item, index) => ({
    ...item,
    id: index + 1,
    // Use updated values if available, fallback to original QR results
    drawerName: item.drawerName || item.DrawerName || '',
    drawerIdentifier: item.drawerIdentifier || item.DrawerIdentifier || '',
    placeOfIssue: item.placeOfIssue || '',
    billNo: item.billNo || item.BillNo || '',
    accountNo: item.accountNo || item.AccountNo || '',
    bankName: item.bankName || item.BankName || '',
    bankBranchName: item.bankBranchName || item.BankBranchName || '',
    payableAmount: item.payableAmount || 0,
    paymentDueDate: item.paymentDueDate ? dayjs(item.paymentDueDate) : dayjs(),
    // Initialize per-row document uploads
    frontImage: item.frontImage || null,
    backImage: item.backImage || null,
    invoiceFile: item.invoiceFile || null,
  }));

  // Handle delete row
  const handleDeleteRow = useCallback(
    async (rowId: number) => {
      try {
        setQrResults((prev) => prev.filter((_, index) => index + 1 !== rowId));

        await notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Çek silindi.',
        });
      } catch (error) {
        await notice({
          variant: 'error',
          title: 'Hata',
          message: 'Silme işlemi başarısız.',
        });
      }
    },
    [setQrResults, notice],
  );

  // Handle document upload for specific row and document type
  const handleDocumentUpload = useCallback(
    async (rowId: number, documentType: DocumentType, file: File | null) => {
      try {
        const fieldName =
          documentType === DocumentType.FRONT_IMAGE
            ? 'frontImage'
            : documentType === DocumentType.BACK_IMAGE
              ? 'backImage'
              : 'invoiceFile';

        setQrResults((prev) =>
          prev.map((item, index) => {
            if (index + 1 === rowId) {
              return { ...item, [fieldName]: file };
            }
            return item;
          }),
        );

        if (file) {
          await notice({
            variant: 'success',
            title: 'Dosya Yüklendi',
            message: `${file.name} başarıyla yüklendi.`,
          });
        } else {
          // File silindi
          const documentTypeLabel =
            documentType === DocumentType.FRONT_IMAGE
              ? 'Ön yüz'
              : documentType === DocumentType.BACK_IMAGE
                ? 'Arka yüz'
                : 'Fatura';

          await notice({
            variant: 'success',
            title: 'Dosya Silindi',
            message: `${documentTypeLabel} dosyası silindi.`,
          });
        }
      } catch (error) {
        await notice({
          variant: 'error',
          title: 'Hata',
          message: 'Dosya işlemi sırasında bir hata oluştu.',
        });
      }
    },
    [setQrResults, notice],
  );

  // Handle copying first row value to all rows
  const handleCopyToAllRows = useCallback(
    (field: 'placeOfIssue' | 'payableAmount' | 'paymentDueDate') => {
      if (qrResults.length === 0) return;

      const firstRowValue = qrResults[0];
      let valueToApply: string | number | Dayjs | null = null;

      switch (field) {
        case 'placeOfIssue':
          valueToApply = firstRowValue.placeOfIssue || '';
          break;
        case 'payableAmount':
          valueToApply = firstRowValue.payableAmount || 0;
          break;
        case 'paymentDueDate':
          valueToApply = firstRowValue.paymentDueDate ? dayjs(firstRowValue.paymentDueDate) : dayjs();
          break;
      }

      setQrResults((prev) =>
        prev.map((item) => {
          const updatedItem = { ...item };

          switch (field) {
            case 'placeOfIssue':
              updatedItem.placeOfIssue = valueToApply as string;
              break;
            case 'payableAmount':
              updatedItem.payableAmount = valueToApply as number;
              break;
            case 'paymentDueDate':
              updatedItem.paymentDueDate = valueToApply as Dayjs;
              break;
          }

          return updatedItem;
        }),
      );

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: `İlk satırdaki değer tüm satırlara kopyalandı.`,
        buttonTitle: 'Tamam',
      });
    },
    [qrResults, setQrResults, notice],
  );

  // Handle loading dummy data for testing
  const handleLoadDummyData = useCallback(() => {
    const dummyData = getDummyQrResults(8); // Load 8 dummy records
    setQrResults(dummyData);
    notice({
      variant: 'primary',
      title: 'Test Verisi Yüklendi',
      message: `${dummyData.length} adet test çek verisi yüklendi.`,
      buttonTitle: 'Tamam',
    });
  }, [setQrResults, notice]);

  // Handle field change
  const handleFieldChange = (rowId: number, field: keyof EditableRow, value: string | number | Dayjs | File | null) => {
    setQrResults((prev) =>
      prev.map((item, index) => {
        if (index + 1 === rowId) {
          // Map EditableRow fields to QrResult fields for proper state update
          const updatedItem = { ...item };

          switch (field) {
            case 'drawerName':
              updatedItem.drawerName = value as string;
              updatedItem.DrawerName = value as string; // Also update original field
              break;
            case 'drawerIdentifier':
              updatedItem.drawerIdentifier = value as string;
              updatedItem.DrawerIdentifier = value as string; // Also update original field
              break;
            case 'placeOfIssue':
              updatedItem.placeOfIssue = value as string;
              break;
            case 'billNo':
              updatedItem.billNo = value as string;
              updatedItem.BillNo = value as string; // Also update original field
              break;
            case 'accountNo':
              updatedItem.accountNo = value as string;
              updatedItem.AccountNo = value as string; // Also update original field
              break;
            case 'payableAmount':
              updatedItem.payableAmount = value as number;
              break;
            case 'paymentDueDate':
              updatedItem.paymentDueDate = value as Dayjs;
              break;
            case 'frontImage':
              updatedItem.frontImage = value as File | null;
              break;
            case 'backImage':
              updatedItem.backImage = value as File | null;
              break;
            case 'invoiceFile':
              updatedItem.invoiceFile = value as File | null;
              break;
          }

          return updatedItem;
        }
        return item;
      }),
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Development/Testing Button - Remove in production */}
          {process.env.NODE_ENV === 'development' && tableData.length === 0 && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ display: 'none' }}
              onClick={handleLoadDummyData}
              size="small"
              disabled={isQrProcessing}>
              Test Verisi Yükle
            </Button>
          )}
        </Box>
      </Box>

      {/* Progress Bar for Bulk Save */}
      {isBulkSaving && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={bulkProgress.total > 0 ? (bulkProgress.current / bulkProgress.total) * 100 : 0}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Kaydediliyor... {bulkProgress.current} / {bulkProgress.total}
          </Typography>
        </Box>
      )}

      <Box
        className="qr-results-compact-table"
        sx={{
          position: 'relative',
          ...(isQrProcessing
            ? { pointerEvents: 'none', opacity: 0.5 }
            : isBulkSaving
              ? { pointerEvents: 'none', opacity: 0.7 }
              : {}),
          '& .MuiTableCell-root': {
            padding: '4px 8px !important',
            fontSize: '12px',
            lineHeight: 1.2,
          },
          '& .MuiTableCell-head': {
            padding: '6px 8px !important',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: 1.3,
          },
          '& .MuiCheckbox-root': {
            padding: '2px',
          },
          '& .MuiIconButton-root': {
            padding: '4px',
          },
          '& .MuiTextField-root': {
            '& .MuiInputBase-root': {
              fontSize: '12px',
              padding: '2px 4px',
            },
            '& .MuiInputBase-input': {
              padding: '4px 6px',
              fontSize: '12px',
            },
          },
          '& .MuiButton-root': {
            fontSize: '11px',
            padding: '2px 6px',
            minHeight: 'unset',
          },
          '& .MuiChip-root': {
            height: '20px',
            fontSize: '10px',
          },
        }}>
        <Table<EditableRow>
          id="qr-results-table"
          rowId="id"
          data={tableData}
          headers={getQrResultsTableHeaders()}
          hidePaging={true}
          size="small"
          maxHeight="500px"
          notFoundConfig={{
            title: isQrProcessing ? 'QR kodlar okunuyor...' : 'Henüz QR kod okunmamış',
            subTitle: isQrProcessing
              ? 'Lütfen bekleyiniz, çek bilgileri işleniyor.'
              : 'Çek ön yüz görselini yükleyerek QR kod okutabilirsiniz.',
          }}
          rowActions={[
            {
              Element: ({ row }) =>
                row ? (
                  <IconButton size="small" color="primary" onClick={() => handleEditRow(row.id)}>
                    <EditIcon />
                  </IconButton>
                ) : null,
            },
            {
              Element: ({ row }) =>
                row ? (
                  <IconButton
                    size="small"
                    sx={{ color: theme.palette.error[700] }}
                    onClick={() => handleDeleteRow(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                ) : null,
            },
          ]}>
          {/* Editable Text Fields */}
          <Slot<EditableRow> id="drawerName">
            {(_, row) => (
              <TextField
                size="small"
                value={row?.drawerName || ''}
                onChange={(e) => handleFieldChange(row!.id, 'drawerName', e.target.value)}
                placeholder="Keşideci adı"
                variant="outlined"
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '12px',
                    minHeight: '28px',
                  },
                  '& .MuiInputBase-input': {
                    padding: '4px 6px',
                  },
                }}
              />
            )}
          </Slot>

          <Slot<EditableRow> id="drawerIdentifier">
            {(_, row) => (
              <TextField
                size="small"
                value={row?.drawerIdentifier || ''}
                onChange={(e) => handleFieldChange(row!.id, 'drawerIdentifier', e.target.value)}
                placeholder="VKN/TCKN"
                variant="outlined"
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '12px',
                    minHeight: '28px',
                  },
                  '& .MuiInputBase-input': {
                    padding: '4px 6px',
                  },
                }}
              />
            )}
          </Slot>

          <Slot<EditableRow> id="placeOfIssue">
            {(_, row) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TextField
                  size="small"
                  value={row?.placeOfIssue || ''}
                  onChange={(e) => handleFieldChange(row!.id, 'placeOfIssue', e.target.value)}
                  placeholder="Keşide yeri"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '12px',
                      minHeight: '28px',
                    },
                    '& .MuiInputBase-input': {
                      padding: '4px 6px',
                    },
                  }}
                />
                {row?.id === 1 && tableData.length > 1 && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleCopyToAllRows('placeOfIssue')}
                    title="İlk satırdaki değeri tüm satırlara kopyala"
                    sx={{ p: 0.5, ml: 0.5 }}>
                    <ContentCopyIcon sx={{ fontSize: '14px' }} />
                  </IconButton>
                )}
              </Box>
            )}
          </Slot>

          <Slot<EditableRow> id="billNo">
            {(_, row) => (
              <TextField
                size="small"
                value={row?.billNo || ''}
                onChange={(e) => handleFieldChange(row!.id, 'billNo', e.target.value)}
                placeholder="Çek no"
                variant="outlined"
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '12px',
                    minHeight: '28px',
                  },
                  '& .MuiInputBase-input': {
                    padding: '4px 6px',
                  },
                }}
              />
            )}
          </Slot>

          <Slot<EditableRow> id="accountNo">
            {(_, row) => (
              <TextField
                size="small"
                value={row?.accountNo || ''}
                onChange={(e) => handleFieldChange(row!.id, 'accountNo', e.target.value)}
                placeholder="Hesap no"
                variant="outlined"
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '12px',
                    minHeight: '28px',
                  },
                  '& .MuiInputBase-input': {
                    padding: '4px 6px',
                  },
                }}
              />
            )}
          </Slot>

          <Slot<EditableRow> id="payableAmount">
            {(_, row) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <NumericFormat
                  size="small"
                  value={row?.payableAmount || 0}
                  onValueChange={(values) => {
                    handleFieldChange(row!.id, 'payableAmount', values.floatValue || 0);
                  }}
                  placeholder="Tutar"
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  allowNegative={false}
                  customInput={TextField}
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: '₺',
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '12px',
                      minHeight: '28px',
                    },
                    '& .MuiInputBase-input': {
                      padding: '4px 6px',
                    },
                  }}
                />
                {row?.id === 1 && tableData.length > 1 && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleCopyToAllRows('payableAmount')}
                    title="İlk satırdaki değeri tüm satırlara kopyala"
                    sx={{ p: 0.5, ml: 0.5 }}>
                    <ContentCopyIcon sx={{ fontSize: '14px' }} />
                  </IconButton>
                )}
              </Box>
            )}
          </Slot>

          <Slot<EditableRow> id="paymentDueDate">
            {(_, row) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={row?.paymentDueDate ? dayjs(row.paymentDueDate) : null}
                    onChange={(date: Dayjs | null) => handleFieldChange(row!.id, 'paymentDueDate', date)}
                    format={HUMAN_READABLE_DATE}
                    slotProps={{
                      textField: {
                        size: 'small',
                        variant: 'outlined',
                        fullWidth: true,
                        required: true,
                        sx: {
                          '& .MuiInputBase-root': {
                            fontSize: '12px',
                            minHeight: '28px',
                          },
                          '& .MuiInputBase-input': {
                            padding: '4px 6px',
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
                {row?.id === 1 && tableData.length > 1 && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleCopyToAllRows('paymentDueDate')}
                    title="İlk satırdaki değeri tüm satırlara kopyala"
                    sx={{ p: 0.5, ml: 0.5 }}>
                    <ContentCopyIcon sx={{ fontSize: '14px' }} />
                  </IconButton>
                )}
              </Box>
            )}
          </Slot>

          {/* Document Upload Slots */}
          <Slot<EditableRow> id="frontImage">
            {(_, row) => {
              if (!row) return null;

              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  {!row.frontImage ? (
                    <>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg,.pdf"
                        style={{ display: 'none' }}
                        id={`front-${row.id}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleDocumentUpload(row.id, DocumentType.FRONT_IMAGE, file);
                          // Clear the input so the same file can be selected again
                          e.target.value = '';
                        }}
                      />
                      <label htmlFor={`front-${row.id}`}>
                        <Button size="small" variant="outlined" sx={{ minWidth: 'auto' }} component="span">
                          <UploadIcon sx={{ fontSize: 'small' }} />
                        </Button>
                      </label>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDocumentUpload(row.id, DocumentType.FRONT_IMAGE, null)}
                        sx={{ p: 0.25 }}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              );
            }}
          </Slot>

          <Slot<EditableRow> id="backImage">
            {(_, row) => {
              if (!row) return null;

              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  {!row.backImage ? (
                    <>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg,.pdf"
                        style={{ display: 'none' }}
                        id={`back-${row.id}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleDocumentUpload(row.id, DocumentType.BACK_IMAGE, file);
                          // Clear the input so the same file can be selected again
                          e.target.value = '';
                        }}
                      />
                      <label htmlFor={`back-${row.id}`}>
                        <Button size="small" variant="outlined" sx={{ minWidth: 'auto' }} component="span">
                          <UploadIcon sx={{ fontSize: 'small' }} />
                        </Button>
                      </label>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDocumentUpload(row.id, DocumentType.BACK_IMAGE, null)}
                        sx={{ p: 0.25 }}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              );
            }}
          </Slot>

          <Slot<EditableRow> id="bankName">
            {(_, row) => (
              <TextField
                size="small"
                value={row?.bankName || ''}
                placeholder="Banka adı"
                variant="outlined"
                fullWidth
                required
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '12px',
                    minHeight: '28px',
                    backgroundColor: 'grey.50',
                  },
                  '& .MuiInputBase-input': {
                    padding: '4px 6px',
                    cursor: 'default',
                  },
                }}
              />
            )}
          </Slot>

          <Slot<EditableRow> id="bankBranchName">
            {(_, row) => (
              <TextField
                size="small"
                value={row?.bankBranchName || ''}
                placeholder="Şube adı"
                variant="outlined"
                fullWidth
                required
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '12px',
                    minHeight: '28px',
                    backgroundColor: 'grey.50',
                  },
                  '& .MuiInputBase-input': {
                    padding: '4px 6px',
                    cursor: 'default',
                  },
                }}
              />
            )}
          </Slot>

          <Slot<EditableRow> id="invoiceFile">
            {(_, row) => {
              if (!row) return null;

              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  {!row.invoiceFile ? (
                    <>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg,.pdf,.xml"
                        style={{ display: 'none' }}
                        id={`invoice-${row.id}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleDocumentUpload(row.id, DocumentType.INVOICE_FILE, file);
                          // Clear the input so the same file can be selected again
                          e.target.value = '';
                        }}
                      />
                      <label htmlFor={`invoice-${row.id}`}>
                        <Button size="small" variant="outlined" sx={{ minWidth: 30 }} component="span">
                          <UploadIcon sx={{ fontSize: 'small' }} />
                        </Button>
                      </label>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDocumentUpload(row.id, DocumentType.INVOICE_FILE, null)}
                        sx={{ p: 0.25 }}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              );
            }}
          </Slot>
        </Table>

        {/* Loading Overlay */}
        {(isQrProcessing || isBulkSaving) && (
          <Backdrop
            open={true}
            sx={{
              position: 'absolute',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: isQrProcessing ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: 1,
            }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress color="primary" size={isQrProcessing ? 40 : 32} />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {isQrProcessing
                  ? tableData.length > 0
                    ? 'Yeni QR kodlar okunuyor...'
                    : 'QR kodlar okunuyor...'
                  : 'Çekler kaydediliyor...'}
              </Typography>
              {isQrProcessing && (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Çek bilgileri işleniyor, lütfen bekleyiniz.
                </Typography>
              )}
              {isBulkSaving && bulkProgress.total > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {bulkProgress.current} / {bulkProgress.total}
                </Typography>
              )}
            </Box>
          </Backdrop>
        )}
      </Box>

      {/* Error Messages */}
      {tableData.some((row) => row.ErrorMessage) && (
        <Box sx={{ mt: 2 }}>
          {tableData
            .filter((row) => row.ErrorMessage)
            .map((row, index) => (
              <Alert key={index} severity="error" sx={{ mb: 1 }}>
                <strong>Çek {row.billNo || row.id}:</strong> {row.ErrorMessage}
              </Alert>
            ))}
        </Box>
      )}

      {/* Edit Dialog */}
      <QrRowEditDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        row={editingRow}
        onSave={handleSaveEditedRow}
        pdfFile={pdfFile}
      />
    </Box>
  );
};

export default forwardRef(QrResultsEditableTableComponent);
