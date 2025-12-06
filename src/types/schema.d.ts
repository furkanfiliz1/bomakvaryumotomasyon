import { SchemaMeta } from 'src/components/common/Form/types';
import yup from '@validation';

declare module 'yup' {
  interface BaseSchema extends yup.BaseSchema {
    meta(obj: Partial<SchemaMeta>): this;
  }

  interface Schema extends yup.Schema {
    meta(obj: Partial<SchemaMeta>): this;
  }

  interface MixedSchema extends yup.MixedSchema {
    meta(obj: Partial<SchemaMeta>): this;
  }

  interface StringSchema extends yup.MixedSchema {
    meta(obj: Partial<SchemaMeta>): this;
  }
}
