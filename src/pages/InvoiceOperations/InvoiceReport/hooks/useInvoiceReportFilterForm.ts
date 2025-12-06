import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import type { BuyerItem, Currency, InvoiceSourceType, StatusOption, TypeOption } from '../invoice-report.types';
import { useInvoiceReportQueryParams } from './useInvoiceReportQueryParams';

interface UseInvoiceReportFilterFormProps {
  usingStatusOptions: StatusOption[];
  invoiceTypeOptions: TypeOption[];
  deleteStatusOptions: TypeOption[];
  notifyBuyerOptions: TypeOption[];
  invoiceStatusOptions: TypeOption[];
  profileIdOptions: TypeOption[];
  invoiceSourceTypes: InvoiceSourceType[];
  currencies: Currency[];
  buyersList: BuyerItem[];
  sellersCompanySearchResults: Array<{ Id: number; CompanyName: string; Identifier: string }>;
  searchSellersByCompanyNameOrIdentifier: (CompanyNameOrIdentifier?: string) => Promise<void>;
  isSellersSearchLoading: boolean;
  onFilterChange: (filters: Record<string, unknown>) => void;
}

interface FormData {
  receiverIdentifier: string;
  senderIdentifier: string | { value: string; label: string } | null; // AsyncAutoComplete can be string or object
  notifyBuyer: number | string;
  type: string;
  SourceType: string;
  availableType: string;
  isDeleted: string;
  status: number | string;
  profileId: string;
  currencyId: number | string;
  startDate: string;
  endDate: string;
  invoiceNumber: string;
  serialNumber: string;
  sequenceNumber: string;
}

/**
 * Hook for managing invoice report filter form state with Yup schema validation
 * Following OperationPricing useOperationPricingFilterForm pattern exactly
 */
