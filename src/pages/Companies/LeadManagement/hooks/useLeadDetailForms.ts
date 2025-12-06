/**
 * Lead Detail Form Hooks
 * Custom hooks for managing forms in lead detail tabs
 * Following OperationPricing hooks pattern
 */

import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  CityOption,
  CountryOption,
  CustomerManager,
  DistrictOption,
  LeadDocumentStatusOption,
  ProductTypeOption,
  useGetCustomerManagerListQuery,
} from 'src/api/figoParaApi';
import { fields } from 'src/components/common/Form/schemas/_common';
import { useGetLeadCallResultStatusDataQuery } from 'src/pages/Companies/companies.api';
import { ActivityType, Company, CompanySector } from 'src/pages/Companies/companies.types';
import * as yup from 'yup';
import { useGetSalesScenariosQuery } from '../lead-management.api';
import type { CallHistory, CallHistoryFormData, LeadDetail } from '../lead-management.types';

interface UseFirmaDetailsFormParams {
  leadDetail?: LeadDetail;
  productTypeList?: ProductTypeOption[];
  customerManagerList?: CustomerManager[];
  companySectorList?: CompanySector[];
  buyerCompaniesList?: Company[];
  companyActivityTypesList?: ActivityType[];
  documentStatusList?: LeadDocumentStatusOption[];
  countriesList?: CountryOption[];
  citiesList?: CityOption[];
  districtsList?: DistrictOption[];
  selectedCountry?: string;
  selectedCity?: number;
}

/**
 * Firma Details Form Hook
 * Manages form state for company information tab
 * Based on LeadRequestModel fields from API
 */
export const useFirmaDetailsForm = ({
  leadDetail,
  productTypeList = [],
  customerManagerList = [],
  companySectorList = [],
  buyerCompaniesList = [],
  companyActivityTypesList = [],
  documentStatusList = [],
  countriesList = [],
  citiesList = [],
  districtsList = [],
  selectedCountry,
  selectedCity,
}: UseFirmaDetailsFormParams) => {
  const initialValues = {
    TaxNumber: leadDetail?.TaxNumber || '',
    CompanyName: leadDetail?.CompanyName || '',
    CompanyPhone: leadDetail?.CompanyPhone || '',
    EmailAddress: leadDetail?.EmailAddress || '',
    ProductType: leadDetail?.ProductType ? String(leadDetail.ProductType) : '',
    WebsiteUrl: leadDetail?.WebsiteUrl || '',
    SectorCode: leadDetail?.SectorCode ? String(leadDetail.SectorCode) : '',
    CustomerManagerId: leadDetail?.CustomerManagerId ? String(leadDetail.CustomerManagerId) : '',
    ReceiverCompanyId: leadDetail?.ReceiverCompanyId ? String(leadDetail.ReceiverCompanyId) : '',
    CompanyActivityType: leadDetail?.CompanyActivityType ? String(leadDetail.CompanyActivityType) : '',
    EstablishmentYear: leadDetail?.EstablishmentYear || '',
    DocumentSendStatus: leadDetail?.DocumentSendStatus ? String(leadDetail.DocumentSendStatus) : '',
    Country: leadDetail?.Country || '',
    City: leadDetail?.City ? String(leadDetail.City) : '',
    District: leadDetail?.District ? String(leadDetail.District) : '',
  };

  // Schema based on API fields (PascalCase from BE)
  const schema = useMemo(
    () =>
      yup.object({
        TaxNumber: fields.text.label('VKN').meta({ col: 4 }),
        CompanyName: fields.text.label('Şirket Adı').meta({ col: 4 }),
        CompanyPhone: fields.phone.label('Şirket Telefonu').meta({ col: 4 }),
        EmailAddress: fields.text.email('Geçersiz email adresi').label('E-Posta').meta({ col: 4 }),
        ProductType: fields
          .select(productTypeList, 'string', ['Value', 'Description'])
          .optional()
          .label('İlgilendiği Ürün')
          .meta({ col: 4, showSelectOption: true }),
        WebsiteUrl: fields.text.label('Web Sitesi').meta({ col: 4 }),
        SectorCode: fields
          .select(companySectorList, 'string', ['sectorCode', 'sectorName'])
          .optional()
          .label('Sektör')
          .meta({ col: 4, showSelectOption: true }),
        CustomerManagerId: fields
          .select(customerManagerList, 'string', ['Id', 'FullName'])
          .optional()
          .label('Müşteri Temsilcisi')
          .meta({ col: 4, showSelectOption: true }),
        ReceiverCompanyId: fields
          .select(buyerCompaniesList, 'string', ['Identifier', 'CompanyName'])
          .optional()
          .label('Alıcı')
          .meta({ col: 4, showSelectOption: true }),
        CompanyActivityType: fields
          .select(companyActivityTypesList, 'string', ['Value', 'Description'])
          .optional()
          .label('Şirket Tipi')
          .meta({ col: 4, showSelectOption: true }),
        EstablishmentYear: fields.date
          .optional()
          .label('Kuruluş Yılı')
          .meta({ col: 4, disableFuture: true, views: ['year'] }),
        DocumentSendStatus: fields
          .select(documentStatusList, 'string', ['Value', 'Description'])
          .optional()
          .label('Evrak Gönderim Durumu')
          .meta({ col: 4, showSelectOption: true }),
        Country: fields
          .select(countriesList, 'string', ['Value', 'Description'])
          .optional()
          .label('Ülke')
          .meta({ col: 4, showSelectOption: true }),
        City: fields
          .select(citiesList, 'string', ['Id', 'Name'])
          .optional()
          .label('Şehir')
          .meta({ col: 4, showSelectOption: true, disabled: !selectedCountry }),
        District: fields
          .select(districtsList, 'string', ['Id', 'Name'])
          .optional()
          .label('İlçe')
          .meta({ col: 4, showSelectOption: true, disabled: !selectedCity }),
      }),
    [
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
    ],
  );

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return { form, schema };
};

