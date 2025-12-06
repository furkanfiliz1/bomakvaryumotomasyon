/**
 * VirtualTable Component
 * High-performance table with minimal re-renders and optimized rendering
 */

import { Alert, Box, Checkbox, CircularProgress, Paper, TablePagination, Typography } from '@mui/material';
import React, { memo, useCallback, useMemo } from 'react';
import { VirtualTableColumn, VirtualTableProps } from './types';

// Utility functions
const getRowIdFromRow = <T extends Record<string, unknown>>(
  row: T,
  getRowId?: (row: T) => string | number,
  index?: number,
): string | number => {
  if (getRowId) {
    return getRowId(row);
  }

  // Type-safe fallback for common id fields
  if ('CompanyCustomerManagerId' in row && typeof row.CompanyCustomerManagerId === 'number') {
    return row.CompanyCustomerManagerId;
  }
  if ('id' in row && (typeof row.id === 'string' || typeof row.id === 'number')) {
    return row.id;
  }

  return index ?? 0;
};

const getFieldValue = <T extends Record<string, unknown>>(row: T, fieldId: string): string => {
  const value = row[fieldId];
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return '';
};

// Memoized table header component
const TableHeader = memo(
  <T extends Record<string, unknown>>({
    columns,
    selectable,
    selectedIds,
    data,
    onSelectAll,
    isRowDisabled,
  }: {
    columns: VirtualTableColumn<T>[];
    selectable?: boolean;
    selectedIds?: (string | number)[];
    data: T[];
    onSelectAll?: (checked: boolean) => void;
    isRowDisabled?: (row: T) => boolean;
  }) => {
    const selectableRows = useMemo(() => data.filter((row) => !isRowDisabled?.(row)), [data, isRowDisabled]);

    const selectedCount = useMemo(
      () =>
        selectableRows.filter((row) => {
          const rowId = getRowIdFromRow(row);
          return selectedIds?.includes(rowId);
        }).length,
      [selectableRows, selectedIds],
    );

    const isAllSelected = selectableRows.length > 0 && selectedCount === selectableRows.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < selectableRows.length;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5',
          minHeight: 48,
          px: 1,
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}>
        {selectable && (
          <Box sx={{ width: 48, display: 'flex', justifyContent: 'center' }}>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={(e) => onSelectAll?.(e.target.checked)}
              size="small"
            />
          </Box>
        )}

        {columns.map((column) => (
          <Box
            key={column.id}
            sx={{
              width: column.width,
              minWidth: column.minWidth || column.width,
              flex: '1 1 auto',
              px: 1,
              fontWeight: 'bold',
              fontSize: '0.875rem',
              color: 'text.secondary',
              textAlign: column.align || 'left',
            }}>
            {column.label}
          </Box>
        ))}
      </Box>
    );
  },
);

TableHeader.displayName = 'TableHeader';

// Memoized table row component
const TableRow = memo(
  <T extends Record<string, unknown>>({
    row,
    index,
    columns,
    selectedIds,
    onRowSelect,
    isRowDisabled,
    getRowId,
  }: {
    row: T;
    index: number;
    columns: VirtualTableColumn<T>[];
    selectedIds?: (string | number)[];
    onRowSelect?: (row: T, checked: boolean) => void;
    isRowDisabled?: (row: T) => boolean;
    getRowId?: (row: T) => string | number;
  }) => {
    const rowId = useMemo(() => getRowIdFromRow(row, getRowId, index), [row, getRowId, index]);
    const isSelected = useMemo(() => selectedIds?.includes(rowId) || false, [selectedIds, rowId]);
    const isDisabled = useMemo(() => isRowDisabled?.(row) || false, [isRowDisabled, row]);

    const handleRowClick = useCallback(() => {
      if (onRowSelect && !isDisabled) {
        onRowSelect(row, !isSelected);
      }
    }, [onRowSelect, row, isSelected, isDisabled]);

    const handleCheckboxChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onRowSelect?.(row, e.target.checked);
      },
      [onRowSelect, row],
    );

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          cursor: onRowSelect ? 'pointer' : 'default',
          '&:hover': {
            backgroundColor: (() => {
              if (isSelected) return 'rgba(25, 118, 210, 0.12)';
              if (onRowSelect) return 'rgba(0, 0, 0, 0.04)';
              return 'transparent';
            })(),
          },
          px: 1,
          minHeight: 52,
        }}
        onClick={handleRowClick}>
        {onRowSelect && (
          <Box sx={{ width: 48, display: 'flex', justifyContent: 'center' }}>
            <Checkbox checked={isSelected} disabled={isDisabled} onChange={handleCheckboxChange} size="small" />
          </Box>
        )}

        {columns.map((column) => (
          <Box
            key={column.id}
            sx={{
              width: column.width,
              minWidth: column.minWidth || column.width,
              flex: '1 1 auto',
              px: 1,
              textAlign: column.align || 'left',
              fontSize: '0.875rem',
            }}
            onClick={(e) => e.stopPropagation()}>
            {column.render ? column.render(row, index) : getFieldValue(row, column.id)}
          </Box>
        ))}
      </Box>
    );
  },
);

