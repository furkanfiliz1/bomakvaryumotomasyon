import { fields } from '@components';
import yup from '@validation';
import type { OnboardingStatus } from '../companies.types';

/**
 * Company Status Update Form Schema using built-in Form component patterns
 * Following OperationPricing schema structure and project form standards
 */

// Loan decision types - matching legacy implementation
const LOAN_DECISION_TYPES = [
  { Value: '1', Description: 'Otomatik Onay' },
  { Value: '2', Description: 'Manuel Onay' },
  { Value: '3', Description: 'Red' },
];

export interface CompanyStatusUpdateFormData {
  OnboardingStatusTypes: string;
  LoanDecisionTypes?: string | null;
  OperationalLimit?: number | null;
  commentText?: string | null;
}

export const createCompanyStatusUpdateFormSchema = (
  availableStatuses: OnboardingStatus[] = [],
  showExtraFields: boolean = false,
) => {
  return yup.object({
    // Onboarding Status Selection - Required field
    OnboardingStatusTypes: fields
      .select(availableStatuses, 'string', ['Value', 'Description'])
      .required('Onboarding durumu seçimi zorunludur')
      .label('Onboarding Durumu')
      .meta({
        col: 12,
        placeholder: 'Onboarding durumu seçiniz',
      }),

    // Loan Decision Types - Conditional field (only for status 4 or 17)
    LoanDecisionTypes: fields
      .select(LOAN_DECISION_TYPES, 'string', ['Value', 'Description'])
      .label('Kredi Karar Türü')
      .nullable()
      .meta({
        col: 12,
        placeholder: 'Kredi karar türü seçiniz',
        visible: showExtraFields,
      }),

    // Operational Limit - Conditional currency field (only for status 4 or 17)
    OperationalLimit: fields.currency.label('Operasyonel Limit').nullable().meta({
      col: 12,
      currency: 'TRY',
      visible: showExtraFields,
    }),

    // Comment Text - Optional multiline text
    commentText: fields.textarea.label('Yorum').nullable().meta({
      col: 12,
      placeholder: 'Durum değişikliği hakkında yorum ekleyin...',
    }),
  });
};

export const DEFAULT_COMPANY_STATUS_UPDATE_FORM: CompanyStatusUpdateFormData = {
  OnboardingStatusTypes: '',
  LoanDecisionTypes: null,
  OperationalLimit: null,
  commentText: null,
};
