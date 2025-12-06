import { fields } from '@components';
import yup from '@validation';
import type { AnyObject } from 'yup';

/**
 * Schema for creating new compensation transactions
 * Following the OperationPricing form patterns
 */
export const createCompensationTransactionCreateSchema = (
  transactionTypes: { value: string; label: string }[] = [],
  financerCompanies: { value: number; label: string }[] = [],
  companiesSearchResults: Array<{ Identifier: string; CompanyName: string }> = [],
  searchCompaniesByNameOrIdentifier?: (searchValue: string) => Promise<void>,
  isCompaniesSearchLoading?: boolean,
) => {
  console.log('transactionTypes', transactionTypes);
  return yup.object({
    operationType: fields
      .select(transactionTypes, 'string', ['value', 'label'])
      .required('İşlem tipi seçimi zorunludur')
      .label('İşlem Tipi')
      .meta({
        col: 6,
        size: 'medium',
      }),

    identifier: fields
      .asyncAutoComplete(
        companiesSearchResults,
        'string',
        ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
        searchCompaniesByNameOrIdentifier,
        isCompaniesSearchLoading,
        3,
      )
      .required('Ünvan / VKN zorunludur')
      .label('Ünvan / VKN')
      .meta({
        col: 6,
        size: 'medium',
        placeholder: 'VKN/Ünvan arayın...',
      }),

    financerCompany: fields
      .select(financerCompanies, 'number', ['value', 'label'], false)
      .optional()
      .nullable()
      .label('Finansör Şirket')
      .meta({
        col: 6,
        size: 'medium',
      }),

    transactionDate: fields.date.required('İşlem tarihi zorunludur').label('İşlem Tarihi').meta({
      col: 6,
      size: 'medium',
    }),

    amount: fields.currency.required('Tutar zorunludur').min(0.01, "Tutar 0'dan büyük olmalıdır").label('Tutar').meta({
      col: 6,
      size: 'medium',
    }),
  });
};

/**
 * Schema for updating compensation transactions
 * Following the OperationPricing form patterns
 * VKN and Ünvan are shown as separate readonly text fields
 */
export const createCompensationTransactionUpdateSchema = (
  transactionTypes: { value: string; label: string }[] = [],
  financerCompanies: { value: number; label: string }[] = [],
) => {
  return yup.object({
    operationType: fields
      .select(transactionTypes, 'string', ['value', 'label'])
      .required('İşlem tipi seçimi zorunludur')
      .label('İşlem Tipi')
      .meta({
        col: 6,
        size: 'medium',
      }),

    identifier: fields.text.required('VKN zorunludur').label('VKN').meta({
      col: 6,
      size: 'medium',
      disabled: true, // Read-only in edit mode
    }),

    customerName: fields.text.optional().label('Ünvan').meta({
      col: 6,
      size: 'medium',
      disabled: true, // Read-only in edit mode
    }),

    financerCompany: fields
      .select(financerCompanies, 'number', ['value', 'label'], false)
      .optional()
      .nullable()
      .label('Finansör Şirket')
      .meta({
        col: 6,
        size: 'medium',
      }),

    transactionDate: fields.date.required('İşlem tarihi zorunludur').label('İşlem Tarihi').meta({
      col: 6,
      size: 'medium',
    }),

    amount: fields.currency.required('Tutar zorunludur').min(0.01, "Tutar 0'dan büyük olmalıdır").label('Tutar').meta({
      col: 6,
      size: 'medium',
    }),
  });
};
