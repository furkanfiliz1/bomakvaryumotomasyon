/**
 * Opportunity Filter Form Hook
 * Following LeadManagement pattern (useLeadFilterForm.ts) and forms.instructions.md
 *
 * Key Features:
 * - Schema-based field definitions with Yup validation
 * - Reactive form state with React Hook Form
 * - Dropdown data integration
 * - Server-side pagination and filtering
 * - Date range filtering
 *
 * Reference Implementation: pages/Companies/LeadManagement/hooks/useLeadFilterForm.ts
 * Documentation: .github/instructions/forms.instructions.md
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { OpportunityFilterFormData } from '../opportunity-management.types';
import { useOpportunityDropdownData } from './useOpportunityDropdownData';

interface UseOpportunityFilterFormOptions {
  onFilterChange?: (data: Partial<OpportunityFilterFormData>) => void;
}

/**
 * Custom hook for managing opportunity filter form state and validation
 * Matches OpportunitySearchRequestModel from API specification
 */
function useOpportunityFilterForm(options?: UseOpportunityFilterFormOptions) {
  // Fetch dropdown data for filters
  const {
    customerManagerList,
    productTypeList,
    receiverList,
    statusOptions,
    winningStatusOptions,
    salesScenarioOptions,
  } = useOpportunityDropdownData();

  // Initial form values
  const initialValues = {
    subject: '',
    receiverName: '',
    createdAtStart: '',
    createdAtEnd: '',
    statusDescription: undefined as string | undefined,
    productType: undefined as number | undefined,
    receiverId: undefined as number | undefined,
    customerManagerId: undefined as number | undefined,
    winningStatus: undefined as string | undefined,
    salesScenario: undefined as string | undefined,
  };

  /**
   * Form validation schema using Yup with meta information for rendering
   * Following forms.instructions.md patterns for field definitions
   * All fields are optional for filtering
   */
  const schema = useMemo(() => {
    return yup.object({
      // Subject field (text input)
      subject: fields.text.label('Konu').meta({
        col: 3,
      }),

      // Receiver Name field (text input)
      receiverName: fields.text.label('Alıcı Unvan').meta({
        col: 3,
      }),

      // Start Date field (date picker)
      createdAtStart: fields.date.optional().nullable().label('Oluşturulma Tarihi Başlangıç').meta({
        col: 3,
      }),

      // End Date field (date picker)
      createdAtEnd: fields.date
        .optional()
        .nullable()
        .label('Oluşturulma Tarihi Bitiş')
        .meta({
          col: 3,
        })
        .test('date-range', 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır', function (value) {
          const { createdAtStart } = this.parent;
          if (!createdAtStart || !value) return true;
          return new Date(value) >= new Date(createdAtStart);
        }),

      // Status dropdown (select)
      statusDescription: fields
        .select(statusOptions, 'string', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('Durum Açıklaması')
        .meta({
          col: 3,
          showSelectOption: true,
        }),

      // Product Type dropdown (select)
      productType: fields
        .select(productTypeList, 'number', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('İlgilendiği Ürün')
        .meta({
          col: 3,
          showSelectOption: true,
        }),

      // Receiver (Alıcı) dropdown (select)
      receiverId: fields
        .select(receiverList, 'number', ['Id', 'CompanyName'])
        .optional()
        .nullable()
        .label('Alıcı')
        .meta({
          col: 3,
          showSelectOption: true,
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

      // Winning Status dropdown (select) - Statü (Kazanıldı/Kaybedildi)
      winningStatus: fields
        .select(winningStatusOptions, 'string', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('Statü')
        .meta({
          col: 3,
          showSelectOption: true,
        }),

      // Sales Scenario dropdown (select)
      salesScenario: fields
        .select(salesScenarioOptions, 'string', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('Satış Senaryosu')
        .meta({
          col: 3,
          showSelectOption: true,
        }),
    });
  }, [customerManagerList, productTypeList, receiverList, statusOptions, winningStatusOptions, salesScenarioOptions]);

  // Initialize form with React Hook Form and Yup resolver
  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  /**
   * Internal function to transform and send filters
   */
  const applyFilters = (formData: Record<string, unknown>) => {
    if (options?.onFilterChange) {
      options.onFilterChange(formData as Partial<OpportunityFilterFormData>);
    }
  };

  /**
   * Handle search button click
   */
  const handleSearch = () => {
    const formData = form.getValues();
    applyFilters(formData);
  };

  /**
   * Handle reset button click
   */
  const handleReset = () => {
    form.reset(initialValues);
    applyFilters(initialValues);
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
  };
}

export default useOpportunityFilterForm;
