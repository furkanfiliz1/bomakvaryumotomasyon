import yup from '@validation';
import { SchemaField, SchemaInputType } from '../enums';
import { Entries, SelectOptions } from '../types';

export const string = yup.string().default('').trim();

export const text = string.meta({
  field: SchemaField.InputText,
  type: SchemaInputType.text,
});

export const number = yup
  .number()
  .meta({
    field: SchemaField.InputText,
    type: SchemaInputType.number,
  })
  .transform((value) => (isNaN(value) ? null : value));

export const texteditor = string.meta({
  field: SchemaField.InputTextEditor,
  type: SchemaInputType.texteditor,
});

export const currency = yup
  .number()
  .meta({
    field: SchemaField.InputCurrency,
  })
  .transform((value) => (isNaN(value) ? null : value));

export const textarea = string.meta({
  field: SchemaField.InputText,
  type: SchemaInputType.textarea,
});

export const checkbox = yup.mixed().meta({
  field: SchemaField.InputCheckbox,
  type: SchemaInputType.checkbox,
});

export const switchField = yup.boolean().meta({
  field: SchemaField.InputSwitch,
});

export const switchNumber = yup.number().meta({
  field: SchemaField.InputSwitch,
});

export const radio = yup.mixed().meta({
  field: SchemaField.InputRadio,
  type: SchemaInputType.radio,
});

export const date = string.meta({ field: SchemaField.InputDate, type: SchemaInputType.date });

export const phone = string.meta({ field: SchemaField.InputPhoneNumber });

export const password = string
  .label('Parola')
  .meta({ field: SchemaField.InputPassword, type: SchemaInputType.password });

export const url = string.meta({
  field: SchemaField.InputText,
  type: SchemaInputType.url,
});

export const iban = string.meta({
  field: SchemaField.InputIBAN,
});

export const inputNumericMask = string.meta({
  field: SchemaField.InputNumericMask,
});

export const select = (
  options: SelectOptions,
  type: 'string' | 'number',
  entries: Entries,
  disabled?: boolean,
  tooltip?: string,
  showSelectOption?: boolean,
) => {
  if (type === 'number')
    return yup
      .number()
      .transform((value) => (isNaN(value) ? null : value))
      .meta({
        field: SchemaField.InputSelect,
        options,
        entries,
        type: SchemaInputType.number,
        disabled,
        tooltipText: tooltip,
        showSelectOption,
      });
  else {
    return yup.string().meta({
      field: SchemaField.InputSelect,
      options,
      entries,
      type: SchemaInputType.text,
      disabled,
      tooltipText: tooltip,
      showSelectOption,
    });
  }
};

export const multipleSelect = (
  options: SelectOptions,
  type: 'string' | 'number',
  entries: Entries,
  disabled?: boolean,
  tooltip?: string,
) => {
  if (type === 'number')
    return yup.array().of(yup.number().required()).default([]).meta({
      field: SchemaField.InputMultiSelect,
      options,
      entries,
      type: SchemaInputType.number,
      disabled,
      tooltipText: tooltip,
      multiple: true,
    });
  else {
    return yup.array().of(yup.string().required()).default([]).meta({
      field: SchemaField.InputMultiSelect,
      options,
      entries,
      type: SchemaInputType.text,
      disabled,
      tooltipText: tooltip,
      multiple: true,
    });
  }
};

export const switchButtons = (options: SelectOptions, type: 'string' | 'number', entries: Entries) => {
  if (type === 'number') return yup.number().meta({ field: SchemaField.SwitchButtons, options, entries });
  else {
    return yup.string().meta({ field: SchemaField.SwitchButtons, options, entries });
  }
};

export const autoComplete = (options: SelectOptions, type: 'string' | 'number', entries: Entries) => {
  if (type === 'number')
    return yup
      .number()
      .transform((value) => (isNaN(value) ? null : value))
      .meta({ field: SchemaField.InputAutoComplete, options, entries });
  else {
    return yup.string().meta({ field: SchemaField.InputAutoComplete, options, entries });
  }
};

// Overloads for proper type inference
export function asyncAutoComplete(
  options: SelectOptions,
  type: 'string',
  entries: Entries,
  onSearch?: (searchValue: string) => Promise<void>,
  isLoading?: boolean,
  minSearchLength?: number,
): yup.StringSchema;
export function asyncAutoComplete(
  options: SelectOptions,
  type: 'number',
  entries: Entries,
  onSearch?: (searchValue: string) => Promise<void>,
  isLoading?: boolean,
  minSearchLength?: number,
): yup.NumberSchema;
export function asyncAutoComplete(
  options: SelectOptions,
  type: 'object',
  entries: Entries,
  onSearch?: (searchValue: string) => Promise<void>,
  isLoading?: boolean,
  minSearchLength?: number,
): yup.MixedSchema;
export function asyncAutoComplete(
  options: SelectOptions,
  type: 'string' | 'number' | 'object',
  entries: Entries,
  onSearch?: (searchValue: string) => Promise<void>,
  isLoading?: boolean,
  minSearchLength?: number,
) {
  const meta = {
    field: SchemaField.InputAsyncAutoComplete,
    options,
    entries,
    onSearch,
    isLoading,
    minSearchLength,
  };

  if (type === 'number')
    return yup
      .number()
      .transform((value) => (Number.isNaN(value) ? null : value))
      .meta(meta);
  else if (type === 'object') {
    // For async autocomplete that stores full object (not just string/number value)
    return yup.mixed().meta(meta);
  } else {
    return yup.string().meta(meta);
  }
}

export const customComponent = (element: () => JSX.Element) => {
  return yup.mixed().meta({ field: SchemaField.CustomComponent, element });
};

export const fields = {
  iban,
  url,
  date,
  text,
  currency,
  textarea,
  number,
  autoComplete,
  asyncAutoComplete,
  checkbox,
  switchField,
  switchNumber,
  name: text,
  password,
  select,
  multipleSelect,
  phone,
  texteditor,
  radio,
  switchButtons,
  customComponent,
  inputNumericMask,
};
