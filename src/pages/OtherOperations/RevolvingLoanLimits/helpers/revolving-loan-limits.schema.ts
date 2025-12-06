import { fields } from '@components';
import yup from '@validation';
import type { RevolvingLoanLimitsFormValues } from '../revolving-loan-limits.types';

/**
 * Revolving Loan Limits Form Schema - matches legacy validation exactly
 */
export const createRevolvingLoanLimitsSchema = () => {
  return yup.object({
    Identifier: fields.text
      .required('Bu alan zorunludur')
      .min(10, 'TCKN en az 10 haneli olmalıdır.')
      .max(11, 'TCKN 11 haneli olmalıdır.')
      .label('VKN')
      .meta({
        col: 12,
        maxLength: 11,
      }),
  }) as yup.ObjectSchema<RevolvingLoanLimitsFormValues>;
};
