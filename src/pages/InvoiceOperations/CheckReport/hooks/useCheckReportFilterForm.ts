import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { AnyObject } from 'yup';
import * as yup from 'yup';
import type { CheckReportFilters, CompanySearchResult } from '../check-report.types';

interface UseCheckReportFilterFormProps {
  bankList: { value: string; label: string }[];
  branchList: { value: string; label: string }[];
  companySearchResults: CompanySearchResult[];
  onFilterChange: (filters: Partial<CheckReportFilters>) => void;
  onBankChange: (bankId: string | null) => void;
  onCompanySearch: (searchTerm: string) => Promise<void>;
  isCompanySearchLoading: boolean;
}

/**
 * Hook to manage check report filter form
 * Follows OperationPricing pattern for form management
 */
export const useCheckReportFilterForm = ({
  bankList,
  branchList,
  companySearchResults,
  onFilterChange,
  onBankChange,
  onCompanySearch,
  isCompanySearchLoading,
}: UseCheckReportFilterFormProps) => {
  console.log('companySearchResults', companySearchResults);
  // Track if a bank is selected for disabling branch field
  const [isBankSelected, setIsBankSelected] = useState(false);

  // Create schema following exact legacy field structure
  const schema = useMemo(() => {
    return yup.object({
      senderIdentifier: fields
        .asyncAutoComplete(
          companySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          onCompanySearch,
          isCompanySearchLoading,
          3,
        )
        .label('Satıcı Ünvan / VKN')
        .meta({ col: 2, placeholder: 'VKN/Ünvan arayın...' }),
      drawerIdentifier: fields.text.label('Keşideci VKN/TCKN').meta({ col: 2 }),
      drawerName: fields.text.label('Keşideci Adı').meta({ col: 2 }),
      PlaceOfIssue: fields.text.label('Keşide Yeri').meta({ col: 2 }),
      bankEftCode: fields.select(bankList, 'string', ['value', 'label']).label('Banka Adı').meta({ col: 2 }),
      bankBranchEftCode: fields
        .select(branchList, 'string', ['value', 'label'])
        .label('Banka Şubesi')
        .meta({ col: 2, disabled: !isBankSelected }),
      no: fields.text.label('Çek No').meta({ col: 2 }),
      chequeAccountNo: fields.text.label('Çek Hesap No').meta({ col: 2 }),
      minPayableAmount: fields.number.label('Çek Minimum Tutarı').meta({ col: 2 }),
      maxPayableAmount: fields.number.label('Çek Maksimum Tutarı').meta({ col: 2 }),
      minPaymentDate: fields.date.label('Çek Ödeme Tarihi Başlangıç').meta({ col: 2 }),
      maxPaymentDate: fields.date.label('Çek Ödeme Tarihi Bitiş').meta({ col: 2 }),
    });
  }, [bankList, branchList, isBankSelected, companySearchResults, isCompanySearchLoading, onCompanySearch]);

  const defaultValues = {
    senderIdentifier: '',
    drawerIdentifier: '',
    drawerName: '',
    PlaceOfIssue: '',
    bankEftCode: '',
    bankBranchEftCode: '',
    no: '',
    chequeAccountNo: '',
    minPayableAmount: undefined,
    maxPayableAmount: undefined,
    minPaymentDate: '',
    maxPaymentDate: '',
  };

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  // Watch bank selection to enable/disable branch field
  useEffect(() => {
    const subscription = form.watch((value) => {
      const bankValue = value.bankEftCode;
      setIsBankSelected(!!bankValue && bankValue !== '');
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSearch = () => {
    const formData = form.getValues();
    onFilterChange(formData as Partial<CheckReportFilters>);
  };

  const handleReset = () => {
    form.reset(defaultValues);
    onFilterChange(defaultValues);
    onBankChange(null); // Reset bank selection to clear branches
  };

  const handleBankChange = (bankId: string) => {
    // Reset branch selection when bank changes
    form.setValue('bankBranchEftCode', '');
    onBankChange(bankId || null);
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
    handleBankChange,
  };
};
