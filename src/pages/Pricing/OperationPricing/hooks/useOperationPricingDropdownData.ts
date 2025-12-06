import { CustomerManager, ProductTypeOption, useGetCustomerManagerListQuery } from '@api';
import { useGetProductTypesQuery } from '@api';

/**
 * Hook for fetching dropdown data needed for operation pricing filters
 * Uses API responses with correct property mapping for form fields
 */
export const useOperationPricingDropdownData = (): {
  customerManagerList: Array<{ Id: number; FullName: string }>;
  productTypeList: Array<{ Value: string; Description: string }>;
  isLoading: boolean;
} => {
  // Customer managers data
  const { data: customerManagersData, isLoading: isCustomerManagersLoading } = useGetCustomerManagerListQuery();

  // Product types data - this comes transformed as { value: number, label: string }
  const { data: productTypesData, isLoading: isProductTypesLoading } = useGetProductTypesQuery();

  // Add "Tümü" option to customer manager list
  const customerManagerList = customerManagersData?.Items
    ? [{ Id: '0', FullName: 'Tümü' }, ...customerManagersData.Items]
    : [{ Id: '0', FullName: 'Tümü' }];

  // Convert transformed API response back to expected format for form fields
  const productTypeList = productTypesData
    ? [{ Value: '*', Description: 'Tümü' }, ...productTypesData]
    : [{ Value: '*', Description: 'Tümü' }];

  return {
    customerManagerList: customerManagerList as CustomerManager[],
    productTypeList: productTypeList as ProductTypeOption[],
    isLoading: isCustomerManagersLoading || isProductTypesLoading,
  };
};

export default useOperationPricingDropdownData;
