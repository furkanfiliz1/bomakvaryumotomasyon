/**
 * useOptimizedSelection Hook
 * Optimized selection management using Set for O(1) lookups
 */

import { useCallback, useMemo, useState } from 'react';
import type { CompanyCustomerManagerItem } from '../company-representative-settings.types';

interface UseOptimizedSelectionReturn {
  /** Set of selected row IDs */
  selectedIds: Set<number>;
  /** Array of selected row IDs (for compatibility) */
  selectedIdsArray: number[];
  /** Check if a row is selected */
  isSelected: (rowId: number) => boolean;
  /** Toggle selection for a single row */
  toggleSelection: (rowId: number, data: CompanyCustomerManagerItem[]) => void;
  /** Select all eligible rows */
  selectAll: (data: CompanyCustomerManagerItem[], isRowDisabled?: (row: CompanyCustomerManagerItem) => boolean) => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Get selected items from data */
  getSelectedItems: (data: CompanyCustomerManagerItem[]) => CompanyCustomerManagerItem[];
  /** Number of selected items */
  selectedCount: number;
}

export function useOptimizedSelection(): UseOptimizedSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const isSelected = useCallback(
    (rowId: number): boolean => {
      return selectedIds.has(rowId);
    },
    [selectedIds],
  );

  const toggleSelection = useCallback((rowId: number, data: CompanyCustomerManagerItem[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        // Find the row to add to selection
        const row = data.find((r) => r.CompanyCustomerManagerId === rowId);
        if (row) {
          next.add(rowId);
        }
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(
    (data: CompanyCustomerManagerItem[], isRowDisabled?: (row: CompanyCustomerManagerItem) => boolean) => {
      const eligibleIds = data.filter((row) => !isRowDisabled?.(row)).map((row) => row.CompanyCustomerManagerId);

      setSelectedIds((prev) => {
        // Check if all eligible items are already selected
        const allSelected = eligibleIds.every((id) => prev.has(id));

        if (allSelected) {
          // Deselect all
          return new Set();
        } else {
          // Select all eligible
          return new Set(eligibleIds);
        }
      });
    },
    [],
  );

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const getSelectedItems = useCallback(
    (data: CompanyCustomerManagerItem[]): CompanyCustomerManagerItem[] => {
      return data.filter((row) => selectedIds.has(row.CompanyCustomerManagerId));
    },
    [selectedIds],
  );

  const selectedIdsArray = useMemo(() => Array.from(selectedIds), [selectedIds]);
  const selectedCount = selectedIds.size;

  return useMemo(
    () => ({
      selectedIds,
      selectedIdsArray,
      isSelected,
      toggleSelection,
      selectAll,
      clearSelection,
      getSelectedItems,
      selectedCount,
    }),
    [
      selectedIds,
      selectedIdsArray,
      isSelected,
      toggleSelection,
      selectAll,
      clearSelection,
      getSelectedItems,
      selectedCount,
    ],
  );
}
