import dayjs from 'dayjs';
import * as yup from 'yup';

/**
 * Turkish Phone Number Validation
 * Accepts:
 * - Mobile: 5xx xxx xx xx (e.g., 555 555 55 55, 0555 555 55 55)
 * - Landline: 2xx xxx xx xx, 3xx xxx xx xx, 4xx xxx xx xx (e.g., 212 434 11 22, 0212 434 11 22)
 *
 * Automatically removes:
 * - Leading 0 (Turkish domestic prefix)
 * - Spaces, dashes, parentheses
 */
yup.addMethod(yup.string, 'validPhone', function (messageError) {
  return this.test('validPhone', messageError, (value) => {
    if (value && value.length > 0) {
      // Remove all non-digit characters for validation
      const cleaned = value.replace(/\D/g, '');

      // Remove leading 0 if present (Turkish domestic format)
      const normalized = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;

      // Mobile: 5xx xxx xx xx (10 digits starting with 5)
      const mobilePattern = /^5\d{9}$/;

      // Landline: 2xx xxx xx xx or 3xx xxx xx xx (10 digits starting with 2, 3, or 4)
      const landlinePattern = /^[2-4]\d{9}$/;

      return mobilePattern.test(normalized) || landlinePattern.test(normalized);
    }
    return true;
  });
});
yup.addMethod(yup.string, 'validEmail', function (messageError) {
  return this.test('validEmail', messageError, (value) => {
    if (value && value.length > 0) {
      return /^[A-Za-z0-9._+\-']+@[A-Za-z0-9.-]+\.[a-z]{2,}$/g.test(value);
    }
    return true;
  });
});

yup.addMethod(yup.number, 'validYear', function (messageError) {
  return this.test('validYear', messageError, (value) => {
    if (value && value > 1800 && value < 2500) {
      return true;
    }
    return false;
  });
});

yup.addMethod(yup.number, 'validQuarter', function (messageError, max) {
  return this.test('validQuarter', messageError, (value) => {
    if (value && value >= 1 && value <= max) {
      return true;
    }
    return false;
  });
});

yup.addMethod(yup.string, 'disablePast', function (messageError) {
  return this.test('disablePast', messageError, (value) => {
    const currentDate = dayjs();
    const providedDate = dayjs(value);

    if (!dayjs(providedDate).isValid()) {
      // no value yet...
      return true;
    }

    if (providedDate.isBefore(currentDate, 'day')) {
      return false; // Validation passes
    }

    return true;
  });
});

yup.addMethod(yup.string, 'disableFuture', function (messageError) {
  return this.test('disableFuture', messageError, (value) => {
    const currentDate = dayjs();
    const providedDate = dayjs(value);
    if (!dayjs(providedDate).isValid()) {
      // no value yet...
      return true;
    }

    if (providedDate.isAfter(currentDate, 'day')) {
      return false; // Validation passes
    }

    return false;
  });
});

declare module 'yup' {
  interface StringSchema {
    validPhone(message: string): StringSchema;
    validEmail(message: string): StringSchema;
    disablePast(message: string): StringSchema;
    disableFuture(message: string): StringSchema;
  }

  interface NumberSchema {
    validYear(message: string): NumberSchema;
    validQuarter(message: string, max: number): NumberSchema;
  }
}

export default yup;
