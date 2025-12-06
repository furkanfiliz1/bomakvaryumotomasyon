/**
 * Optimized Virtual Table V2
 * High-performance table with minimal re-renders
 *
 * KEY OPTIMIZATIONS:
 * 1. Custom virtualization - only visible rows are rendered
 * 2. Memoized header component
 * 3. Stable callback references
 * 4. Efficient selection management with Set
 */

import { Alert, Box, Checkbox, CircularProgress, Paper, TablePagination, Typography } from '@mui/material';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import type { CompanyCustomerManagerItem } from '../company-representative-settings.types';
import { OptimizedTableRow } from './OptimizedTableRow';

// ============================================
// TYPES
// ============================================

interface DropdownOptions {
  customerManagerList: Array<{ Id: number; FullName: string }>;
  productTypeList: Array<{ Value: string; Description: string }>;
  financersList: Array<{ Id: number; CompanyName: string }>;
  buyerCompaniesList: Array<{ Id: number; CompanyName: string }>;
}

interface OptimizedTableV2Props {
  /** Table data */
  data: CompanyCustomerManagerItem[];
  /** Whether data is loading */
  loading?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Dropdown options bundle */
  dropdownOptions: DropdownOptions;
  /** Row data with changes applied */
  getRowWithChanges: (row: CompanyCustomerManagerItem) => CompanyCustomerManagerItem;
  /** Selected row IDs (using Set for O(1) lookup) */
  selectedIds: Set<number>;
  /** Check if a row is disabled */
  isRowDisabled: (row: CompanyCustomerManagerItem) => boolean;
  /** Handler for field changes */
  onFieldChange: (rowId: number, field: string, value: unknown) => void;
  /** Handler for refreshing a row */
  onRefresh: (rowId: number) => void;
  /** Handler for viewing history */
  onHistory: (rowId: number) => void;
  /** Handler for selection toggle */
  onSelect: (rowId: number, selected: boolean) => void;
  /** Handler for select all */
  onSelectAll: () => void;
  /** Whether a save is in progress */
  isSaving?: boolean;
  /** Saving row ID */
  savingRowId?: number | null;
  /** Pagination - current page (1-based) */
  currentPage?: number;
  /** Pagination - page size */
  pageSize?: number;
  /** Pagination - total count */
  totalCount?: number;
  /** Pagination - page change handler */
  onPageChange?: (page: number) => void;
  /** Pagination - page size change handler */
  onPageSizeChange?: (pageSize: number) => void;
  /** Table height */
  height?: number;
  /** Empty message */
  emptyMessage?: string;
}

// ============================================
// HEADER COMPONENT
// ============================================

interface TableHeaderProps {
  selectedCount: number;
  totalSelectableCount: number;
  onSelectAll: () => void;
}

