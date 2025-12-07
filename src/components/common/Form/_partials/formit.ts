import { AnyObject, ObjectSchema } from 'yup';
import { SchemaInputType } from './enums';
import { SchemaMeta } from './types';

export const formitMeta = (schema: ObjectSchema<AnyObject>, name: string) => {
  const description = schema.describe().fields[name] as unknown as Record<string, SchemaMeta>;
  const meta = description?.meta;
  const col = description?.meta?.col || 12;
  const label = description?.label || '';
  const fieldType = description?.type || SchemaInputType.text;
  const size = description?.meta?.size;

  return {
    col,
    name,
    field: '',
    fieldType,
    label,
    size,
    fields: description.fields,
    ...(meta as object),
  } as unknown as SchemaMeta;
};
