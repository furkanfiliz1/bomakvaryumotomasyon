import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { fields } from 'src/components/common/Form/schemas/_common';
import type { AnyObject } from 'src/components/common/Form/types';
import * as yup from 'yup';
import { processFilterParams } from '../helpers/integration-reports.helpers';
import type { IntegrationReportsFilters } from '../integration-reports.types';
import { useIntegrationReportsDropdownData } from './useIntegrationReportsDropdownData';

interface UseIntegrationReportsFilterFormProps {
  onFilterChange: (filters: Partial<IntegrationReportsFilters>) => void;
}

// Hook for managing Integration Reports filter form
// Following OperationPricing filter form pattern exactly with async autocomplete
function useIntegrationReportsFilterForm({ onFilterChange }: UseIntegrationReportsFilterFormProps) {
  // Get dropdown data including async search functions
  const {
    sellersCompanySearchResults,
    financiersCompanySearchResults,
    searchSellersByCompanyNameOrIdentifier,
    searchFinanciersByCompanyNameOrIdentifier,
    isSellersSearchLoading,
    isFinanciersSearchLoading,
  } = useIntegrationReportsDropdownData();

  // Initialize with current date like legacy system
  const today = new Date().toISOString().split('T')[0];

  const initialValues = useMemo(
    () => ({
      AllowanceId: '',
      CompanyIdentifier: '',
      SenderIdentifier: '',
      StartDate: today,
      EndDate: today,
    }),
    [today],
  );

  // Form schema with async autocomplete fields for VKN searches
  const schema = useMemo(() => {
    return yup.object({
      AllowanceId: fields.text.label('İskonto No').meta({ col: 2 }),
      CompanyIdentifier: fields
        .asyncAutoComplete(
          financiersCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchFinanciersByCompanyNameOrIdentifier,
          isFinanciersSearchLoading,
          3,
        )
        .label('Finansör VKN')
        .meta({ col: 3, placeholder: 'VKN/Ünvan arayın...' }),
      SenderIdentifier: fields
        .asyncAutoComplete(
          sellersCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchSellersByCompanyNameOrIdentifier,
          isSellersSearchLoading,
          3,
        )
        .label('Tedarikçi VKN')
        .meta({ col: 3, placeholder: 'VKN/Ünvan arayın...' }),
      StartDate: fields.date.required('Başlangıç tarihi zorunludur').label('Başlangıç Tarihi').meta({ col: 2 }),
      EndDate: fields.date.required('Bitiş tarihi zorunludur').label('Bitiş Tarihi').meta({ col: 2 }),
    });
  }, [
    financiersCompanySearchResults,
    sellersCompanySearchResults,
    searchFinanciersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isFinanciersSearchLoading,
    isSellersSearchLoading,
  ]);

  // Form setup - let yup schema define the type
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  // Handle search - matches legacy applyFilter
  const handleSearch = useCallback(() => {
    const formData = form.getValues();

    // Convert async autocomplete values to strings as expected by API
    const companyIdentifier = formData.CompanyIdentifier ? String(formData.CompanyIdentifier) : undefined;
    const senderIdentifier = formData.SenderIdentifier ? String(formData.SenderIdentifier) : undefined;

    const processedFilters = processFilterParams({
      AllowanceId: formData.AllowanceId,
      CompanyIdentifier: companyIdentifier,
      SenderIdentifier: senderIdentifier,
      StartDate: formData.StartDate,
      EndDate: formData.EndDate,
      Page: 1, // Reset to first page on new search
      PageSize: 25,
    });

    onFilterChange(processedFilters);
  }, [form, onFilterChange]);

  // Handle clear - reset form to initial values and clear filters
  const handleClear = useCallback(() => {
    form.reset(initialValues);

    // Send all initial values directly to override all previous parameters - DO NOT process them
    const clearedFilters: Partial<IntegrationReportsFilters> = {
      AllowanceId: '',
      CompanyIdentifier: undefined,
      SenderIdentifier: undefined,
      StartDate: today,
      EndDate: today,
      Page: 1,
      PageSize: 25,
    };

    onFilterChange(clearedFilters);
  }, [form, onFilterChange, initialValues, today]);

  return {
    form,
    schema,
    handleSearch,
    handleClear,
  };
}

export default useIntegrationReportsFilterForm;
