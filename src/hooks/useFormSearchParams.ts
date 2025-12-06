import { useCallback, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

/**
 * @deprecated Use `useFilterFormWithUrlSync` instead.
 * This hook is kept for backward compatibility but will be removed in future versions.
 *
 * Generic hook for bidirectional sync between form state and URL search parameters
 *
 * Features:
 * - Automatically populates form from URL params on mount
 * - Provides methods to update URL params from form values
 * - Type-safe parameter handling
 * - Automatic encoding/decoding of complex values (arrays, dates)
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { updateUrlFromForm, resetUrl } = useFormSearchParams(form, {
 *   syncOnMount: true,
 * });
 *
 * // With array fields and async data loaders
 * const { updateUrlFromForm, resetUrl } = useFormSearchParams(form, {
 *   syncOnMount: true,
 *   arrayFields: ['senderUserIds', 'receiverUserIds'], // Fields that are always arrays
 *   asyncDataLoaders: {
 *     senderIdentifier: async (value) => await searchSellers(value),
 *     receiverIdentifier: async (value) => await searchBuyers(value),
 *   },
 *   autocompleteOptionsGetters: {
 *     senderIdentifier: () => sellersCompanySearchResults,
 *     receiverIdentifier: () => buyersCompanySearchResults,
 *   },
 * });
 *
 * // Update URL when form submits
 * const handleSubmit = (data) => {
 *   updateUrlFromForm(data);
 *   onFilterChange(data);
 * };
 *
 * // Reset both form and URL
 * const handleReset = () => {
 *   form.reset();
 *   resetUrl();
 * };
 * ```
 */

/**
 * @deprecated Use `useFilterFormWithUrlSync` instead.
 */
export interface UseFormSearchParamsOptions {
  /**
   * Whether to automatically sync form values from URL on mount
   * @default true
   */
  syncOnMount?: boolean;

  /**
   * Whether to replace history entry instead of pushing new one
   * @default true
   */
  replaceHistory?: boolean;

  /**
   * Custom date format transformer
   * @default undefined
   */
  dateFormat?: string;

  /**
   * Async data loaders for specific fields (e.g., autocomplete fields)
   * Key: field name, Value: async function that loads data for that field value
   * @example
   * {
   *   senderIdentifier: async (value) => await searchSellers(value),
   *   receiverIdentifier: async (value) => await searchBuyers(value)
   * }
   */
  asyncDataLoaders?: Record<string, (value: unknown) => Promise<void>>;

  /**
   * Functions to transform autocomplete field values from URL to proper object format
   * Key: field name, Value: function that returns the options array to search in
   * @example
   * {
   *   senderIdentifier: () => sellersCompanySearchResults,
   *   receiverIdentifier: () => buyersCompanySearchResults
   * }
   */
  autocompleteOptionsGetters?: Record<string, () => Array<{ Identifier: string; CompanyName: string; Id?: number }>>;

  /**
   * Field names that should always be treated as arrays (for multipleSelect fields)
   * @example ['senderUserIds', 'receiverUserIds', 'userIds']
   */
  arrayFields?: string[];
}

/**
 * Generic hook for syncing React Hook Form state with URL search parameters
 * Simplified implementation following existing codebase patterns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFormSearchParams<TFormData extends Record<string, any>>(
  form: UseFormReturn<TFormData>,
  options: UseFormSearchParamsOptions = {},
) {
  const {
    syncOnMount = true,
    replaceHistory = true,
    asyncDataLoaders = {},
    autocompleteOptionsGetters = {},
    arrayFields = [],
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Parse URL params into form values object
   */
  const urlParams = useMemo((): Partial<TFormData> => {
    const params: Record<string, unknown> = {};

    // Fields that should always be treated as arrays (for multipleSelect fields)
    const arrayFieldsSet = new Set(arrayFields);

    for (const [key, value] of searchParams.entries()) {
      // Handle comma-separated arrays
      if (value.includes(',')) {
        const arrayValue = value.split(',').map((v) => {
          const trimmed = v.trim();
          const num = Number(trimmed);
          return Number.isNaN(num) ? trimmed : num;
        });
        params[key] = arrayValue;
        continue;
      }

      // Handle fields that should be arrays even with single value
      if (arrayFieldsSet.has(key)) {
        const num = Number(value);
        const arrayValue = [Number.isNaN(num) ? value : num];
        params[key] = arrayValue;
        continue;
      }

      // Try to parse as number
      const numValue = Number(value);
      if (!Number.isNaN(numValue) && value.trim() !== '') {
        params[key] = numValue;
        continue;
      }

      // Try to parse as boolean
      if (value === 'true' || value === 'false') {
        params[key] = value === 'true';
        continue;
      }

      // Default to string
      params[key] = value;
    }

    return params as Partial<TFormData>;
  }, [searchParams, arrayFields]);

  /**
   * Sync form values from URL params
   */
  const syncFormFromUrl = useCallback(() => {
    if (Object.keys(urlParams).length > 0) {
      for (const [key, value] of Object.entries(urlParams)) {
        let finalValue = value;

        // Check if this is an autocomplete field that needs object transformation
        if (autocompleteOptionsGetters[key] && typeof value === 'string') {
          const optionsGetter = autocompleteOptionsGetters[key];
          const options = optionsGetter();

          // Find the matching option by Identifier
          const matchingOption = options.find((opt) => opt.Identifier === value);

          if (matchingOption) {
            // Transform to the format AsyncAutoComplete expects
            finalValue = {
              Id: matchingOption.Id || 0,
              Identifier: matchingOption.Identifier,
              CompanyName: matchingOption.CompanyName,
              label: `${matchingOption.Identifier} - ${matchingOption.CompanyName}`,
              value: matchingOption.Identifier,
            };
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.setValue(key as any, finalValue, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    }
  }, [urlParams, form, autocompleteOptionsGetters]);

  /**
   * Update URL params from form values
   */
  const updateUrlFromForm = useCallback(
    (formData?: Partial<TFormData>) => {
      const data = formData || form.getValues();
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(data)) {
        if (value === undefined || value === null || value === '') {
          continue;
        }

        // Handle arrays
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
          continue;
        }

        // Handle objects - skip to avoid [object Object]
        if (typeof value === 'object') {
          continue;
        }

        // Handle primitives (string, number, boolean)
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          params.set(key, String(value));
        }
      }

      setSearchParams(params, { replace: replaceHistory });
    },
    [form, setSearchParams, replaceHistory],
  );

  /**
   * Reset URL params (clear all)
   */
  const resetUrl = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: replaceHistory });
  }, [setSearchParams, replaceHistory]);

  /**
   * Update a single URL param
   */
  const updateUrlParam = useCallback(
    (key: string, value: unknown) => {
      const params = new URLSearchParams(searchParams);

      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      setSearchParams(params, { replace: replaceHistory });
    },
    [searchParams, setSearchParams, replaceHistory],
  );

  /**
   * Remove a single URL param
   */
  const removeUrlParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      setSearchParams(params, { replace: replaceHistory });
    },
    [searchParams, setSearchParams, replaceHistory],
  );

  /**
   * Check if URL has any params
   */
  const hasUrlParams = useMemo(() => {
    return searchParams.size > 0;
  }, [searchParams]);

  // Auto-sync form from URL on mount with async data loading support
  useEffect(() => {
    const syncWithAsyncData = async () => {
      if (!hasUrlParams) return;

      // Check if we have any async data loaders configured
      const hasAsyncLoaders = Object.keys(asyncDataLoaders).length > 0;

      if (hasAsyncLoaders) {
        // Load async data for fields that have values in URL
        const loaderPromises: Promise<void>[] = [];

        for (const [fieldName, loader] of Object.entries(asyncDataLoaders)) {
          const fieldValue = urlParams[fieldName];
          if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
            loaderPromises.push(loader(fieldValue));
          }
        }

        // Wait for all async data to load
        await Promise.all(loaderPromises);

        // Give React time to update the state and re-render the dropdowns
        // This ensures the options are available before we set the form values
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Now sync form values from URL
      if (syncOnMount) {
        syncFormFromUrl();
      }
    };

    syncWithAsyncData();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    /**
     * Parsed URL parameters as form data
     */
    urlParams,

    /**
     * Update URL parameters from form values
     */
    updateUrlFromForm,

    /**
     * Sync form values from current URL parameters
     */
    syncFormFromUrl,

    /**
     * Clear all URL parameters
     */
    resetUrl,

    /**
     * Update a single URL parameter
     */
    updateUrlParam,

    /**
     * Remove a single URL parameter
     */
    removeUrlParam,

    /**
     * Check if URL has any parameters
     */
    hasUrlParams,

    /**
     * Raw search params for advanced use cases
     */
    searchParams,
  };
}
