/**
 * Excel Lead Import Modal
 * Following InvoiceOperations/ExcelInvoiceImportModal pattern
 * Modal for uploading and validating Excel lead data
 */

import { Dropzone, Icon, Modal, ModalMethods, Slot, Table, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Alert, AlertTitle, Box, Button, LinearProgress, Typography, useTheme } from '@mui/material';
import { Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ProductTypeOption, useGetProductTypesQuery } from 'src/api/figoParaApi';
import { HeadCell, RowActions } from 'src/components/common/Table/types';
import * as yup from 'yup';
import { getFieldLabel, leadHeaderFieldKeys } from '../../helpers/excel/lead-excel-field-mappings';
import { EXCEL_IMPORT_ACTION_TYPES, ExcelImportEvent } from '../../helpers/excel/lead-excel-import-worker';
import { useCreateLeadsExcelMutation } from '../../lead-management.api';
import { LeadAddManuelFormData } from '../../lead-management.types';

// Helper: Get product names from values
const getProductNames = (products: number[], productTypeList: ProductTypeOption[]) => {
  return products
    .map((productValue) => {
      const option = productTypeList.find((opt) => opt.Value === String(productValue));
      return option?.Description || String(productValue);
    })
    .join(', ');
};

// Helper: Check if row has missing required fields
const isRowInvalid = (row: LeadAddManuelFormData) => {
  return leadHeaderFieldKeys.some((field) => {
    if (!field.required) return false;
    const value = row[field.id];
    if (field.id === 'products') {
      return !value || (Array.isArray(value) && value.length === 0);
    }
    return !value || value === '';
  });
};

// Helper: Render product slot content
const renderProductSlot = (row: LeadAddManuelFormData | undefined, productTypeList: ProductTypeOption[]) => {
  const products = row?.products || [];

  if (products.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">-</Typography>
      </Box>
    );
  }

  const productNames = getProductNames(products, productTypeList);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2">{productNames}</Typography>
    </Box>
  );
};

// Helper: Convert value to display string
const convertToDisplayValue = (value: unknown): string => {
  if (!value || value === '') return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return '-';
};

// Helper: Render standard field slot content
const renderFieldSlot = (
  value: unknown,
  row: LeadAddManuelFormData | undefined,
  fieldId: string,
  errorColor: string,
) => {
  const displayValue = convertToDisplayValue(value);
  const rowIsInvalid = row ? isRowInvalid(row) : false;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {rowIsInvalid && fieldId === 'taxNumber' && <Icon icon="alert-circle" size={16} color={errorColor} />}
      <Typography variant="body2">{displayValue}</Typography>
    </Box>
  );
};

export interface ExcelLeadImportModalMethods {
  open: () => void;
  close: () => void;
}

interface ExcelLeadImportModalProps {}

