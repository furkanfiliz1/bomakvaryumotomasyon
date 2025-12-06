/**
 * Bulk Update Dialog Component
 * Modal for updating multiple company representative assignments
 * Following OperationPricing modal patterns exactly
 */

import { Form } from '@components';
import { RESPONSE_DATE } from '@constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { useForm } from 'react-hook-form';
import { fields } from 'src/components/common/Form/schemas/_common';
import yup from 'src/validation';
import type {
  BulkUpdateFormData,
  CompanyCustomerManagerItem,
  CustomerManagerOption,
  FinancerOption,
  ProductTypeOption,
} from '../company-representative-settings.types';
import type { BuyerCompanyOption } from '../hooks/useCompanyRepresentativeDropdownData';

interface BulkUpdateDialogProps {
  open: boolean;
  selectedItems: CompanyCustomerManagerItem[];
  customerManagerList: CustomerManagerOption[];
  productTypeList: ProductTypeOption[];
  financersList: FinancerOption[];
  buyerCompaniesList: BuyerCompanyOption[];
  loading?: boolean;
  onConfirm: (formData: BulkUpdateFormData) => void;
  onCancel: () => void;
}

export const BulkUpdateDialog: React.FC<BulkUpdateDialogProps> = ({
  open,
  selectedItems,
  customerManagerList,
  productTypeList,
  financersList,
  buyerCompaniesList,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  // Form initial values
  const initialValues: BulkUpdateFormData = {
    startDate: dayjs().format(RESPONSE_DATE),
    managerUserId: null,
    productType: null,
    financerCompanyId: null,
    buyerCompanyId: null,
  };

  // Form schema with conditional validation
  const schema = yup.object({
    startDate: fields.date
      .required('Başlangıç tarihi gereklidir')
      .label('Geçerlilik Başlangıç Tarihi')
      .meta({ col: 12 }),

    managerUserId: fields
      .select(customerManagerList, 'number', ['Id', 'FullName'])
      .required('Müşteri temsilcisi seçilmelidir')
      .label('Müşteri Temsilcisi')
      .nullable()
      .meta({ col: 12 }),

    productType: fields
      .select(productTypeList, 'number', ['Value', 'Description'])
      .required('Ürün tipi seçilmelidir')
      .label('Ürün')
      .nullable()
      .meta({ col: 12 }),

    financerCompanyId: fields
      .select(financersList, 'number', ['Id', 'CompanyName'])
      .nullable()
      .label('Finansör')
      .meta({ col: 12 }),

    buyerCompanyId: fields
      .select(buyerCompaniesList, 'number', ['Id', 'CompanyName'])
      .nullable()
      .label('Alıcı')
      .meta({ col: 12 }),
  });

  const form = useForm({
    defaultValues: initialValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema as any),
    mode: 'onChange',
  });

  // Watch product type to conditionally show/hide financer and buyer fields
  const watchedProductType = form.watch('productType');
  const isInvoiceFinancing = Number(watchedProductType) === 3;
  const isBuyerEnabled = Number(watchedProductType) === 2;

  // Reset financer/buyer when product type changes
  React.useEffect(() => {
    if (!isInvoiceFinancing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as any).setValue('financerCompanyId', null);
    }
    if (!isBuyerEnabled) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as any).setValue('buyerCompanyId', null);
    }
  }, [isInvoiceFinancing, isBuyerEnabled, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = form.handleSubmit((formData: any) => {
    // Transform form data to match API expectations
    const transformedData: BulkUpdateFormData = {
      startDate: formData.startDate,
      managerUserId: Number(formData.managerUserId),
      productType: Number(formData.productType),
      financerCompanyId: formData.financerCompanyId ? Number(formData.financerCompanyId) : null,
      buyerCompanyId: formData.buyerCompanyId ? Number(formData.buyerCompanyId) : null,
    };

    onConfirm(transformedData);
  });

  const handleClose = () => {
    form.reset();
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: 400 },
      }}>
      <DialogTitle>Seçili Müşteri Temsilcisi Güncelleme</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {selectedItems.length} adet şirket için müşteri temsilcisi bilgileri güncellenecek.
          </Typography>
        </Box>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form form={form} schema={schema as any} />

        {/* Helper text for conditional fields */}
        {(!isInvoiceFinancing || !isBuyerEnabled) && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {!isInvoiceFinancing && '* Finansör alanı sadece Fatura Finansmanı ürünü için gereklidir'}
            {!isInvoiceFinancing && !isBuyerEnabled && <br />}
            {!isBuyerEnabled && '* Alıcı alanı sadece Tedarikçi ürünü için gereklidir'}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading} variant="outlined">
          İptal
        </Button>

        <LoadingButton onClick={handleSubmit} loading={loading} variant="contained" color="primary">
          Güncelle
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
