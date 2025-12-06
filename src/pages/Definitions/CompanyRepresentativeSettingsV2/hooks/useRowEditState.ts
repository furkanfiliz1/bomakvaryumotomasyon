/**
 * useRowEditState Hook
 * Manages row-level edit state for optimized inline editing
 * Only one row can be in edit mode at a time
 */

import { useCallback, useMemo, useState } from 'react';
import type { CompanyCustomerManagerItem } from '../company-representative-settings.types';

interface RowPendingChanges {
  ManagerUserId?: number;
  ProductType?: number | string;
  FinancerCompanyId?: number | null;
  BuyerCompanyId?: number | null;
  StartDate?: string;
}

type RowChangesMap = Record<number, RowPendingChanges>;

interface UseRowEditStateReturn {
  /** Currently editing row ID, null if no row is being edited */
  editingRowId: number | null;
  /** Map of row ID to pending changes */
  rowChanges: RowChangesMap;
  /** Start editing a row */
  startEditing: (rowId: number) => void;
  /** Cancel editing and discard changes */
  cancelEditing: (rowId: number) => void;
  /** Update a field value for a row */
  updateField: (rowId: number, field: string, value: unknown) => void;
  /** Get pending changes for a row, merged with original data */
  getRowWithChanges: (row: CompanyCustomerManagerItem) => CompanyCustomerManagerItem;
  /** Check if a row has pending changes */
  hasChanges: (rowId: number) => boolean;
  /** Check if any row has pending changes */
  hasAnyChanges: () => boolean;
  /** Get all row IDs that have pending changes */
  getChangedRowIds: () => number[];
  /** Clear changes for a specific row (after successful save) */
  clearChanges: (rowId: number) => void;
  /** Clear all changes and editing state */
  clearAllChanges: () => void;
}

export function useRowEditState(): UseRowEditStateReturn {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [rowChanges, setRowChanges] = useState<RowChangesMap>({});

  const startEditing = useCallback((rowId: number) => {
    setEditingRowId(rowId);
  }, []);

  const cancelEditing = useCallback((rowId: number) => {
    setEditingRowId(null);
    // Clear any pending changes for this row
    setRowChanges((prev) => {
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  }, []);

  const updateField = useCallback((rowId: number, field: string, value: unknown) => {
    setRowChanges((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  }, []);

  const getRowWithChanges = useCallback(
    (row: CompanyCustomerManagerItem): CompanyCustomerManagerItem => {
      const changes = rowChanges[row.CompanyCustomerManagerId];
      if (!changes) return row;

      // Type-safe merge with proper type coercion
      const mergedRow = { ...row };

      if (changes.ManagerUserId !== undefined) {
        mergedRow.ManagerUserId = changes.ManagerUserId;
      }
      if (changes.ProductType !== undefined) {
        mergedRow.ProductType =
          typeof changes.ProductType === 'string' ? Number(changes.ProductType) : changes.ProductType;
      }
      if (changes.FinancerCompanyId !== undefined) {
        mergedRow.FinancerCompanyId = changes.FinancerCompanyId;
      }
      if (changes.BuyerCompanyId !== undefined) {
        mergedRow.BuyerCompanyId = changes.BuyerCompanyId;
      }
      if (changes.StartDate !== undefined) {
        mergedRow.StartDate = changes.StartDate;
      }

      return mergedRow;
    },
    [rowChanges],
  );

  const hasChanges = useCallback(
    (rowId: number): boolean => {
      return rowId in rowChanges && Object.keys(rowChanges[rowId]).length > 0;
    },
    [rowChanges],
  );

  const hasAnyChanges = useCallback((): boolean => {
    return Object.keys(rowChanges).length > 0;
  }, [rowChanges]);

  const getChangedRowIds = useCallback((): number[] => {
    return Object.keys(rowChanges)
      .map(Number)
      .filter((id) => Object.keys(rowChanges[id]).length > 0);
  }, [rowChanges]);

  const clearChanges = useCallback((rowId: number) => {
    setEditingRowId((prev) => (prev === rowId ? null : prev));
    setRowChanges((prev) => {
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  }, []);

  const clearAllChanges = useCallback(() => {
    setEditingRowId(null);
    setRowChanges({});
  }, []);

  return useMemo(
    () => ({
      editingRowId,
      rowChanges,
      startEditing,
      cancelEditing,
      updateField,
      getRowWithChanges,
      hasChanges,
      hasAnyChanges,
      getChangedRowIds,
      clearChanges,
      clearAllChanges,
    }),
    [
      editingRowId,
      rowChanges,
      startEditing,
      cancelEditing,
      updateField,
      getRowWithChanges,
      hasChanges,
      hasAnyChanges,
      getChangedRowIds,
      clearChanges,
      clearAllChanges,
    ],
  );
}
