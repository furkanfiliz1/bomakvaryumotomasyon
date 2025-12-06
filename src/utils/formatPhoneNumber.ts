export const formatPhoneNumber = (phoneNumber?: string | null): string => {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const tenDigits = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;

  if (tenDigits.length !== 10) {
    return phoneNumber;
  }

  const match = tenDigits.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);

  if (match) {
    return `(${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
  }

  return phoneNumber;
};

export const formatPhoneNumberLastFourDigits = (phoneNumber?: string | null): string => {
  // This function formats the last four digits of a phone number rest of the number is hidden with asterisks and with () first three digits
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const tenDigits = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
  if (tenDigits.length !== 10) {
    return phoneNumber;
  }
  const match = tenDigits.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `(***) *** ${match[3]}-${match[4]}`;
  }
  return phoneNumber;
};
