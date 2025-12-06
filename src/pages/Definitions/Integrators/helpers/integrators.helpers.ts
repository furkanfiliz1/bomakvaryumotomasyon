/**
 * Integrators Helpers
 * Business logic and utility functions
 */

import type {
  DataTypeOption,
  FlattenedIntegrator,
  InputDataTypeOption,
  Integrator,
  IntegratorFormData,
  IntegratorParam,
  ParamFormData,
  SubIntegrator,
} from '../integrators.types';

/**
 * Flatten nested integrators for parent dropdown
 * Adds indentation prefix based on nesting level
 */
export const flattenIntegratorsForDropdown = (integrators: Integrator[], level = 0): FlattenedIntegrator[] => {
  const result: FlattenedIntegrator[] = [];

  for (const integrator of integrators) {
    const prefix = level > 0 ? ' - '.repeat(level) : '';
    result.push({
      Id: integrator.Id,
      Name: `${prefix}${integrator.Name}`,
    });

    if (integrator.SubIntegrators && integrator.SubIntegrators.length > 0) {
      const children = flattenIntegratorsForDropdown(integrator.SubIntegrators as Integrator[], level + 1);
      result.push(...children);
    }
  }

  return result;
};

/**
 * Parse integrator form data to API request format
 */
export const parseIntegratorFormData = (
  data: IntegratorFormData,
): {
  Identifier: string;
  Name: string;
  IsActive: boolean;
  IsBackground: boolean;
  Type: string;
  ParentId: string | null;
} => {
  return {
    Identifier: data.Identifier,
    Name: data.Name,
    IsActive: Boolean(data.IsActive),
    IsBackground: Boolean(data.IsBackground),
    Type: String(data.Type),
    ParentId: data.ParentId ? String(data.ParentId) : null,
  };
};

/**
 * Parse param form data to IntegratorParam format
 */
export const parseParamFormData = (
  data: ParamFormData,
  dataTypes: DataTypeOption[],
  inputDataTypes: InputDataTypeOption[],
): IntegratorParam => {
  const dataType = dataTypes.find((dt) => dt.Value === String(data.DataType));
  const inputDataType = inputDataTypes.find((idt) => idt.Value === String(data.InputDataType));

  return {
    Key: data.Key,
    SubKey: data.SubKey || null,
    Description: data.Description,
    DataType: String(data.DataType),
    DataTypeDescription: dataType?.Description || '',
    OrderIndex: Number(data.OrderIndex) || 0,
    InputDataType: String(data.InputDataType),
    InputDataTypeDescription: inputDataType?.Description || '',
    Detail: data.Detail || '',
  };
};

/**
 * Check if integrator has sub-integrators
 */
export const hasSubIntegrators = (integrator: Integrator | SubIntegrator): boolean => {
  return integrator.SubIntegrators && integrator.SubIntegrators.length > 0;
};

/**
 * Get label for true boolean value
 */
export const getTrueLabel = (): string => 'Evet';

/**
 * Get label for false boolean value
 */
export const getFalseLabel = (): string => 'Hayır';

/**
 * Get active status label
 */
export const getActiveLabel = (): string => 'Aktif';

/**
 * Get passive status label
 */
export const getPassiveLabel = (): string => 'Pasif';

/**
 * Sort integrators by name
 */
export const sortIntegratorsByName = (integrators: Integrator[]): Integrator[] => {
  return [...integrators].sort((a, b) => a.Name.localeCompare(b.Name, 'tr'));
};

/**
 * Find integrator by ID in nested structure
 */
export const findIntegratorById = (integrators: Integrator[], id: number): Integrator | SubIntegrator | null => {
  for (const integrator of integrators) {
    if (integrator.Id === id) {
      return integrator;
    }
    if (integrator.SubIntegrators && integrator.SubIntegrators.length > 0) {
      const found = findSubIntegratorById(integrator.SubIntegrators, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Find sub-integrator by ID recursively
 */
const findSubIntegratorById = (subIntegrators: SubIntegrator[], id: number): SubIntegrator | null => {
  for (const sub of subIntegrators) {
    if (sub.Id === id) {
      return sub;
    }
    if (sub.SubIntegrators && sub.SubIntegrators.length > 0) {
      const found = findSubIntegratorById(sub.SubIntegrators, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Get nesting level of an integrator
 */
export const getIntegratorLevel = (integrator: Integrator | SubIntegrator): number => {
  let level = 0;
  if ('ParentId' in integrator && integrator.ParentId !== null) {
    level = 1; // At least level 1 if has parent
  }
  return level;
};

/**
 * Convert base64 to Blob for file download
 */
export const base64ToBlob = (base64: string, mimeType = 'application/pdf'): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.codePointAt(i) ?? 0;
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Download file from base64 content
 */
export const downloadBase64File = (base64: string, fileName: string, mimeType = 'application/pdf'): void => {
  const blob = base64ToBlob(base64, mimeType);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
