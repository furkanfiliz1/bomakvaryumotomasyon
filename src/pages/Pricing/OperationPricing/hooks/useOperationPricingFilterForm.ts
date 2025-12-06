import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomerManager, ProductTypeOption } from '@store';
import yup from '@validation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { OperationPricingFilters, OperationPricingStatus } from '../operation-pricing.types';

interface FormData {
  CompanyIdentifier: string;
  CompanyName: string;
  status: string;
  referenceId: string;
  productType: string;
  startPaymentDate: string;
  endPaymentDate: string;
  userIds: number[];
}

interface UseOperationPricingFilterFormProps {
  customerManagerList: CustomerManager[];
  productTypeList: ProductTypeOption[]; // String values to match working implementation
  initialFilters?: Partial<OperationPricingFilters>;
  onFilterChange: (filters: Partial<OperationPricingFilters>) => void;
}

// Status options for dropdown - matching legacy exactly (constant, doesn't change)
const STATUS_OPTIONS = [
  { Value: OperationPricingStatus.All, Description: 'Tümü' },
  { Value: OperationPricingStatus.Paid, Description: 'Ödendi' },
  { Value: OperationPricingStatus.Canceled, Description: 'İptal Edildi' },
  { Value: OperationPricingStatus.Failed, Description: 'Başarısız' },
  { Value: OperationPricingStatus.Error, Description: 'Hata' },
  { Value: OperationPricingStatus.Refund, Description: 'İade' },
  { Value: OperationPricingStatus.PartialReturn, Description: 'Kısmi İade' },
];

function useOperationPricingFilterForm({
  customerManagerList,
  productTypeList,
  initialFilters,
  onFilterChange,
}: UseOperationPricingFilterFormProps) {
  // Initialize with provided filters or default date range (today)
  const today = new Date();

  const initialValues: FormData = {
    CompanyIdentifier: initialFilters?.CompanyIdentifier || '',
    CompanyName: initialFilters?.CompanyName || '',
    status: initialFilters?.status !== undefined ? String(initialFilters.status) : String(OperationPricingStatus.All),
    referenceId: initialFilters?.referenceId || '',
    productType: initialFilters?.productType || '*', // Use '*' to match the "Tümü" option from dropdown
    startPaymentDate: initialFilters?.startPaymentDate || today.toISOString().split('T')[0],
    endPaymentDate: initialFilters?.endPaymentDate || today.toISOString().split('T')[0], // Same day as default
    userIds: initialFilters?.UserIds || ([] as number[]), // Empty array as default following Companies pattern
  };

  // Form schema following DiscountOperations pattern exactly
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      CompanyIdentifier: fields.text.label('Satıcı VKN').meta({ col: 3 }),
      CompanyName: fields.text.label('Satıcı Ünvan').meta({ col: 3 }),
      status: fields.select(STATUS_OPTIONS, 'string', ['Value', 'Description']).label('Statü').meta({ col: 3 }),
      referenceId: fields.text.label('İskonto No').meta({ col: 3 }),
      productType: fields
        .select(productTypeList, 'string', ['Value', 'Description'])
        .label('Ürün Tipi')
        .meta({ col: 3 }),
      startPaymentDate: fields.date.required('Başlangıç tarihi gerekli').label('Başlangıç Tarihi').meta({ col: 3 }),
      endPaymentDate: fields.date.required('Bitiş tarihi gerekli').label('Bitiş Tarihi').meta({ col: 3 }),
      userIds: fields
        .multipleSelect(customerManagerList || [], 'number', ['Id', 'FullName'])
        .optional()
        .label('Müşteri Temsilcisi')
        .meta({
          col: 3,
        }),
    };

    return yup.object(baseFields);
  }, [productTypeList, customerManagerList]); // Recreate schema when dropdown data changes

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Update form when URL parameters change
  useEffect(() => {
    if (initialFilters) {
      form.reset({
        CompanyIdentifier: initialFilters.CompanyIdentifier || '',
        CompanyName: initialFilters.CompanyName || '',
        status:
          initialFilters.status !== undefined ? String(initialFilters.status) : String(OperationPricingStatus.All),
        referenceId: initialFilters.referenceId || '',
        productType: initialFilters.productType || '*',
        startPaymentDate: initialFilters.startPaymentDate || new Date().toISOString().split('T')[0],
        endPaymentDate: initialFilters.endPaymentDate || new Date().toISOString().split('T')[0],
        userIds: initialFilters.UserIds || ([] as number[]),
      });
    }
  }, [initialFilters, form]);

  const handleSearch = () => {
    const formData = form.getValues();

    // Transform form data to API filter format - following Companies pattern exactly

    const filters: Partial<OperationPricingFilters> = {
      CompanyIdentifier: formData.CompanyIdentifier || undefined,
      CompanyName: formData.CompanyName || undefined,
      status: Number(formData.status) === OperationPricingStatus.All ? undefined : Number(formData.status),
      referenceId: formData.referenceId || undefined,
      productType: formData.productType && formData.productType !== '*' ? formData.productType : undefined,
      startPaymentDate: formData.startPaymentDate,
      endPaymentDate: formData.endPaymentDate,
      UserIds: formData.userIds?.length ? (formData.userIds as number[]) : undefined,
      page: 1, // Reset to first page when filtering
    };

    onFilterChange(filters);
  };

  return {
    form,
    schema,
    handleSearch,
    statusOptions: STATUS_OPTIONS,
    customerManagerList,
    productTypeList,
  };
}

export default useOperationPricingFilterForm;
