import { INavConfig,  RemoveNull } from '@types';
import { Dayjs } from 'dayjs';
import { cloneDeep } from 'lodash';
import { NoticeOptions } from 'src/components/common/NoticeModal';


export const getRandomNumber = () => {
  return crypto.getRandomValues(new Uint32Array(1))[0];
};

export function bufferToBase64(buffer: Buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));




export const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomDate = () => {
  return new Date(new Date().valueOf() - Math.random() * 1e12);
};

export const getFromParams = (key: string) => {
  const urlParams = new URL(window.location.toString()).searchParams;

  return urlParams.get(key);
};

export const setToParams = (key: string, value: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url.toString());
};


export const emptyOrNullRemoveQuery = (param: object) => {
  const params = { ...param };
  for (const key of Object.keys(params)) {
    if (
      params[key as keyof typeof params] === null ||
      params[key as keyof typeof params] === undefined ||
      params[key as keyof typeof params] === ''
    ) {
      delete params[key as keyof typeof params];
    }
  }
  return params;
};



export function removeEmpty<T>(obj: T): RemoveNull<T> {
  return Object.fromEntries(
    Object.entries(obj as object)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v]),
  ) as RemoveNull<T>;
}



export const changeElementOrder = (data: unknown[], fromIndex: number, toIndex: number) => {
  const updatedData = cloneDeep(data);
  const [movedElement] = updatedData.splice(fromIndex, 1);
  updatedData.splice(toIndex, 0, movedElement);
  return updatedData;
};

export const isHoliday = (date: Dayjs, updatedHolidays: Dayjs[]): boolean => {
  return updatedHolidays?.some((holiday) => date.isSame(holiday, 'day'));
};

export const isWeekend = (date: Dayjs): boolean => {
  const dayOfWeek = date.day();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export const getNavTitle = (t: INavConfig['title']) => {
  if (typeof t === 'function') {
    return 'asd'
  } else return t;
};

export const fileValidate = (
  files: FileList | null,
  types?: string[],
  notice?: (options: NoticeOptions) => Promise<void>,
) => {
  if (types) {
    let fileTypeCheck = false;
    if (files) {
      for (let i = 0; i < files.length; ++i) {
        const file = files[i];
        const fileType = file.name.split('.').pop()?.toLocaleLowerCase() ?? '';
        fileTypeCheck = types.includes(fileType);
      }

      if (!fileTypeCheck && types.length > 0) {
        notice &&
          notice({
            variant: 'warning',
            title: 'Uyarı',
            message: `Kabul edilen dosya türleri: ${types.map((type) => type)?.toString()}`,
            buttonTitle: 'Tamam',
          });
        return null;
      }
    }
  }
  return true;
};

export const isAllColumnsSameValue = <T = object>(
  rows: T[],
  key: keyof T,
  value: number | string | undefined | null,
) => {
  return rows.every((row) => row[key] == value);
};



/**
 * Checks if MergedSearch data has necessary fields to be rendered in company detail
 * @param mergedSearch MergedSearch object from API
 * @returns boolean indicating if data is sufficient to render
 */

