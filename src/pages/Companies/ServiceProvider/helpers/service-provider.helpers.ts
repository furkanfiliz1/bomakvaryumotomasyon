import type { IntegratorType, NestedIntegratorOption } from '../service-provider.types';

/**
 * Converts nested integrators response to flat dropdown options
 * Matches legacy renderNestedIntegratorsSelection method functionality
 */
export const flattenNestedIntegrators = (list: IntegratorType[], childLevel = 0): NestedIntegratorOption[] => {
  const result: NestedIntegratorOption[] = [];

  const processLevel = (items: IntegratorType[], level: number) => {
    items.forEach((item) => {
      const isChild = level > 0;
      const optionName = isChild ? `${' - '.repeat(level)}${item.Name}` : item.Name;

      result.push({
        Id: item.Id,
        Name: optionName,
      });

      if (item.SubIntegrators && item.SubIntegrators.length > 0) {
        processLevel(item.SubIntegrators, level + 1);
      }
    });
  };

  processLevel(list, childLevel);
  return result;
};

/**
 * Gets integrator type display label
 */
export const getIntegratorTypeLabel = (type: number): string => {
  switch (type) {
    case 1:
      return 'Fatura';
    case 2:
      return 'Edefter';
    case 3:
      return 'Dosya Servisi';
    case 4:
      return 'Web Servis';
    case 5:
      return 'Banka Hareket Servisi';
    case 6:
      return 'Banka';
    case 7:
      return 'Banka Hesabı';
    default:
      return 'Bilinmiyor';
  }
};

/**
 * Formats parameter key for display
 */
export const formatParameterKey = (key: string, subKey?: string): string => {
  return subKey ? `${key}--${subKey}` : key;
};

/**
 * Parses parameter key back to original format
 */
export const parseParameterKey = (paramKey: string): { key: string; subKey?: string } => {
  if (paramKey.indexOf('--') < 0) {
    return { key: paramKey };
  }

  const [key, subKey] = paramKey.split('--');
  return { key, subKey };
};

/**
 * Formats parameter description for display
 */
export const formatParameterDescription = (description: string, subKey?: string): string => {
  return subKey ? `${description} (${subKey})` : description;
};

/**
 * Validates integrator parameter form data
 */
export const validateIntegratorParameters = (parameters: Record<string, string>): boolean => {
  // Check if all required parameters have values
  return Object.values(parameters).every((value) => value && value.trim().length > 0);
};
