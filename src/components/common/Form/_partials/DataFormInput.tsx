import { UseFormReturn } from 'react-hook-form';
import InputAsyncAutoComplete from './_partials/InputAsyncAutoComplete';
import InputAutoComplete from './_partials/InputAutoComplete';
import InputCheckbox from './_partials/InputCheckbox';
import InputCurrency from './_partials/InputCurrency';
import InputDatePicker from './_partials/InputDatePicker';
import InputHidden from './_partials/InputHidden';
import InputIBAN from './_partials/InputIBAN';
import InputMultiSelect from './_partials/InputMultiSelect';
import InputNumericMask from './_partials/InputNumericMask';
import InputPassword from './_partials/InputPassword';
import InputPhoneNumber from './_partials/InputPhoneNumber';
import InputRadio from './_partials/InputRadio';
import InputSelect from './_partials/InputSelect';
import InputSwitch from './_partials/InputSwitch';
import InputText from './_partials/InputText';
import { SchemaField } from './enums';
import { SchemaMeta, SelectOptions } from './types';

interface IDataFormInput {
  name?: string;
  meta: SchemaMeta;
  mb?: number;
  form: UseFormReturn;
  categories?: SelectOptions;
  size?: 'small' | 'medium';
}

export default function DataFormInput({ name, meta, form, mb = 2, size }: IDataFormInput) {
  const inputName = name || meta.name;

  switch (meta.field) {
    case SchemaField.CustomComponent:
      return meta?.element?.() || null;
    case SchemaField.InputText:
      return <InputText {...meta} key={inputName} name={inputName} form={form} mb={mb} />;
    case SchemaField.InputPassword:
      return <InputPassword {...meta} key={inputName} name={inputName} form={form} mb={mb} />;
    case SchemaField.InputCurrency:
      return <InputCurrency {...meta} key={inputName} name={inputName} form={form} mb={mb} />;
    case SchemaField.InputCheckbox:
      return <InputCheckbox {...meta} key={inputName} name={inputName} form={form} mb={mb} />;
    case SchemaField.InputRadio:
      return <InputRadio {...meta} key={inputName} name={inputName} form={form} mb={mb} radios={meta?.radios} />;
    case SchemaField.InputSwitch:
      return <InputSwitch {...meta} key={inputName} name={inputName} form={form} mb={mb} fieldType={meta.fieldType} />;
    case SchemaField.InputSelect:
      return (
        <InputSelect
          key={inputName}
          {...meta}
          name={inputName}
          form={form}
          options={meta?.options}
          entries={meta?.entries}
          mb={mb}
          size={size || 'medium'}
          showSelectOption={meta?.showSelectOption}
        />
      );
    case SchemaField.InputMultiSelect:
      return (
        <InputMultiSelect
          key={inputName}
          {...meta}
          name={inputName}
          form={form}
          options={meta?.options}
          entries={meta?.entries}
          mb={mb}
          size={size || 'medium'}
        />
      );
    case SchemaField.InputAutoComplete:
      return (
        <InputAutoComplete
          key={inputName}
          {...meta}
          name={inputName}
          form={form}
          options={meta?.options}
          entries={meta?.entries}
          mb={mb}
        />
      );
    case SchemaField.InputAsyncAutoComplete:
      return (
        <InputAsyncAutoComplete
          key={inputName}
          {...meta}
          name={inputName}
          form={form}
          options={meta?.options}
          mb={mb}
          onSearch={meta?.onSearch}
          isLoading={meta?.isLoading}
          minSearchLength={meta?.minSearchLength}
        />
      );
    case SchemaField.InputHidden:
      return <InputHidden {...meta} key={inputName} name={inputName} form={form} mb={mb} />;
    case SchemaField.InputPhoneNumber:
      return <InputPhoneNumber {...meta} key={inputName} name={inputName} form={form} mb={mb} />;
    case SchemaField.InputDate:
      return <InputDatePicker {...meta} key={inputName} name={inputName} form={form} mb={mb} />;
    case SchemaField.InputIBAN:
      return <InputIBAN {...meta} key={inputName} name={inputName} form={form} mb={mb} />;
    case SchemaField.InputNumericMask:
      return <InputNumericMask {...meta} key={inputName} name={inputName} form={form} mb={mb} />;
    default:
      return null;
  }
}
