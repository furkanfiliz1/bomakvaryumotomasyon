/**
 * Lead Filter Form Hook
 * Following OperationPricing pattern (useOperationPricingFilterForm.ts) and forms.instructions.md
 *
 * Key Features:
 * - Schema-based field definitions with Yup validation
 * - Reactive form state with React Hook Form
 * - URL query parameter synchronization
 * - Dropdown data integration (customer managers, channels, product types, call results)
 * - Server-side pagination and filtering
 * - Date range filtering with sensible defaults
 *
 * Reference Implementation: pages/Pricing/OperationPricing/hooks/useOperationPricingFilterForm.ts
 * Documentation: .github/instructions/forms.instructions.md
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { LeadFilterFormData } from '../lead-management.types';
import { useLeadDropdownData } from './useLeadDropdownData';

interface UseLeadFilterFormOptions {
  onFilterChange?: (data: Partial<LeadFilterFormData>) => void;
}

/**
 * Custom hook for managing lead filter form state and validation
 * Matches LeadSearchRequestModel from API specification
 */
function useLeadFilterForm(options?: UseLeadFilterFormOptions) {
  // Fetch dropdown data for filters
  const { customerManagerList, leadingChannelList, productTypeList, callResultList, membershipOptions } =
    useLeadDropdownData();

  // Initial form values - matching LeadSearchRequestModel (camelCase)
  const initialValues = {
    companyName: '',
    taxNumber: '',
    customerManagerId: undefined as number | undefined,
    channelCode: undefined as string | undefined,
    productType: undefined as number | undefined,
    callResult: undefined as number | undefined,
    membershipCompleted: undefined as number | undefined, // Will hold boolean id from select (true/false)
    startDate: '',
    endDate: '',
  };

  /**
   * Form validation schema using Yup with meta information for rendering
   * Following forms.instructions.md patterns for field definitions
   * All fields are optional for filtering (no required validations)
   */
  const schema = useMemo(() => {
    return yup.object({
      // Company Name field (text input)
      companyName: fields.text.label('Firma Ünvanı').meta({
        col: 3, // 4 columns per row = 3 cols each
      }),

      // Tax Number field (text input)
      taxNumber: fields.text.label('Vergi Kimlik No').meta({
        col: 3,
      }),

      // Customer Manager dropdown (select)
      customerManagerId: fields
        .select(customerManagerList, 'number', ['Id', 'FullName'])
        .optional()
        .nullable()
        .label('Müşteri Temsilcisi')
        .meta({
          col: 3,
          showSelectOption: true,
        }),

      // Leading Channel dropdown (select)
      channelCode: fields
        .select(leadingChannelList, 'string', ['Id', 'Value'])
        .optional()
        .nullable()
        .label('Kanal Kodu')
        .meta({
          col: 3,
          showSelectOption: true,
        }),

      // Product Type dropdown (select)
      productType: fields
        .select(productTypeList, 'number', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('Ürün Tipi')
        .meta({
          col: 3,
          showSelectOption: true,
        }),

      // Call Result dropdown (select) - matches LeadCallResultStatus enum
      callResult: fields
        .select(callResultList, 'number', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('Arama Sonucu')
        .meta({
          col: 3,
          showSelectOption: true,
        }),

      // Membership Status dropdown (select) - boolean values (true/false)
      membershipCompleted: fields
        .select(membershipOptions, 'number', ['id', 'name'])
        .optional()
        .nullable()
        .label('Üyelik Durumu')
        .meta({
          col: 3,
          showSelectOption: true,
        }),

      // Start Date field (date picker) - optional for filtering
      startDate: fields.date.optional().nullable().label('Başlangıç Tarihi').meta({
        col: 3,
      }),

      // End Date field (date picker) - optional for filtering
      endDate: fields.date
        .optional()
        .nullable()
        .label('Bitiş Tarihi')
        .meta({
          col: 3,
        })
        .test('date-range', 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır', function (value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return true;
          return new Date(value) >= new Date(startDate);
        }),
    });
  }, [customerManagerList, leadingChannelList, productTypeList, callResultList, membershipOptions]);

  // Initialize form with React Hook Form and Yup resolver
  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange', // Validate on change for better UX
  });

  /**
   * Internal function to transform and send filters
   */
  const applyFilters = (formData: Record<string, unknown>) => {
    // Transform form data to API filter format - following ScoreInvoiceReports pattern

    // Trigger callback with transformed filters
    if (options?.onFilterChange) {
      options.onFilterChange(formData);
    }
  }; /**
   * Handle search button click
   * Transforms form data to filter format and triggers callback
   */
  const handleSearch = () => {
    const formData = form.getValues();
    applyFilters(formData);
  };

  /**
   * Handle reset button click
   * Resets form to initial values and triggers search with cleared filters
   */
  const handleReset = () => {
    form.reset(initialValues);

    // Pass initial values directly to ensure cleared filters are sent
    // This avoids race condition where form.getValues() might return old values
    applyFilters(initialValues);
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
  };
}

export default useLeadFilterForm;
