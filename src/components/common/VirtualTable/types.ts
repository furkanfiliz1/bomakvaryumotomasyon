/**
 * VirtualTable Component Types
 * Lightweight, performant table with virtualization for large datasets
 */

import { ReactNode } from 'react';

export interface VirtualTableColumn<T = Record<string, unknown>> {
  id: string;
  label: string;
  width: number;
  minWidth?: number;
  render?: (row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface VirtualTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: VirtualTableColumn<T>[];
  height?: number;
  itemHeight?: number;
  loading?: boolean;
  error?: string | null;

  // Selection
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[], selectedRows: T[]) => void;
  getRowId?: (row: T) => string | number;
  isRowDisabled?: (row: T) => boolean;

  // Pagination
  pageSize?: number;
  currentPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Empty state
  emptyMessage?: string;

  // Styling
  className?: string;
  dense?: boolean;
}
