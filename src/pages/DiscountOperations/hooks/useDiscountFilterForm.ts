import { fields } from '@components';
import { RESPONSE_DATE } from '@constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFilterFormWithUrlSync } from '@hooks';
import { ProductTypes } from '@types';
import yup from '@validation';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { DiscountOperationFilters } from '../discount-operations.types';

type StringOrNumber = string | number;

interface FormData extends Record<string, unknown> {
  allowanceId?: string;
  senderIdentifier?: string;
  senderCompanyName?: string;
  receiverIdentifier?: StringOrNumber;
  financerCompanyId?: StringOrNumber;
  status?: StringOrNumber;
  customerManagerUserId?: StringOrNumber;
  startDate?: string;
  endDate?: string;
  drawerName?: string;
  paymentStatus?: StringOrNumber;
  offerType?: string;
}

interface UseDiscountFilterFormProps {
  buyerList: Array<{ Id: number; Identifier: string; CompanyName: string }>;
  bankList: Array<{ Id: number; CompanyName: string }>;
  customerManagerList: Array<{ Id: number; FullName: string }>;
  allowanceStatuses: Array<{ Value: number; Description: string }>;
  allowancePaymentStatuses: Array<{ Value: string; Description: string }>;
  productType: ProductTypes;
  onFilterChange: (filters: Partial<DiscountOperationFilters>) => void;
}

function useDiscountFilterForm({
  buyerList,
  bankList,
  customerManagerList,
  allowanceStatuses,
  allowancePaymentStatuses,
  productType,
  onFilterChange,
}: UseDiscountFilterFormProps) {
  const today = dayjs().format(RESPONSE_DATE);

  // Empty default values for reset
  const defaultValues = useMemo(
    () => ({
      allowanceId: '',
      senderIdentifier: '',
      senderCompanyName: '',
      receiverIdentifier: '',
      financerCompanyId: '',
      status: '',
      customerManagerUserId: '',
      startDate: today,
      endDate: today,
      drawerName: '',
      paymentStatus: '',
      offerType: '',
    }),
    [today],
  );

  const createSchema = () => {
    // Offer type options for cheque financing
    const offerTypeOptions = [
      { Value: 'partial', Description: 'Kısmi Teklif' },
      { Value: 'full', Description: 'Tam Teklif' },
    ];

    const baseFields: yup.AnyObject = {
      allowanceId: fields.text.optional().nullable().label('Talep No').meta({ col: 2 }),
      senderIdentifier: fields.text.optional().nullable().label('Tedarikçi Vkn').meta({ col: 2 }),
      senderCompanyName: fields.text.optional().nullable().label('Tedarikçi Ünvanı').meta({ col: 2 }),
      drawerName: fields.text
        .optional()
        .nullable()
        .label('Keşideci Ünvanı')
        .meta({ col: 2, visible: productType === ProductTypes.CHEQUES_FINANCING }),
      customerManagerUserId: fields
        .select(customerManagerList, 'string', ['Id', 'FullName'])
        .optional()
        .nullable()
        .label('Müşteri Temsilcisi')
        .meta({ col: 2, showSelectOption: true }),
      financerCompanyId: fields
        .select(bankList, 'string', ['Id', 'CompanyName'])
        .optional()
        .nullable()
        .label('Finansör')
        .meta({ col: 2, showSelectOption: true }),
      status: fields
        .select(allowanceStatuses, 'string', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('Durum')
        .meta({ col: 2, showSelectOption: true }),

      startDate: fields.date.optional().nullable().label('Başlangıç Tarihi').meta({ col: 2 }),
      endDate: fields.date.optional().nullable().label('Bitiş Tarihi').meta({ col: 2 }),
    };

    if (
      productType !== ProductTypes.CHEQUES_FINANCING &&
      productType !== ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE &&
      productType !== ProductTypes.INSTANT_BUSINESS_LOAN &&
      productType !== ProductTypes.COMMERCIAL_LOAN
    ) {
      baseFields.receiverIdentifier = fields
        .select(buyerList, 'string', ['Identifier', 'CompanyName'])
        .optional()
        .nullable()
        .label('Alıcı Ünvan')
        .meta({ col: 2, showSelectOption: true, showSelectOptionText: 'Hepsi' });
    }

    if (
      productType === ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE ||
      productType === ProductTypes.ROTATIVE_LOAN ||
      (productType !== ProductTypes.RECEIVABLE_FINANCING &&
        productType !== ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE &&
        productType !== ProductTypes.INSTANT_BUSINESS_LOAN &&
        productType !== ProductTypes.COMMERCIAL_LOAN)
    ) {
      baseFields.paymentStatus = fields
        .select(allowancePaymentStatuses, 'string', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('Ödeme Durumu')
        .meta({ col: 2, showSelectOption: true });
    }
    // Add offer type field only for cheque financing
    if (productType === ProductTypes.CHEQUES_FINANCING) {
      baseFields.offerType = fields
        .select(offerTypeOptions, 'string', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('Teklif Şekli')
        .meta({ col: 2, showSelectOption: true, showSelectOptionText: 'Seçiniz' });
    }

    return yup.object(baseFields);
  };

  const schema = createSchema();

  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Transform form data to API filter format
  const transformToApiFilters = (data: FormData): Partial<DiscountOperationFilters> => {
    const filters: Partial<DiscountOperationFilters> = {
      allowanceId: data.allowanceId || undefined,
      senderIdentifier: data.senderIdentifier || undefined,
      senderCompanyName: data.senderCompanyName || undefined,
      receiverIdentifier: data.receiverIdentifier ? String(data.receiverIdentifier) : undefined,
      financerCompanyId: data.financerCompanyId ? String(data.financerCompanyId) : undefined,
      status: data.status ? String(data.status) : undefined,
      customerManagerUserId: data.customerManagerUserId ? String(data.customerManagerUserId) : undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      drawerName: data.drawerName || undefined,
      PaymentStatus: data.paymentStatus ? String(data.paymentStatus) : undefined,
    };

    // Add offer type filter for cheque financing
    if (productType === ProductTypes.CHEQUES_FINANCING && data.offerType) {
      filters.isPartialBid = data.offerType === 'partial';
    }

    return filters;
  };

  // URL to form field name mapping (API uses PascalCase, form uses camelCase)
  const urlToFormFieldMap = useMemo(
    () => ({
      PaymentStatus: 'paymentStatus',
    }),
    [],
  );

  // Custom URL value transformer for special fields like isPartialBid -> offerType
  const getInitialFormValues = useCallback((): Partial<FormData> => {
    const params = new URLSearchParams(globalThis.location.search);
    const customValues: Partial<FormData> = {};

    // Handle isPartialBid -> offerType conversion
    const isPartialBid = params.get('isPartialBid');
    if (isPartialBid !== null) {
      customValues.offerType = isPartialBid === 'true' ? 'partial' : 'full';
    }

    return customValues;
  }, []);

  // Use the generic useFilterFormWithUrlSync hook for URL sync
  const { handleApply, handleReset: resetForm } = useFilterFormWithUrlSync<FormData, Partial<DiscountOperationFilters>>(
    {
      form,
      onFilterChange,
      transformToApiFilters,
      urlToFormFieldMap,
      customInitialValues: getInitialFormValues(),
    },
  );

  const handleReset = () => {
    resetForm(defaultValues);
  };

  return {
    form,
    schema,
    handleSearch: handleApply,
    handleReset,
  };
}

export { useDiscountFilterForm };
