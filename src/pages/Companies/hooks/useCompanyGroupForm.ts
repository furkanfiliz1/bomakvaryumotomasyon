import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import { useLazySearchGroupCompaniesQuery } from '../companies.api';

interface CompanyGroupFormData {
  selectedCompany: string;
  relationshipType: 'Parent' | 'Subsidiary' | 'Sister';
}

interface UseCompanyGroupFormProps {
  companyId: number;
  onSubmit: (data: { companyId: number; relationshipType: string }) => void;
}

export function useCompanyGroupForm({ companyId, onSubmit }: UseCompanyGroupFormProps) {
  const [searchResults, setSearchResults] = useState<Array<{ Id: number; CompanyName: string; Identifier: string }>>(
    [],
  );
  const [searchGroupCompanies, { isLoading: isSearchLoading }] = useLazySearchGroupCompaniesQuery();

  const initialValues = {
    selectedCompany: '',
    relationshipType: 'Sister' as const,
  };

  const relationshipTypeOptions = [
    { value: 'Parent', label: 'Ana Şirket' },
    { value: 'Subsidiary', label: 'Bağlı Şirket' },
    { value: 'Sister', label: 'Kardeş Şirket' },
  ];

  const searchCompaniesByNameOrIdentifier = async (companyNameOrIdentifier?: string) => {
    if (!companyNameOrIdentifier || companyNameOrIdentifier.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await searchGroupCompanies({
        GroupedCompanyId: companyId,
        CompanyName: companyNameOrIdentifier,
        Status: 1,
      }).unwrap();

      setSearchResults(response.Items || []);
    } catch (error) {
      console.error('Company search failed:', error);
      setSearchResults([]);
    }
  };

  const schema = yup.object().shape({
    selectedCompany: fields
      .asyncAutoComplete(
        searchResults,
        'string',
        ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
        searchCompaniesByNameOrIdentifier,
        isSearchLoading,
        3,
      )
      .required()
      .meta({ label: 'Şirket Seç' }),
    relationshipType: yup
      .string()
      .oneOf(['Parent', 'Subsidiary', 'Sister'])
      .required()
      .meta({ label: 'İlişki Türü', options: relationshipTypeOptions }),
  });

  const form = useForm<CompanyGroupFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const handleFormSubmit = (data: CompanyGroupFormData) => {
    const selectedCompanyData = searchResults.find((company) => String(data.selectedCompany) === company.Identifier);

    if (selectedCompanyData) {
      onSubmit({
        companyId: selectedCompanyData.Id,
        relationshipType: data.relationshipType,
      });
      form.reset(initialValues);
      setSearchResults([]);
    }
  };

  const handleReset = () => {
    form.reset(initialValues);
    setSearchResults([]);
  };

  return {
    form,
    schema,
    handleFormSubmit,
    handleReset,
    searchResults,
    isSearchLoading,
    searchCompaniesByNameOrIdentifier,
  };
}
