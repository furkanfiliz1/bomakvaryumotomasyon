import { pickBy } from 'lodash';

export const serialize = (params: Record<string, unknown>) => {
  const prms: Array<string | number> = [];

  Object.entries(pickBy(params, (item) => item !== undefined)).forEach(([key, value]) => {
    if (Array.isArray(params[key])) {
      (params[key] as Array<string | number>).forEach((item) => {
        prms.push(`${key}=${item}`);
      });
    } else {
      prms.push(`${key}=${value}`);
    }
  });
  return prms.join('&');
};
