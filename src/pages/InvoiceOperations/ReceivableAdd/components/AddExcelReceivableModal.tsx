/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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
import { Box, LinearProgress, Tooltip, Typography, useTheme } from '@mui/material';
import { currencyFormatter } from '@utils';
import yup from '@validation';
import dayjs from 'dayjs';
import { cloneDeep, isNil } from 'lodash';
import { Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { HeadCell, RowActions } from 'src/components/common/Table/types';
import { invoiceHeaderFieldKeys, validateExcelFile } from '../helpers';
import { useCreateReceivableMutation } from '../receivable-add.api';
import { EXCELIMPORTACTIONTYPES, EXCELIMPORTEVENT } from './receivable-excel-import-worker';

export interface AddExcelReceivableModalMethods {
  open: () => void;
  close: () => void;
}

interface AddExcelReceivableModalProps {}

export interface IReceivableData {
  id?: number;
  OrderNo?: string;
  IssueDate?: string;
  PaymentDueDate?: string;
  PayableAmount?: number;
  CurrencyCode?: string;
  ReceiverName?: string;
  ReceiverIdentifier?: string;
  SenderName?: string;
  SenderIdentifier?: string;
}

const AddExcelReceivableModal = (_: AddExcelReceivableModalProps, ref: Ref<AddExcelReceivableModalMethods>) => {
  const notice = useNotice();
  const theme = useTheme();
  const modal = useRef<ModalMethods>(null);
  const excelWorkerRef = useRef<Worker>();
  const [createReceivable, { error, isLoading, isSuccess }] = useCreateReceivableMutation();

  const [excelList, setExcelList] = useState<IReceivableData[]>([]);
  const [isExcelParserLoading, setisExcelParserLoading] = useState(false);

  useErrorListener(error);

  const schema = yup.object({
    file: yup.mixed().required('Lütfen bir dosya yükleyin').nullable(),
  });

  const errorColumnStyle = {
    border: '1px dashed',
    borderColor: theme.palette.error[700],
    height: '100%',
    position: 'absolute',
    left: '2%',
    top: 0,
    width: '96%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

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
      const validation = validateExcelFile(file);
      if (!validation.isValid) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: validation.error || 'Geçersiz dosya formatı',
          buttonTitle: 'Tamam',
        });
        // Reset the file input to clear the invalid file
        form.setValue('file', null);
        return;
      }

      excelWorkerRef.current?.postMessage({ type: EXCELIMPORTACTIONTYPES.IMPORT, payload: file });
    }
  }, [file, notice, form]);

  const headers: HeadCell[] = useMemo(() => {
    const fieldMapping = {
      OrderNo: { id: 'OrderNo', label: 'Alacak Numarası', slot: false },
      IssueDate: { id: 'IssueDate', label: 'Oluşturma Tarihi', slot: true },
      PaymentDueDate: { id: 'PaymentDueDate', label: 'Vade Tarihi', slot: true },
      PayableAmount: { id: 'PayableAmount', label: 'Alacak Tutarı', slot: true },
      ReceiverName: { id: 'ReceiverName', label: 'Alıcı Unvan', slot: false },
      ReceiverIdentifier: { id: 'ReceiverIdentifier', label: 'Alıcı TCKN/VKN', slot: false },
      SenderName: { id: 'SenderName', label: 'Satıcı Unvan', slot: false },
      SenderIdentifier: { id: 'SenderIdentifier', label: 'Satıcı TCKN/VKN', slot: false },
    };

    return invoiceHeaderFieldKeys
      .filter((field) => fieldMapping[field.id as keyof typeof fieldMapping])
      .map((field) => {
        const mapping = fieldMapping[field.id as keyof typeof fieldMapping];
        return {
          ...mapping,
        };
      });
  }, []);

  const onSubmit = (excelList: IReceivableData[]) => {
    const data = excelList.map((row) => {
      return {
        OrderNo: row.OrderNo || '',
        PayableAmount: row.PayableAmount || 0,
        PaymentDueDate: row.PaymentDueDate || '',
        CurrencyCode: row.CurrencyCode || 'TRY',
        ProductType: 1, // Default product type
        IssueDate: row.IssueDate || '',
        ReceiverIdentifier: row.ReceiverIdentifier,
        SenderIdentifier: row.SenderIdentifier,
      };
    });

    createReceivable(data);
  };

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Alacaklar başarıyla yüklendi',
        buttonTitle: 'Devam Et',
      });
      setExcelList([]);
      modal.current?.close();
    }
  }, [isSuccess, notice]);

  const clearAll = () => {
    setExcelList([]);
    form.reset();
  };

  useEffect(() => {
    const excelWorker = new Worker(new URL('./receivable-excel-import-worker', import.meta.url), { type: 'module' });
    excelWorkerRef.current = excelWorker;

    excelWorker.onmessage = (e: MessageEvent<EXCELIMPORTEVENT>) => {
      const { type, payload } = e.data;

      switch (type) {
        case EXCELIMPORTACTIONTYPES.STARTED:
          setisExcelParserLoading(true);
          return;
        case EXCELIMPORTACTIONTYPES.FINISHED:
          setisExcelParserLoading(false);
          setExcelList(payload);
      }
    };

    return () => {
      excelWorker.terminate();
    };
  }, []);

  const totalInvoiceAmount = useMemo(
    () => excelList.reduce((acc, next) => acc + (next?.PayableAmount ?? 0), 0),
    [excelList],
  );

  const onInvoicePayableAmountChange = useCallback((newValue: undefined | number, id: number) => {
    setExcelList((prevExcelList) =>
      prevExcelList.map((order) => (order.id === id ? { ...order, PayableAmount: newValue } : order)),
    );
  }, []);

  const onOrderPaymentDueDateChange = useCallback((newValue: unknown, id: number, isAllSelected: boolean) => {
    if (isAllSelected) {
      setExcelList((order) => {
        return order.map((i) => {
          const newInvoice = cloneDeep(i);
          newInvoice.PaymentDueDate = dayjs(newValue as string).format(RESPONSE_DATE);
          return newInvoice;
        });
      });
      return;
    }

    setExcelList((prevExcelList) =>
      prevExcelList.map((order) =>
        order.id === id ? { ...order, PaymentDueDate: dayjs(newValue as string).format(RESPONSE_DATE) } : order,
      ),
    );
  }, []);

  const deleteRow = (id: number) => {
    const newExcelList = excelList.filter((r) => r.id !== id);
    setExcelList(newExcelList);
    if (newExcelList.length === 0) {
      form.reset();
    }
  };

  const rowActions: RowActions<IReceivableData>[] = [
    {
      Element: ({ row }) => (
        <Button
          id="delete"
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
              Toplam Alacak Sayısı: <Typography variant="body2">{excelList.length ? excelList.length : '-'}</Typography>
            </Typography>
            <Typography variant="body2">
              Toplam Tutar:{' '}
              <Typography variant="body2">
                {totalInvoiceAmount ? currencyFormatter(totalInvoiceAmount, excelList[0]?.CurrencyCode || 'TRY') : '-'}
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
              id="save"
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
    const myfield = field as keyof IReceivableData;
    // excelllist sort by field and order
    sortedExcelList.sort((a, b) => {
      if ((a?.[myfield] ?? '') < (b?.[myfield] ?? '')) return order === 'asc' ? -1 : 1;
      if ((a?.[myfield] ?? '') > (b?.[myfield] ?? '')) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setExcelList(sortedExcelList);
  };

  return (
    <Modal ref={modal} maxWidth="xl" actions={actions} title="Alacak Ekle">
      {isExcelParserLoading && <LinearProgress />}
      <Dropzone
        supportedFormat={['csv', 'xls', 'xlsx']}
        loading={isLoading}
        multiple={false}
        name="file"
        form={form as unknown as UseFormReturn<FieldValues>}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        hideFileList
      />

      {excelList?.length > 0 && (
        <Table<IReceivableData>
          id="addExcelReceivableTable"
          rowId="id"
          data={excelList || []}
          headers={headers}
          rowActions={rowActions}
          sortingConfig={{ onSort }}
          notFoundConfig={{ title: "Excel'den alacak verisi bulunamadı" }}>
          {invoiceHeaderFieldKeys.map((item) => {
            if (item.id === 'PayableAmount') {
              return (
                <Slot<IReceivableData> id={item.id} key={item.id}>
                  {(PayableAmount, row) => {
                    const isEmpty = isNil(PayableAmount) || PayableAmount === '';
                    const isRequired = item.required;
                    return (
                      <Box sx={isRequired && isEmpty ? errorColumnStyle : {}}>
                        <InputCurrencyWithoutForm
                          style={{ minWidth: 175 }}
                          currency={row?.CurrencyCode || 'TRY'}
                          maxLength={14}
                          name={`${row?.id}.PayableAmount`}
                          id={`${row?.id}.PayableAmount`}
                          value={PayableAmount}
                          onChange={(value) => {
                            if (value) {
                              onInvoicePayableAmountChange(Number(value), row?.id!);
                            } else {
                              onInvoicePayableAmountChange(0, row?.id!);
                            }
                          }}
                        />
                      </Box>
                    );
                  }}
                </Slot>
              );
            }

            if (item.id === 'PaymentDueDate') {
              return (
                <Slot<IReceivableData> id={item.id} key={item.id}>
                  {(value, row) => {
                    const isEmpty = isNil(value) || value === '';
                    const isRequired = item.required;
                    return (
                      <Box sx={isRequired && isEmpty ? errorColumnStyle : {}}>
                        <InvoiceDatePicker
                          onChange={(value, isAllSelected) => {
                            onOrderPaymentDueDateChange(value, row?.id || 0, isAllSelected);
                          }}
                          error={false}
                          value={row?.PaymentDueDate ? row?.PaymentDueDate : ''}
                        />
                      </Box>
                    );
                  }}
                </Slot>
              );
            }

            return (
              <Slot<IReceivableData> id={item.id} key={item.id}>
                {(value, row) => {
                  const isEmpty = isNil(value) || value === '';
                  const isRequired = item.required;
                  const isDate = item.id === 'IssueDate';
                  const isCurrency = item?.id === 'PayableAmount';

                  return (
                    <Tooltip title={isEmpty && isRequired ? 'Gerekli alan' : ''}>
                      <Typography
                        variant="cell"
                        fontWeight={isCurrency ? 600 : 400}
                        sx={isRequired && isEmpty ? errorColumnStyle : {}}>
                        {isDate && (dayjs(value).isValid() ? dayjs(value).format(HUMAN_READABLE_DATE) : value)}
                        {isCurrency && currencyFormatter(value ? Number(value) : 0, row?.CurrencyCode)}
                        {(!isDate && !isCurrency && value) || ''}
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

export default forwardRef(AddExcelReceivableModal);
