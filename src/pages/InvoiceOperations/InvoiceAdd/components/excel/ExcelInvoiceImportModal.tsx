import {
  Button,
  Dropzone,
  Icon,
  InputCurrencyWithoutForm,
  InvoiceDatePicker,
  LoadingButton,
  Modal,
  ModalMethods,
  Slot,
  Table,
  useNotice,
} from '@components';
import { HUMAN_READABLE_DATE, RESPONSE_DATE } from '@constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, IconButton, LinearProgress, Tooltip, Typography, useTheme } from '@mui/material';
import { UserTypes } from '@types';
import { currencyFormatter } from '@utils';
import yup from '@validation';
import dayjs from 'dayjs';
import { cloneDeep, isNil } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { useLazyPostInvoiceFileQuery } from 'src/api/invoiceOperationApi';
import { HeadCell, RowActions } from 'src/components/common/Table/types';
import FileUploadInfoDrawer from 'src/components/shared/xml/InfoDrawer';
import { ExcelFieldMapping, invoiceHeaderFieldKeys } from '../../helpers/excel';
import { EXCEL_IMPORT_ACTION_TYPES, ExcelImportEvent } from '../../helpers/excel/invoice-excel-import-worker';
import { useCreateInvoiceMutation } from '../../invoice-add.api';
import { CreateInvoiceFormData, CreateInvoiceRequest } from '../../invoice-add.types';

// File validation helper
interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// Helper functions
const checkFileSize = (file: File): FileValidationResult => {
  const maxSize = 15 * 1024 * 1024; // 15MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Dosya boyutu 15MB sınırını aşıyor. Mevcut boyut: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }
  return { isValid: true };
};

const pushEvent = (eventName: string, data?: Record<string, unknown>) => {
  console.log('Event:', eventName, data);
};

export interface ExcelInvoiceImportModalMethods {
  open: () => void;
  close: () => void;
}

interface ExcelInvoiceImportModalProps {}

