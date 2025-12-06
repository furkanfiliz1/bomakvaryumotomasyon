import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supplierQueryDefaultValues, transformSupplierQueryFormToRequest } from '../helpers';
import { useLazyGetReceiverAssociatedSupplierQuery } from '../supplier-query.api';
import { createSupplierQuerySchema } from '../supplier-query.schema';
import type { SupplierQueryFormValues, SupplierQueryResponse } from '../supplier-query.types';

export const useSupplierQueryForm = () => {
  const [searchSupplier, { isLoading: isSearching, error: searchSupplierError }] =
    useLazyGetReceiverAssociatedSupplierQuery();

  useErrorListener(searchSupplierError);

  const [queryResult, setQueryResult] = useState<SupplierQueryResponse | null>(null);
  const [buyerCodeSnapshot, setBuyerCodeSnapshot] = useState<string>('');

  const form = useForm<SupplierQueryFormValues>({
    resolver: yupResolver(createSupplierQuerySchema()),
    defaultValues: supplierQueryDefaultValues,
    mode: 'onChange',
  });

  const { reset } = form;

  // Create static schema
  const schema = createSupplierQuerySchema();

  // Submit handler - matches legacy handleSubmit exactly
  const handleSubmit = async (values: SupplierQueryFormValues) => {
    try {
      setQueryResult(null);

      // Transform to API format
      const requestData = transformSupplierQueryFormToRequest(values);

      // Make API call
      const response = await searchSupplier(requestData).unwrap();

      console.log('response', response);

      if (response) {
        // Success - save result and snapshot like legacy
        setQueryResult(response);
        setBuyerCodeSnapshot(values.buyerCode);
      }
    } catch (error) {
      console.error('Supplier query error:', error);
    }
  };

  // Reset handler - matches legacy reset behavior
  const handleReset = () => {
    reset(supplierQueryDefaultValues);
    setQueryResult(null);
    setBuyerCodeSnapshot('');
  };

  return {
    form,
    schema,
    isSearching,
    queryResult,
    buyerCodeSnapshot,
    handleSubmit,
    handleReset,
  };
};