/**
 * User Details Form Hook
 * Manages form state for contact person information tab
 * Uses API fields (PascalCase from BE): FirstName, LastName, MobilePhone, EmailAddress
 */
export const useUserDetailsForm = (leadDetail?: LeadDetail) => {
  const initialValues = {
    FirstName: leadDetail?.FirstName || '',
    LastName: leadDetail?.LastName || '',
    EmailAddress: leadDetail?.EmailAddress || '',
    MobilePhone: leadDetail?.MobilePhone || '',
  };

  const schema = yup.object({
    FirstName: fields.text.label('Ad').meta({ col: 6 }),
    LastName: fields.text.label('Soyad').meta({ col: 6 }),
    EmailAddress: fields.text.email('Geçersiz email adresi').label('E-Mail').meta({ col: 6 }),
    MobilePhone: fields.phone.label('Cep Telefonu').meta({ col: 6 }),
  });

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return { form, schema };
};

/**
 * Call History Form Hook
 * Manages form state for call history dialog
 * Updated to match API fields (LeadPhoneCallRequestModel)
 * Uses API endpoints for call result and sales scenario options
 */
export const useCallHistoryForm = (callData?: CallHistory | null, leadId?: number, customerManagerId?: number) => {
  // Fetch options from API
  const { data: callResultData } = useGetLeadCallResultStatusDataQuery();
  const { data: customerManagerData } = useGetCustomerManagerListQuery();
  const { data: salesScenarios } = useGetSalesScenariosQuery();

  const callResultOptions = callResultData || [];
  const salesScenarioOptions = salesScenarios || [];
  const customerManagerOptions = customerManagerData?.Items || [];

  const initialValues: CallHistoryFormData = {
    callResult: callData?.CallResult ?? null,
    salesScenario: callData?.SalesScenario ?? null,
    followUpDate: callData?.FollowUpDate || '',
    notes: callData?.Notes || '',
    callDate: callData?.CallDate || new Date().toISOString(),
    customerManagerId: customerManagerId ?? null,
  };

  const schema = yup.object({
    callResult: fields
      .select(callResultOptions, 'number', ['Value', 'Description'])
      .required('Bu alan zorunludur')
      .label('Arama Sonucu')
      .nullable()
      .meta({ col: 6, showSelectOption: true }),
    salesScenario: fields
      .select(salesScenarioOptions, 'number', ['Value', 'Description'])
      .required('Bu alan zorunludur')
      .nullable()
      .label('Satış Senaryosu')
      .meta({ col: 6, showSelectOption: true }),
    followUpDate: fields.date.label('Takip Tarihi').meta({ col: 6 }),
    callDate: fields.date.required('Bu alan zorunludur').label('Arama Tarihi').meta({ col: 6 }),
    customerManagerId: fields
      .select(customerManagerOptions, 'number', ['Id', 'FullName'])
      .optional()
      .nullable()
      .label('Müşteri Temsilcisi')
      .meta({ col: 12, showSelectOption: true }),
    notes: fields.text.label('Notlar').meta({ col: 12 }),
  }) as yup.ObjectSchema<CallHistoryFormData>;

  const form = useForm<CallHistoryFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  return { form, schema, leadId };
};