const ExcelInvoiceImportModal = (_: ExcelInvoiceImportModalProps, ref: Ref<ExcelInvoiceImportModalMethods>) => {
  const notice = useNotice();
  const theme = useTheme();
  const modal = useRef<ModalMethods>(null);
  const excelExporterRef = useRef<Worker>();
  const [saveInvoices, { isSuccess, error, isLoading }] = useCreateInvoiceMutation();
  const [postInvoiceQuery] = useLazyPostInvoiceFileQuery();
  const [excelList, setExcelList] = useState<(CreateInvoiceFormData & { id?: number })[]>([]);
  const [isExcelParserLoading, setisExcelParserLoading] = useState(false);

  useErrorListener(error);

  const schema = yup.object({
    file: yup.mixed().required('Lütfen bir belge yükleyiniz').nullable(),
  });

  const form = useForm({
    defaultValues: { file: null },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      modal?.current?.open();
      setExcelList([]);
      form.reset();
    },
    close: () => {
      modal?.current?.close();
      setExcelList([]);
      form.reset();
    },
  }));

  const file = form.watch('file');

  useEffect(() => {
    if (file && file instanceof File) {
      // Validate file size before processing
      const fileSizeValidation = checkFileSize(file);
      if (!fileSizeValidation.isValid) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: fileSizeValidation.error || 'Maksimum dosya boyutu 15 MB',
          buttonTitle: 'Tamam',
        });
        // Reset the file input to clear the invalid file
        form.setValue('file', null);
        return;
      }

      // File yüklendikten sonra postFile çağrısını yap
      const postFileToAPI = async () => {
        try {
          await postInvoiceQuery({ file: file, lastModified: file.lastModified, name: file.name }, true);
        } catch (error) {
          console.error('File upload error:', error);
        }
      };

      postFileToAPI();
      excelExporterRef.current?.postMessage({ type: EXCEL_IMPORT_ACTION_TYPES.IMPORT, payload: file });
    }
  }, [file, notice, form, postInvoiceQuery]);

  const headers: HeadCell[] = useMemo(() => {
    return invoiceHeaderFieldKeys
      .filter((h: ExcelFieldMapping) => h.showOnTable)
      .map((headerItem: ExcelFieldMapping) => {
        return {
          id: headerItem.id,
          label: headerItem.label, // Use Turkish display name
          slot: true,
          width: headerItem?.width,
        };
      });
  }, []);

  const onSubmit = (excelList: (CreateInvoiceFormData & { id?: number })[]) => {
    const data: CreateInvoiceRequest[] = excelList.map((row) => ({
      hashCode: row.hashCode || '',
      invoiceNumber: row.invoiceNumber || '',
      issueDate: row.issueDate || '',
      payableAmount: row.payableAmount || 0,
      paymentDueDate: row.paymentDueDate || '',
      receiverIdentifier: row.receiverIdentifier || '',
      receiverName: row.receiverName || '',
      remainingAmount: row.approvedPayableAmount === 0 ? (row.payableAmount ?? 0) : (row.approvedPayableAmount ?? 0),
      senderIdentifier: row.senderIdentifier || '',
      senderName: row.senderName || '',
      sequenceNumber: row.sequenceNumber,
      serialNumber: row.serialNumber,
      taxFreeAmount: row.taxFreeAmount || 0,
      payableAmountCurrency: row.payableAmountCurrency || 'TRY',
      uuId: row.uuId || '',
      invoiceTypeCode: 'SATIS',
      approvedPayableAmount: row.approvedPayableAmount || 0,
      profileId: row.profileId || '',
      issueTimex: row.issueTimex || 0,
      type: row.type || 0,
      eInvoiceType: row.eInvoiceType || 0,
    }));
    saveInvoices(data);
  };

  useEffect(() => {
    if (isSuccess) {
      pushEvent('Buyer Invoice Addition Completed', {
        Adding_Method: 'Excel',
        number_of_invoices: excelList.length,
        Currency: 'TRY',
      });
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Faturalar başarıyla kaydedildi',
        buttonTitle: 'Devam',
      });
      setExcelList([]);
      modal.current?.close();
    }
  }, [excelList.length, isSuccess, notice]);

  const onCopy = (hashCode: string) => {
    navigator.clipboard.writeText(hashCode);
    enqueueSnackbar('Panoya kopyalandı', { variant: 'success' });
  };

  const clearAll = () => {
    // if (fileInput?.current) {
    //   fileInput.current.value = '';
    // }
    setExcelList([]);
    form.reset();
  };

  useEffect(() => {
    const excelWorker = new Worker(new URL('../../helpers/excel/invoice-excel-import-worker', import.meta.url), {
      type: 'module',
    });
    excelExporterRef.current = excelWorker;

    excelWorker.onmessage = (e: MessageEvent<ExcelImportEvent>) => {
      const { type, payload } = e.data;

      switch (type) {
        case EXCEL_IMPORT_ACTION_TYPES.STARTED:
          setisExcelParserLoading(true);
          return;
        case EXCEL_IMPORT_ACTION_TYPES.FINISHED:
          setisExcelParserLoading(false);
          setExcelList(payload);
      }
    };

    return () => {
      excelWorker.terminate();
    };
  }, []);

  const totalInvoiceAmount = useMemo(
    () =>
      excelList.reduce((acc, next) => {
        const amount = next?.payableAmount;
        return acc + (typeof amount === 'number' && !isNaN(amount) ? amount : 0);
      }, 0),
    [excelList],
  );

  const onIvoicePayableAmountChange = useCallback((newValue: undefined | number, id: number) => {
    setExcelList((prevInvoices) =>
      prevInvoices.map((invoice) => (invoice.id === id ? { ...invoice, payableAmount: newValue } : invoice)),
    );
  }, []);

  const onIvoicePaymentDueDateChange = useCallback(
    (newValue: unknown, id: number, isAllSelected: boolean) => {
      if (isAllSelected) {
        setExcelList((invoices) => {
          return invoices.map((i) => {
            const newInvoice = cloneDeep(i);
            newInvoice.paymentDueDate = dayjs(newValue as string).format(RESPONSE_DATE);
            return newInvoice;
          });
        });

        return;
      }

      setExcelList(() =>
        excelList.map((invoice) =>
          invoice.id === id ? { ...invoice, paymentDueDate: dayjs(newValue as string).format(RESPONSE_DATE) } : invoice,
        ),
      );
    },
    [excelList],
  );

  const deleteRow = (id: number) => {
    pushEvent('Buyer Invoice Deleted');
    const newExcelList = excelList.filter((r) => r.id !== id);
    setExcelList(newExcelList);
    if (newExcelList.length === 0) {
      form.reset();
    }
  };

  const rowActions: RowActions<CreateInvoiceFormData & { id?: number }>[] = [
    {
      Element: ({ row }) => (
        <Button
          id="common:DELETE"
          onClick={() => row && deleteRow(row?.id || 0)}
          sx={{ mr: 1.5, color: theme.palette.neutral[600], fontWeight: 600 }}
          variant="text"
          size="medium">
          <Typography sx={{ mr: 1, color: theme.palette.neutral[600] }}>Sil</Typography>
          <Icon icon="trash-04" size={14} color={theme.palette.neutral[600]} />
        </Button>
      ),
    },
  ];

  const actions = [
    {
      element: () => (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <Box sx={{ mr: 'auto', ml: 1, display: 'flex' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Toplam Fatura Adedi: <Typography variant="body2">{excelList.length ? excelList.length : '-'}</Typography>
            </Typography>
            <Typography variant="body2">
              Toplam Fatura Tutarı:{' '}
              <Typography variant="body2">
                {totalInvoiceAmount
                  ? currencyFormatter(totalInvoiceAmount, excelList[0]?.payableAmountCurrency || 'TRY')
                  : '-'}
              </Typography>
            </Typography>
          </Box>
          <Box>
            {excelList.length > 0 && (
              <LoadingButton
                sx={{ mr: 2 }}
                disabled={excelList.length === 0}
                id="clearAll"
                onClick={clearAll}
                variant="outlined"
                loading={isLoading}>
                Tümünü Temizle
              </LoadingButton>
            )}
            <LoadingButton
              disabled={excelList.length === 0}
              id="SAVE"
              onClick={() => {
                onSubmit(excelList);
              }}
              variant="contained"
              loading={isLoading}>
              Kaydet
              {excelList.length ? ` (${excelList.length})` : null}
            </LoadingButton>
          </Box>
        </Box>
      ),
    },
  ];

  const onSort = (field: string, order: string) => {
    const sortedExcelList = [...excelList];
    setExcelList([]);
    const myfield = field as keyof CreateInvoiceRequest;
    // excelllist sort by field and order
    sortedExcelList.sort((a, b) => {
      if ((a?.[myfield] ?? '') < (b?.[myfield] ?? '')) return order === 'asc' ? -1 : 1;
      if ((a?.[myfield] ?? '') > (b?.[myfield] ?? '')) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setExcelList(sortedExcelList);
  };

  return (
    <Modal ref={modal} maxWidth="xl" actions={actions} title="Fatura Ekle">
      {isExcelParserLoading && <LinearProgress />}
      <FileUploadInfoDrawer type={UserTypes.BUYER} />
      <Dropzone
        supportedFormat={['csv', 'xls', 'xlsx']}
        loading={isLoading}
        multiple={false}
        name="file"
        form={form as unknown as UseFormReturn<FieldValues>}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        maxSize={15}
        maxSizeType="MB"
        hideFileList
      />

      {excelList?.length > 0 && (
        <Table<CreateInvoiceFormData & { id?: number }>
          id="addExcelInvoiceTable"
          rowId="hashCode"
          data={excelList || []}
          headers={headers}
          rowActions={rowActions}
          sortingConfig={{ onSort }}
          notFoundConfig={{ title: "Excel'den fatura verisi bulunamadı" }}>
          {invoiceHeaderFieldKeys.map((item: ExcelFieldMapping, index: number) => {
            if (item.id === 'approvedPayableAmount') {
              return (
                <Slot<CreateInvoiceFormData & { id?: number }> id={item.id} key={index.toString()}>
                  {(_, row) => {
                    if (!row?.profileId) return <Typography>-</Typography>;
                    return (
                      <InputCurrencyWithoutForm
                        style={{ minWidth: 175 }}
                        currency={row?.payableAmountCurrency || 'TRY'}
                        maxLength={14}
                        name={`${row.id}.PayableAmount`}
                        id={`${row.id}.PayableAmount`}
                        value={row.payableAmount}
                        onChange={(value) => {
                          if (value) {
                            onIvoicePayableAmountChange(Number(value), row.id || 0);
                          } else {
                            onIvoicePayableAmountChange(0, row.id || 0);
                          }
                        }}
                      />
                    );
                  }}
                </Slot>
              );
            }

            if (item.id === 'paymentDueDate') {
              return (
                <Slot<CreateInvoiceFormData & { id?: number }> id={item.id} key={index.toString()}>
                  {(_, row) => {
                    if (!row?.profileId) return '-';

                    return (
                      <InvoiceDatePicker
                        onChange={(value, isAllSelected) => {
                          onIvoicePaymentDueDateChange(value, row?.id || 0, isAllSelected);
                        }}
                        error={false}
                        value={row?.paymentDueDate ? row?.paymentDueDate : ''}
                      />
                    );
                  }}
                </Slot>
              );
            }

            if (item.id === 'hashCode') {
              return (
                <Slot<CreateInvoiceFormData & { id?: number }> id={item.id} key={index.toString()}>
                  {(hashCode) => {
                    if (!hashCode) return '-';
                    return (
                      <Box display="flex" alignItems="center">
                        <Tooltip title={hashCode}>
                          <Typography sx={{ cursor: 'pointer', fontSize: '12px' }}>{`${hashCode
                            ?.toString()
                            .substring(0, 3)}...`}</Typography>
                        </Tooltip>
                        <IconButton size="small" onClick={() => onCopy(hashCode?.toString() || '')}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Box>
                    );
                  }}
                </Slot>
              );
            }
            if (item.id === 'uuId') {
              return (
                <Slot<CreateInvoiceFormData & { id?: number }> id={item.id} key={index.toString()}>
                  {(uuId) => {
                    if (!uuId) return '-';

                    return (
                      <Box display="flex" alignItems="center">
                        <Tooltip title={uuId}>
                          <Typography sx={{ cursor: 'pointer', fontSize: '12px' }}>{`${uuId
                            ?.toString()
                            .substring(0, 3)}...`}</Typography>
                        </Tooltip>
                      </Box>
                    );
                  }}
                </Slot>
              );
            }
            return (
              <Slot<CreateInvoiceFormData & { id?: number }> id={item.id} key={index.toString()}>
                {(value, row) => {
                  const isEmpty = isNil(value) || value === '';
                  const isDate = item.id === 'issueDate' || item.id === 'paymentDueDate';
                  const isCurrency = item.id === 'payableAmount' || item.id === 'approvedPayableAmount';

                  let isRequired = item.required;
                  if (row?.type === 1 && item.id === 'invoiceNumber') {
                    if (isEmpty) isRequired = true;
                  }

                  if (row?.type === 2 && item.id === 'sequenceNumber') {
                    if (isEmpty) isRequired = true;
                  }

                  if (row?.type === 2 && item.id === 'serialNumber') {
                    if (isEmpty) isRequired = true;
                  }

                  if (row?.type === 1 && row.eInvoiceType === 2 && item.id === 'taxFreeAmount') {
                    if (isEmpty) isRequired = true;
                  }

                  return (
                    <Tooltip title={isEmpty && isRequired ? 'Zorunlu alan' : ''}>
                      <Typography variant="cell" fontWeight={isCurrency ? 600 : 400}>
                        {isDate && (dayjs(value).isValid() ? dayjs(value).format(HUMAN_READABLE_DATE) : value)}
                        {isCurrency && currencyFormatter(value ? Number(value) : 0, row?.payableAmountCurrency)}
                        {!isDate && !isCurrency && value}
                      </Typography>
                    </Tooltip>
                  );
                }}
              </Slot>
            );
          })}
        </Table>
      )}
    </Modal>
  );
};

export default forwardRef(ExcelInvoiceImportModal);
