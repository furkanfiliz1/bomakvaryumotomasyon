import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type {
  BankListItem,
  BuyerLimitReportsAPIFilters,
  BuyerLimitReportsFilterForm,
  BuyerListItem,
  UseBuyerLimitReportsFilterForm,
} from '../buyer-limit-reports.types';

interface UseBuyerLimitReportsFilterFormProps {
  bankList: BankListItem[];
  buyerList: BuyerListItem[];
  onFilterChange?: (filters: Partial<BuyerLimitReportsAPIFilters>) => void;
  onBankChange?: (bankId: number) => void;
}

export const useBuyerLimitReportsFilterForm = ({
  bankList,
  buyerList,
  onFilterChange,
  onBankChange,
}: UseBuyerLimitReportsFilterFormProps): UseBuyerLimitReportsFilterForm => {
  // Create schema using fields.select pattern following OperationPricing and other modules
  const schema = useMemo(() => {
    // Add default "Seçiniz" option to dropdown lists with combined display format
    const bankOptions = [
      ...bankList.map((bank) => ({
        ...bank,
        DisplayName: `${bank.Identifier} - ${bank.CompanyName}`,
      })),
    ];

    // Convert buyer IDs to strings for form compatibility and add combined display format
    const buyerOptions = [
      ...buyerList.map((buyer) => ({
        ...buyer,
        Id: buyer.Id.toString(),
        DisplayName: buyer.Identifier ? `${buyer.Identifier} - ${buyer.Name}` : buyer.Name,
      })),
    ];

    return yup.object({
      financerIdentifier: fields
        .select(bankOptions, 'string', ['Identifier', 'DisplayName'])
        .required('Finansör seçimi zorunludur')
        .label('Finansör')
        .meta({ col: 6, showSelectOption: true }),
      companyId: fields
        .select(buyerOptions, 'string', ['Id', 'DisplayName'])
        .required('Alıcı seçimi zorunludur')
        .label('Alıcı')
        .meta({ col: 6, showSelectOption: true }),
    });
  }, [bankList, buyerList]);

  // Initialize form - default values matching legacy state
  const form = useForm<BuyerLimitReportsFilterForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      financerIdentifier: '',
      companyId: '',
    },
    mode: 'onChange',
  });

  // Force form to revalidate when buyer list changes to ensure dropdown updates
  useEffect(() => {
    if (buyerList.length > 0) {
      // Trigger form revalidation to ensure new buyer options are recognized
      form.trigger('companyId');
    }
  }, [buyerList, form]);

  // Watch for bank selection changes and trigger buyer loading
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'financerIdentifier' && values.financerIdentifier && onBankChange) {
        // Find the selected bank and get its ID
        const selectedBank = bankList.find((bank) => bank.Identifier === values.financerIdentifier);
        if (selectedBank) {
          // Clear buyer selection when bank changes
          form.setValue('companyId', '');
          // Trigger buyer loading
          onBankChange(selectedBank.Id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, bankList, onBankChange]);

  // Handle form submission - matching legacy getBankBuyerReport
  const handleSearch = useCallback(() => {
    const isValid = form.formState.isValid;
    const values = form.getValues();

    if (isValid && onFilterChange) {
      // Convert companyId to number for API call like legacy
      onFilterChange({
        financerIdentifier: values.financerIdentifier,
        companyId: values.companyId ? Number(values.companyId) : 0,
      });
    }
  }, [form, onFilterChange]);

  // Handle form reset - matching legacy clearance logic
  const handleReset = useCallback(() => {
    const defaultValues: BuyerLimitReportsFilterForm = {
      financerIdentifier: '',
      companyId: '',
    };

    form.reset(defaultValues);

    if (onFilterChange) {
      onFilterChange({
        financerIdentifier: '',
        companyId: 0,
      });
    }
  }, [form, onFilterChange]);

  return {
    form,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: schema as any,
    handleSearch,
    handleReset,
    isValid: form.formState.isValid,
  };
};
