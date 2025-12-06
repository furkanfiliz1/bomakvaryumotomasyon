import { CustomerTrackingFilters, CustomerTrackingQueryParams } from '../customer-tracking.types';

export function transformFilterFormToParams(filters: CustomerTrackingFilters): CustomerTrackingQueryParams {
  // Transform form values to API parameters, matching legacy structure
  const cleanFilters = clearEmptyFilters(filters);

  return {
    page: 1, // Reset to first page when filtering
    pageSize: 50, // Match legacy pageSize
    sort: 'InsertDatetime', // Match legacy default sort
    sortType: 'desc', // Match legacy default sort direction
    // Static values from legacy
    ActivityType: 2,
    Type: 1,
    // Filter values - direct mapping
    ...cleanFilters,
  };
}

export function getFilterDefaults(): CustomerTrackingFilters {
  return {
    companyIdentifier: '',
    companyName: '',
    startDate: '',
    endDate: '',
    trackingTeamId: '',
    callResultType: '',
    leadStatusType: '',
    LeadingChannelId: '',
    status: '1', // Default to active
  };
}

export function clearEmptyFilters(filters: CustomerTrackingFilters): CustomerTrackingFilters {
  const cleanedFilters: CustomerTrackingFilters = {};

  // Only include non-empty values
  if (filters.companyIdentifier?.trim()) {
    cleanedFilters.companyIdentifier = filters.companyIdentifier.trim();
  }
  if (filters.companyName?.trim()) {
    cleanedFilters.companyName = filters.companyName.trim();
  }
  if (filters.startDate?.trim()) {
    cleanedFilters.startDate = filters.startDate.trim();
  }
  if (filters.endDate?.trim()) {
    cleanedFilters.endDate = filters.endDate.trim();
  }
  if (filters.trackingTeamId?.trim()) {
    cleanedFilters.trackingTeamId = filters.trackingTeamId.trim();
  }
  if (filters.callResultType?.trim()) {
    cleanedFilters.callResultType = filters.callResultType.trim();
  }
  if (filters.leadStatusType?.trim()) {
    cleanedFilters.leadStatusType = filters.leadStatusType.trim();
  }
  if (filters.LeadingChannelId?.trim()) {
    cleanedFilters.LeadingChannelId = filters.LeadingChannelId.trim();
  }
  if (filters.status?.trim()) {
    cleanedFilters.status = filters.status.trim();
  }

  return cleanedFilters;
}

// Helper to format product types display like in legacy
export function formatProductTypes(
  productTypes: Array<{ ProductType: number; ProductTypeDescription: string }> | null,
): string {
  if (!productTypes || productTypes.length === 0) {
    return '-';
  }
  return productTypes.map((p) => p.ProductTypeDescription).join(', ');
}
