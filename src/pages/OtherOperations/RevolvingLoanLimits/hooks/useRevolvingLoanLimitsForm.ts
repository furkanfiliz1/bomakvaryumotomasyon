import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createRevolvingLoanLimitsSchema,
  revolvingLoanLimitsDefaultValues,
  transformRevolvingLoanFormToRequest,
} from '../helpers';
import { useSearchRevolvingLoanLimitMutation } from '../revolving-loan-limits.api';
import type { RevolvingLoanLimitsFormValues, RevolvingLoanLimitsResponse } from '../revolving-loan-limits.types';

export const useRevolvingLoanLimitsForm = () => {
  const [searchRevolvingLoan, { isLoading: isSearching, error: searchRevolvingLoanError }] =
    useSearchRevolvingLoanLimitMutation();

  useErrorListener([searchRevolvingLoanError]);

  const [queryResult, setQueryResult] = useState<RevolvingLoanLimitsResponse | null>(null);
  const [identifierSnapshot, setIdentifierSnapshot] = useState<string>('');

  const form = useForm<RevolvingLoanLimitsFormValues>({
    resolver: yupResolver(createRevolvingLoanLimitsSchema()),
    defaultValues: revolvingLoanLimitsDefaultValues,
    mode: 'onChange',
  });

  const { reset } = form;

  // Create static schema (no conditional logic needed for revolving loan)
  const schema = createRevolvingLoanLimitsSchema();

  // Submit handler - matches legacy formik.onSubmit exactly
  const handleSubmit = async (values: RevolvingLoanLimitsFormValues) => {
    try {
      setQueryResult(null);

      // Transform to API format (simple pass-through)
      const requestData = transformRevolvingLoanFormToRequest(values);

      // Make API call
      const response = await searchRevolvingLoan(requestData).unwrap();

      if (response) {
        // Success - save result and snapshot like legacy
        setQueryResult(response);
        setIdentifierSnapshot(values.Identifier);
      }
    } catch (error) {
      console.error('Revolving loan search error:', error);
    }
  };

  // Reset handler - matches legacy reset behavior
  const handleReset = () => {
    reset(revolvingLoanLimitsDefaultValues);
    setQueryResult(null);
    setIdentifierSnapshot('');
  };

  return {
    form,
    schema,
    isSearching,
    queryResult,
    identifierSnapshot,
    handleSubmit,
    handleReset,
  };
};
