import { fields } from '@components';
// import { yupResolver } from '@hookform/resolvers/yup'; // Commented out due to type mismatch (following reference pattern)
import yup from '@validation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import { useGetFinancersQuery, useLazySearchByCompanyNameOrIdentifierQuery } from '../manual-transaction-entry.api';
import { CompanyActivityType, CompanySearchResult, FinancialRecord } from '../manual-transaction-entry.types';
import { useDropdownData } from './useDropdownData';

// Form data type following reference pattern - SenderIdentifier and FinancerIdentifier are always string for the form
interface FinancialRecordFormData extends Omit<FinancialRecord, 'SenderIdentifier' | 'FinancerIdentifier'> {
  SenderIdentifier?: string | null;
  FinancerIdentifier?: string | null; // Combined field for financer selection
}

interface UseAddFinancialRecordFormProps {
  currencies: Array<{ Id: number; Code: string; Name: string }>;
  financialRecordTypes: Array<{ Value: number; Description: string }>;
  financialActivityTypes: Array<{ Value: number; Description: string }>;
  processTypes: Array<{ Value: number; Description: string }>;
  invoiceParty?: Array<{ Value: string; Description: string }>;
  bankList?: Array<{ Identifier: string; CompanyName: string }>;
  buyerList?: Array<{ Identifier: string; CompanyName: string }>;
  initialData?: FinancialRecord | null; // Support for edit mode
}

