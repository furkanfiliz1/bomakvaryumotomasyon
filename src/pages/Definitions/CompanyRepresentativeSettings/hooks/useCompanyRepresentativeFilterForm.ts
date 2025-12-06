/**
 * Company Representative Filter Form Hook
 * Matches legacy CustomerManagerList filter form exactly
 * Following OperationPricing filter patterns
 */

import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { fields } from 'src/components/common/Form/schemas/_common';
import yup from 'src/validation';
import type {
  CompanyRepresentativeFilters,
  CustomerManagerOption,
  FinancerOption,
  ProductTypeOption,
} from '../company-representative-settings.types';

interface FormData {
  companyIdentifier: string;
  userId: number | string;
  productType: string;
  financerCompanyId: number | string;
  isManagerAssigned: boolean | string;
}

interface UseCompanyRepresentativeFilterFormProps {
  customerManagerList: CustomerManagerOption[];
  productTypeList: ProductTypeOption[];
  financersList: FinancerOption[];
  onFilterChange: (filters: Partial<CompanyRepresentativeFilters>) => void;
}

// Customer Manager Status options - matches legacy exactly
const CUSTOMER_MANAGER_STATUS_OPTIONS = [
  {
    value: 'true',
    text: 'Temsilci Atanmış', // lang.settings.customerManagerAssigned
  },
  {
    value: 'false',
    text: 'Temsilci Atanmamış', // lang.settings.customerManagerUnAssigned
  },
];

// Helper function to convert string to boolean or undefined
function getIsManagerAssignedValue(value: boolean | string): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (typeof value === 'boolean') return value;
  return undefined;
}

function useCompanyRepresentativeFilterForm({
  customerManagerList,
  productTypeList,
  financersList,
  onFilterChange,
}: UseCompanyRepresentativeFilterFormProps) {
  // Initial values matching legacy defaults
  const initialValues: FormData = {
    companyIdentifier: '',
    userId: '',
    productType: '',
    financerCompanyId: '',
    isManagerAssigned: 'true', // Default to "Temsilci Atanmış" matching legacy
  };

  // Form schema following OperationPricing patterns
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      companyIdentifier: fields.text.label('Şirket VKN').meta({ col: 3 }),

      userId: fields
        .select(customerManagerList, 'number', ['Id', 'FullName'])
        .label('Müşteri Temsilcisi')
        .meta({ col: 3 }),

      productType: fields.select(productTypeList, 'string', ['Value', 'Description']).label('Ürün').meta({ col: 3 }),

      financerCompanyId: fields
        .select(financersList, 'number', ['Id', 'CompanyName'])
        .label('Finansör')
        .meta({ col: 3 }),

      isManagerAssigned: fields
        .select(CUSTOMER_MANAGER_STATUS_OPTIONS, 'string', ['value', 'text'])
        .label('Temsilci Durumu')
        .meta({ col: 3 }),
    };

    return yup.object(baseFields);
  }, [customerManagerList, productTypeList, financersList]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSearch = () => {
    const formData = form.getValues();

    // Transform form data to API filter format - matching legacy exactly
    const filters: Partial<CompanyRepresentativeFilters> = {
      companyIdentifier: formData.companyIdentifier || undefined,
      userId: formData.userId && formData.userId !== '' ? Number(formData.userId) : undefined,
      productType: formData.productType || undefined,
      financerCompanyId:
        formData.financerCompanyId && formData.financerCompanyId !== ''
          ? Number(formData.financerCompanyId)
          : undefined,
      isManagerAssigned: getIsManagerAssignedValue(formData.isManagerAssigned),
    };

    onFilterChange(filters);
  };

  return {
    form,
    schema,
    handleSearch,
    statusOptions: CUSTOMER_MANAGER_STATUS_OPTIONS,
  };
}

export default useCompanyRepresentativeFilterForm;
