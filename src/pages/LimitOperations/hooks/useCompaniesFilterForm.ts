import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { fields } from '@components';
import { useFilterFormWithUrlSync } from '@hooks';
import type { CompaniesFilterFormData, CompaniesScoringParams } from '../limit-operations.types';
import { useCompaniesDropdownData } from './useCompaniesDropdownData';

interface UseCompaniesFilterFormProps {
  onFilterChange: (filters: Partial<CompaniesScoringParams>) => void;
}

export const useCompaniesFilterForm = ({ onFilterChange }: UseCompaniesFilterFormProps) => {
  const { dropdownData } = useCompaniesDropdownData();

  const defaultValues: CompaniesFilterFormData = useMemo(
    () => ({
      companyName: undefined,
      identifier: undefined,
      integratorId: undefined,
      invoiceTransferIsActive: undefined,
      isRisk: undefined,
      LeadingChannelId: undefined,
      limitStatus: undefined,
      onboardingStatusTypes: undefined,
      earlyWarningStatus: undefined,
      fibabankaGuaranteeRate: undefined,
      userIds: undefined,
    }),
    [],
  );

  const schema = useMemo(
    () =>
      yup.object().shape({
        companyName: fields.text.optional().label('Unvan').meta({ col: 2 }),
        identifier: fields.text.optional().label('VKN').meta({ col: 2 }).nullable(),
        integratorId: fields
          .select(dropdownData?.integrators || [], 'string', ['Id', 'Name'])
          .optional()
          .nullable()
          .label('Entegratör')
          .meta({ col: 2, showSelectOption: true, showSelectOptionText: 'Hepsi' }),
        onboardingStatusTypes: fields
          .select(dropdownData.companyStatuses, 'string', ['Value', 'Description'])
          .optional()
          .nullable()
          .label('Statü')
          .meta({ col: 2, showSelectOption: true }),
        invoiceTransferIsActive: fields
          .select(dropdownData.invoiceTransferStatuses, 'string', ['value', 'label'])
          .optional()
          .nullable()
          .label('Fatura Aktarımı')
          .meta({ col: 2, showSelectOption: true, showSelectOptionText: 'Hepsi' }),
        isRisk: fields
          .select(dropdownData.riskStatuses, 'string', ['value', 'label'])
          .optional()
          .nullable()
          .label('Risk Durumu')
          .meta({ col: 2, showSelectOption: true, showSelectOptionText: 'Hepsi' }),
        LeadingChannelId: fields
          .select(dropdownData.leadingChannels, 'string', ['Id', 'Value'])
          .optional()
          .nullable()
          .label('Geliş Kanalı')
          .meta({ col: 2, showSelectOption: true }),
        limitStatus: fields
          .select(dropdownData.limitStatuses, 'string', ['value', 'label'])
          .optional()
          .nullable()
          .label('Limit Aktiflik Durumu')
          .meta({ col: 2, showSelectOption: true, showSelectOptionText: 'Hepsi' }),

        earlyWarningStatus: fields
          .select(dropdownData.earlyWarningStatuses, 'string', ['Value', 'Description'])
          .optional()
          .nullable()
          .label('Erken Uyarı Durumu')
          .meta({ col: 2, showSelectOption: true }),
        fibabankaGuaranteeRate: fields
          .select(dropdownData.fibabankaGuaranteeRates, 'string', ['Value', 'Description'])
          .optional()
          .nullable()
          .label('Figopara Garantörlük Oranı (Fibabanka)')
          .meta({ col: 2, showSelectOption: true }),
        userIds: fields
          .multipleSelect(dropdownData.customerManagers, 'number', ['Id', 'FullName'])
          .optional()
          .nullable()
          .label('Müşteri Temsilcisi')
          .meta({ col: 2 }),
      }),
    [dropdownData],
  ) as yup.ObjectSchema<CompaniesFilterFormData>;

  const form = useForm<CompaniesFilterFormData>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Transform form data to API filter format
  const transformToApiFilters = (data: CompaniesFilterFormData): Partial<CompaniesScoringParams> => {
    return {
      companyName: data.companyName || undefined,
      identifier: data.identifier || undefined,
      integratorId: data.integratorId || undefined,
      invoiceTransferIsActive: data.invoiceTransferIsActive || undefined,
      isRisk: data.isRisk || undefined,
      LeadingChannelId: data.LeadingChannelId || undefined,
      limitStatus: data.limitStatus || undefined,
      onboardingStatusTypes: data.onboardingStatusTypes || undefined,
      earlyWarningStatus: data.earlyWarningStatus || undefined,
      fibabankaGuaranteeRate: data.fibabankaGuaranteeRate || undefined,
      userIds: data.userIds && data.userIds.length > 0 ? data.userIds : undefined,
    };
  };

  // Use the generic useFilterFormWithUrlSync hook for URL sync
  const { handleApply, handleReset: resetFormWithUrlSync } = useFilterFormWithUrlSync<
    CompaniesFilterFormData,
    Partial<CompaniesScoringParams>
  >({
    form,
    onFilterChange,
    transformToApiFilters,
    updateUrlParams: true,
  });

  const handleReset = () => {
    resetFormWithUrlSync(defaultValues);
  };

  return {
    form,
    schema,
    handleSearch: handleApply,
    handleReset,
  };
};
