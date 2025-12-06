import { baseApi } from '@api';

export const definitionsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: () => ({
    // Add your definitions endpoints here
  }),
});