const TableHeader = memo<TableHeaderProps>(({ selectedCount, totalSelectableCount, onSelectAll }) => {
  const isAllSelected = totalSelectableCount > 0 && selectedCount === totalSelectableCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalSelectableCount;

  const columns = [
    { id: 'checkbox', label: '', width: 48 },
    { id: 'company', label: 'ŞİRKET VKN / ADI', width: 200, minWidth: 250 },
    { id: 'manager', label: 'MÜŞTERİ TEMSİLCİSİ', width: 280, minWidth: 220 },
    { id: 'product', label: 'ÜRÜN', width: 250, minWidth: 200 },
    { id: 'financer', label: 'FİNANSÖR', width: 250, minWidth: 200 },
    { id: 'buyer', label: 'ALICI', width: 250, minWidth: 200 },
    { id: 'startDate', label: 'BAŞLANGIÇ TARİHİ', width: 220, minWidth: 180 },
    { id: 'actions', label: 'İŞLEMLER', width: 150, minWidth: 120 },
  ];

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
      {/* Checkbox header */}
      <Box sx={{ width: 48, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} onChange={onSelectAll} size="small" />
      </Box>

      {/* Column headers */}
      {columns.slice(1).map((column) => (
        <Box
          key={column.id}
          sx={{
            width: column.width,
            minWidth: column.minWidth || column.width,
            flex: '1 1 auto',
            px: 1,
            fontWeight: 'bold',
            fontSize: '0.75rem',
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}>
          {column.label}
        </Box>
      ))}
    </Box>
  );
});

TableHeader.displayName = 'TableHeader';

// ============================================
// VIRTUALIZED LIST COMPONENT
// ============================================

const ROW_HEIGHT = 56;
const OVERSCAN = 5; // Render extra rows above/below viewport

interface VirtualizedListProps {
  data: CompanyCustomerManagerItem[];
  height: number;
  selectedIds: Set<number>;
  isRowDisabled: (row: CompanyCustomerManagerItem) => boolean;
  getRowWithChanges: (row: CompanyCustomerManagerItem) => CompanyCustomerManagerItem;
  dropdownOptions: DropdownOptions;
  onFieldChange: (rowId: number, field: string, value: unknown) => void;
  onRefresh: (rowId: number) => void;
  onHistory: (rowId: number) => void;
  onSelect: (rowId: number, selected: boolean) => void;
  isSaving: boolean;
  savingRowId: number | null;
}

const VirtualizedList: React.FC<VirtualizedListProps> = memo(
  ({
    data,
    height,
    selectedIds,
    isRowDisabled,
    getRowWithChanges,
    dropdownOptions,
    onFieldChange,
    onRefresh,
    onHistory,
    onSelect,
    isSaving,
    savingRowId,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []);

    // Calculate which rows are visible
    const { visibleRows } = useMemo(() => {
      const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
      const visibleCount = Math.ceil(height / ROW_HEIGHT) + OVERSCAN * 2;
      const end = Math.min(data.length - 1, start + visibleCount);

      const rows = [];
      for (let i = start; i <= end; i++) {
        const row = data[i];
        if (!row) continue;

        const rowId = row.CompanyCustomerManagerId;
        rows.push({
          row,
          rowWithChanges: getRowWithChanges(row),
          isSelected: selectedIds.has(rowId),
          isDisabled: isRowDisabled(row),
          isRowSaving: isSaving && savingRowId === rowId,
          top: i * ROW_HEIGHT,
        });
      }

      return { visibleRows: rows };
    }, [data, scrollTop, height, selectedIds, isRowDisabled, getRowWithChanges, isSaving, savingRowId]);

    const totalHeight = data.length * ROW_HEIGHT;

    return (
      <Box ref={containerRef} sx={{ height, overflow: 'auto', position: 'relative' }} onScroll={handleScroll}>
        {/* Spacer to maintain scroll height */}
        <Box sx={{ height: totalHeight, position: 'relative' }}>
          {visibleRows.map(({ row, rowWithChanges, isSelected, isDisabled, isRowSaving, top }) => (
            <Box
              key={row.CompanyCustomerManagerId}
              sx={{
                position: 'absolute',
                top,
                left: 0,
                right: 0,
                height: ROW_HEIGHT,
              }}>
              <OptimizedTableRow
                row={row}
                rowWithChanges={rowWithChanges}
                isSelected={isSelected}
                isDisabled={isDisabled}
                dropdownOptions={dropdownOptions}
                onFieldChange={onFieldChange}
                onRefresh={onRefresh}
                onHistory={onHistory}
                onSelect={onSelect}
                isSaving={isRowSaving}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  },
);

VirtualizedList.displayName = 'VirtualizedList';

// ============================================
// MAIN TABLE COMPONENT
// ============================================

export const OptimizedTableV2: React.FC<OptimizedTableV2Props> = ({
  data,
  loading = false,
  error = null,
  dropdownOptions,
  getRowWithChanges,
  selectedIds,
  isRowDisabled,
  onFieldChange,
  onRefresh,
  onHistory,
  onSelect,
  onSelectAll,
  isSaving = false,
  savingRowId = null,
  currentPage = 1,
  pageSize = 100,
  totalCount,
  onPageChange,
  onPageSizeChange,
  height = 800,
  emptyMessage = 'Veri bulunamadı',
}) => {
  // Calculate selectable rows count
  const selectableRows = useMemo(() => data.filter((row) => !isRowDisabled(row)), [data, isRowDisabled]);

  const selectedCount = useMemo(() => {
    return selectableRows.filter((row) => selectedIds.has(row.CompanyCustomerManagerId)).length;
  }, [selectableRows, selectedIds]);

  // Calculate heights
  const headerHeight = 48;
  const paginationHeight = 52;
  const contentHeight = height - headerHeight - paginationHeight;

  // Loading state
  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
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
      <Paper sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  // Empty state
  if (!data.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height, overflow: 'hidden' }}>
      {/* Header */}
      <TableHeader
        selectedCount={selectedCount}
        totalSelectableCount={selectableRows.length}
        onSelectAll={onSelectAll}
      />

      {/* Virtualized Content */}
      <VirtualizedList
        data={data}
        height={contentHeight}
        selectedIds={selectedIds}
        isRowDisabled={isRowDisabled}
        getRowWithChanges={getRowWithChanges}
        dropdownOptions={dropdownOptions}
        onFieldChange={onFieldChange}
        onRefresh={onRefresh}
        onHistory={onHistory}
        onSelect={onSelect}
        isSaving={isSaving}
        savingRowId={savingRowId}
      />

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
          labelRowsPerPage="Her sayfada gösterilecek kayıt sayısı:"
        />
      </Box>
    </Paper>
  );
};

export default OptimizedTableV2;
