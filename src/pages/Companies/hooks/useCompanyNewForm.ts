import { useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  useCreateCompanyMutation,
  useGetCitiesQuery,
  useGetCompanyActivityTypesQuery,
  useGetCompanyTypesQuery,
  useLazyGetAddressesByCityIdDistrictsQuery,
} from '../companies.api';
import { CompanyCreateFormData, CompanyCreateRequest } from '../companies.types';
import { createCompanyNewFormSchema, getCompanyNewInitialValues } from '../helpers';

/**
 * Hook for managing company creation form
 * Following OperationPricing pattern with form management and API integration
 */
export const useCompanyNewForm = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const [isLoading, setIsLoading] = useState(false);

  // API hooks for dropdown data
  const { data: cities = [], isLoading: isCitiesLoading } = useGetCitiesQuery();
  const { data: companyTypes = [], isLoading: isCompanyTypesLoading } = useGetCompanyTypesQuery();
  const { data: activityTypes = [], isLoading: isActivityTypesLoading } = useGetCompanyActivityTypesQuery();

  // Lazy query for districts based on selected city
  const [getDistricts, { data: districts = [], isLoading: isDistrictsLoading }] =
    useLazyGetAddressesByCityIdDistrictsQuery();

  // Company creation mutation
  const [createCompany, { isLoading: isCreating, error }] = useCreateCompanyMutation();

  useErrorListener(error);
  // Initial form values
  const initialValues = useMemo(() => getCompanyNewInitialValues(), []);

  // Form schema with dynamic data
  const schema = useMemo(() => {
    return createCompanyNewFormSchema(companyTypes, activityTypes, cities, districts);
  }, [companyTypes, activityTypes, cities, districts]);

  // Form configuration
  const form = useForm<CompanyCreateFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: initialValues,
    mode: 'onChange',
  });

  // Watch city selection to load districts
  const selectedCityId = form.watch('CityId');

  useEffect(() => {
    if (selectedCityId) {
      // Reset district when city changes
      form.setValue('DistrictId', null);
      // Load districts for selected city
      getDistricts(selectedCityId);
    }
  }, [selectedCityId, getDistricts, form]);

  // Transform form data to API request format
  const transformFormDataToRequest = (formData: CompanyCreateFormData): CompanyCreateRequest => {
    const selectedCity = cities.find((city) => city.Id === formData.CityId);
    const selectedDistrict = districts.find((district) => district.Id === formData.DistrictId);

    return {
      ActivityType: formData.ActivityType,
      CompanyName: formData.CompanyName.trim(),
      Type: formData.Type,
      Identifier: formData.Identifier,
      TaxOffice: formData.TaxOffice,
      Address: formData.Address,
      Phone: formData.Phone.replace(/\s/g, ''), // Remove spaces from phone
      MailAddress: formData.MailAddress,
      Status: formData.Status ? 1 : 0, // Convert boolean to number
      CityId: formData.CityId || 0, // Handle null value
      CityName: selectedCity?.Name || '',
      DistrictId: formData.DistrictId || 0, // Handle null value
      CitySubdivisionName: selectedDistrict?.Name || '',
    };
  };

  // Handle form submission
  const handleSubmit = async (formData: CompanyCreateFormData) => {
    try {
      setIsLoading(true);

      const requestData = transformFormDataToRequest(formData);
      const result = await createCompany(requestData).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şirket başarılı bir şekilde oluşturuldu.',
        buttonTitle: 'Şirket Detayına Git',
      }).then(() => {
        navigate(`/companies/${result.Id}/detail`);
      });

      // Navigate to company detail page
    } catch (error: unknown) {
      console.error('Company creation failed:', error);

      // Type guard for error handling
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as { data?: { message?: string } };
        console.error('API Error:', apiError.data?.message || 'Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state for form
  const isFormLoading = isCitiesLoading || isCompanyTypesLoading || isActivityTypesLoading;

  return {
    form,
    schema,
    onSubmit: form.handleSubmit(handleSubmit),
    isLoading: isLoading || isCreating,
    isFormLoading,
    isDistrictsLoading,

    // Dropdown data
    cities,
    districts,
    companyTypes,
    activityTypes,

    // Helper functions
    getDistricts,
  };
};
