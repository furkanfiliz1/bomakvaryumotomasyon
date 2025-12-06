/**
 * Bank Figo Rebate Helper Functions
 * Business logic and data transformation utilities
 */

import dayjs from 'dayjs';
import type {
  BankFigoRebateFormData,
  BankFigoRebateItem,
  CreateBankFigoRebateRequest,
  UpdateBankFigoRebateRequest,
} from '../bank-figo-rebate.types';

/**
 * Format date for API request (ISO format with timezone)
 * Matches legacy: moment(date).format()
 */
export const formatDateForApi = (date: string | null): string | null => {
  if (!date) return null;
  return dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ');
};

/**
 * Format date for display (DD.MM.YYYY)
 * Matches legacy DatePicker format
 */
export const formatDateForDisplay = (date: string | null): string => {
  if (!date) return '';
  return dayjs(date).format('DD.MM.YYYY');
};

/**
 * Parse date from API response for form usage
 */
export const parseDateFromApi = (date: string | null): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Transform form data to create request payload
 * Matches legacy postRebate() transformation
 */
export const transformFormToCreateRequest = (formData: BankFigoRebateFormData): CreateBankFigoRebateRequest => {
  return {
    FinancerCompanyId: Number(formData.FinancerCompanyId),
    StartDate: formatDateForApi(formData.StartDate) as string,
    FinishDate: formatDateForApi(formData.FinishDate || null),
    Rate: parseFloat(formData.Rate),
  };
};

/**
 * Transform rebate item to update request payload
 * Matches legacy updateRebate() transformation
 */
export const transformItemToUpdateRequest = (
  item: BankFigoRebateItem,
  updatedFields: Partial<{
    StartDate: string;
    FinishDate: string | null;
    Rate: number;
  }>,
): UpdateBankFigoRebateRequest => {
  return {
    Id: item.Id,
    FinancerCompanyId: item.FinancerCompanyId,
    StartDate: formatDateForApi(updatedFields.StartDate ?? item.StartDate) as string,
    FinishDate: formatDateForApi(updatedFields.FinishDate ?? item.FinishDate),
    Rate: updatedFields.Rate ?? item.Rate,
    FinancerCompanyName: item.FinancerCompanyName,
  };
};

/**
 * Validate create form data
 * Matches legacy validation: FinancerCompanyId, StartDate, Rate required
 */
export const validateCreateForm = (
  formData: BankFigoRebateFormData,
): { isValid: boolean; errorMessage: string | null } => {
  if (!formData.FinancerCompanyId || formData.FinancerCompanyId === '') {
    return { isValid: false, errorMessage: 'Finansör, Tarih Aralığı veya Oran girmek zorunludur' };
  }
  if (!formData.StartDate) {
    return { isValid: false, errorMessage: 'Finansör, Tarih Aralığı veya Oran girmek zorunludur' };
  }
  if (!formData.Rate || formData.Rate === '') {
    return { isValid: false, errorMessage: 'Finansör, Tarih Aralığı veya Oran girmek zorunludur' };
  }
  return { isValid: true, errorMessage: null };
};

/**
 * Validate update item data
 * Matches legacy validation for update
 */
export const validateUpdateItem = (
  startDate: string | null,
  rate: number | string,
): { isValid: boolean; errorMessage: string | null } => {
  if (!startDate) {
    return { isValid: false, errorMessage: 'Finansör, Tarih Aralığı veya Oran girmek zorunludur' };
  }
  if (rate === '' || rate === null || rate === undefined) {
    return { isValid: false, errorMessage: 'Finansör, Tarih Aralığı veya Oran girmek zorunludur' };
  }
  return { isValid: true, errorMessage: null };
};

/**
 * Get initial form values
 */
export const getInitialFormValues = (): BankFigoRebateFormData => {
  return {
    FinancerCompanyId: '',
    StartDate: '',
    FinishDate: '',
    Rate: '',
  };
};
