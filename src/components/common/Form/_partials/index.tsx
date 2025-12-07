import { Grid } from '@mui/material';
import yup from '@validation';
import { DetailedHTMLProps, FormHTMLAttributes, PropsWithChildren } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import DataFormInput from './DataFormInput';
import { formitMeta } from './formit';

export * from './schemas/_common';

interface DataFormProps<T extends FieldValues>
  extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  form: UseFormReturn<T>;
  schema: yup.ObjectSchema<T>;
  space?: number;
  childCol?: number;
}

export const Form = <T extends FieldValues>(props: PropsWithChildren<DataFormProps<T>>) => {
  const { form, schema, children, childCol, ...rest } = props;
  const schemaMetas = Object.keys(schema?.fields).map((name) =>
    formitMeta(schema as yup.ObjectSchema<yup.AnyObject>, name),
  );
  return (
    <form {...rest}>
      <Grid container spacing={1} columnSpacing={1}>
        {schemaMetas.map((meta) => {
          return meta.visible !== false ? (
            <Grid item key={meta.name} sm={meta.col} xs={12}>
              <DataFormInput
                meta={meta}
                form={form as UseFormReturn}
                name={`${meta.name}`}
                mb={meta.mb ?? 0}
                size={meta.size}
              />
            </Grid>
          ) : (
            <div key={meta.name}></div>
          );
        })}
        {children && (
          <Grid item xs={childCol || 12}>
            {children}
          </Grid>
        )}
      </Grid>
    </form>
  );
};