const ExcelLeadImportModal = (_: ExcelLeadImportModalProps, ref: Ref<ExcelLeadImportModalMethods>) => {
  const notice = useNotice();
  const theme = useTheme();
  const modal = useRef<ModalMethods>(null);
  const navigate = useNavigate();

  // Fetch product types from API
  const { data: productTypesData } = useGetProductTypesQuery();
  const productTypeList = productTypesData || [];
  const excelWorkerRef = useRef<Worker>();
  const [createLeads, { isSuccess, error, isLoading }] = useCreateLeadsExcelMutation();
  const [excelList, setExcelList] = useState<(LeadAddManuelFormData & { id?: number })[]>([]);
  const [isExcelParserLoading, setIsExcelParserLoading] = useState(false);

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

  // Helper: Validate file size
  const validateFileSize = useCallback(
    (file: File) => {
      const maxSize = 15 * 1024 * 1024;
      if (file.size > maxSize) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: `Dosya boyutu 15MB sınırını aşıyor. Mevcut boyut: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          buttonTitle: 'Tamam',
        });
        form.setValue('file', null);
        return false;
      }
      return true;
    },
    [notice, form],
  );

  useEffect(() => {
    if (!file || !(file instanceof File)) return;

    const isValid = validateFileSize(file);
    if (isValid) {
      excelWorkerRef.current?.postMessage({ type: EXCEL_IMPORT_ACTION_TYPES.IMPORT, payload: file });
    }
  }, [file, validateFileSize]);

  // Count invalid rows
  const invalidRowsCount = useMemo(() => {
    return excelList.filter(isRowInvalid).length;
  }, [excelList]);

  const headers: HeadCell[] = useMemo(() => {
    return leadHeaderFieldKeys
      .filter((h) => h.showOnTable)
      .map((headerItem) => {
        return {
          id: headerItem.id,
          label: getFieldLabel(headerItem.id),
          slot: true,
          width: headerItem?.width,
        };
      });
  }, []);

  const onSubmit = (excelList: (LeadAddManuelFormData & { id?: number })[]) => {
    const data: LeadAddManuelFormData[] = excelList.map((row) => ({
      taxNumber: row.taxNumber || '',
      title: row.title || '',
      firstName: row.firstName || '',
      lastName: row.lastName || '',
      phone: row.phone || '',
      products: row.products || [],
    }));

    // Using createLeads which maps to LeadRequestModel in the API layer
    createLeads({ data });
  };

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Leadler başarıyla kaydedildi',
        buttonTitle: 'Devam',
        onClick: () => {
          navigate('/companies/leads');
        },
      });
      setExcelList([]);
      modal.current?.close();
    }
  }, [isSuccess, navigate, notice]);

  // Helper: Highlight invalid rows
  const highlightInvalidRows = useCallback(() => {
    const tableElement = document.querySelector('#addExcelLeadTable');
    if (!tableElement) return;

    const rows = tableElement.querySelectorAll('tbody tr');
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const shouldHighlight = index < excelList.length && isRowInvalid(excelList[index]);

      if (shouldHighlight) {
        row.classList.add('invalid-row');
      } else {
        row.classList.remove('invalid-row');
      }
    }
  }, [excelList]);

  // Highlight invalid rows after table renders
  useEffect(() => {
    if (excelList.length === 0) return;

    // Small delay to ensure table is rendered
    setTimeout(highlightInvalidRows, 100);
  }, [excelList, highlightInvalidRows]);

  const clearAll = () => {
    setExcelList([]);
    form.reset();
  };

  // Helper: Handle worker messages
  const handleWorkerMessage = useCallback(
    (e: MessageEvent<ExcelImportEvent>) => {
      const { type, payload } = e.data;

      if (type === EXCEL_IMPORT_ACTION_TYPES.STARTED) {
        setIsExcelParserLoading(true);
        return;
      }

      if (type === EXCEL_IMPORT_ACTION_TYPES.FINISHED) {
        setIsExcelParserLoading(false);
        setExcelList(payload);

        // Show warning if exactly 500 leads (indicating file had more rows)
        if (payload.length === 500) {
          notice({
            variant: 'warning',
            title: 'Uyarı',
            message: 'Maksimum 500 lead yüklenebilir. Dosyanızda daha fazla satır varsa sadece ilk 500 lead işlendi.',
            buttonTitle: 'Tamam',
          });
        }
      }
    },
    [notice],
  );

  useEffect(() => {
    const excelWorker = new Worker(new URL('../../helpers/excel/lead-excel-import-worker', import.meta.url), {
      type: 'module',
    });
    excelWorkerRef.current = excelWorker;
    excelWorker.onmessage = handleWorkerMessage;

    return () => {
      excelWorker.terminate();
    };
  }, [handleWorkerMessage]);

  const deleteRow = (id: number) => {
    const newExcelList = excelList.filter((r) => r.id !== id);
    setExcelList(newExcelList);
    if (newExcelList.length === 0) {
      form.reset();
    }
  };

  const rowActions: RowActions<LeadAddManuelFormData & { id?: number }>[] = [
    {
      Element: ({ row }: { row?: LeadAddManuelFormData & { id?: number } }) => (
        <Button
          id="common:DELETE"
          onClick={() => row && deleteRow(row?.id || 0)}
          sx={{ mr: 1.5, color: theme.palette.text.secondary, fontWeight: 600 }}
          variant="text"
          size="medium">
          <Typography sx={{ mr: 1, color: theme.palette.text.secondary }}>Sil</Typography>
          <Icon icon="trash-04" size={14} color={theme.palette.text.secondary} />
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
          <Box sx={{ mr: 'auto', ml: 1, display: 'flex', gap: 3, alignItems: 'center' }}>
            <Typography variant="body2">
              Toplam Lead Adedi:{' '}
              <Typography component="span" variant="body2" fontWeight={600}>
                {excelList.length ? excelList.length : '-'}
              </Typography>
            </Typography>
            {invalidRowsCount > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon="alert-circle" size={16} color={theme.palette.error[700]} />
                <Typography variant="body2" color={theme.palette.error[700]}>
                  <Typography component="span" variant="body2" fontWeight={600} color={theme.palette.error[700]}>
                    {invalidRowsCount}
                  </Typography>{' '}
                  eksik satır
                </Typography>
              </Box>
            )}
          </Box>
          <Box>
            {excelList.length > 0 && (
              <Button
                sx={{ mr: 2 }}
                disabled={excelList.length === 0}
                id="clearAll"
                onClick={clearAll}
                variant="outlined">
                Tümünü Temizle
              </Button>
            )}
            <Button
              disabled={excelList.length === 0}
              id="SAVE"
              onClick={() => {
                onSubmit(excelList);
              }}
              variant="contained">
              Kaydet
              {excelList.length ? ` (${excelList.length})` : null}
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Modal ref={modal} maxWidth="xl" actions={actions} title="Lead Ekle">
      {isExcelParserLoading && <LinearProgress />}

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

      {excelList?.length > 0 && invalidRowsCount > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          icon={<Icon icon="alert-triangle" size={20} color={theme.palette.warning.main} />}>
          <AlertTitle sx={{ fontWeight: 600 }}>Eksik Bilgili Satırlar Bulundu</AlertTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              Excel dosyanızda <strong>{invalidRowsCount}</strong> adet zorunlu alan eksik satır bulunmaktadır.
            </Typography>
          </Box>
        </Alert>
      )}

      {excelList?.length > 0 && (
        <Table<LeadAddManuelFormData & { id?: number }>
          id="addExcelLeadTable"
          rowId="id"
          data={excelList || []}
          headers={headers}
          rowActions={rowActions}
          notFoundConfig={{ title: "Excel'den lead verisi bulunamadı" }}>
          {leadHeaderFieldKeys.map((item) => {
            const isProductField = item.id === 'products';

            if (isProductField) {
              return (
                <Slot<LeadAddManuelFormData & { id?: number }> id={item.id} key={item.id}>
                  {(_: unknown, row?: LeadAddManuelFormData & { id?: number }) =>
                    renderProductSlot(row, productTypeList)
                  }
                </Slot>
              );
            }

            return (
              <Slot<LeadAddManuelFormData & { id?: number }> id={item.id} key={item.id}>
                {(value: unknown, row?: LeadAddManuelFormData & { id?: number }) =>
                  renderFieldSlot(value, row, item.id, theme.palette.error[700])
                }
              </Slot>
            );
          })}
        </Table>
      )}
    </Modal>
  );
};

export default forwardRef(ExcelLeadImportModal);
