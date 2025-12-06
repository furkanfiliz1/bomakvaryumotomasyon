import { Dropzone, LoadingButton, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { usePostInvoicesDocumentUpsertMutation, usePostInvoicesMutation } from '@store';
import { ProductTypes, UserTypes } from '@types';
import { currencyFormatter } from '@utils';
import yup from '@validation';
import dayjs from 'dayjs';
import { XMLParser } from 'fast-xml-parser';
import FileSaver from 'file-saver';
import { cloneDeep, isEqual, uniqBy } from 'lodash';
import { Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { IInvoiceCreateRequestModel, useLazyPostInvoiceFileQuery } from 'src/api/invoiceOperationApi';
import * as XLSX from 'xlsx';
import Modal, { ModalMethods } from '../../common/Modal';
import AddXmlInvoiceModalTable from './AddXmlInvoiceModalTable';
import XMLInfoDrawer from './InfoDrawer';

const MAX_UPLOAD_XML_COUNT = 500;
const CHUNK_SIZE = 20;
const parser = new XMLParser();
const MAX_UPLOAD_XML_SIZE_IN_BYTE = 4 * 1024 * 1024; // 2mb

const INVOICE_EXCEL_HEADER = [
  'Satıcı Ünvan',
  'Satıcı VKN',
  'Alıcı Ünvan',
  'Alıcı VKN',
  'Fatura No',
  'Fatura Tipi',
  'Hash Code',
  'Fatura Tarihi',
  'Vade Tarihi',
  'Fatura Tutarı',
  'Para Birimi',
];

const INVOICE_EXCEL_KEYS = [
  'senderName',
  'senderIdentifier',
  'receiverName',
  'receiverIdentifier',
  'invoiceNumber',
  'invoiceType',
  'hashCode',
  'issueDate',
  'paymentDueDate',
  'payableAmount',
  'documentCurrency',
];

export interface AddXMLInvoiceModalMethods {
  open: () => void;
  close: () => void;
}

interface AddXMLInvoiceModalProps {
  onSuccess: () => void;
  onUpsert?: (docs: string[]) => void;
  type: UserTypes.BUYER | UserTypes.SELLER;
  productType?: ProductTypes;
  skipCreation?: boolean;
}

export interface InvoiceTableData {
  file: File;
  fileJson: IInvoiceCreateRequestModel;
  invoiceId: string | undefined;
  touched: boolean;
  isLoading: boolean;
  base64String: string;
}

const AddXMLInvoiceModal = (props: AddXMLInvoiceModalProps, ref: Ref<AddXMLInvoiceModalMethods>) => {
  const { productType, skipCreation, onUpsert } = props;
  const notice = useNotice();
  const { onSuccess, type } = props;
  const modal = useRef<ModalMethods>(null);
  const [createInvoice, { error, isLoading: isCreateLoading, isSuccess: isCreateSuccess }] = usePostInvoicesMutation();
  const [createUpsertInvoice, { error: errorInvoiceUpsert, isLoading: isUpsertLoading, isSuccess: isUpsertSuccess }] =
    usePostInvoicesDocumentUpsertMutation();
  const [postInvoiceQuery] = useLazyPostInvoiceFileQuery();
  const [invoiceTableData, setInvoiceTableData] = useState<InvoiceTableData[]>([]);
  const isSpot = productType === ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE;
  const isLoading = isCreateLoading || isUpsertLoading;

  const [isXmlParsing, setIsXmlParsing] = useState(false);

  const totalInvoiceAmount = invoiceTableData.reduce((acc, next) => acc + (next?.fileJson?.payableAmount ?? 0), 0);

  useErrorListener([error, errorInvoiceUpsert]);

  const schema = yup.object({
    files: yup.mixed().required('Lütfen belge yükleyiniz'),
  });

  const form = useForm({
    defaultValues: { files: [] },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });

  const files = form.watch('files') as File[] | undefined;

  useImperativeHandle(ref, () => ({
    open: () => {
      modal?.current?.open();
      setInvoiceTableData([]);
      form.reset();
    },
    close: () => {
      modal?.current?.close();
      setInvoiceTableData([]);
      form.reset();
    },
  }));

  const postFile = useCallback(
    async (row: InvoiceTableData) => {
      setInvoiceTableData((rows) => {
        const newRows = cloneDeep(rows);
        const index = newRows.findIndex((r) => r.invoiceId === row.invoiceId);
        if (index > -1) {
          newRows[index].isLoading = true;
        }

        return isEqual(rows, newRows) ? rows : newRows;
      });

      const res = await postInvoiceQuery(
        { file: row.file, lastModified: row.file.lastModified, name: row.file.name },
        true,
      );

      if ('data' in res && res.data) {
        setInvoiceTableData((rows) => {
          const newRows = cloneDeep(rows);
          const index = newRows.findIndex((r) => r.invoiceId === row.invoiceId);
          if (index > -1 && res.data) {
            newRows[index].fileJson = res.data;
            newRows[index].isLoading = false;
          }

          return isEqual(rows, newRows) ? rows : newRows;
        });
      } else {
        setInvoiceTableData((rows) => {
          const newRows = cloneDeep(rows);
          const index = newRows.findIndex((r) => r.invoiceId === row.invoiceId);
          if (index > -1) {
            newRows[index].isLoading = false;
          }

          return isEqual(rows, newRows) ? rows : newRows;
        });
      }
    },
    [postInvoiceQuery],
  );

  useEffect(() => {
    if (!files || files.length < 1) return;

    if (invoiceTableData.length + files.length > MAX_UPLOAD_XML_COUNT) {
      notice({
        variant: 'error',
        title: 'Tamamlanmadı',
        message: `En fazla ${MAX_UPLOAD_XML_COUNT} dosya yükleyebilirsiniz`,
        buttonTitle: 'Tamam',
      });

      form.reset();
      return;
    }

    setIsXmlParsing(true);

    const result =
      files?.map(async (file) => {
        const FAULTY_INVOCE_RESPONSE = {
          file,
          fileJson: {} as IInvoiceCreateRequestModel,
          invoiceId: undefined,
          touched: false,
          base64String: '',
        };

        if (file.size > MAX_UPLOAD_XML_SIZE_IN_BYTE) {
          notice({
            variant: 'warning',
            title: 'Tamamlanmadı',
            message: "Dosya boyutu 4MB'den büyük olamaz",
            buttonTitle: 'Tamam',
          });
          return FAULTY_INVOCE_RESPONSE;
        }

        try {
          const xmlData = await file.text();
          const res = await parser.parse(xmlData);
          const invoiceId = res?.['Invoice']?.['cbc:ID'] as string | undefined;
          const base64String = isSpot ? await convertFileToBase64(file) : '';
          return { file, fileJson: {} as IInvoiceCreateRequestModel, invoiceId, touched: false, base64String };
        } catch {
          return FAULTY_INVOCE_RESPONSE;
        }
      }) || [];

    Promise.all(result).then(async (res) => {
      setIsXmlParsing(false);
      const newInvoices = uniqBy(
        uniqBy([...res, ...invoiceTableData], (i) => i.file.name),
        (i) => i.invoiceId,
      ).map((i) => ({ ...i, touched: true, isLoading: !!i.invoiceId }));

      setInvoiceTableData(newInvoices.sort((i) => (i.invoiceId ? 1 : -1)));

      const requests: (() => void)[][] = [];

      newInvoices.forEach((i, index) => {
        const arrIndex = Math.floor(index / CHUNK_SIZE);
        if (!requests[arrIndex]) requests[arrIndex] = [];

        if (!i.invoiceId) {
          requests[arrIndex].push(async () => {});
          return;
        } else {
          requests[arrIndex].push(() => postFile(i));
        }
      });

      for (const fns of requests) {
        await Promise.all(fns.map((f) => f()));
      }
    });

    form.reset();
  }, [files, form, invoiceTableData, notice, postFile, isSpot]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(btoa(reader.result)); // Binary string'i Base64'e çevir
        } else {
          reject(new Error('FileReader result is not a string'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (isCreateSuccess) {
      if (isSpot && !isUpsertSuccess) return;

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Başarıyla eklendi',
        buttonTitle: 'Devam Et',
      });
      onSuccess();

      modal.current?.close();
    }
  }, [isCreateSuccess, onSuccess, notice, isSpot, createUpsertInvoice, isUpsertSuccess]);

  const faultyInvoiceCount = invoiceTableData.filter(
    (i) => !i.invoiceId || (i.touched && !i.fileJson.invoiceNumber),
  ).length;
  const isThereAnyFaultInvoice = faultyInvoiceCount > 0;

  const isThereAnyLoadingInvoice = invoiceTableData.some((i) => i.isLoading);

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
              Toplam Fatura Adedi:{' '}
              <Typography variant="body4">{invoiceTableData.length ? invoiceTableData.length : '-'}</Typography>
            </Typography>
            <Typography variant="body2">
              Toplam Fatura Tutarı:{' '}
              <Typography variant="body4">
                {totalInvoiceAmount
                  ? currencyFormatter(totalInvoiceAmount, invoiceTableData[0]?.fileJson?.currency || 'TRY')
                  : '-'}
              </Typography>
            </Typography>
          </Box>
          <Box>
            {invoiceTableData.length > 0 && (
              <Button sx={{ mr: 2 }} id="exportExcel" onClick={exportToExcel} variant="outlined">
                Excel
              </Button>
            )}
            <LoadingButton
              sx={{ mr: 2 }}
              id="SAVE"
              color="error"
              onClick={clearFaultyInvoices}
              variant="outlined"
              disabled={faultyInvoiceCount === 0}
              loading={isLoading || isThereAnyLoadingInvoice}>
              {`Hatalı Faturaları Temizle (${faultyInvoiceCount})`}
            </LoadingButton>
            {invoiceTableData.length > 0 && (
              <LoadingButton
                sx={{ mr: 2 }}
                disabled={invoiceTableData.length === 0}
                id="clearAll"
                onClick={clearAll}
                variant="outlined"
                loading={isLoading || isThereAnyLoadingInvoice}>
                Tümünü Temizle
              </LoadingButton>
            )}
            <LoadingButton
              disabled={invoiceTableData.length === 0 || isThereAnyFaultInvoice}
              id="SAVE"
              onClick={onSubmit}
              variant="contained"
              loading={isLoading || isThereAnyLoadingInvoice}>
              Kaydet
              {invoiceTableData.length ? ` (${invoiceTableData.length})` : null}
            </LoadingButton>
          </Box>
        </Box>
      ),
    },
  ];

  const onSubmit = async () => {
    const data = invoiceTableData.map((data) => {
      const row = cloneDeep(data.fileJson);
      row.payableAmountCurrency = row?.currency || '';
      row.invoiceTypeCode = 'SATIS';

      // paymentDueDate geçersiz tarih ise null yap
      if (row.paymentDueDate && !dayjs(row.paymentDueDate).isValid()) {
        row.paymentDueDate = null;
      }

      if (row.approvedPayableAmount === 0) {
        row.remainingAmount = row?.payableAmount ?? 0;
      } else {
        row.remainingAmount = row?.approvedPayableAmount ?? 0;
      }
      return row;
    });

    const upsertData = invoiceTableData.map((data) => {
      return {
        data: data.base64String,
        name: data.file.name,
        type: 'xml',
        hash: data.fileJson.hashCode,
      };
    });

    const res = skipCreation ? {} : await createInvoice(data);

    if (('data' in res && res.data) || skipCreation) {
      if (isSpot) {
        const res = await createUpsertInvoice({ invoiceDocumentList: upsertData });
        if ('data' in res && res.data) {
          onUpsert?.(invoiceTableData.map((i) => i.fileJson.invoiceNumber || ''));
        }
      }
    }
  };

  const exportToExcel = () => {
    const convertFileTypeToText = (type: string) => {
      return type === 'EInvoice' ? 'E-Fatura' : 'Kağıt Fatura';
    };

    const data = invoiceTableData.map((inv) => ({
      senderName: inv.fileJson.senderName,
      senderIdentifier: inv.fileJson.senderIdentifier,
      receiverName: inv.fileJson.receiverName,
      receiverIdentifier: inv.fileJson.receiverIdentifier,
      invoiceNumber: inv.fileJson.invoiceNumber,
      invoiceType: convertFileTypeToText(inv.fileJson.invoiceType || ''),
      hashCode: inv.fileJson.hashCode,
      issueDate: inv.fileJson.issueDate ? dayjs(inv.fileJson.issueDate).format('DD.MM.YYYY') : '',
      paymentDueDate: inv.fileJson.paymentDueDate ? dayjs(inv.fileJson.paymentDueDate).format('DD.MM.YYYY') : '',
      payableAmount: inv.fileJson.payableAmount,
      documentCurrency: inv.fileJson.currency,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: INVOICE_EXCEL_KEYS });

    XLSX.utils.sheet_add_aoa(worksheet, [INVOICE_EXCEL_HEADER], { origin: 'A1' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faturalar');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(excelBlob, 'fatura_raporlari.xlsx');
  };

  const clearAll = () => {
    setInvoiceTableData([]);
  };

  const clearFaultyInvoices = () => {
    setInvoiceTableData((invoices) => {
      return invoices.filter((i) => i.invoiceId && i.fileJson.invoiceNumber);
    });
  };

  return (
    <Modal ref={modal} maxWidth="xl" actions={actions} title="Fatura Ekle">
      <XMLInfoDrawer type={type} />
      <Dropzone
        supportedFormat={['xml']}
        loading={isLoading}
        multiple
        name="files"
        form={form as unknown as UseFormReturn<FieldValues>}
        accept={'.xml'}
        hideFileList
      />
      {isXmlParsing && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBlock: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        {invoiceTableData.length > 0 && (
          <AddXmlInvoiceModalTable invoiceTableData={invoiceTableData} setInvoiceTableData={setInvoiceTableData} />
        )}
      </Box>
    </Modal>
  );
};

export default forwardRef(AddXMLInvoiceModal);
