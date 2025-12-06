import { useCallback, useEffect, useRef } from 'react';
import { FieldValues } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { AnyObject } from 'yup';

/**
 * Minimal form interface - only methods used by this hook
 */
interface MinimalFormReturn {
  getValues: () => FieldValues;
  reset: (values?: FieldValues) => void;
}

/**
 * Configuration for async autocomplete fields
 */
export interface AsyncFieldConfig {
  /** Function to search for data (e.g., search companies by identifier) */
  searchFn: (value: string) => Promise<void>;
  /** Array of search results */
  results: AnyObject[];
  /** Field name in the search results that matches the URL param (e.g., 'Identifier') */
  matchField: string;
}

/**
 * Generic hook for filter forms with URL synchronization
 * Handles both regular fields and async autocomplete fields
 */
export function useFilterFormWithUrlSync<TFormData extends FieldValues, TApiFilters>({
  form,
  onFilterChange,
  transformToApiFilters,
  asyncFields = {},
  updateUrlParams = true,
  urlToFormFieldMap = {},
  customInitialValues = {},
}: {
  /** React Hook Form instance (only getValues and reset are used) */
  form: MinimalFormReturn;
  /** Callback when filters change */
  onFilterChange: (filters: TApiFilters) => void;
  /** Transform form data to API filter format */
  transformToApiFilters: (formData: TFormData) => TApiFilters;
  /** Configuration for async autocomplete fields */
  asyncFields?: Record<string, AsyncFieldConfig>;
  /** Whether to update URL parameters (default: true) */
  updateUrlParams?: boolean;
  /** Mapping from URL param names to form field names (e.g., { SenderIdentifier: 'senderIdentifier' }) */
  urlToFormFieldMap?: Record<string, string>;
  /** Custom initial values that require special transformation (e.g., isPartialBid -> offerType) */
  customInitialValues?: Partial<TFormData>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialization state
  const isInitializedRef = useRef(false);
  const hasTriggeredInitialSearchRef = useRef(false);
  const pendingAsyncFieldsRef = useRef<Record<string, string>>({});
  // Store initial URL params to avoid re-running on URL changes
  const initialUrlParamsRef = useRef<Record<string, string> | null>(null);

  // Store urlToFormFieldMap ref
  const urlToFormFieldMapRef = useRef(urlToFormFieldMap);
  urlToFormFieldMapRef.current = urlToFormFieldMap;

  // Helper to convert URL param key to form field key
  const getFormFieldName = (urlKey: string): string => {
    return urlToFormFieldMapRef.current[urlKey] || urlKey;
  };

  // List of array fields (form field names that should be parsed as arrays)
  const arrayFieldsRef = useRef<string[]>([]);
  // Detect array fields from urlToFormFieldMap keys that end with 'Ids' or 'UserIds'
  // Also include common array field names directly
  arrayFieldsRef.current = [
    ...Object.entries(urlToFormFieldMap)
      .filter(([urlKey]) => urlKey.endsWith('Ids') || urlKey.endsWith('UserIds'))
      .map(([, formKey]) => formKey),
    'userIds', // Common array field
  ];

  // Helper to check if a field should be treated as array
  const isArrayField = (fieldName: string): boolean => {
    return fieldName.endsWith('Ids') || fieldName.endsWith('userIds') || arrayFieldsRef.current.includes(fieldName);
  };

  // Helper to parse URL values - handles both single and multiple params
  const parseUrlValues = (formFieldName: string, values: string[]): unknown => {
    // Check if this field should be an array or has multiple values
    if (isArrayField(formFieldName) || values.length > 1) {
      // Parse values as array (keep as strings for form, let transform handle conversion)
      return values.map((v) => v.trim());
    }
    // Single value - return as string
    return values[0];
  };

  // Store parsed URL params (can be string or array)
  const initialParsedUrlParamsRef = useRef<Record<string, unknown> | null>(null);

  // Capture initial URL params on first render only (mapped to form field names)
  if (initialUrlParamsRef.current === null) {
    const params: Record<string, string> = {};
    const parsedParams: Record<string, unknown> = {};

    // Get unique keys first
    const uniqueKeys = new Set<string>();
    for (const [key] of searchParams.entries()) {
      uniqueKeys.add(key);
    }

    // Process each unique key
    for (const key of uniqueKeys) {
      const formFieldName = getFormFieldName(key);
      const allValues = searchParams.getAll(key);

      // Store first value for backward compatibility
      params[formFieldName] = allValues[0];
      // Parse all values (handles repeated params like userIds=1&userIds=2)
      parsedParams[formFieldName] = parseUrlValues(formFieldName, allValues);
    }

    initialUrlParamsRef.current = params;
    initialParsedUrlParamsRef.current = parsedParams;
  }

  // Store refs to avoid dependency issues
  const asyncFieldsRef = useRef(asyncFields);
  asyncFieldsRef.current = asyncFields;

  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  const transformToApiFiltersRef = useRef(transformToApiFilters);
  transformToApiFiltersRef.current = transformToApiFilters;

  // Store custom initial values ref
  const customInitialValuesRef = useRef(customInitialValues);
  customInitialValuesRef.current = customInitialValues;

  // Initialize on mount - trigger async searches and set regular fields
  useEffect(() => {
    // Only run once on mount
    if (isInitializedRef.current) return;

    const urlParams = initialUrlParamsRef.current || {};
    const customValues = customInitialValuesRef.current || {};
    const hasUrlParams = Object.keys(urlParams).length > 0;
    const hasCustomValues = Object.keys(customValues).length > 0;

    if (!hasUrlParams && !hasCustomValues) {
      isInitializedRef.current = true;
      return;
    }

    const currentAsyncFields = asyncFieldsRef.current;
    const asyncFieldNames = Object.keys(currentAsyncFields);

    // Set regular (non-async) fields immediately, merging with custom values
    const regularUpdates: Partial<TFormData> = { ...customValues };
    const parsedParams = initialParsedUrlParamsRef.current || {};
    for (const [key, value] of Object.entries(urlParams)) {
      if (!asyncFieldNames.includes(key) && value) {
        // Use parsed value (handles arrays) instead of raw string
        regularUpdates[key as keyof TFormData] = parsedParams[key] as TFormData[keyof TFormData];
      }
    }

    if (Object.keys(regularUpdates).length > 0) {
      const currentValues = form.getValues();
      form.reset({ ...currentValues, ...regularUpdates } as TFormData);
    }

    // Trigger async searches
    for (const [fieldName, config] of Object.entries(currentAsyncFields)) {
      const urlValue = urlParams[fieldName];
      if (urlValue) {
        pendingAsyncFieldsRef.current[fieldName] = urlValue;
        config.searchFn(urlValue);
      }
    }

    // Mark as initialized if no async fields to wait for
    if (Object.keys(pendingAsyncFieldsRef.current).length === 0) {
      isInitializedRef.current = true;

      // Trigger initial search with URL params (no async fields case)
      if (!hasTriggeredInitialSearchRef.current) {
        hasTriggeredInitialSearchRef.current = true;
        const formData = form.getValues() as TFormData;
        const apiFilters = transformToApiFiltersRef.current(formData);
        onFilterChangeRef.current(apiFilters);
      }
    }
  }, [form]);

  // Create a stable key for async results changes
  const getResultsKey = () => {
    return Object.entries(asyncFieldsRef.current)
      .map(([key, config]) => `${key}:${config.results.length}`)
      .join(',');
  };

  // Watch for async results and update form
  const prevResultsKeyRef = useRef('');

  useEffect(() => {
    // Skip if already fully initialized or no pending fields
    const pendingFields = pendingAsyncFieldsRef.current;
    if (Object.keys(pendingFields).length === 0) return;

    const currentResultsKey = getResultsKey();
    // Skip if results haven't changed
    if (currentResultsKey === prevResultsKeyRef.current) return;
    prevResultsKeyRef.current = currentResultsKey;

    const formUpdates: Partial<TFormData> = {};
    const fieldsToRemove: string[] = [];
    const currentAsyncFields = asyncFieldsRef.current;

    for (const [fieldName, urlValue] of Object.entries(pendingFields)) {
      const config = currentAsyncFields[fieldName];
      if (!config || config.results.length === 0) continue;

      const matchedObject = config.results.find((item: AnyObject) => item[config.matchField] === urlValue);

      if (matchedObject) {
        formUpdates[fieldName as keyof TFormData] = matchedObject as TFormData[keyof TFormData];
        fieldsToRemove.push(fieldName);
      }
    }

    // Remove processed fields from pending
    for (const field of fieldsToRemove) {
      delete pendingAsyncFieldsRef.current[field];
    }

    // Apply form updates if we have any
    if (Object.keys(formUpdates).length > 0) {
      const currentValues = form.getValues();
      form.reset({ ...currentValues, ...formUpdates } as TFormData);
    }

    // Mark as initialized and trigger search when all pending fields are processed
    if (Object.keys(pendingAsyncFieldsRef.current).length === 0) {
      isInitializedRef.current = true;

      // Trigger initial search with complete form data
      if (!hasTriggeredInitialSearchRef.current) {
        hasTriggeredInitialSearchRef.current = true;
        // Use setTimeout to ensure form.reset has completed
        setTimeout(() => {
          const formData = form.getValues() as TFormData;
          const apiFilters = transformToApiFiltersRef.current(formData);
          onFilterChangeRef.current(apiFilters);
        }, 0);
      }
    }
  }, [asyncFields, form]);

  /**
   * Handle filter apply (search)
   */
  const handleApply = useCallback(() => {
    const formData = form.getValues() as TFormData;
    const apiFilters = transformToApiFilters(formData);

    // Update URL if enabled
    if (updateUrlParams) {
      const urlParams = new URLSearchParams();

      for (const [key, value] of Object.entries(apiFilters as Record<string, unknown>)) {
        if (value === undefined || value === null || value === '') continue;

        if (Array.isArray(value) && value.length > 0) {
          // Append each array item separately: userIds=1&userIds=2&userIds=3
          for (const item of value) {
            urlParams.append(key, String(item));
          }
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          urlParams.append(key, String(value));
        }
      }

      setSearchParams(urlParams);
    }

    // Notify parent
    onFilterChange(apiFilters);

    return apiFilters;
  }, [form, transformToApiFilters, updateUrlParams, setSearchParams, onFilterChange]);

  /**
   * Handle filter reset
   */
  const handleReset = useCallback(
    (defaultValues: Partial<TFormData>) => {
      // Reset initialization state
      isInitializedRef.current = true; // Keep as initialized to prevent re-triggering
      pendingAsyncFieldsRef.current = {};

      // Reset form
      form.reset(defaultValues as TFormData);

      // Clear URL params
      if (updateUrlParams) {
        setSearchParams(new URLSearchParams());
      }

      // Notify parent with reset values
      const apiFilters = transformToApiFilters(defaultValues as TFormData);
      onFilterChange(apiFilters);
    },
    [form, transformToApiFilters, updateUrlParams, setSearchParams, onFilterChange],
  );

  return {
    handleApply,
    handleReset,
    searchParams,
  };
}