TableRow.displayName = 'TableRow';

// Main VirtualTable component
export const VirtualTable = <T extends Record<string, unknown>>({
  data,
  columns,
  height = 600,
  loading = false,
  error = null,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  getRowId,
  isRowDisabled,
  pageSize = 100,
  currentPage = 1,
  totalCount,
  onPageChange,
  onPageSizeChange,
  emptyMessage = 'No data available',
  className,
}: VirtualTableProps<T>) => {
  // For server-side pagination, use data as-is (already paginated by server)
  // For client-side pagination, slice the data
  const startIndex = totalCount ? (currentPage - 1) * pageSize : 0;
  const paginatedData = totalCount ? data : data.slice(startIndex, currentPage * pageSize);

  // Selection handlers
  const handleRowSelect = useCallback(
    (row: T, checked: boolean) => {
      if (!onSelectionChange || !getRowId) return;

      const rowId = getRowId(row);
      let newSelectedIds: (string | number)[];

      if (checked) {
        newSelectedIds = [...selectedIds, rowId];
      } else {
        newSelectedIds = selectedIds.filter((id) => id !== rowId);
      }

      const selectedRows = data.filter((r) => newSelectedIds.includes(getRowId(r)));
      onSelectionChange(newSelectedIds, selectedRows);
    },
    [selectedIds, onSelectionChange, getRowId, data],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!onSelectionChange || !getRowId) return;

      if (checked) {
        const selectableRows = data.filter((row) => !isRowDisabled?.(row));
        const allIds = selectableRows.map((row) => getRowId(row));
        onSelectionChange(allIds, selectableRows);
      } else {
        onSelectionChange([], []);
      }
    },
    [data, onSelectionChange, getRowId, isRowDisabled],
  );

  // Calculate dynamic heights
  const headerHeight = 48;
  const paginationHeight = 52;
  const baseListHeight = height - headerHeight - paginationHeight;

  // Calculate content height based on number of rows
  const rowHeight = 52; // minHeight from TableRow
  const contentHeight = paginatedData.length * rowHeight;
  const shouldScroll = contentHeight > baseListHeight;

  // If content is smaller than available space, use content height
  // If content is larger, use available space and enable scroll
  const listHeight = shouldScroll ? baseListHeight : Math.min(contentHeight, baseListHeight);
  const actualTableHeight = shouldScroll ? height : headerHeight + listHeight + paginationHeight;

  // Loading state
  if (loading) {
    return (
      <Paper className={className} sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Yükleniyor...
        </Typography>
      </Paper>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper className={className} sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  // Empty state
  if (!data.length) {
    return (
      <Paper className={className} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={className} sx={{ height: actualTableHeight, overflow: 'hidden' }}>
      {/* Header */}
      <TableHeader
        columns={columns as VirtualTableColumn<Record<string, unknown>>[]}
        selectable={selectable}
        selectedIds={selectedIds}
        data={data}
        onSelectAll={handleSelectAll}
        isRowDisabled={isRowDisabled as ((row: Record<string, unknown>) => boolean) | undefined}
      />

      {/* Scrollable Content */}
      <Box
        sx={{
          height: listHeight,
          overflow: shouldScroll ? 'auto' : 'visible',
        }}>
        {paginatedData.map((row, index) => (
          <TableRow
            key={getRowIdFromRow(row, getRowId, startIndex + index)}
            row={row}
            index={startIndex + index}
            columns={columns as VirtualTableColumn<Record<string, unknown>>[]}
            selectedIds={selectedIds}
            onRowSelect={
              selectable ? (handleRowSelect as (row: Record<string, unknown>, checked: boolean) => void) : undefined
            }
            isRowDisabled={isRowDisabled as ((row: Record<string, unknown>) => boolean) | undefined}
            getRowId={getRowId as ((row: Record<string, unknown>) => string | number) | undefined}
          />
        ))}
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: paginationHeight,
          borderTop: '1px solid #e0e0e0',
          px: 2,
        }}>
        <TablePagination
          component="div"
          count={totalCount || data.length}
          page={currentPage - 1}
          onPageChange={(_, page) => onPageChange?.(page + 1)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={
            onPageSizeChange ? (e) => onPageSizeChange(Number.parseInt(e.target.value, 10)) : undefined
          }
          rowsPerPageOptions={onPageSizeChange ? [25, 50, 100, 200] : []}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
          showFirstButton
          showLastButton
          labelRowsPerPage={'Her sayfada gösterilecek kayıt sayısı:'}
        />
      </Box>
    </Paper>
  );
};

export default VirtualTable;