export function useAddFinancialRecordForm({
  currencies,
  financialRecordTypes,
  financialActivityTypes,
  processTypes,
  invoiceParty = [],
  bankList = [],
  buyerList = [],
  initialData = null,
}: UseAddFinancialRecordFormProps) {
  // Get dropdown data (without search functionality, we'll implement it directly)
  useDropdownData(); // Still needed for other dropdown data but we're not using search from it

  // Company search functionality - following reference implementation pattern
  const [sellersSearchResults, setSellersSearchResults] = useState<CompanySearchResult[]>([]);
  const [searchSellers, { isLoading: isSellersSearchLoading }] = useLazySearchByCompanyNameOrIdentifierQuery();

  // Financers data loading
  const { data: financersData } = useGetFinancersQuery({});

  const searchSellersByCompanyNameOrIdentifier = useCallback(
    async (searchValue: string) => {
      if (searchValue && searchValue.length >= 3) {
        try {
          const result = await searchSellers({
            CompanyNameOrIdentifier: searchValue,
            Status: 1,
            ActivityType: CompanyActivityType.SELLER,
          }).unwrap();

          // Transform results to match the expected format for async autocomplete (following reference pattern)
          const transformedResults = result.Items.map((company: CompanySearchResult) => {
            // Clean JSON string formatting if it exists (following reference pattern)
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
              label: `${cleanCompanyName} / ${cleanIdentifier}`, // Match reference format
              value: cleanIdentifier,
            };
          });

          setSellersSearchResults(transformedResults);
        } catch (error) {
          console.error('Sellers search failed:', error);
          setSellersSearchResults([]);
        }
      } else {
        setSellersSearchResults([]);
      }
    },
    [searchSellers],
  );
  // Use initialData if provided (edit mode), otherwise use default values (add mode)
  const initialValues: Partial<FinancialRecordFormData> = initialData
    ? {
        ...initialData,
        // Convert dates to the correct format for form fields
        IssueDate: initialData.IssueDate ? initialData.IssueDate.split('T')[0] : new Date().toISOString().split('T')[0],
        InvoiceDueDate: initialData.InvoiceDueDate ? initialData.InvoiceDueDate.split('T')[0] : null,
        // Ensure ReferenceNumber is properly mapped
        ReferenceNumber: initialData.ReferenceNumber || null,
        // Always start with string identifier, let the component handle object assignment (following reference pattern)
        SenderIdentifier: initialData.SenderIdentifier || '',
        // Map FinancerIdentifier for the combined field
        FinancerIdentifier: initialData.FinancerIdentifier || '',
      }
    : {
        FinancialRecordType: null,
        FinancialRecordProcessType: null,
        FinancialActivityType: 0,
        TaxFreeAmount: null,
        IssueDate: new Date().toISOString().split('T')[0],
        BillingIdentifier: null,
        ReceiverIdentifier: null,
        SenderIdentifier: '', // Always start with empty string (following reference pattern)
        CurrencyId: 1,
        ReferenceNumber: null,
        BankGuaranteedAmount: null,
        SystemGuaranteedAmount: null,
        InvoiceParty: null,
        FinancerIdentifier: '', // Combined field for VKN/Ünvan
      };

  // Create dropdown options
  const financialActivityOptions = financialActivityTypes.map((type) => ({
    value: type.Value,
    label: type.Description,
  }));

  const financialRecordTypeOptions = financialRecordTypes.map((type) => ({
    value: type.Value,
    label: type.Description,
  }));

  const currencyOptions = currencies.map((currency) => ({
    value: currency.Id,
    label: currency.Code,
  }));

  const processTypeOptions = processTypes.map((type) => ({
    value: type.Value,
    label: type.Description,
  }));

  // Invoice party options - will be used in conditional components
  const invoicePartyOptions = invoiceParty.map((party) => ({
    value: Number(party.Value),
    label: party.Description,
  }));

  const bankOptions = bankList.map((bank) => ({
    value: bank.Identifier,
    label: bank.CompanyName,
  }));

  const buyerOptions = buyerList.map((buyer) => ({
    value: buyer.Identifier,
    label: buyer.CompanyName,
  }));

  // Financers options from API data
  const financersOptions = financersData?.Items
    ? financersData.Items.map((financer) => {
        // Clean JSON string formatting if it exists (following reference pattern)
        const cleanIdentifier =
          financer.Identifier && financer.Identifier.startsWith('"') && financer.Identifier.endsWith('"')
            ? financer.Identifier.slice(1, -1)
            : financer.Identifier;

        const cleanCompanyName =
          financer.CompanyName && financer.CompanyName.startsWith('"') && financer.CompanyName.endsWith('"')
            ? financer.CompanyName.slice(1, -1)
            : financer.CompanyName;

        return {
          value: cleanIdentifier,
          label: `${cleanCompanyName} / ${cleanIdentifier}`,
        };
      })
    : [];

  // Function to create dynamic schema based on form values
  const createSchema = (currentValues: Partial<FinancialRecordFormData> = {}) => {
    const { FinancialRecordType, FinancialRecordProcessType } = currentValues;
    console.log('FinancialRecordType', FinancialRecordType);
    // Conditional visibility logic based on reference file render conditions
    const isManualRecord = FinancialRecordType?.toString() === '0';
    const isBankRecord = FinancialRecordType?.toString() === '1';
    const isNewCustomerAcquisition = FinancialRecordType?.toString() === '7';
    const isSupplier = FinancialRecordProcessType?.toString() === '0';
    const isSme = FinancialRecordProcessType?.toString() === '1';
    const isSpot = FinancialRecordProcessType?.toString() === '3' || FinancialRecordProcessType?.toString() === '5';
    const isReceivable = FinancialRecordProcessType?.toString() === '4';
    const isFigoskor = FinancialRecordProcessType?.toString() === '8';
    const isFigoskorPro = FinancialRecordProcessType?.toString() === '10';

    // Render conditions from reference file:
    // renderManualGuarantee: FinancialRecordType === 0 && (isSupplier || isReceivable)
    // renderManualCommon: FinancialRecordType === 0 && !isFigoskor && !isFigoskorPro
    // renderManualEasy: FinancialRecordType === 0 && (isSme || isSpot)
    // renderBankGuarantee: FinancialRecordType === 1 && isSupplier
    // renderNewCustomerFinancer: FinancialRecordType === 7
    const showManualGuarantee = isManualRecord && (isSupplier || isReceivable);
    const showManualCommon = isManualRecord && !isFigoskor && !isFigoskorPro;
    const showManualEasy = isManualRecord && (isSme || isSpot);
    const showBankGuarantee = isBankRecord && isSupplier;
    const showNewCustomerFinancer = isNewCustomerAcquisition;

    return yup.object({
      FinancialActivityType: fields
        .select(financialActivityOptions, 'number', ['value', 'label'])
        .required('Gelir-Gider Tipi seçimi zorunludur')
        .label('Gelir-Gider Tipi')
        .meta({ col: 6 }),

      FinancialRecordType: fields
        .select(financialRecordTypeOptions, 'number', ['value', 'label'])
        .required('İşlem Tipi seçimi zorunludur')
        .label('İşlem Tipi')
        .meta({ col: 6 }),

      BillingIdentifier: fields.text
        .required('Fatura kesilen VKN zorunludur')
        .label('Fatura Kesilen VKN')
        .meta({ col: 6 }),

      IssueDate: fields.date.required('İşlem tarihi zorunludur').label('İşlem Tarihi').meta({ col: 6 }),

      TaxFreeAmount: fields.currency
        .required("Fatura Tutarı(KDV'siz) zorunludur")
        .label("Fatura Tutarı(KDV'siz)")
        .meta({ col: 6, currency: 'TRY' }),

      CurrencyId: fields
        .select(currencyOptions, 'number', ['value', 'label'])
        .required('Para birimi seçimi zorunludur')
        .label('Para Birimi')
        .meta({ col: 6 }),

      FinancialRecordProcessType: fields
        .select(processTypeOptions, 'number', ['value', 'label'])
        .nullable()
        .label('İlgili Süreç')
        .meta({ col: 6 }),

      // Conditional fields with meta.visible based on render conditions

      // Manual Guarantee fields (renderManualGuarantee)
      InvoiceParty: fields
        .select(invoicePartyOptions, 'number', ['value', 'label'])
        .nullable()
        .label('Fatura Kesilen Şirket Tipi')
        .meta({ col: 6, visible: showManualGuarantee }),

      // Manual Common fields (renderManualCommon)
      SenderIdentifier: fields
        .asyncAutoComplete(
          sellersSearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchSellersByCompanyNameOrIdentifier,
          isSellersSearchLoading,
          3,
        )
        .nullable()
        .label('Satıcı VKN/Ünvan')
        .meta({ col: 6, placeholder: 'VKN/Ünvan arayın...', visible: showManualCommon }),

      FinancerIdentifier: fields
        .select(financersOptions, 'string', ['value', 'label'])
        .nullable()
        .label('Finansör VKN/Ünvanı')
        .meta({ col: 6, visible: showManualCommon || showNewCustomerFinancer }),

      ReferenceNumber: fields.text
        .nullable()
        .label(isSpot ? 'Spot Kredi Numarası' : 'İskonto Numarası')
        .meta({ col: 6, visible: showManualCommon }),

      // Manual Easy fields (renderManualEasy)
      SystemGuaranteedAmount: fields.currency
        .nullable()
        .label('Figopara Garantili Tutar')
        .meta({ col: 6, currency: 'TRY', visible: showManualEasy }),

      BankGuaranteedAmount: fields.currency
        .nullable()
        .label('Banka Garantili Tutar')
        .meta({ col: 6, currency: 'TRY', visible: showManualEasy }),

      // Receiver field for both ManualGuarantee and BankGuarantee
      ReceiverIdentifier: fields.text
        .nullable()
        .label('Alıcı VKN')
        .meta({ col: 6, visible: showManualGuarantee || showBankGuarantee }),
    });
  };

  // Initial schema
  const schema = createSchema(initialValues);

  const form = useForm<FinancialRecordFormData>({
    defaultValues: initialValues,
    // resolver: yupResolver(schema), // Commented out temporarily due to type mismatch (following reference pattern)
    mode: 'onChange',
  });

  // Reset form when initialData changes (edit mode) - following reference pattern
  useEffect(() => {
    if (initialData) {
      // Handle SenderIdentifier for AsyncAutoComplete if data exists (following reference pattern)
      if (initialData.SenderIdentifier && initialData.SenderName) {
        // Clean JSON string formatting if it exists (following reference pattern)
        const cleanIdentifier =
          initialData.SenderIdentifier.startsWith('"') && initialData.SenderIdentifier.endsWith('"')
            ? initialData.SenderIdentifier.slice(1, -1)
            : initialData.SenderIdentifier;

        const cleanCompanyName =
          initialData.SenderName.startsWith('"') && initialData.SenderName.endsWith('"')
            ? initialData.SenderName.slice(1, -1)
            : initialData.SenderName;

        // Create company object for AsyncAutoComplete field (following reference pattern)
        const senderCompanyObject: CompanySearchResult = {
          Id: 0, // We don't have company ID in the financial record data
          Identifier: cleanIdentifier,
          CompanyName: cleanCompanyName,
          label: `${cleanCompanyName} / ${cleanIdentifier}`, // Match reference format
          value: cleanIdentifier,
        };

        // Add to search results so it can be found by AsyncAutoComplete (following reference pattern)
        setSellersSearchResults((prev) => {
          const exists = prev.some((item) => item.Identifier === cleanIdentifier);
          if (!exists) {
            return [senderCompanyObject, ...prev];
          }
          return prev;
        });
      }

      // Prepare form data with string identifier (following reference pattern)
      const formDataToReset: Partial<FinancialRecordFormData> = {
        ...initialData,
        // Convert dates to the correct format for form fields
        IssueDate: initialData.IssueDate ? initialData.IssueDate.split('T')[0] : new Date().toISOString().split('T')[0],
        InvoiceDueDate: initialData.InvoiceDueDate ? initialData.InvoiceDueDate.split('T')[0] : null,
        // Use string identifier for AsyncAutoComplete (following reference pattern)
        SenderIdentifier: initialData.SenderIdentifier || '',
        // Use string identifier for select (FinancerIdentifier is now select field)
        FinancerIdentifier: initialData.FinancerIdentifier || '',
      };

      // Reset form with the processed data
      form.reset(formDataToReset);
    }
  }, [initialData, form]);

  return {
    form,
    schema,
    createSchema,
    bankOptions,
    buyerOptions,
    invoicePartyOptions,
    financersOptions,
    // Company search data (following reference pattern)
    sellersCompanySearchResults: sellersSearchResults,
    searchSellersByCompanyNameOrIdentifier,
    isSellersSearchLoading,
    setSellersSearchResults,
  };
}
