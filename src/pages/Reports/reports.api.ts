import { baseApi } from '@api';

export const reportsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: () => ({
    // Add your reports endpoints here
  }),
});
