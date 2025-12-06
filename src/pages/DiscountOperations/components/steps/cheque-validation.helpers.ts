import { ChequeValidationError, ExcelChequeData } from './cheque.types';

/**
 * Cheque Excel validation helper
 * Referans: /Users/furkanfiliz/Desktop/Project/Figopara.Operation/src/helpers/chequeHelper.js
 * OperationPricing pattern'ini takip eder
 */
export const validateChequeExcelData = (data: ExcelChequeData[]): ChequeValidationError[] => {
  const errors: ChequeValidationError[] = [];

  data.forEach((cheque, index) => {
    const chequeErrors: string[] = [];

    // Required field validations - referans projeden alınan kurallar
    if (!cheque.bankEftCode || cheque.bankEftCode === '') {
      chequeErrors.push('bankEftCode');
    }

    if (!cheque.no || cheque.no === '') {
      chequeErrors.push('no');
    }

    if (!cheque.chequeAccountNo || cheque.chequeAccountNo === '') {
      chequeErrors.push('chequeAccountNo');
    }

    if (!cheque.drawerIdentifier || cheque.drawerIdentifier === '') {
      chequeErrors.push('drawerIdentifier');
    }

    if (!cheque.paymentDueDate || cheque.paymentDueDate === '') {
      chequeErrors.push('paymentDueDate');
    }

    if (!cheque.payableAmountCurrency) {
      chequeErrors.push('payableAmountCurrency');
    }

    if (!cheque.payableAmount || Number(cheque.payableAmount) <= 0) {
      chequeErrors.push('payableAmount');
    }

    // Place of issue validation - zorunlu alan
    if (!cheque.placeOfIssue || cheque.placeOfIssue === '') {
      chequeErrors.push('placeOfIssue');
    }

    // Optional field validation for drawer name - referans projede var
    if (!cheque.drawerName || cheque.drawerName === '') {
      chequeErrors.push('drawerName');
    }

    // Date format validation
    if (cheque.paymentDueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(cheque.paymentDueDate)) {
        chequeErrors.push('paymentDueDate');
      }
    }

    // VKN/TCKN validation (basic length check)
    if (cheque.drawerIdentifier) {
      const identifier = String(cheque.drawerIdentifier).replace(/\s/g, '');
      if (identifier.length !== 10 && identifier.length !== 11) {
        chequeErrors.push('drawerIdentifier');
      }
    }

    // Amount validation
    if (cheque.payableAmount) {
      const amount = Number(cheque.payableAmount);
      if (isNaN(amount) || amount <= 0) {
        chequeErrors.push('payableAmount');
      }
    }

    // Currency validation
    if (cheque.payableAmountCurrency) {
      const validCurrencies = ['TRY', 'USD', 'EUR'];
      if (!validCurrencies.includes(cheque.payableAmountCurrency)) {
        chequeErrors.push('payableAmountCurrency');
      }
    }

    // Add validation errors if any exist
    if (chequeErrors.length > 0) {
      errors.push({
        index,
        name: 'ChequeValidationError',
        errors: chequeErrors,
      });
    }
  });

  return errors;
};

/**
 * Get validation error message for a specific field
 */
export const getValidationErrorMessage = (field: string): string => {
  const errorMessages: Record<string, string> = {
    bankEftCode: 'Banka kodu zorunludur',
    no: 'Çek numarası zorunludur',
    chequeAccountNo: 'Çek hesap numarası zorunludur',
    drawerIdentifier: 'Keşideci VKN/TCKN zorunludur ve 10-11 haneli olmalıdır',
    paymentDueDate: 'Çek vade tarihi zorunludur ve YYYY-MM-DD formatında olmalıdır',
    payableAmountCurrency: 'Para birimi zorunludur (TRY, USD, EUR)',
    payableAmount: "Tutar zorunludur ve 0'dan büyük olmalıdır",
    placeOfIssue: 'Keşide yeri zorunludur',
    drawerName: 'Keşideci adı zorunludur',
  };

  return errorMessages[field] || 'Geçersiz değer';
};
