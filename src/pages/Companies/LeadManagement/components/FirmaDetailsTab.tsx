/**
 * Firma Details Tab Component
 * Displays and allows editing of company information
 * Following OperationPricing form patterns
 */

import { Form, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
  useGetCitiesQuery,
  useGetCountriesEnumQuery,
  useGetCustomerManagerListQuery,
  useGetLeadDocumentStatusQuery,
  useGetProductTypesQuery,
  useLazyGetDistrictsByCityIdQuery,
} from 'src/api/figoParaApi';
import {
  useGetBuyerCompaniesQuery,
  useGetCompanyActivityTypesQuery,
  useGetCompanySectorQuery,
} from 'src/pages/Companies/companies.api';
import { useFirmaDetailsForm } from '../hooks';
import { useUpdateLeadMutation } from '../lead-management.api';
import type { LeadDetail } from '../lead-management.types';

interface FirmaDetailsTabProps {
  leadDetail: LeadDetail;
  onUpdate: () => void;
}

export const FirmaDetailsTab: React.FC<FirmaDetailsTabProps> = ({ leadDetail, onUpdate }) => {
  const [updateLead, { isLoading, error }] = useUpdateLeadMutation();
  const notice = useNotice();

  // State for cascading dropdowns
  const [selectedCountry, setSelectedCountry] = useState<string>(leadDetail?.Country || '');
  const [selectedCity, setSelectedCity] = useState<number | undefined>(leadDetail?.City || undefined);
  const [isDistrictsLoaded, setIsDistrictsLoaded] = useState(false);

  // Fetch dropdown data from APIs
  const { data: productTypesData } = useGetProductTypesQuery();
  const { data: customerManagerData } = useGetCustomerManagerListQuery();
  const { data: companySectorData } = useGetCompanySectorQuery();
  const { data: buyerCompaniesData } = useGetBuyerCompaniesQuery();
  const { data: companyActivityTypesData } = useGetCompanyActivityTypesQuery();
  const { data: documentStatusData } = useGetLeadDocumentStatusQuery();
  const { data: countriesData } = useGetCountriesEnumQuery();
  const { data: citiesData } = useGetCitiesQuery();
  const [getDistricts, { data: districtsData }] = useLazyGetDistrictsByCityIdQuery();

  const productTypeList = productTypesData || [];
  const customerManagerList = customerManagerData?.Items || [];
  const companySectorList = companySectorData?.data || [];
  const buyerCompaniesList = buyerCompaniesData || [];
  const companyActivityTypesList = companyActivityTypesData || [];
  const documentStatusList = documentStatusData || [];
  const countriesList = countriesData || [];
  const citiesList = citiesData || [];
  const districtsList = districtsData || [];

  // Initialize form with lead detail data
  const { form, schema } = useFirmaDetailsForm({
    leadDetail,
    productTypeList,
    customerManagerList,
    companySectorList,
    buyerCompaniesList,
    companyActivityTypesList,
    documentStatusList,
    countriesList,
    citiesList,
    districtsList,
    selectedCountry,
    selectedCity,
  });

  // Watch for country and city changes to enable/disable dependent dropdowns
  const watchCountry = form.watch('Country');
  const watchCity = form.watch('City');

  useEffect(() => {
    const countryValue = typeof watchCountry === 'string' ? watchCountry : '';
    if (countryValue && countryValue !== selectedCountry) {
      setSelectedCountry(countryValue);
      // Reset city and district when country changes
      form.setValue('City', '');
      form.setValue('District', '');
      setSelectedCity(undefined);
    }
  }, [watchCountry, selectedCountry, form]);

  useEffect(() => {
    const cityId = watchCity ? Number(watchCity) : undefined;
    if (cityId && cityId !== selectedCity) {
      setSelectedCity(cityId);
      // Reset district when city changes
      form.setValue('District', '');
      // Fetch districts for the selected city
      getDistricts(cityId);
    }
  }, [watchCity, selectedCity, form, getDistricts]);

  // Load districts on initial render if city is selected
  useEffect(() => {
    if (selectedCity && !isDistrictsLoaded) {
      getDistricts(selectedCity);
    }
  }, [selectedCity, getDistricts, isDistrictsLoaded]);

  // Set District value after districts are loaded
  useEffect(() => {
    if (districtsData && districtsData.length > 0 && leadDetail?.District && !isDistrictsLoaded) {
      form.setValue('District', String(leadDetail.District));
      setIsDistrictsLoaded(true);
    }
  }, [districtsData, leadDetail?.District, form, isDistrictsLoaded]);

  // Error handling
  useErrorListener(error);

  const handleSubmit = async (formData: { [key: string]: unknown }) => {
    try {
      // Transform form data to API format (string values from select -> number)
      // Merge firma form data with user details from leadDetail
      const data = {
        // Firma fields from form
        TaxNumber: formData.TaxNumber as string,
        CompanyName: formData.CompanyName as string,
        CompanyPhone: (formData.CompanyPhone as string) || undefined,
        EmailAddress: (formData.EmailAddress as string) || leadDetail.EmailAddress,
        ProductType: formData.ProductType ? Number(formData.ProductType) : undefined,
        CustomerManagerName: (formData.CustomerManagerName as string) || undefined,
        WebsiteUrl: (formData.WebsiteUrl as string) || undefined,
        SectorCode: (formData.SectorCode as string) || undefined,
        CustomerManagerId: formData.CustomerManagerId ? Number(formData.CustomerManagerId) : undefined,
        ReceiverCompanyId: formData.ReceiverCompanyId ? Number(formData.ReceiverCompanyId) : undefined,
        CompanyActivityType: formData.CompanyActivityType ? Number(formData.CompanyActivityType) : undefined,
        EstablishmentYear: formData.EstablishmentYear
          ? dayjs(formData.EstablishmentYear as string).format('YYYY')
          : undefined,
        DocumentSendStatus: formData.DocumentSendStatus ? Number(formData.DocumentSendStatus) : undefined,
        Country: (formData.Country as string) || undefined,
        City: formData.City ? Number(formData.City) : undefined,
        District: formData.District ? Number(formData.District) : undefined,
        // User fields from leadDetail (preserve existing user data)
        FirstName: leadDetail.FirstName || '',
        LastName: leadDetail.LastName || '',
        MobilePhone: leadDetail.MobilePhone || '',
      };

      await updateLead({
        id: leadDetail.Id,
        data: data,
      }).unwrap();

      notice({
        variant: 'success',
        title: 'Güncelleme Başarılı',
        message: 'Firma bilgileri başarıyla güncellendi.',
      });

      // Refresh parent data
      onUpdate();
    } catch (error) {
      // Error handled by useErrorListener
      console.error('Failed to update lead:', error);
    }
  };

  return (
    <Box>
      <Form form={form} schema={schema} space={2} />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <LoadingButton
          loading={isLoading}
          onClick={form.handleSubmit(handleSubmit)}
          variant="contained"
          color="primary">
          Kaydet
        </LoadingButton>
      </Box>
    </Box>
  );
};
