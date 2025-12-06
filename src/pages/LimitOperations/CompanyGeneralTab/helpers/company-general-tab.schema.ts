import { fields } from '@components';
import yup from '@validation';

/**
 * Form Schemas for Company General Tab
 * Following OperationPricing pattern for schema-based validation
 */

/**
 * General Information Form Schema
 */
export const createGeneralInformationSchema = () => {
  return yup.object({
    transferActive: yup.boolean().required('Transfer durumu seçimi gereklidir').label('Transfer Durumu'),
    startTransferDate: fields.date
      .nullable()
      .when('transferActive', {
        is: true,
        then: (schema) => schema.required('Transfer aktifken başlangıç tarihi gereklidir'),
        otherwise: (schema) => schema.nullable(),
      })
      .label('İlk Transfer Tarihi'),
  });
};

/**
 * Score Information Form Schema
 */
export const createScoreInformationSchema = () => {
  return yup.object({
    nextOutgoingDate: fields.date
      .required('Integratör son transfer tarihi gereklidir')
      .label('Integratör Son Transfer'),
  });
};

/**
 * Combined form schema factory
 * Returns appropriate schema based on form type
 */
export const createCompanyGeneralTabSchema = (formType: 'general' | 'score') => {
  switch (formType) {
    case 'general':
      return createGeneralInformationSchema();
    case 'score':
      return createScoreInformationSchema();
    default:
      throw new Error(`Unknown form type: ${formType}`);
  }
};
