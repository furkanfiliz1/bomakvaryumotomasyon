import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { createCompanyDetailFormSchema } from '../helpers/company-detail-form.schema';
import { CompanyDetailFormData, CompanyDetail } from '../companies.types';
import {
  useGetProductTypesQuery,
  useGetCompanyKindsQuery,
  useGetCompanySizeTypesQuery,
  useGetRevenueTypesQuery,
  useGetIntegratorsQuery,
} from '../companies.api';

/**
 * Custom hook for Company Detail Form management
 * Following OperationPricing hooks pattern with form and schema creation
 */
export const useCompanyDetailForm = (initialData?: CompanyDetail) => {
  // Data queries for dropdown options
  const { data: productTypes = [] } = useGetProductTypesQuery();
  const { data: companyKinds = [] } = useGetCompanyKindsQuery();
  const { data: companySizeTypes = [] } = useGetCompanySizeTypesQuery();
  const { data: revenueTypes = [] } = useGetRevenueTypesQuery();
  const { data: integrators = [] } = useGetIntegratorsQuery();

  // Transform API data to form data format
  const transformToFormData = (data?: CompanyDetail): CompanyDetailFormData => {
    if (!data) return {};

    // Extract ProductType values from ProductTypes array if it exists
    const productTypeValues = data.ProductTypes?.map((pt) => pt.ProductType) || null;

    return {
      CompanySizeType: data.CompanySizeType || null,
      FoundationYear: data.FoundationYear || null,
      ProductTypes: productTypeValues,
      RevenueType: data.RevenueType || null,
      IntegratorId: data.IntegratorId || null,
      CompanyKind: data.CompanyKind || null,
      AffiliateStructure: data.AffiliateStructure || null,
      Bail: data.Bail || null,
      Activity: data.Activity || null,
    };
  };

  // Initialize form values
  const initialValues: CompanyDetailFormData = transformToFormData(initialData);

  // Create schema with dropdown data
  const schema = useMemo(
    () => createCompanyDetailFormSchema(productTypes, companyKinds, companySizeTypes, revenueTypes, integrators),
    [productTypes, companyKinds, companySizeTypes, revenueTypes, integrators],
  );

  // Initialize form with react-hook-form
  const form = useForm<CompanyDetailFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return {
    form,
    schema,
    initialValues,
  };
};
