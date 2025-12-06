import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { LegalProceedingsQueryParams } from '../limit-operations.types';
import { useLegalProceedingsQueryParams } from './useLegalProceedingsQueryParams';

interface FormData {
  Identifier: string;
  startCompensationDate: string;
  endCompensationDate: string;
  compensationState: string;
  lawFirmId: string;
  compensationProtocol: string;
  startCollectionDate: string;
  endCollectionDate: string;
  integratorStatus: string;
  financerId: string;
  customerManagerId: string;
  ProductType: string;
  guarantorRate: string;
  Id: string;
  RiskyFinancialSituations: number[];
}

interface UseLegalProceedingsFilterFormDropdownData {
  compensationStateTypes: Array<{ label: string; value: number }>;
  lawFirms: Array<{ label: string; value: number }>;
  compensationProtocolTypes: Array<{ label: string; value: number }>;
  integratorStatusTypes: Array<{ label: string; value: number }>;
  integrators: Array<{ label: string; value: number }>;
  customerManagers: Array<{ label: string; value: number }>;
  guarantorRates: Array<{ label: string; value: number }>;
  riskyCalculations: Array<{ label: string; value: number }>;
}

interface UseLegalProceedingsFilterFormProps {
  dropdownData?: UseLegalProceedingsFilterFormDropdownData;
  onFilterChange: (filters: Partial<LegalProceedingsQueryParams>) => void;
  companySearchResults?: Array<{ label: string; value: string }>;
  searchCompaniesByNameOrIdentifier?: (searchTerm?: string) => Promise<void>;
  isCompanySearchLoading?: boolean;
}

/**
 * Hook to manage Legal Proceedings filter form with dynamic schema
 * Following OperationPricing pattern with onFilterChange callback
 */
export const useLegalProceedingsFilterForm = ({
  dropdownData,
  onFilterChange,
  companySearchResults = [],
  searchCompaniesByNameOrIdentifier,
  isCompanySearchLoading = false,
}: UseLegalProceedingsFilterFormProps) => {
  // Use query params hook for URL parameter management
  const { updateParams, resetParams, hasFilters } = useLegalProceedingsQueryParams();

  // Initialize with default empty values (following OperationPricing pattern)
  const initialValues: FormData = {
    Identifier: '',
    startCompensationDate: '',
    endCompensationDate: '',
    compensationState: '',
    lawFirmId: '',
    compensationProtocol: '',
    startCollectionDate: '',
    endCollectionDate: '',
    integratorStatus: '',
    financerId: '',
    customerManagerId: '',
    ProductType: '',
    guarantorRate: '',
    Id: '',
    RiskyFinancialSituations: [],
  };

  // Create dynamic schema based on dropdown data
  const schema = useMemo(() => {
    // Provide default empty arrays if dropdownData is not provided
    const defaultDropdownData = {
      compensationStateTypes: [],
      lawFirms: [],
      compensationProtocolTypes: [],
      integratorStatusTypes: [],
      integrators: [],
      customerManagers: [],
      guarantorRates: [],
      riskyCalculations: [],
    };

    const data = dropdownData || defaultDropdownData;

    const baseFields: yup.AnyObject = {
      Identifier: fields
        .asyncAutoComplete(
          companySearchResults,
          'string',
          ['value', 'label'],
          searchCompaniesByNameOrIdentifier || (() => Promise.resolve()),
          isCompanySearchLoading,
          3,
        )
        .label('Ünvan / VKN')
        .meta({ col: 2, placeholder: 'Ara' }),
      startCompensationDate: fields.date.label('Tazmin Başlangıç Tarihi').meta({ col: 2 }),
      endCompensationDate: fields.date.label('Tazmin Bitiş Tarihi').meta({ col: 2 }),
      compensationState: fields
        .select(data.compensationStateTypes, 'string', ['value', 'label'])
        .label('Statü')
        .meta({ col: 2, showSelectOption: true }),
      lawFirmId: fields.select(data.lawFirms, 'string', ['value', 'label']).label('Hukuk Bürosu').meta({ col: 2 }),
      compensationProtocol: fields
        .select(data.compensationProtocolTypes, 'string', ['value', 'label'])
        .label('Protokol Durumu')
        .meta({ col: 2, showSelectOption: true }),
      integratorStatus: fields
        .select(data.integratorStatusTypes, 'string', ['value', 'label'])
        .label('Entegratör Durumu')
        .meta({ col: 2, showSelectOption: true }),
      financerId: fields
        .select(data.integrators, 'string', ['value', 'label'])
        .label('Finansör Ünvan')
        .meta({ col: 2, showSelectOption: true }),
      customerManagerId: fields
        .select(data.customerManagers, 'number', ['value', 'label'])
        .label('Müşteri Temsilcisi')
        .meta({ col: 2, showSelectOption: true }),
      ProductType: fields.number.label('Teminat Türü').meta({ col: 2, showSelectOption: true }),
      guarantorRate: fields
        .select(data.guarantorRates, 'string', ['value', 'label'])
        .label('Garantörlük Oranı')
        .meta({ col: 2, showSelectOption: true }),
      Id: fields.number.label('Tazmin ID').meta({ col: 2, showSelectOption: true }),
      RiskyFinancialSituations: fields
        .multipleSelect(data.riskyCalculations, 'number', ['value', 'label'])
        .label('Şirket Durumu')
        .meta({ col: 2, showSelectOption: true }),
    };

    return yup.object(baseFields);
  }, [dropdownData, companySearchResults, searchCompaniesByNameOrIdentifier, isCompanySearchLoading]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSearch = () => {
    const formData = form.getValues();

    // Convert form data to query parameters and clean empty values
    const searchParams: Partial<LegalProceedingsQueryParams> = {
      page: 1, // Reset to first page when filtering
    };

    // Process each field, converting empty strings to undefined and parsing numbers
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        // Convert string numbers back to numbers for API
        if (
          [
            'compensationState',
            'lawFirmId',
            'compensationProtocol',
            'integratorStatus',
            'financerId',
            'customerManagerId',
            'ProductType',
            'guarantorRate',
            'Id',
          ].includes(key)
        ) {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            (searchParams as Record<string, unknown>)[key] = numValue;
          }
        } else {
          (searchParams as Record<string, unknown>)[key] = value;
        }
      }
    });

    // Update URL parameters for browser history
    updateParams(searchParams);

    // Trigger immediate search via callback (OperationPricing pattern)
    onFilterChange(searchParams);
  };

  // Handle form reset
  const onReset = () => {
    form.reset(initialValues);
    resetParams();
  };

  // Handle export request
  const onExport = () => {
    const formData = form.getValues();
    const exportParams: Partial<LegalProceedingsQueryParams> = {
      isExport: true,
      page: 1,
      pageSize: 1000, // Get all records for export
    };

    // Process each field, converting null to undefined
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        (exportParams as Record<string, unknown>)[key] = value;
      }
    });

    updateParams(exportParams);
  };

  return {
    form,
    schema,
    handleSearch,
    onReset,
    onExport,
    hasFilters,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
  };
};
