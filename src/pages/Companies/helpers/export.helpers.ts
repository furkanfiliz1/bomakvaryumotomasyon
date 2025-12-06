import dayjs from 'dayjs';
import { CompanyFilters } from '../companies.types';
import { CompaniesFilterFormData } from './filter-form.helpers';

type ExportMutation = (params: CompanyFilters) => {
  unwrap: () => Promise<{ ExtensionData: string }>;
};

export const exportCompanies = async (filters: CompaniesFilterFormData, exportMutation: ExportMutation) => {
  try {
    const exportParams = {
      ...transformFiltersForAPI(filters),
      isExport: true,
    };

    console.log('Export params:', exportParams); // Debug logging
    const result = await exportMutation(exportParams).unwrap();
    console.log('Export result:', result); // Debug logging

    if (result?.ExtensionData) {
      const fileDate = dayjs().format('YYYY-MM-DD');
      const fileName = `sirketler_${fileDate}.xls`;

      // Use FileSaver approach like legacy implementation for better compatibility
      const { default: FileSaver } = await import('file-saver');
      FileSaver.saveAs(`data:xls;base64,${result.ExtensionData}`, fileName);
    } else {
      console.error('No ExtensionData in response:', result);
      throw new Error('No data received for export');
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

export const transformFiltersForAPI = (filters: CompaniesFilterFormData): CompanyFilters => {
  const toNumber = (value: string | number | null | undefined): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    return isNaN(num) ? undefined : num;
  };

  const toString = (value: string | number | null | undefined): string | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    return String(value);
  };

  const apiFilters: Partial<CompanyFilters> = {
    // Default parameters that match the curl request
    page: 1,
    pageSize: 50,
    sort: 'InsertDateTime',
    sortType: 'Desc',

    // Form filters
    type: toNumber(filters.type) || 1, // Default to type 1 as seen in curl
    status: toNumber(filters.status),
    companyIdentifier: filters.companyIdentifier || undefined,
    companyName: filters.companyName || undefined,
    activityType: toString(filters.activityType),
    startDate: filters.startDate ? dayjs(filters.startDate).format('YYYY-MM-DD') : undefined,
    endDate: filters.endDate ? dayjs(filters.endDate).format('YYYY-MM-DD') : undefined,
    onboardingStatusTypes: toString(filters.onboardingStatusTypes),
    signedContract: toString(filters.signedContract),
    LeadingChannelId: toString(filters.LeadingChannelId),
    UserMail: filters.UserMail || undefined,
    UserPhone: filters.UserPhone || undefined,
    UserName: filters.UserName || undefined,
    NameSurname: filters.NameSurname || undefined,
    userIds: filters.userIds?.filter((id: number | undefined): id is number => id !== undefined),
    CityId: toNumber(filters.CityId),
    GetByIntegrators: false,
  };

  // Remove empty strings, null values, zero values for optional fields
  Object.keys(apiFilters).forEach((key) => {
    const value = apiFilters[key as keyof CompanyFilters];
    if (
      value === '' ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0) ||
      (key !== 'GetByIntegrators' && value === 0) // Don't remove 0 for GetByIntegrators
    ) {
      delete apiFilters[key as keyof CompanyFilters];
    }
  });

  return apiFilters as CompanyFilters;
};
