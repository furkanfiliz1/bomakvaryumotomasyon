/**
 * Lead Add Manuel Form Hook
 * Schema and validation for manual lead creation
 * Following OperationPricing pattern with dynamic product types from API
 */

import { fields } from '@components';
import yup from '@validation';
import { useMemo } from 'react';
import { ProductTypeOption } from 'src/api/figoParaApi';

export const useLeadAddManuelSchema = (productTypeList: ProductTypeOption[]) => {
  return useMemo(
    () =>
      yup.object({
        taxNumber: fields.text
          .label('VKN')
          .required('VKN zorunludur')
          .min(10, 'VKN 10 veya 11 haneli olmalıdır')
          .meta({ col: 6, maxLength: 11, inputType: 'number' }),
        title: fields.text.label('Ünvan').required('Ünvan zorunludur').meta({ col: 6 }),
        firstName: fields.text.label('Ad').required('Ad zorunludur').meta({ col: 6 }),
        lastName: fields.text.label('Soyad').required('Soyad zorunludur').meta({ col: 6 }),
        phone: fields.phone
          .label('Cep Telefonu')
          .validPhone('Geçerli bir cep telefonu numarası giriniz')
          .required('Cep telefonu zorunludur')
          .meta({ col: 6 }),
        products: fields
          .multipleSelect(productTypeList, 'number', ['Value', 'Description'])
          .label('İlgilendiği Ürünler')
          .required('En az bir ürün seçilmelidir')
          .meta({ col: 6 }),
      }),
    [productTypeList],
  );
};
