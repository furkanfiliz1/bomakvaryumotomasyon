import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useForm } from 'react-hook-form';

import type { Company, Currency } from '../companies.types';

interface UseCompanyCodeFormProps {
  initialData?: {
    Code?: string;
    SenderIdentifier?: string;
    FinancerCompanyId?: number | null;
    CurrencyId?: number | null;
  };
  company: Company;
  financierCompanies?: Company[];
  currencies?: Currency[];
}

export const useCompanyCodeForm = ({
  initialData,
  company,
  financierCompanies = [],
  currencies = [],
}: UseCompanyCodeFormProps) => {
  const isBuyer = company.ActivityType === 1;
  const isFinancier = company.ActivityType === 3;

  const getSchema = () => {
    // Build schema object dynamically based on company type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schemaShape: Record<string, any> = {
      Code: fields.text
        .required('Şirket kodu zorunludur')
        .label('Şirket Kodu')
        .meta({
          col: isFinancier || isBuyer ? 6 : 12,
        }),
      SenderIdentifier: fields.text
        .required('Tanımlanan şirket VKN/TCKN zorunludur')
        .matches(/^\d+$/, 'Sadece rakam girilmelidir')
        .label('Tanımlanan Şirket VKN/TCKN')
        .meta({
          col: isFinancier || isBuyer ? 6 : 12,
          disabled: !!initialData?.SenderIdentifier,
        }),
    };

    // Add FinancerCompanyId field for Buyer companies
    if (isBuyer) {
      schemaShape.FinancerCompanyId = fields
        .select(financierCompanies, 'number', ['Id', 'CompanyName'], false, undefined, true)
        .nullable()
        .label('Finansör Şirket')
        .meta({
          col: 6,
        });
    }

    // Add CurrencyId field for Financier companies
    if (isFinancier) {
      schemaShape.CurrencyId = fields
        .select(currencies, 'number', ['Id', 'Code'], false, undefined, false)
        .required('Para birimi zorunludur')
        .label('Para Birimi')
        .meta({
          col: 6,
        });
    }

    return yup.object(schemaShape);
  };

  const schema = getSchema();

  const defaultValues = {
    Code: initialData?.Code || '',
    SenderIdentifier: initialData?.SenderIdentifier || '',
    FinancerCompanyId: initialData?.FinancerCompanyId || null,
    CurrencyId: initialData?.CurrencyId || (isFinancier ? 1 : null),
  };

  const form = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return { form, schema };
};
