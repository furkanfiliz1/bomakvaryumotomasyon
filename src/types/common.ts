import { LoginUserResponseModel, UserResponseModel } from '@store';
import { IconTypes } from '../components/common/Icon/types';
import { UserTypes } from './enums';
import { FC } from 'react';

export type App = 'RADAR' | 'PORTAL';

interface UserCustomize {
  EncryptPassword?: string;
}
export type User = LoginUserResponseModel & UserResponseModel & UserCustomize;

export type Nullable<T> = {
  [K in keyof T]: Nullable<T[K]> | null;
};

export interface INavConfig {
  title: string | ((userType: UserTypes) => string);
  breadcrumbTitle: string | ((userType: UserTypes) => string);
  path: string;
  icon?: keyof typeof IconTypes;
  initialPath?: string;
  children?: INavConfig[];
  hidden?: boolean;
  Badge?: FC;
  groupTitle?: string;
  description?: string;
  className?: string;
}

type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

export type RemoveNull<T> = ExpandRecursively<{ [K in keyof T]: Exclude<RemoveNull<T[K]>, null> }>;

export type BaseResponseModel = {
  IsSuccess: boolean;
  ExceptionId?: string;
  IsValidationError?: boolean;
  ExceptionMessage?: string;
  Result?: unknown;
};
