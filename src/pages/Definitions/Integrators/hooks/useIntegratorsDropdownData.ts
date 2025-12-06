/**
 * Integrators Dropdown Data Hook
 * Fetches all dropdown options needed for integrator forms
 */

import { flattenIntegratorsForDropdown, sortIntegratorsByName } from '../helpers';
import {
  useGetDataTypesQuery,
  useGetInputDataTypesQuery,
  useGetIntegrationTypesQuery,
  useGetNestedIntegratorsQuery,
} from '../integrators.api';

export const useIntegratorsDropdownData = () => {
  // Fetch integration types
  const {
    data: integrationTypes = [],
    isLoading: isIntegrationTypesLoading,
    error: integrationTypesError,
  } = useGetIntegrationTypesQuery();

  // Fetch data types for params
  const { data: dataTypes = [], isLoading: isDataTypesLoading, error: dataTypesError } = useGetDataTypesQuery();

  // Fetch input data types for params
  const {
    data: inputDataTypes = [],
    isLoading: isInputDataTypesLoading,
    error: inputDataTypesError,
  } = useGetInputDataTypesQuery();

  // Fetch nested integrators for parent dropdown
  const {
    data: nestedIntegrators = [],
    isLoading: isIntegratorsLoading,
    error: integratorsError,
    refetch: refetchIntegrators,
  } = useGetNestedIntegratorsQuery();

  // Transform integration types for select field
  const integrationTypeOptions = integrationTypes.map((type) => ({
    value: type.Value,
    label: type.Description,
  }));

  // Transform data types for select field
  const dataTypeOptions = dataTypes.map((type) => ({
    value: type.Value,
    label: type.Description,
  }));

  // Transform input data types for select field
  const inputDataTypeOptions = inputDataTypes.map((type) => ({
    value: type.Value,
    label: type.Description,
  }));

  // Flatten integrators for parent dropdown
  const sortedIntegrators = sortIntegratorsByName(nestedIntegrators);
  const parentIntegratorOptions = flattenIntegratorsForDropdown(sortedIntegrators).map((item) => ({
    value: String(item.Id),
    label: item.Name,
  }));

  const isLoading = isIntegrationTypesLoading || isDataTypesLoading || isInputDataTypesLoading || isIntegratorsLoading;

  const error = integrationTypesError || dataTypesError || inputDataTypesError || integratorsError;

  return {
    // Raw data
    integrationTypes,
    dataTypes,
    inputDataTypes,
    nestedIntegrators,
    sortedIntegrators,

    // Options for select fields
    integrationTypeOptions,
    dataTypeOptions,
    inputDataTypeOptions,
    parentIntegratorOptions,

    // Loading and error states
    isLoading,
    error,

    // Refetch function
    refetchIntegrators,
  };
};

export default useIntegratorsDropdownData;
