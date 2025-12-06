import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { DifferenceEntry } from '../../../difference-entry.types';

interface FormData {
  CompanyId: number;
  ProductType: number | null;
  DeficiencyType: number;
  DeficiencyStatus: number;
  ExpectedDueDate: string;
  Description: string;
}

interface UseDifferenceEntryFormProps {
  processTypes: Array<{ Value: number; Description: string }>;
  differenceTypes: Array<{ Value: number; Description: string }>;
  statusList: Array<{ Value: number; Description: string }>;
  companiesResult?: Array<{ Id: number; Identifier: string; CompanyName: string }>;
  onCompanySearch: (searchValue: string) => Promise<void>;
  isCompanySearchLoading?: boolean;
}

function useDifferenceEntryForm({
  processTypes,
  differenceTypes,
  statusList,
  companiesResult = [],
  onCompanySearch,
  isCompanySearchLoading = false,
}: UseDifferenceEntryFormProps) {
  const initialValues: FormData = {
    CompanyId: 0,
    ProductType: null,
    DeficiencyType: 0,
    DeficiencyStatus: 1,
    ExpectedDueDate: '',
    Description: '',
  };

  // Prepare options for dropdowns
  const processTypeOptions = useMemo(
    () => processTypes.map((type) => ({ Value: type.Value, Description: type.Description })),
    [processTypes],
  );

  const differenceTypeOptions = useMemo(
    () => differenceTypes.map((type) => ({ Value: type.Value, Description: type.Description })),
    [differenceTypes],
  );

  const statusOptions = useMemo(
    () => statusList.map((status) => ({ Value: status.Value, Description: status.Description })),
    [statusList],
  );

  const companyOptions = useMemo(
    () =>
      companiesResult.map((company) => ({
        Value: company.Id,
        Description: `${company.Identifier} / ${company.CompanyName}`,
      })),
    [companiesResult],
  );

  // Form schema following OperationPricing pattern
  const schema = useMemo(() => {
    return yup.object().shape({
      DeficiencyType: fields
        .select(differenceTypeOptions, 'number', ['Value', 'Description'])
        .required('Farklılık tipi seçimi zorunludur')
        .label('Farklılık Tipi'),
      ProductType: yup
        .number()
        .nullable()
        .oneOf([null, ...processTypeOptions.map((option) => option.Value)], 'Geçersiz süreç tipi seçimi')
        .required('İlgili Süreç seçimi zorunludur')
        .label('İlgili Süreç'),
      CompanyId: fields
        .asyncAutoComplete(
          companyOptions,
          'number',
          ['Value', 'Description'],
          onCompanySearch,
          isCompanySearchLoading,
          2, // minSearchLength
        )
        .required('Ünvan seçimi zorunludur')
        .label('Ünvan'),
      ExpectedDueDate: fields.date
        .required('Beklenen Tamamlanma Tarihi zorunludur')
        .label('Beklenen Tamamlanma Tarihi'),
      DeficiencyStatus: fields
        .select(statusOptions, 'number', ['Value', 'Description'])
        .required('Statü seçimi zorunludur')
        .label('Statü'),
      Description: fields.textarea.required('Notlar zorunludur').min(1, 'Notlar boş olamaz').label('Notlar'),
    }) as yup.ObjectSchema<FormData>;
  }, [
    processTypeOptions,
    differenceTypeOptions,
    statusOptions,
    companyOptions,
    onCompanySearch,
    isCompanySearchLoading,
  ]);

  const form = useForm<FormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const transformFormData = (data: {
    CompanyId: number;
    ProductType: number | null;
    DeficiencyType: number;
    DeficiencyStatus: number;
    ExpectedDueDate: string;
    Description: string;
  }): Partial<DifferenceEntry> => {
    return {
      CompanyId: data.CompanyId,
      ProductType: data.ProductType ?? 0, // Convert null to 0 as default
      DeficiencyType: data.DeficiencyType,
      DeficiencyStatus: data.DeficiencyStatus,
      ExpectedDueDate: data.ExpectedDueDate,
      Description: data.Description,
    };
  };

  return {
    form,
    schema,
    transformFormData,
  };
}

export default useDifferenceEntryForm;
