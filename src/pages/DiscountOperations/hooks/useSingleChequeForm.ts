import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSingleChequeSchema } from '../components/steps/single-cheque-form.schema.tsx';
import { SINGLE_CHEQUE_INITIAL_VALUES } from '../components/steps/single-cheque-form.types';
import { useGetBankBranchesQuery, useGetBanksQuery } from '../discount-operations.api';

/**
 * Custom hook for managing single cheque form
 * Following OperationPricing patterns with integrated dropdown data
 * Creates dynamic schema with dropdown options
 */
export const useSingleChequeForm = () => {
  const [selectedBankId, setSelectedBankId] = useState<number | undefined>(undefined);

  // Get banks data
  const { data: banksData, isLoading: banksLoading, error: banksError } = useGetBanksQuery();

  // Get bank branches data for selected bank
  const {
    data: branchesData,
    isLoading: branchesLoading,
    error: branchesError,
  } = useGetBankBranchesQuery({ BankId: selectedBankId!, pageSize: 999999 }, { skip: !selectedBankId });

  // Transform banks data for Select component
  const banksOptions = banksData
    ? banksData.map((bank) => ({
        id: bank.Id,
        name: `${bank.Name} (${bank.Code})`,
        code: bank.Code,
      }))
    : [];
  // Transform branches data for Select component
  const branchesOptions = branchesData?.Items
    ? branchesData.Items.map((branch) => ({
        id: branch.Id,
        name: `${branch.Name} (${branch.Code})`,
        code: branch.Code,
      }))
    : [];

  // Create schema with current options
  const schema = createSingleChequeSchema({
    banksOptions,
    branchesOptions,
  });

  // Create form
  const form = useForm({
    defaultValues: SINGLE_CHEQUE_INITIAL_VALUES,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange' as const,
  });

  // Helper function for form setValue
  const setFormValue = useCallback(
    (name: string, value: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form.setValue as any)(name, value);
    },
    [form],
  );

  // Watch bank selection and update selectedBankId
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'bankEftCode') {
        const newBankId = value.bankEftCode ? Number(value.bankEftCode) : undefined;
        if (newBankId !== selectedBankId) {
          setSelectedBankId(newBankId);
          // Clear branch selection when bank changes
          setFormValue('bankBranchEftCode', null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, selectedBankId, setFormValue]);

  return {
    form,
    schema,
    setFormValue,
    dropdownData: {
      banksOptions,
      banksLoading,
      banksError,
      branchesOptions,
      branchesLoading,
      branchesError,
      isLoading: banksLoading || branchesLoading,
      hasError: !!(banksError || branchesError),
    },
    selectedBankId,
  };
};
