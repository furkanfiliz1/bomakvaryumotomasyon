import { fields, Form, LoadingButton, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Box, Card, Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import yup from '@validation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';
import {
  useCreateCompanyForBillOperationMutation,
  useGetCitiesQuery,
  useLazyGetDistrictsQuery,
  useLazySearchCompanyQuery,
} from '../../discount-operations.api';

interface CompanyInfoStepProps {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  initialData?: Record<string, unknown>;
}

// Helper function to determine initial isFigoUser state
const getInitialFigoUserState = (initialData?: Record<string, unknown>): boolean => {
  if (initialData?.isFigoUser !== undefined) {
    return Boolean(initialData.isFigoUser);
  }
  return !initialData?.companyId;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- onBack reserved for future back navigation
export const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ onNext, onBack: _onBack, initialData }) => {
  const [isFigoUser, setIsFigoUser] = useState<boolean>(() => getInitialFigoUserState(initialData));

  const [isDistrictDisabled, setIsDistrictDisabled] = useState(true);
  const [isCompanyCreated, setIsCompanyCreated] = useState(!!initialData?.companyId);
  const [createCompany, { isLoading, data, isSuccess, error }] = useCreateCompanyForBillOperationMutation();
  const notice = useNotice();

  // City and District API calls
  const { data: cities = [] } = useGetCitiesQuery();
  useErrorListener(error);
  const [getDistricts, { data: districts = [] }] = useLazyGetDistrictsQuery();

  // Company search API call
  const [searchCompanyAPI, { isLoading: isSearchingCompaniesAPI }] = useLazySearchCompanyQuery();

  // InitialData'da cityId varsa o şehrin, yoksa İstanbul'un ilçelerini yükle
  useEffect(() => {
    if (cities.length > 0) {
      const cityId = initialData?.cityId as number | undefined;
      // InitialData'da cityId varsa onu, yoksa İstanbul ID'si 34'ü yükle
      getDistricts(cityId || 34);
    }
  }, [cities, getDistricts, initialData?.cityId]);

  // Transform city and district data for select options
  const cityOptions = cities.map((city) => ({ id: city.Id, name: city.Name }));
  const districtOptions = districts.map((district) => ({ id: district.Id, name: district.Name }));

  // Company search options and function
  const [companyOptions, setCompanyOptions] = useState<
    { id: number; name: string; rawData: { Id: number; Identifier: string; CompanyName: string } }[]
  >([]);

  const searchCompanies = useCallback(
    async (inputValue: string) => {
      if (!inputValue || inputValue.length < 3) {
        setCompanyOptions([]);
        return;
      }

      try {
        const result = await searchCompanyAPI({ companyNameOrIdentifier: inputValue });

        if (result.data?.Items) {
          const options = result.data.Items.map((item) => ({
            id: item.Id,
            name: `${item.CompanyName} (${item.Identifier})`,
            rawData: item, // Ham şirket verisini de sakla
          }));
          setCompanyOptions(options);
        } else {
          setCompanyOptions([]);
        }
      } catch (error) {
        console.error('Şirket arama hatası:', error);
        setCompanyOptions([]);
      }
    },
    [searchCompanyAPI],
  );

  // Figopara müşteri formu şeması
  const figoUserSchema = useMemo(
    () =>
      yup.object({
        selectedCompany: fields
          .asyncAutoComplete(companyOptions, 'number', ['id', 'name'], searchCompanies, isSearchingCompaniesAPI, 3)
          .nullable()
          .required('Şirket seçimi zorunludur')
          .label('Şirket Seçin')
          .meta({ col: 12 }),
      }),
    [companyOptions, isSearchingCompaniesAPI, searchCompanies],
  );

  // Figopara form tipi - şema required olsa da başlangıçta undefined olabilir
  type FigoFormData = yup.InferType<typeof figoUserSchema>;

  // Yeni kullanıcı için form şeması - memoized
  const newUserSchema = useMemo(
    () =>
      yup.object({
        companyIdentifier: isCompanyCreated
          ? fields.text.label('Şirket TCKN/VKN').meta({ col: 4, disabled: true })
          : fields.text.required('TCKN/VKN zorunludur').label('Şirket TCKN/VKN').meta({ col: 4 }),
        companyName: isCompanyCreated
          ? fields.text.label('Şirket Adı').meta({ col: 4, disabled: true })
          : fields.text
              .required('Şirket adı zorunludur')
              .min(2, 'En az 2 karakter olmalıdır')
              .label('Şirket Adı')
              .meta({ col: 4 }),
        taxOffice: fields.text.label('Vergi Dairesi').meta({ col: 4, disabled: isCompanyCreated }),
        companyAddress: fields.text.label('Şirket Adresi').meta({ col: 4, disabled: isCompanyCreated }),
        cityId: isCompanyCreated
          ? fields.select(cityOptions, 'number', ['id', 'name']).label('Şehir').meta({ col: 4, disabled: true })
          : fields
              .select(cityOptions, 'number', ['id', 'name'])
              .required('Şehir seçimi zorunludur')
              .label('Şehir')
              .meta({ col: 4 }),
        districtId: isCompanyCreated
          ? fields.select(districtOptions, 'number', ['id', 'name']).label('İlçe').meta({ col: 4, disabled: true })
          : fields
              .select(districtOptions, 'number', ['id', 'name'])
              .required('İlçe seçimi zorunludur')
              .label('İlçe')
              .meta({ col: 4, disabled: isDistrictDisabled }),
        ___: fields.customComponent(() => <Divider sx={{ my: 1 }} />),
        firstName: isCompanyCreated
          ? fields.text.label('Ad').meta({ col: 4, disabled: true })
          : fields.text.required('Ad zorunludur').min(2, 'En az 2 karakter olmalıdır').label('Ad').meta({ col: 4 }),
        lastName: isCompanyCreated
          ? fields.text.label('Soyad').meta({ col: 4, disabled: true })
          : fields.text
              .required('Soyad zorunludur')
              .min(2, 'En az 2 karakter olmalıdır')
              .label('Soyad')
              .meta({ col: 4 }),
        email: isCompanyCreated
          ? fields.text.label('E-posta').meta({ col: 4, disabled: true })
          : fields.text
              .email('Geçerli bir e-posta adresi giriniz')
              .required('E-posta zorunludur')
              .label('E-posta')
              .meta({ col: 4 }),
        userPhone: isCompanyCreated
          ? fields.phone.label('Telefon').meta({ col: 4, disabled: true })
          : fields.phone.required('Telefon numarası zorunludur').label('Telefon').meta({ col: 4 }),
        userIdentifier: fields.text.label('TCKN').meta({ col: 4, disabled: isCompanyCreated, inputType: 'number' }),
        birthDate: fields.date.label('Doğum Tarihi').meta({ col: 4, disabled: isCompanyCreated }).nullable(),
      }),
    [cityOptions, districtOptions, isDistrictDisabled, isCompanyCreated],
  );

  // Yeni kullanıcı formu
  const form = useForm({
    defaultValues: {
      companyIdentifier: '',
      companyName: '',
      taxOffice: '',
      companyAddress: '',
      cityId: undefined,
      districtId: undefined,
      firstName: '',
      lastName: '',
      email: '',
      userPhone: '',
      userIdentifier: '',
      birthDate: null,
      ...initialData,
    },
    resolver: yupResolver(newUserSchema),
    mode: 'onChange',
  });

  // InitialData'dan şirket verisini al ve options'a ekle
  useEffect(() => {
    if (initialData?.selectedCompanyData) {
      const companyData = initialData.selectedCompanyData as { Id: number; Identifier: string; CompanyName: string };
      const existingOption = companyOptions.find((option) => option.id === companyData.Id);

      if (!existingOption) {
        const newOption = {
          id: companyData.Id,
          name: `${companyData.CompanyName} (${companyData.Identifier})`,
          rawData: companyData,
        };
        setCompanyOptions((prev) => [newOption, ...prev]);
      }
    }
  }, [initialData?.selectedCompanyData, companyOptions]);

  // Figopara müşteri formu
  const figoForm = useForm<FigoFormData>({
    defaultValues: {
      selectedCompany: (initialData?.selectedCompanyData as { Id: number })?.Id ?? null,
    },
    resolver: yupResolver(figoUserSchema),
    mode: 'onChange',
  });

  const { handleSubmit, setValue, reset, watch } = form;

  // Şehir seçimini izle
  const selectedCityId = watch('cityId');

  // İlçe alanının disabled durumunu güncelle
  useEffect(() => {
    const disabled = !selectedCityId;
    setIsDistrictDisabled(disabled);
  }, [selectedCityId]);

  // Şehir değiştiğinde ilçeleri getir
  useEffect(() => {
    if (selectedCityId) {
      const cityId = typeof selectedCityId === 'string' ? Number.parseInt(selectedCityId, 10) : selectedCityId;
      if (!Number.isNaN(cityId)) {
        getDistricts(cityId);
        // İlçe seçimini sıfırla
        setValue('districtId', '');
      }
    }
  }, [selectedCityId, getDistricts, setValue]);

  // isFigoUser değişikliklerini izle
  useEffect(() => {
    // Kullanıcı tipi değiştiğinde her iki formu da temizle ve isCompanyCreated'ı sıfırla
    setIsCompanyCreated(false);

    if (isFigoUser) {
      // Evet seçildiğinde: Yeni kullanıcı formunu temizle
      reset({
        companyIdentifier: '',
        companyName: '',
        taxOffice: '',
        companyAddress: '',
        cityId: undefined,
        districtId: undefined,
        firstName: '',
        lastName: '',
        email: '',
        userPhone: '',
        userIdentifier: '',
        birthDate: null,
      });
    } else {
      // Hayır seçildiğinde: Figopara müşteri formunu temizle
      figoForm.reset({
        selectedCompany: undefined,
      });
      setCompanyOptions([]);
    }
  }, [isFigoUser, reset, figoForm]);

  const onSubmit = async (data: Record<string, unknown>) => {
    if (isFigoUser) {
      // Figopara kullanıcısı için direkt geç
      onNext({ ...data, isFigoUser });
      return;
    }

    // Şirket zaten oluşturulmuşsa direkt devam et
    if (isCompanyCreated) {
      onNext({ ...data, isFigoUser, companyId: initialData?.companyId });
      return;
    }

    // Yeni şirket oluşturma onayı iste
    try {
      await notice({
        type: 'confirm',
        variant: 'warning',
        catchOnCancel: true,
        title: 'Şirket Oluşturma Onayı',
        message: 'Yeni bir şirket oluşturmak üzeresiniz. Devam etmek istiyor musunuz?',
        buttonTitle: 'Evet, Devam Et',
        icon: 'alert-triangle',
      });
    } catch {
      // User cancelled the confirmation dialog
      return;
    }

    try {
      // Yeni kullanıcı için API call yap
      const requestData = {
        company: {
          identifier: data.companyIdentifier as string,
          companyName: data.companyName as string,
          address: data.companyAddress as string,
          taxOffice: data.taxOffice as string,
          phone: data.userPhone as string,
          cityId: data.cityId as number,
          email: data.email as string,
          MailAddress: data.email as string,
          districtId: data.districtId as number,
        },
        user: {
          identifier: data.userIdentifier as string,
          firstName: data.firstName as string,
          lastName: data.lastName as string,
          birthDate: data.birthDate as string,
          userName: (data.email as string)?.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || '', // NOSONAR - replaceAll requires ES2021
          email: data.email as string,
          phone: data.userPhone as string,
        },
      };

      createCompany(requestData).unwrap();
    } catch (error) {
      console.error('Şirket oluşturma hatası:', error);
      // Hata durumunda yine de devam et, ancak CompanyId olmadan
      onNext({ ...data, isFigoUser });
    }
  };

  // Figopara müşteri formu submit fonksiyonu
  const onFigoSubmit = async (data: Record<string, unknown>) => {
    // Seçilen şirketin tam verisini bul
    const selectedCompanyId = data.selectedCompany as number;
    const selectedCompanyData = companyOptions.find((option) => option.id === selectedCompanyId)?.rawData;
    onNext({
      ...data,
      isFigoUser,
      companyId: selectedCompanyData?.Id,
      selectedCompanyData, // Ham şirket verisini ekle
    });
  };

  const handleUserTypeChange = (value: string) => {
    setIsFigoUser(value === 'true');
  };

  useEffect(() => {
    if (isSuccess && data) {
      // Şirket oluşturma başarılı, CompanyId ile devam et ve state'i güncelle
      setIsCompanyCreated(true);
      onNext({ ...form.getValues(), isFigoUser, companyId: data.CompanyId });
    }
  }, [data, form, isFigoUser, isSuccess, onNext]);

  return (
    <Box sx={{ pt: 2 }}>
      <Card sx={{ p: 2 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
          <Box>
            <CustomInputLabel label=" Figopara Müşteri mi?" />
            <RadioGroup
              value={(isFigoUser ?? false).toString()}
              onChange={(e) => handleUserTypeChange(e.target.value)}
              row>
              <FormControlLabel value="true" control={<Radio />} label="Evet" />
              <FormControlLabel value="false" control={<Radio />} label="Hayır" />
            </RadioGroup>
          </Box>

          {isFigoUser && (
            <Box sx={{ flex: '0 0 80%' }}>
              <Form form={figoForm as unknown as UseFormReturn<FieldValues>} schema={figoUserSchema} />
            </Box>
          )}
        </Box>
        {!isFigoUser && (
          <Box>
            <Form form={form} schema={newUserSchema}></Form>
          </Box>
        )}
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <LoadingButton
          id="company-info-next-btn"
          loading={isLoading}
          variant="contained"
          onClick={isFigoUser ? figoForm.handleSubmit(onFigoSubmit) : handleSubmit(onSubmit)}>
          İleri
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default CompanyInfoStep;
