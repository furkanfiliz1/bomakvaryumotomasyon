import { SHOULD_PASSWORD_BE_ENCRYPTED } from '@config';
import { AllowanceResponseModel, MergedSearch } from '@store';
import { INavConfig, ProductTypes, RemoveNull, User, UserTypes } from '@types';
import { PBKDF2, algo, enc } from 'crypto-js';
import { Dayjs } from 'dayjs';
import { cloneDeep, isNil } from 'lodash';
import { NoticeOptions } from 'src/components/common/NoticeModal';
import utf8 from 'utf8';

export const isProd = process.env.REACT_APP_ENV_NAME === 'production';
export const isQA = process.env.REACT_APP_ENV_NAME === 'qa';
export const isTest = process.env.REACT_APP_ENV_NAME === 'test';
export const isDev = isQA || isTest;

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

export const getUserType = (user: User | undefined): UserTypes => {
  if (user?.CompanyType === 1) {
    if (user.ActivityType === 2) return UserTypes.SELLER;
    return UserTypes.BUYER;
  }
  return UserTypes.FINANCER;
};

export const getDocumentLabelName = (labelId: number) => {
  switch (labelId) {
    case 32:
      return 'Yıllık beyanname';
    case 33:
      return 'Geçici beyanname';
    case 34:
      return 'Mizan';
    case 35:
      return 'Findeks';
    default:
      return '';
  }
};

export const getAllowanceAmount = (allowance: AllowanceResponseModel | undefined) => {
  return allowance?.TotalApprovedPayableAmount || allowance?.TotalPayableAmount || undefined;
};

export default function checkType(type: string | null | undefined) {
  let result = '';

  switch (type) {
    case 'pdf':
      result = 'pdf';
      break;
    case 'png':
      result = 'image/png';
      break;
    case 'jpg':
      result = 'image/jpg';
      break;
    case 'jpeg':
      result = 'image/jpeg';
      break;
    case 'xml':
      result = 'html';
      break;
    case 'application/pdf':
      result = 'pdf';
      break;
    case 'image/jpeg':
      result = 'jpeg';
      break;
    case 'image/jpg':
      result = 'jpg';
      break;
    case 'image/png':
      result = 'png';
      break;
    case 'application/zip':
      result = 'zip';
      break;
    case 'application/x-rar':
      result = 'rar';
      break;
    case 'application/x-zip-compressed':
      result = 'zip';
      break;
    case 'zip':
      result = 'application/x-zip-compressed';
      break;
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      result = 'xlsx';
      break;
    case 'application/vnd.ms-excel':
      result = 'xls';
      break;
    default:
      result = '';
  }
  return result;
}

export const makeWord = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

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

export const tablePageReset = (pageSize: string | null) => {
  setToParams('page', '1');
  pageSize && setToParams('pageSize', pageSize);
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

export const joinIfTestEnv = <T extends object>(dummyData: T[], data: T[]) => {
  if (isProd) return data;
  return [...dummyData, ...data];
};

export const encryptPassword = (password: string | null | undefined, salt: string) => {
  if (!SHOULD_PASSWORD_BE_ENCRYPTED) return password;
  if (!password) return '';
  const byteArray = PBKDF2(password, utf8.encode(salt), { keySize: 8, iterations: 10000, hasher: algo.SHA512 });
  const base64password = enc.Base64.stringify(byteArray);

  return base64password + '#figo#' + salt;
};

export const sha256 = async (message: string) => {
  const msgBuffer = new TextEncoder().encode(message);

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export function removeEmpty<T>(obj: T): RemoveNull<T> {
  return Object.fromEntries(
    Object.entries(obj as object)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v]),
  ) as RemoveNull<T>;
}

export const fixedWithoutRounding = (number: number, decimals?: number) => {
  if (isNil(decimals)) decimals = 2;
  const pow = 10 ** decimals;
  return Math.trunc(number * pow) / pow;
};

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

export const getNavTitle = (t: INavConfig['title'], userType: UserTypes) => {
  if (typeof t === 'function') {
    return t(userType);
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

export const getProductName = (productType: number) => {
  switch (productType) {
    case ProductTypes.SME_FINANCING:
      return 'Fatura Finansmanı';
    case ProductTypes.SUPPLIER_FINANCING:
      return 'Tedarikçi Finansmanı';
    case ProductTypes.CHEQUES_FINANCING:
      return 'Çek Finansmanı';
    case ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE:
      return 'Faturalı Spot Kredi Finansmanı';
    case ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE:
      return 'Faturasız Spot Kredi Finansmanı';
    case ProductTypes.COMMERCIAL_LOAN:
      return 'Taksitli Ticari Kredi';
    case ProductTypes.RECEIVABLE_FINANCING:
      return 'Alacak Finansmanı';

    default:
      return '';
  }
};

/**
 * Checks if MergedSearch data has necessary fields to be rendered in company detail
 * @param mergedSearch MergedSearch object from API
 * @returns boolean indicating if data is sufficient to render
 */
export const isRenderCompanyDetailMergedSearch = (mergedSearch: MergedSearch): boolean => {
  if (!mergedSearch) return false;

  // Check if any of the required fields are null
  if (
    mergedSearch.Category === null &&
    mergedSearch.ContactEmail === null &&
    mergedSearch.Phone === null &&
    mergedSearch.Rating === null &&
    mergedSearch.Reviews === null &&
    mergedSearch.Website === null
  ) {
    return false;
  }

  return true;
};
