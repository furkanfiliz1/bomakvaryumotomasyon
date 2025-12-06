import { UseFormReturn } from 'react-hook-form';
import { AnyObject } from 'yup';
import { IconTypes } from '../Icon/types';
import { SchemaField, SchemaInputType } from './enums';

export type Entries = [string, string | ((values: SelectOption) => string)];

export interface IControl {
  value?: string | number | boolean;
  onChange?: (...event: (string | number | boolean)[]) => void;
}

export interface IInput {
  name: string;
  form: UseFormReturn;
  label?: string;
  mb?: number;
  mt?: number;
  type?: React.InputHTMLAttributes<unknown>['type'];
  minRows?: number;
  maxRows?: number;
  readonly?: boolean;
  size?: 'medium' | 'small';
  visible?: boolean;
  trim?: boolean;
  maxLength?: number;
  inputType?: 'string' | 'number';
  currency?: string;
  autoFocus?: boolean;
  inputLabelBg?: string;
  placeholder?: string;
  tooltipIcon?: keyof typeof IconTypes;
  tooltipText?: string;
  subText?: string;
  disabled?: boolean;
}

export interface IInputSelect extends IInput {
  options?: SelectOptions;
  entries?: Entries;
  defaultValue?: AnyObject;
  disabled?: boolean;
  tooltip?: string;
  defaultTitle?: string;
  selectInputValueChange?: (value: string) => void;
  maxWidth?: string;
  showSelectOption?: boolean;
  showSelectOptionText?: string;
}

export interface IInputAsyncAutoComplete extends IInput {
  options?: SelectOptions;
  entries?: Entries;
  defaultValue?: AnyObject;
  disabled?: boolean;
  onSearch?: (searchValue: string) => Promise<void>;
  isLoading?: boolean;
  minSearchLength?: number;
}

export interface IInputRadio extends IInput {
  radios?: SelectOptions;
  defaultValue?: AnyObject;
  raidoInputValueChange?: (value: string) => void;
}

export type SelectOption = AnyObject;
export type SelectOptions = SelectOption[];

export type RadioOption = AnyObject;
export type RadioOptions = RadioOption[];

export interface SchemaMeta {
  name: string;
  col: number;
  label: string;
  field: SchemaField;
  fields?: SchemaMeta[];
  fieldType: string;
  type?: SchemaInputType;
  maxRows?: number;
  accept?: string;
  iconSize?: number;
  width?: number;
  height?: number;
  mb?: number;
  options?: SelectOptions;
  readonly?: boolean;
  addLabel?: string;
  visible?: boolean;
  entries?: Entries;
  maxLength?: number;
  trim?: boolean;
  element?: () => JSX.Element;
  inputType?: 'string' | 'number';
  autoFocus?: boolean;
  minDate?: Date;
  maxDate?: Date;
  endAdornmentText?: string;
  disabled?: boolean;
  defaultTitle?: string;
  selectInputValueChange: (value: string) => void;
  placeholder?: string;
  disablePast?: boolean;
  disableFuture?: boolean;
  radios?: RadioOptions;
  size?: 'small' | 'medium';
  tooltipIcon?: keyof typeof IconTypes;
  tooltipText?: string;
  subText?: string;
  onSearch?: (searchValue: string) => Promise<void>;
  isLoading?: boolean;
  minSearchLength?: number;
  maxWidth?: string;
  mt?: number;
  showSelectOption?: boolean;
  showSelectOptionText?: string;
  views?: ('year' | 'month' | 'day')[];
}

// Export AnyObject for use in async autocomplete type definitions
export type { AnyObject };
