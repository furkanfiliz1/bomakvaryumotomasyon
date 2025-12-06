import yup from '@validation';
import { AnyObject } from 'yup';

import { fields } from '@components';
import type { RiskyCalculationType } from '../limit-operations.types';

// Define financer company type for the schema - matches transformed data format
export interface FinancerCompanyOption {
  value: number;
  label: string;
}

// Define company search result type for asyncAutoComplete
export interface CompanySearchResult {
  Id: number;
  CompanyName: string;
  Identifier: string;
}

/**
 * Schema for creating legal proceeding compensation
 * Following the OperationPricing form patterns and reference AddCompensation.js logic
 */
export const createLegalProceedingCompensationSchema = (
  financerCompanies: FinancerCompanyOption[] = [],
  riskyCalculations: RiskyCalculationType[] = [],
  companySearchResults: CompanySearchResult[] = [],
  searchCompaniesByIdentifier: (identifier?: string) => Promise<void>,
  isCompanySearchLoading: boolean,
) => {
  console.log('financerCompanies', financerCompanies);
  // Product type options (filtered to only include types 3 and 4 like reference)
  const productTypeOptions = [
    { Value: 3, Description: 'Fatura Finansmanı' },
    { Value: 4, Description: 'Çek Finansmanı' },
  ];

  return yup.object({
    identifier: fields
      .asyncAutoComplete(
        companySearchResults,
        'string',
        ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
        searchCompaniesByIdentifier,
        isCompanySearchLoading,
        3, // minimum search length
      )
      .required('Ünvan / VKN zorunludur')
      .label('Ünvan / VKN')
      .meta({
        col: 6,
      }),

    compensationDate: fields.date.required('Tazmin Tarihi zorunludur').label('Tazmin Tarihi').meta({
      col: 6,
    }),

    amount: fields.currency
      .required('Tazmin Tutarı zorunludur')
      .min(0.01, "Tazmin tutarı 0'dan büyük olmalıdır")
      .label('Tazmin Tutarı')
      .meta({
        col: 6,
      }),

    financerCompany: fields
      .select(financerCompanies, 'number', ['value', 'label'])
      .required('Finansör Ünvan seçilmelidir')
      .label('Finansör Ünvan')
      .meta({
        col: 6,
        showSelectOption: true,
      }),

    riskyFinancialSituations: fields
      .multipleSelect(riskyCalculations, 'number', ['Id', 'Name'])
      .optional()
      .label('Şirket Durumu')
      .meta({
        col: 6,
      }),

    productType: fields
      .select(productTypeOptions, 'number', ['Value', 'Description'])
      .required('Teminat Türü seçilmelidir')
      .label('Teminat Türü')
      .meta({
        col: 6,
      }),
  });
};
