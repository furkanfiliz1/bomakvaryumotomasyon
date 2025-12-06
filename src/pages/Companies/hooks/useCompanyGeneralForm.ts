import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fields } from '../../../components/common/Form';
import {
  useGetAddressesCitiesQuery,
  useGetCompanyActivityTypesQuery,
  useGetCompanySectorQuery,
  useGetCompanyTypesQuery,
  useGetPassiveReasonsQuery,
  useLazyGetAddressesByCityIdDistrictsQuery,
  useLazyGetScoreCompanyByIdentifierQuery,
} from '../companies.api';
import { Company } from '../companies.types';

export interface CompanyFormData {
  CompanyName: string;
  Identifier: string;
  Type: number;
  Status: number;
  Phone?: string;
  MailAddress?: string;
  Address?: string;
  ActivityType: number;
  TaxOffice?: string;
  Utm?: string;
  CustomerNumber?: string;
  SignedContract: number;
  SignedScoreContract: number;
  IsTest: boolean;
  city: number | string;
  CityId?: number;
  DistrictId?: number | string;
  PassiveStatusReason?: string;
  companySectorId?: number;
}

export const useCompanyGeneralForm = (companyData: Company) => {
  const [selectedCity, setSelectedCity] = useState<{ Id: number; Name: string } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{ Id: number; Name: string } | null>(null);
  const [hasScoreCompany, setHasScoreCompany] = useState(false);
  const [scoreCompanyId, setScoreCompanyId] = useState<number | null>(null);
  const [companySectorId, setCompanySectorId] = useState<number | null>(null);
  // Data queries
  const { data: activityTypes = [] } = useGetCompanyActivityTypesQuery();
  const { data: companyTypes = [] } = useGetCompanyTypesQuery();
  const { data: cities } = useGetAddressesCitiesQuery();
  const [getAddressesByCityIdDistrictsQuery, { data: districtList }] = useLazyGetAddressesByCityIdDistrictsQuery();
  const { data: passiveReasons = [] } = useGetPassiveReasonsQuery();

  // Score company queries
  const { data: companySectorList } = useGetCompanySectorQuery();
  const [getScoreCompanyByIdentifierQuery] = useLazyGetScoreCompanyByIdentifierQuery();

  // City list prioritization (big cities first) - following AdressUpdateModal pattern
  const cityList = (() => {
    if (!cities) return [];
    const bigCities = [4127, 4160, 4161];

    const filterBigCity = cities.filter((o1) => {
      return bigCities.some((o2) => {
        return o1.Id === o2;
      });
    });

    const filterOtherCity = cities.filter((o1) => {
      return !bigCities.some((o2) => {
        return o1.Id === o2;
      });
    });

    return [...filterBigCity, ...filterOtherCity];
  })();

  const schema = useMemo(() => {
    return yup.object({
      // Switch Fields
      SignedContract: fields.switchNumber.label('Sözleşme Onaylandı mı?').meta({ col: 6, spaceBetween: true }),
      SignedScoreContract: fields.switchNumber
        .label('Figo Skor Sözleşmesi Onaylandı mı?')
        .meta({ col: 6, spaceBetween: true }),
      Status: fields.switchNumber.label('Şirket Statüsü Aktif mi?').meta({ col: 6, spaceBetween: true }),
      IsTest: fields.switchField.label('Test şirketi mi?').meta({ col: 6, spaceBetween: true }),
      CompanyName: fields.text.required('Şirket adı zorunludur').label('Şirket Ünvanı').meta({ col: 12 }),

      Type: fields
        .select(
          companyTypes.map((type) => ({
            value: parseInt(type.Value),
            label: type.Description,
          })),
          'number',
          ['value', 'label'],
        )
        .required('Şirket tipi zorunludur')
        .label('Şirket Tipi')
        .meta({ col: 6 }),

      Identifier: fields.text.required('VKN/TCKN zorunludur').label('VKN/TCKN').meta({ col: 6 }),

      TaxOffice: fields.text.label('Vergi Dairesi').meta({ col: 6 }),

      ...(hasScoreCompany &&
        companySectorList && {
          companySectorId: fields
            .select(
              companySectorList.data?.map((sector) => ({
                value: sector.id,
                label: sector.sectorName,
              })) || [],
              'number',
              ['value', 'label'],
            )
            .label('Sektör Bilgisi')
            .meta({ col: 6 }),
        }),

      Address: fields.text.label('Adres').meta({ col: 6 }),

      Phone: fields.phone.label('Telefon Numarası').meta({ col: 6 }),

      MailAddress: fields.text.email('Geçerli bir e-posta adresi giriniz').label('E-Posta').meta({ col: 6 }),

      Utm: fields.text.label('UTM').meta({ col: 6, disabled: true }),

      ActivityType: fields
        .select(
          activityTypes.map((type) => ({
            value: parseInt(type.Value),
            label: type.Description,
          })),
          'number',
          ['value', 'label'],
        )
        .required('Faaliyet tipi zorunludur')
        .label('Şirket Tipi(Satıcı/Alıcı)')
        .meta({ col: 6 }),

      city: fields
        .select(cityList || [], 'number', ['Id', 'Name'])
        .label('İl')
        .required('İl zorunludur')
        .meta({ col: 6 }),

      DistrictId: fields
        .select(districtList || [], 'number', ['Id', 'Name'])
        .label('İlçe')
        .required('İlçe zorunludur')
        .meta({ col: 6, disabled: !districtList }),

      ...(companyData.IsCustomerNoVisible && {
        CustomerNumber: fields.text.label('IBMN').meta({ col: 6 }),
      }),

      PassiveStatusReason: fields
        .select(
          passiveReasons.map((reason) => ({
            value: reason.Value,
            label: reason.Description,
          })),
          'string',
          ['value', 'label'],
        )
        .label('Pasif Olma Nedeni')
        .meta({ col: 6, visible: false }),
    });
  }, [
    companyTypes,
    activityTypes,
    cityList,
    districtList,
    companyData.IsCustomerNoVisible,
    hasScoreCompany,
    companySectorList,
    passiveReasons,
  ]);

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      CompanyName: companyData.CompanyName || '',
      Identifier: companyData.Identifier || '',
      Type: companyData.Type ?? 1,
      Status: companyData.Status ?? 1,
      Phone: companyData.Phone || '',
      MailAddress: companyData.MailAddress || '',
      Address: companyData.Address || '',
      ActivityType: companyData.ActivityType ?? 1,
      TaxOffice: companyData.TaxOffice || '',
      Utm: companyData.Utm || '',
      CustomerNumber: companyData.CustomerNumber || '',
      SignedContract: companyData.SignedContract ?? 0,
      SignedScoreContract: companyData.SignedScoreContract ?? 0,
      IsTest: companyData.IsTest || false,
      city: companyData.CityId || '',
      CityId: companyData.CityId,
      DistrictId: companyData.DistrictId || '',
      PassiveStatusReason:
        typeof companyData.PassiveStatusReason === 'object'
          ? companyData.PassiveStatusReason?.Value || ''
          : companyData.PassiveStatusReason || '',
      companySectorId: companySectorId || '',
    } as CompanyFormData,
    mode: 'onChange',
  });

  const watchStatus = form.watch('Status');

  // Create dynamic schema based on watchStatus
  const dynamicSchema = useMemo(() => {
    return yup.object({
      // Switch Fields
      SignedContract: fields.switchNumber.label('Sözleşme Onaylandı mı?').meta({ col: 6, spaceBetween: true }),
      SignedScoreContract: fields.switchNumber
        .label('Figo Skor Sözleşmesi Onaylandı mı?')
        .meta({ col: 6, spaceBetween: true }),
      Status: fields.switchNumber.label('Şirket Statüsü Aktif mi?').meta({ col: 6, spaceBetween: true }),
      IsTest: fields.switchField.label('Test şirketi mi?').meta({ col: 6, spaceBetween: true }),
      CompanyName: fields.text.required('Şirket adı zorunludur').label('Şirket Ünvanı').meta({ col: 12 }),

      Type: fields
        .select(
          companyTypes.map((type) => ({
            value: parseInt(type.Value),
            label: type.Description,
          })),
          'number',
          ['value', 'label'],
        )
        .required('Şirket tipi zorunludur')
        .label('Şirket Tipi')
        .meta({ col: 6 }),

      Identifier: fields.text.required('VKN/TCKN zorunludur').label('VKN/TCKN').meta({ col: 6 }),

      TaxOffice: fields.text.label('Vergi Dairesi').meta({ col: 6 }),

      ...(hasScoreCompany &&
        companySectorList && {
          companySectorId: fields
            .select(
              companySectorList.data?.map((sector) => ({
                value: sector.id,
                label: sector.sectorName,
              })) || [],
              'number',
              ['value', 'label'],
            )
            .label('Sektör Bilgisi')
            .meta({ col: 6 }),
        }),

      Address: fields.text.label('Adres').meta({ col: 6 }),

      Phone: fields.phone.label('Telefon Numarası').meta({ col: 6 }),

      MailAddress: fields.text.email('Geçerli bir e-posta adresi giriniz').label('E-Posta').meta({ col: 6 }),

      Utm: fields.text.label('UTM').meta({ col: 6, disabled: true }),

      ActivityType: fields
        .select(
          activityTypes.map((type) => ({
            value: parseInt(type.Value),
            label: type.Description,
          })),
          'number',
          ['value', 'label'],
        )
        .required('Faaliyet tipi zorunludur')
        .label('Şirket Tipi(Satıcı/Alıcı)')
        .meta({ col: 6 }),

      city: fields
        .select(cityList || [], 'number', ['Id', 'Name'])
        .label('İl')
        .required('İl zorunludur')
        .meta({ col: 6 }),

      DistrictId: fields
        .select(districtList || [], 'number', ['Id', 'Name'])
        .label('İlçe')
        .required('İlçe zorunludur')
        .meta({ col: 6, disabled: !districtList }),

      ...(companyData.IsCustomerNoVisible && {
        CustomerNumber: fields.text.label('IBMN').meta({ col: 6 }),
      }),

      ...(watchStatus !== 1 && {
        PassiveStatusReason: fields
          .select(
            passiveReasons.map((reason) => ({
              value: reason.Value,
              label: reason.Description,
            })),
            'string',
            ['value', 'label'],
          )
          .label('Pasif Olma Nedeni')
          .meta({ col: 6 }),
      }),
    });
  }, [
    companyTypes,
    activityTypes,
    cityList,
    districtList,
    companyData.IsCustomerNoVisible,
    hasScoreCompany,
    companySectorList,
    passiveReasons,
    watchStatus,
  ]);

  // Reset form when companyData changes to ensure proper initialization
  useEffect(() => {
    // Handle PassiveStatusReason - can be either a number or an object with Value property
    const passiveReasonValue =
      typeof companyData.PassiveStatusReason === 'object'
        ? companyData.PassiveStatusReason?.Value || ''
        : companyData.PassiveStatusReason || '';

    form.reset({
      CompanyName: companyData.CompanyName || '',
      Identifier: companyData.Identifier || '',
      Type: companyData.Type ?? 1,
      Status: companyData.Status ?? 1,
      Phone: companyData.Phone || '',
      MailAddress: companyData.MailAddress || '',
      Address: companyData.Address || '',
      ActivityType: companyData.ActivityType ?? 1,
      TaxOffice: companyData.TaxOffice || '',
      Utm: companyData.Utm || '',
      CustomerNumber: companyData.CustomerNumber || '',
      SignedContract: companyData.SignedContract ?? 0,
      SignedScoreContract: companyData.SignedScoreContract ?? 0,
      IsTest: companyData.IsTest || false,
      city: companyData.CityId || '',
      CityId: companyData.CityId,
      DistrictId: companyData.DistrictId || '',
      PassiveStatusReason: passiveReasonValue,
      companySectorId: companySectorId ?? undefined,
    } as CompanyFormData);
  }, [companyData, form, companySectorId]);

  useEffect(() => {
    if (companyData.CityId && cities) {
      const city = cities.find((c) => c.Id === companyData.CityId);
      if (city) {
        setSelectedCity(city);
        // İlk yüklemede şehre ait ilçeleri yükle
        getAddressesByCityIdDistrictsQuery(companyData.CityId);
      }
    }
  }, [cities, companyData.CityId, getAddressesByCityIdDistrictsQuery]);

  useEffect(() => {
    if (companyData.DistrictId && districtList && districtList.length > 0) {
      const district = districtList.find((d) => d.Id === companyData.DistrictId);

      if (district) {
        setSelectedDistrict(district);
        // Form değerini de güncelle
        form.setValue('DistrictId', companyData.DistrictId);
      }
    }
  }, [districtList, companyData.DistrictId, form]);

  // Watch for city changes to fetch districts - following AdressUpdateModal pattern
  const cityId = form.watch('city');
  useEffect(() => {
    if (cityId) {
      getAddressesByCityIdDistrictsQuery(Number(cityId || 0));
    }
  }, [cityId, form, getAddressesByCityIdDistrictsQuery]);

  // Clear district when city changes (not on initial load)
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Only clear district on city change after initial load
    if (!isInitialLoad && cityId !== companyData.CityId) {
      form.setValue('DistrictId', '');
      setSelectedDistrict(null);
    }
  }, [cityId, form, isInitialLoad, companyData.CityId]);

  // Mark initial load as complete after city and district are set
  useEffect(() => {
    if (companyData.CityId && companyData.DistrictId && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [companyData.CityId, companyData.DistrictId, isInitialLoad]);

  // Fetch score company data when company identifier exists
  useEffect(() => {
    if (companyData.Identifier) {
      getScoreCompanyByIdentifierQuery({ identifier: companyData.Identifier }).then((response) => {
        if (response.data && response.data.id) {
          setHasScoreCompany(true);
          setCompanySectorId(response.data.companySectorId);
          setScoreCompanyId(response.data.id);
        }
      });
    }
  }, [companyData.Identifier, getScoreCompanyByIdentifierQuery]);

  // Update form value when companySectorId changes
  useEffect(() => {
    if (companySectorId !== null) {
      form.setValue('companySectorId', companySectorId);
    }
  }, [companySectorId, form]);

  // Handle city selection
  const handleCityChange = (cityId: number | null) => {
    const city = cities?.find((c) => c.Id === cityId);
    setSelectedCity(city || null);
    setSelectedDistrict(null);
    form.setValue('city', cityId || '');
    form.setValue('CityId', cityId || undefined);
    form.setValue('DistrictId', '');
  };

  // Handle district selection
  const handleDistrictChange = (districtId: number | null) => {
    const district = districtList?.find((d) => d.Id === districtId);
    setSelectedDistrict(district || null);
    form.setValue('DistrictId', districtId || '');
  };

  return {
    form,
    schema: dynamicSchema,
    selectedCity,
    selectedDistrict,
    handleCityChange,
    handleDistrictChange,
    cities: cityList,
    districts: districtList || [],
    activityTypes,
    companyTypes,
    passiveReasons,
    hasScoreCompany,
    scoreCompanyId,
    companySectorId,
    companySectorList: companySectorList?.data || [],
    watchStatus,
  };
};
