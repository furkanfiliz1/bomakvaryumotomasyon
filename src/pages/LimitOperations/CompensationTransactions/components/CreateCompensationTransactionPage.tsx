import { Form, PageHeader, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Box, Button, Card, Stack } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  useCreateCompensationTransactionMutation,
  useGetCompensationTransactionTypesQuery,
  useGetFinancerCompaniesForCompensationQuery,
  useLazySearchCompaniesByNameOrIdentifierQuery,
} from '../compensation-transactions.api';
import type { CompensationTransactionFormData } from '../compensation-transactions.types';
import {
  createCompensationTransactionCreateSchema,
  transformFinancerCompanies,
  transformTransactionTypes,
} from '../helpers';

/**
 * Create Compensation Transaction Page Component
 * Following OperationPricing patterns and modern form handling
 */
export const CreateCompensationTransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // API hooks
  const { data: transactionTypes, isLoading: isLoadingTypes } = useGetCompensationTransactionTypesQuery();
  const { data: financerCompanies, isLoading: isLoadingFinancers } = useGetFinancerCompaniesForCompensationQuery();
  const [createCompensationTransaction, { isLoading: isCreating, error: createError }] =
    useCreateCompensationTransactionMutation();
  const [searchCompanies, { isLoading: isSearchingCompanies }] = useLazySearchCompaniesByNameOrIdentifierQuery();

  useErrorListener(createError);

  // State for company search results
  const [companiesSearchResults, setCompaniesSearchResults] = useState<
    Array<{ Identifier: string; CompanyName: string }>
  >([]);

  // Company search function for async autocomplete
  const searchCompaniesByNameOrIdentifier = useCallback(
    async (searchValue: string) => {
      if (!searchValue || searchValue.length < 3) {
        setCompaniesSearchResults([]);
        return;
      }

      try {
        const result = await searchCompanies({
          CompanyNameOrIdentifier: searchValue,
          Status: 1,
          ActivityType: 2,
        }).unwrap();

        setCompaniesSearchResults(result.Items || []);
      } catch (error) {
        console.error('Company search error:', error);
        setCompaniesSearchResults([]);
      }
    },
    [searchCompanies],
  );

  // Form setup - using create schema with async autocomplete
  const schema = useMemo(
    () =>
      createCompensationTransactionCreateSchema(
        transformTransactionTypes(transactionTypes || []),
        transformFinancerCompanies(financerCompanies || []),
        companiesSearchResults,
        searchCompaniesByNameOrIdentifier,
        isSearchingCompanies,
      ),
    [
      transactionTypes,
      financerCompanies,
      companiesSearchResults,
      searchCompaniesByNameOrIdentifier,
      isSearchingCompanies,
    ],
  );

  const form = useForm<CompensationTransactionFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      operationType: '',
      identifier: '',
      financerCompany: undefined,
      transactionDate: '',
      amount: 0,
    },
  });

  // Handle form submission
  const handleSubmit = async (formData: CompensationTransactionFormData) => {
    try {
      const createData = {
        Identifier: formData.identifier,
        TransactionDate: formData.transactionDate,
        Amount: formData.amount,
        Type: formData.operationType,
        FinancerId: formData.financerCompany,
      };

      await createCompensationTransaction(createData).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: formData.operationType === '1' ? 'Tahsilat başarıyla eklendi' : 'Maliyet başarıyla eklendi',
        buttonTitle: 'Tamam',
      });

      navigate('/limit-operations/legal-proceedings/compensation-transactions');
    } catch (error) {
      console.error('Create failed:', error);
      // Error handling is managed by the error listener
    }
  };

  const handleBack = () => {
    navigate('/limit-operations/legal-proceedings/compensation-transactions');
  };

  const isLoading = isLoadingTypes || isLoadingFinancers;

  return (
    <Box>
      <PageHeader title="Yeni Tazmin İşlemi" subtitle="Kanuni Takip - Muhasebe İşlemleri" />
      <Box mx={2}>
        <Card sx={{ p: 2, mt: 2 }}>
          <Form
            form={form}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            schema={schema as any}
            space={3}
          />

          <Stack direction="row" spacing={1} sx={{ mt: 4, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleBack} disabled={isCreating}>
              İptal
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isCreating || isLoading}>
              {isCreating ? 'Ekleniyor...' : 'Ekle'}
            </Button>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
};