const useInvoiceReportFilterForm = ({
  usingStatusOptions,
  invoiceTypeOptions,
  deleteStatusOptions,
  notifyBuyerOptions,
  invoiceStatusOptions,
  profileIdOptions,
  invoiceSourceTypes,
  currencies,
  buyersList,
  sellersCompanySearchResults,
  searchSellersByCompanyNameOrIdentifier,
  isSellersSearchLoading,
  onFilterChange,
}: UseInvoiceReportFilterFormProps) => {
  // Get URL parameters to initialize form with current values
  const { searchParams, resetSearchParams } = useInvoiceReportQueryParams();

  // Create enhanced sellersCompanySearchResults that includes URL param if not found
  const enhancedSellersResults = useMemo(() => {
    if (searchParams.senderIdentifier) {
      const existingSeller = sellersCompanySearchResults.find((s) => s.Identifier === searchParams.senderIdentifier);
      if (!existingSeller) {
        // Create a temporary entry for the URL param value
        return [
          ...sellersCompanySearchResults,
          {
            Id: -1, // Temporary ID
            Identifier: searchParams.senderIdentifier,
            CompanyName: `Loading... (${searchParams.senderIdentifier})`, // Temporary name
          },
        ];
      }
    }
    return sellersCompanySearchResults;
  }, [sellersCompanySearchResults, searchParams.senderIdentifier]);

  // Initialize with values from URL params or default values
  const initialValues: FormData = {
    receiverIdentifier: searchParams.receiverIdentifier || '',
    senderIdentifier: searchParams.senderIdentifier
      ? (() => {
          const seller = enhancedSellersResults.find((s) => s.Identifier === searchParams.senderIdentifier);
          return seller
            ? {
                value: seller.Identifier,
                label: `${seller.CompanyName || '-'} / ${seller.Identifier}`,
              }
            : searchParams.senderIdentifier; // fallback to string if seller not found yet
        })()
      : '',
    notifyBuyer: searchParams.notifyBuyer ?? 1, // Use nullish coalescing to allow 0
    type: searchParams.type || '', // InvoiceType.All
    SourceType: searchParams.SourceType || '',
    availableType: searchParams.availableType || '',
    isDeleted: searchParams.isDeleted || '0', // DeletedStatus.No
    status: searchParams.status ?? 1, // Use nullish coalescing to allow 0
    profileId: searchParams.profileId || '', // ProfileIdType.All
    currencyId: searchParams.currencyId ?? 1, // Use nullish coalescing to allow 0
    startDate: searchParams.startDate || '',
    endDate: searchParams.endDate || '',
    invoiceNumber: searchParams.invoiceNumber || '',
    serialNumber: searchParams.serialNumber || '',
    sequenceNumber: searchParams.sequenceNumber || '',
  };

  // Form schema following OperationPricing pattern exactly
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      // Seller identifier with AsyncAutoComplete
      senderIdentifier: (() => {
        return fields
          .asyncAutoComplete(
            enhancedSellersResults,
            'string',
            ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
            searchSellersByCompanyNameOrIdentifier,
            isSellersSearchLoading,
            3, // minimum search length
          )
          .label('Satıcı VKN')
          .meta({ col: 2 });
      })(),

      notifyBuyer: fields
        .select(notifyBuyerOptions, 'number', ['value', 'label'])
        .label('Bildirim Tipi')
        .meta({ col: 2 }),

      SourceType: fields
        .select(invoiceSourceTypes, 'string', ['Value', 'Description'])
        .label('Fatura Yüklenme Yeri')
        .meta({ col: 2, showSelectOption: true }),

      type: fields
        .select(invoiceTypeOptions, 'string', ['value', 'label'])
        .label('Fatura Tipi')
        .meta({ col: 2, showSelectOption: true }),

      // Buyer identifier with select dropdown
      receiverIdentifier: fields
        .autoComplete(buyersList, 'string', ['Identifier', 'CompanyName'])
        .label('Alıcı VKN')
        .meta({ col: 2, placeholder: 'Ara' }),

      // Notification type

      // Usage status
      availableType: fields
        .select(usingStatusOptions, 'string', ['id', 'name'])
        .label('Kullanım Durumu')
        .meta({ col: 2, showSelectOption: true, showSelectOptionText: 'Hepsi' }),
      invoiceNumber: fields.text.label('E-Fatura No').meta({ col: 2 }),
      serialNumber: fields.text.label('Seri No').meta({ col: 2 }),
      sequenceNumber: fields.text.label('Sıra No').meta({ col: 2 }),
      // Invoice source type

      // Invoice type

      // Profile type (conditional - only shown for e-invoices)
      profileId: fields
        .select(profileIdOptions, 'string', ['value', 'label'])
        .label('Profil Tipi')
        .meta({ col: 2, visible: false }), // Will be controlled by form state
      // Invoice numbers

      // Date range
      startDate: fields.date.label('Başlangıç Tarihi').meta({ col: 2 }),
      endDate: fields.date.label('Bitiş Tarihi').meta({ col: 2 }),

      // Status and currency
      status: fields.select(invoiceStatusOptions, 'number', ['value', 'label']).label('Fatura Durumu').meta({ col: 2 }),

      isDeleted: fields.select(deleteStatusOptions, 'string', ['value', 'label']).label('Silinmiş Mi').meta({ col: 2 }),

      currencyId: fields
        .select(currencies, 'number', ['Id', 'Code'])
        .label('Para Birimi')
        .nullable()
        .optional()
        .meta({ col: 2, showSelectOption: true }),
    };

    return yup.object(baseFields);
  }, [
    buyersList,
    currencies,
    invoiceSourceTypes,
    usingStatusOptions,
    invoiceTypeOptions,
    deleteStatusOptions,
    notifyBuyerOptions,
    invoiceStatusOptions,
    profileIdOptions,
    enhancedSellersResults,
    searchSellersByCompanyNameOrIdentifier,
    isSellersSearchLoading,
  ]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Trigger search for senderIdentifier when URL params change and seller is not found yet
  useEffect(() => {
    if (searchParams.senderIdentifier && sellersCompanySearchResults.length === 0) {
      // If we have a senderIdentifier from URL but no search results yet, trigger search
      searchSellersByCompanyNameOrIdentifier(searchParams.senderIdentifier);
    }
  }, [searchParams.senderIdentifier, sellersCompanySearchResults.length, searchSellersByCompanyNameOrIdentifier]);

  // Update form values when URL parameters change
  useEffect(() => {
    const newValues: FormData = {
      receiverIdentifier: searchParams.receiverIdentifier || '',
      senderIdentifier: searchParams.senderIdentifier
        ? (() => {
            const seller = enhancedSellersResults.find((s) => s.Identifier === searchParams.senderIdentifier);

            return seller
              ? {
                  value: seller.Identifier,
                  label: `${seller.CompanyName || '-'} / ${seller.Identifier}`,
                }
              : searchParams.senderIdentifier; // fallback to string if seller not found yet
          })()
        : '',
      notifyBuyer: searchParams.notifyBuyer ?? 1, // Use nullish coalescing to allow 0
      type: searchParams.type || '',
      SourceType: searchParams.SourceType || '',
      availableType: searchParams.availableType || '',
      isDeleted: searchParams.isDeleted || '0',
      status: searchParams.status ?? 1, // Use nullish coalescing to allow 0
      profileId: searchParams.profileId || '',
      currencyId: searchParams.currencyId ?? 1, // Use nullish coalescing to allow 0
      startDate: searchParams.startDate || '',
      endDate: searchParams.endDate || '',
      invoiceNumber: searchParams.invoiceNumber || '',
      serialNumber: searchParams.serialNumber || '',
      sequenceNumber: searchParams.sequenceNumber || '',
    };

    form.reset(newValues);
  }, [searchParams, form, enhancedSellersResults]);

  // TODO: Profile field visibility will be handled by conditional logic in the form

  // Handle search - transforms form data and calls onFilterChange
  const handleSearch = () => {
    const formData = form.getValues();

    // Extract senderIdentifier value (could be object or string)
    const senderIdentifierValue =
      typeof formData.senderIdentifier === 'object' && formData.senderIdentifier !== null
        ? formData.senderIdentifier.value
        : formData.senderIdentifier;

    // Transform form data to API filter format
    const filters: Record<string, unknown> = {
      receiverIdentifier: formData.receiverIdentifier || undefined,
      senderIdentifier: senderIdentifierValue || undefined,
      notifyBuyer: formData.notifyBuyer,
      type: formData.type || undefined,
      SourceType: formData.SourceType || undefined,
      availableType: formData.availableType || undefined,
      isDeleted: formData.isDeleted,
      status: formData.status,
      profileId: formData.profileId || undefined,
      currencyId: formData.currencyId,
      // Fix date handling - format dates as strings and use undefined for empty dates
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString().split('T')[0] // Format as YYYY-MM-DD
        : undefined,
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString().split('T')[0] // Format as YYYY-MM-DD
        : undefined,
      invoiceNumber: formData.invoiceNumber || undefined,
      serialNumber: formData.serialNumber || undefined,
      sequenceNumber: formData.sequenceNumber || undefined,
    };

    onFilterChange(filters);
  };

  // Handle reset - clear form and filters
  const handleReset = () => {
    form.reset(initialValues);
    onFilterChange({});
    resetSearchParams();
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
    // Dropdown options for components
    dropdownOptions: {
      usingStatusOptions,
      invoiceTypeOptions,
      deleteStatusOptions,
      notifyBuyerOptions,
      invoiceStatusOptions,
      profileIdOptions,
      invoiceSourceTypes,
      currencies,
      buyersList,
    },
  };
};

export default useInvoiceReportFilterForm;
