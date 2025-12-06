import { fields } from '@components';
import * as yup from 'yup';
import type { SupplierQueryFormValues } from './supplier-query.types';

/**
 * Supplier Query form validation schema - matches legacy validation exactly
 */
export const createSupplierQuerySchema = (): yup.ObjectSchema<SupplierQueryFormValues> => {
  return yup.object({
    buyerCode: fields.text
      .required('Alıcı kodu gereklidir.')
      .trim()
      .min(1, 'Alıcı kodu boş olamaz.')
      .label('Alıcı Kodu'),
  }) as yup.ObjectSchema<SupplierQueryFormValues>;
};
