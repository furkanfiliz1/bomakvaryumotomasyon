import { fields } from '@components';
import yup from '@validation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import {
  useLazySearchCompaniesByNameOrIdentifierQuery,
  useLazySearchFinancerCompaniesQuery,
} from '../limit-operations.api';
import type { CompanySearchResult, CompensationUpdateFormData } from '../limit-operations.types';

interface UseUpdateCompensationFormProps {
  initialData?: Partial<CompensationUpdateFormData>;
  dropdownData?: {
    // financers removed - now using async autocomplete with API
    riskyCalculations: { label: string; value: number }[];
    guarantorRates: { label: string; value: number }[];
    documentStates: { label: string; value: number }[];
    lawFirms: { label: string; value: number }[];
    protocols: { label: string; value: number }[];
    productTypes: { label: string; value: number }[];
    states: { label: string; value: number }[];
  };
}

/**
 * Schema-based form hook for compensation update form
 * Following the modern form system architecture from forms.instructions.md
 */
export const useUpdateCompensationForm = ({ initialData, dropdownData }: UseUpdateCompensationFormProps = {}) => {
  // Company search functionality
  const [companySearchResults, setCompanySearchResults] = useState<CompanySearchResult[]>([]);
  const [searchCompanies, { isLoading: isCompanySearchLoading }] = useLazySearchCompaniesByNameOrIdentifierQuery();

  // Financer companies data - using select instead of asyncAutoComplete
  const [financerOptions, setFinancerOptions] = useState<{ label: string; value: number }[]>([]);
  const [searchFinancerCompanies] = useLazySearchFinancerCompaniesQuery();
  const searchCompaniesByNameOrIdentifier = useCallback(
    async (searchValue: string) => {
      if (searchValue && searchValue.length >= 3) {
        try {
          const result = await searchCompanies({
            CompanyNameOrIdentifier: searchValue,
            Status: 1,
            ActivityType: 2, // SELLER
          }).unwrap();

          // Transform results to match the expected format for async autocomplete
          const transformedResults = result.Items.map((company) => {
            // Clean JSON string formatting if it exists
            const cleanIdentifier =
              company.Identifier && company.Identifier.startsWith('"') && company.Identifier.endsWith('"')
                ? company.Identifier.slice(1, -1)
                : company.Identifier;

            const cleanCompanyName =
              company.CompanyName && company.CompanyName.startsWith('"') && company.CompanyName.endsWith('"')
                ? company.CompanyName.slice(1, -1)
                : company.CompanyName;

            return {
              ...company,
              Identifier: cleanIdentifier,
              CompanyName: cleanCompanyName,
              label: `${cleanCompanyName} / ${cleanIdentifier}`,
              value: cleanIdentifier,
            };
          });
          console.log('transformedResults', transformedResults);

          setCompanySearchResults(transformedResults);
        } catch (error) {
          console.error('Company search failed:', error);
          setCompanySearchResults([]);
        }
      } else {
        setCompanySearchResults([]);
      }
    },
    [searchCompanies],
  );

  // Load financer companies on component mount
  useEffect(() => {
    const loadFinancerCompanies = async () => {
      try {
        const result = await searchFinancerCompanies({
          page: 1,
          pageSize: 100,
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2, // FINANCIER type
        }).unwrap();

        // Transform results to match the expected format for select dropdown
        const transformedOptions = result.Items.map((company) => {
          // Clean JSON string formatting if it exists
          const cleanIdentifier =
            company.Identifier && company.Identifier.startsWith('"') && company.Identifier.endsWith('"')
              ? company.Identifier.slice(1, -1)
              : company.Identifier;

          const cleanCompanyName =
            company.CompanyName && company.CompanyName.startsWith('"') && company.CompanyName.endsWith('"')
              ? company.CompanyName.slice(1, -1)
              : company.CompanyName;

          return {
            label: `${cleanCompanyName} / ${cleanIdentifier}`,
            value: company.Id, // Use Id as the value for FinancerId
          };
        });

        setFinancerOptions(transformedOptions);
      } catch (error) {
        console.error('Failed to load financer companies:', error);
        setFinancerOptions([]);
      }
    };

    loadFinancerCompanies();
  }, [searchFinancerCompanies]);

  // Use hardcoded strings as the project doesn't use react-i18next
  const defaultValues: CompensationUpdateFormData = {
    Identifier: '', // Always start with empty string, let the component handle object assignment
    CompensationDate: initialData?.CompensationDate || '',
    Amount: initialData?.Amount || 0,
    FinancerId: initialData?.FinancerId || 0,
    RiskyFinancialSituations: initialData?.RiskyFinancialSituations || [],
    GuarantorRate: initialData?.GuarantorRate,
    DocumentState: initialData?.DocumentState,
    LawFirmId: initialData?.LawFirmId || 0,
    AssignmentFee: initialData?.AssignmentFee || 0,
    AssignmentDate: initialData?.AssignmentDate || '',
    Protocol: initialData?.Protocol,
    ProductType: initialData?.ProductType,
    State: initialData?.State || 0,
    InterestRate: initialData?.InterestRate || 0,
    InterestAmount: initialData?.InterestAmount || 0,
    Note: initialData?.Note || '',
    IsDigital: initialData?.IsDigital || false,
  };

  const schema = yup.object({
    // Company Identifier - AsyncAutoComplete for company search
    Identifier: fields
      .asyncAutoComplete(
        companySearchResults,
        'string',
        ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
        searchCompaniesByNameOrIdentifier,
        isCompanySearchLoading,
        3,
      )
      .required('Ünvan / VKN seçiniz')
      .label('Ünvan / VKN')
      .meta({ col: 6, placeholder: 'VKN/Ünvan arayın...' }),

    // Compensation Date
    CompensationDate: fields.date.required('Tazmin Tarihi zorunlu').label('Tazmin Tarihi').meta({ col: 6 }),

    // Amount
    Amount: fields.currency.required('Tazmin Tutarı zorunlu').label('Tazmin Tutarı').meta({ col: 6, currency: 'TRY' }),

    // Financer - Select dropdown with loaded financer companies
    FinancerId: fields
      .select(financerOptions, 'number', ['value', 'label'])
      .required('Finansör Ünvan seçiniz')
      .label('Finansör Ünvan')
      .meta({ col: 6, showSelectOption: true }),

    // Risky Financial Situations - Multi Select
    RiskyFinancialSituations: yup
      .array()
      .of(yup.mixed())
      .default([])
      .label('Şirket Durumu')
      .meta({
        field: 'InputMultiSelect',
        col: 6,
        options: dropdownData?.riskyCalculations || [],
        entries: ['value', 'label'],
      }),

    // Guarantor Rate
    GuarantorRate: fields
      .select(dropdownData?.guarantorRates || [], 'number', ['value', 'label'])
      .required('Garantörlük Oranı seçiniz')
      .label('Garantörlük Oranı')
      .meta({ col: 6, showSelectOption: true }),

    // Document State
    DocumentState: fields
      .select(dropdownData?.documentStates || [], 'number', ['value', 'label'])
      .required('Evrak Durumu seçiniz')
      .label('Evrak Durumu')
      .meta({ col: 6, showSelectOption: true }),

    // Law Firm
    LawFirmId: fields
      .select(dropdownData?.lawFirms || [], 'number', ['value', 'label'])
      .label('Hukuk Bürosu')
      .meta({ col: 6, showSelectOption: true }),

    // Assignment Fee
    AssignmentFee: fields.currency.label('Atama Tutarı').meta({ col: 6, currency: 'TRY' }),

    // Assignment Date
    AssignmentDate: fields.date.label('Atama Tarihi').meta({ col: 6 }),

    // Protocol
    Protocol: fields
      .select(dropdownData?.protocols || [], 'number', ['value', 'label'])
      .required('Protokol seçiniz')
      .label('Protokol')
      .meta({ col: 6, showSelectOption: true }),

    // Product Type
    ProductType: fields
      .select(dropdownData?.productTypes || [], 'number', ['value', 'label'])
      .required('Teminat Türü seçiniz')
      .label('Teminat Türü')
      .meta({ col: 6, showSelectOption: true }),

    // State
    State: fields
      .select(dropdownData?.states || [], 'number', ['value', 'label'])
      .required('Statü seçiniz')
      .label('Statü')
      .meta({ col: 6 }),

    // Interest Rate
    InterestRate: fields.number.label('Faiz Oranı (%)').meta({ col: 6 }),

    // Interest Amount - Read Only
    InterestAmount: fields.currency.label('Faiz Tutarı').meta({ col: 6, currency: 'TRY', disabled: true }),

    IsDigital: fields.switchField.label('Dijital mi?').meta({ col: 6 }),
    // Note
    Note: fields.textarea.label('Notlar').meta({ col: 12 }),

    // Is Digital Switch

    // Details field for compensation details (not visible in form, used for data processing)
    details: yup.array().default([]).meta({ visible: false }),
  });

  const form = useForm<CompensationUpdateFormData>({
    defaultValues,
    // resolver: yupResolver(schema), // Commented out temporarily due to type mismatch
    mode: 'onChange',
  });

  return {
    form,
    schema,
    setCompanySearchResults,
    financerOptions, // Expose financer options if needed
  };
};
