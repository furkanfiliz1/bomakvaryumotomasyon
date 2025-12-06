import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetBankBranchessQuery, useGetBanksQuery } from '../check-report.api';
import type { BankOption, BranchOption, CheckReportItem } from '../check-report.types';
import type { BillReferenceEndorser, CheckEditFormData } from '../helpers/check-edit-form.schema';
import { createCheckEditFormSchema, DEFAULT_CHECK_EDIT_FORM } from '../helpers/check-edit-form.schema';

interface UseCheckEditFormProps {
  checkData?: CheckReportItem;
  onSubmit: (data: CheckEditFormData) => void;
  banksData?: BankOption[];
  branchesData?: BranchOption[];
}

// Simple translation function for required messages
const t = (key: string) => {
  switch (key) {
    case 'REQUIRED':
      return 'Zorunlu';
    default:
      return key;
  }
};

/**
 * Hook for managing check edit form state and validation
 * Following OperationPricing form patterns with dropdown data integration
 */
export const useCheckEditForm = ({ checkData, onSubmit, banksData = [], branchesData = [] }: UseCheckEditFormProps) => {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  // Use passed data instead of fetching internally (keeping the old queries for backward compatibility)
  const { data: internalBanksData } = useGetBanksQuery();
  const { data: internalBranchesData } = useGetBankBranchessQuery(selectedBankId!, {
    skip: !selectedBankId,
  });

  // Transform banks data to options format - use passed data if available, otherwise fall back to internal
  const bankList = useMemo(() => {
    const dataToUse = banksData.length > 0 ? banksData : internalBanksData || [];
    return dataToUse;
  }, [banksData, internalBanksData]);

  // Transform branches data to options format - use passed data if available, otherwise fall back to internal
  const branchList = useMemo(() => {
    const dataToUse = branchesData.length > 0 ? branchesData : internalBranchesData?.Items || [];
    return dataToUse;
  }, [branchesData, internalBranchesData]);

  // Create schema with current dropdown data
  const schema = useMemo(() => createCheckEditFormSchema(bankList, branchList, t), [bankList, branchList]);

  // Create form with validation
  const form = useForm<CheckEditFormData>({
    defaultValues: DEFAULT_CHECK_EDIT_FORM,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  // Transform API data to form data format
  const transformCheckDataToForm = useCallback(
    (check: CheckReportItem): CheckEditFormData => {
      // Find matching bank and branch IDs for the codes (API returns codes, form needs IDs)
      console.log('transformCheckDataToForm - Finding bank/branch:', {
        checkBankEftCode: check.BankEftCode,
        checkBankBranchEftCode: check.BankBranchEftCode,
        bankListLength: bankList.length,
        branchListLength: branchList.length,
        firstBank: bankList[0],
        firstBranch: branchList[0],
      });
      const selectedBank = bankList.find((bank) => bank.Code === check.BankEftCode);
      const selectedBranch = branchList.find((branch) => branch.Code === check.BankBranchEftCode);
      console.log('transformCheckDataToForm - Found:', { selectedBank, selectedBranch });

      // Handle billReferenceEndorsersList - map from ReferenceEndorsers (API response)
      let billReferenceEndorsersList: BillReferenceEndorser[] = [];
      if (check.ReferenceEndorsers && Array.isArray(check.ReferenceEndorsers)) {
        billReferenceEndorsersList = check.ReferenceEndorsers.map((endorser, index) => ({
          id: `endorser-${index}-${Date.now()}`,
          endorserIdentifier: endorser.EndorserIdentifier || '',
        }));
      }

      // Ensure at least one empty entry exists
      if (billReferenceEndorsersList.length === 0) {
        billReferenceEndorsersList = [{ id: `default-${Date.now()}`, endorserIdentifier: '' }];
      }

      return {
        drawerName: check.DrawerName || '',
        drawerIdentifier: check.DrawerIdentifier || '',
        placeOfIssue: check.PlaceOfIssue || '',
        bankEftCode: selectedBank?.Id || '',
        bankBranchEftCode: selectedBranch?.Id || '',
        no: check.No || '',
        chequeAccountNo: check.ChequeAccountNo || '',
        payableAmount: check.PayableAmount || 0,
        paymentDueDate: check.PaymentDueDate ? new Date(check.PaymentDueDate) : null,
        endorserName: check.EndorserName || '',
        endorserIdentifier: check.EndorserIdentifier || '',
        referenceEndorserName: check.ReferenceEndorserName || '',
        referenceEndorserIdentifier: check.ReferenceEndorserIdentifier || '',
        billReferenceEndorsersList,
      };
    },
    [bankList, branchList],
  );

  // Transform form data to API request format (matching curl request structure)
  const transformFormDataToApiRequest = useCallback(
    (formData: CheckEditFormData) => {
      // Transform billReferenceEndorsersList to API format
      const billReferenceEndorsersListPush: Array<{ endorserIdentifier: string }> = [];
      if (formData.billReferenceEndorsersList) {
        formData.billReferenceEndorsersList.forEach((endorser) => {
          if (endorser.endorserIdentifier && endorser.endorserIdentifier.trim()) {
            billReferenceEndorsersListPush.push({
              endorserIdentifier: endorser.endorserIdentifier.trim(),
            });
          }
        });
      }
      console.log('formData.bankEftCode', formData.bankEftCode, typeof formData.bankEftCode);
      console.log('formData.bankBranchEftCode', formData.bankBranchEftCode, typeof formData.bankBranchEftCode);
      console.log('bankList sample:', bankList[0]?.Id, typeof bankList[0]?.Id);
      console.log('branchList sample:', branchList[0]?.Id, typeof branchList[0]?.Id);
      // Find bank and branch data from the dropdown data (form has IDs, API needs codes)
      // Use string comparison to handle type mismatches
      const selectedBank = bankList.find((bank) => String(bank.Id) === String(formData.bankEftCode));
      const selectedBranch = branchList.find((branch) => String(branch.Id) === String(formData.bankBranchEftCode));
      console.log('selectedBank', selectedBank);
      console.log('selectedBranch', selectedBranch);
      console.log('Transform debug:', {
        formBankEftCode: formData.bankEftCode,
        formBankBranchEftCode: formData.bankBranchEftCode,
        bankListLength: bankList.length,
        branchListLength: branchList.length,
        selectedBank,
        selectedBranch,
        bankCode: selectedBank?.Code,
        branchCode: selectedBranch?.Code,
      });
      return {
        drawerName: formData.drawerName,
        drawerIdentifier: formData.drawerIdentifier,
        placeOfIssue: formData.placeOfIssue,
        bankEftCode: selectedBank?.Code || formData.bankEftCode || '', // Send bank code to API
        bankBranchEftCode: selectedBranch?.Code || formData.bankBranchEftCode || '', // Send branch code to API
        bankName: selectedBank?.Name || '',
        bankBranchName: selectedBranch?.Name || '',
        no: formData.no,
        chequeAccountNo: formData.chequeAccountNo,
        payableAmount: formData.payableAmount,
        paymentDueDate: formData.paymentDueDate ? dayjs(formData.paymentDueDate).format('YYYY-MM-DD') : null,
        endorserName: formData.endorserName || undefined,
        endorserIdentifier: formData.endorserIdentifier || undefined,
        referenceEndorserName: formData.referenceEndorserName || undefined,
        referenceEndorserIdentifier: formData.referenceEndorserIdentifier || undefined,
        billReferenceEndorsersList: billReferenceEndorsersListPush,
      };
    },
    [bankList, branchList],
  );

  // Load initial data when check data is provided - avoid resetting when bankList changes
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (checkData && bankList.length > 0 && !isInitialized) {
      const formData = transformCheckDataToForm(checkData);
      form.reset(formData);

      // Load branches if bank is selected
      if (checkData.BankEftCode) {
        // Find bank by code and set ID for branch loading
        const selectedBank = bankList.find((bank) => bank.Code === checkData.BankEftCode);
        if (selectedBank) {
          setSelectedBankId(selectedBank.Id);
        }
      }
      setIsInitialized(true);
    }
  }, [checkData, form, transformCheckDataToForm, bankList, isInitialized]);

  // Reset initialization flag when checkData changes
  useEffect(() => {
    setIsInitialized(false);
  }, [checkData]);

  // Note: Bank change watching is handled in CheckEditModal to avoid conflicts

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data as CheckEditFormData);
  });

  // Handle form reset
  const handleReset = useCallback(() => {
    if (checkData) {
      const formData = transformCheckDataToForm(checkData);
      form.reset(formData);
    } else {
      form.reset(DEFAULT_CHECK_EDIT_FORM);
    }
  }, [checkData, form, transformCheckDataToForm]);

  return {
    form,
    schema,
    handleSubmit,
    handleReset,
    transformFormDataToApiRequest,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
    selectedBankId,
    bankList,
    branchList,
  };
};
