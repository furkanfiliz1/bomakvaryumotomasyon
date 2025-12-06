import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { fields } from '@components';
import { useFilterFormWithUrlSync } from '@hooks';
import { useMemo } from 'react';
import { ReceivableReportFilterFormData, ReceivableReportFilters } from '../receivable-report.types';

interface UseReceivableReportFilterFormProps {
  buyerList?: Array<{ Identifier: string; CompanyName: string }>;
  currencyList?: Array<{ Id: number; Code: string }>;
  onFilterChange: (filters: Partial<ReceivableReportFilters>) => void;
}

export const useReceivableReportFilterForm = ({
  buyerList = [],
  currencyList = [],
  onFilterChange,
}: UseReceivableReportFilterFormProps) => {
  const defaultValues: ReceivableReportFilterFormData = useMemo(
    () => ({
      senderIdentifier: null,
      receiverIdentifier: null,
      orderNo: null,
      startDate: null,
      endDate: null,
      isCharged: null,
      isDeleted: null,
      PayableAmountCurrency: null,
      productType: null,
      status: null,
    }),
    [],
  );

  // Usage status options - using 'all' as a special value for "Tümü"
  const usageStatusOptions = useMemo(
    () => [
      { id: 'all', name: 'Tümü' },
      { id: 'false', name: 'Kullanıma uygun' },
      { id: 'true', name: 'Kullanılmış' },
    ],
    [],
  );

  // Delete status options
  const deleteStatusOptions = useMemo(
    () => [
      { id: '0', name: 'Hayır' },
      { id: '1', name: 'Evet' },
    ],
    [],
  );

  // Convert buyer list to AutoComplete format
  const buyerOptions = useMemo(
    () => [
      { id: '', name: 'Tümü' },
      ...buyerList.map((buyer) => ({
        id: buyer.Identifier,
        name: buyer.CompanyName,
      })),
    ],
    [buyerList],
  );

  // Convert currency list to AutoComplete format
  const currencyOptions = useMemo(
    () =>
      currencyList.map((currency) => ({
        id: currency.Id.toString(),
        name: currency.Code,
      })),
    [currencyList],
  );

  const schema = useMemo(
    () =>
      yup.object().shape({
        senderIdentifier: fields.text.nullable().label('Satıcı VKN').meta({ col: 3 }),

        orderNo: fields.text.nullable().label('Alacak No').meta({ col: 3 }),

        startDate: fields.date.nullable().label('Başlangıç Tarihi').meta({ col: 3 }),

        endDate: fields.date.nullable().label('Bitiş Tarihi').meta({ col: 3 }),

        receiverIdentifier: fields
          .autoComplete(buyerOptions, 'string', ['id', 'name'])
          .nullable()
          .label('Alıcı Unvan')
          .meta({ col: 3 }),

        isCharged: fields
          .autoComplete(usageStatusOptions, 'string', ['id', 'name'])
          .nullable()
          .label('Kullanım Durumu')
          .meta({ col: 3 }),

        isDeleted: fields
          .autoComplete(deleteStatusOptions, 'string', ['id', 'name'])
          .nullable()
          .label('Silinmiş Mi?')
          .meta({ col: 3 }),

        PayableAmountCurrency: fields
          .autoComplete(currencyOptions, 'string', ['id', 'name'])
          .nullable()
          .label('Para Birimi')
          .meta({ col: 3, showSelectOption: true }),

        productType: fields.number.nullable().label('Ürün Tipi').meta({ col: 3, visible: false }),

        status: fields.number.nullable().label('Durum').meta({ col: 3, visible: false }),
      }),
    [buyerOptions, currencyOptions, usageStatusOptions, deleteStatusOptions],
  );

  const form = useForm<ReceivableReportFilterFormData>({
    defaultValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  // Transform form data to API filter format
  const transformToApiFilters = (data: ReceivableReportFilterFormData): Partial<ReceivableReportFilters> => {
    return {
      senderIdentifier: data.senderIdentifier || undefined,
      receiverIdentifier: data.receiverIdentifier ? String(data.receiverIdentifier) : undefined,
      orderNo: data.orderNo || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      // 'all' means no filter, so we send undefined
      isCharged: data.isCharged && data.isCharged !== 'all' ? String(data.isCharged) : undefined,
      isDeleted: data.isDeleted && data.isDeleted !== 'all' ? String(data.isDeleted) : undefined,
      PayableAmountCurrency: data.PayableAmountCurrency ? String(data.PayableAmountCurrency) : undefined,
      productType: data.productType || undefined,
      status: data.status || undefined,
    };
  };

  // Use the generic useFilterFormWithUrlSync hook for URL sync
  const { handleApply, handleReset: resetFormWithUrlSync } = useFilterFormWithUrlSync<
    ReceivableReportFilterFormData,
    Partial<ReceivableReportFilters>
  >({
    form,
    onFilterChange,
    transformToApiFilters,
  });

  const resetForm = () => {
    resetFormWithUrlSync(defaultValues);
  };

  const getFormValues = () => {
    return form.getValues();
  };

  return {
    form,
    schema,
    resetForm,
    getFormValues,
    handleSearch: handleApply,
  };
};
