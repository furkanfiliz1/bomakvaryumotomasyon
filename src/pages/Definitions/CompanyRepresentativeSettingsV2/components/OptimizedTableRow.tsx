/**
 * Optimized Table Row Component V2
 * Memoized row component that only re-renders when its specific data changes
 * Always editable like V1, but with heavy memoization for performance
 *
 * KEY OPTIMIZATIONS:
 * 1. Heavy memoization to prevent unnecessary re-renders
 * 2. Stable callback references via useCallback
 * 3. Minimal prop drilling with bundled handlers
 */

import { Box, Checkbox } from '@mui/material';
import React, { memo, useCallback, useMemo } from 'react';
import { isFinancerDisabled } from '../../CompanyRepresentativeSettings/helpers/company-representative-settings.helpers';
import type { CompanyCustomerManagerItem } from '../company-representative-settings.types';
import {
  ActionsSlot,
  BuyerCompanySlot,
  CompanyDisplaySlot,
  CustomerManagerSlot,
  FinancerSlot,
  ProductTypeSlot,
  StartDateSlot,
} from './OptimizedTableSlots';

// ============================================
// TYPES
// ============================================

interface DropdownOptions {
  customerManagerList: Array<{ Id: number; FullName: string }>;
  productTypeList: Array<{ Value: string; Description: string }>;
  financersList: Array<{ Id: number; CompanyName: string }>;
  buyerCompaniesList: Array<{ Id: number; CompanyName: string }>;
}

interface OptimizedTableRowProps {
  /** Original row data */
  row: CompanyCustomerManagerItem;
  /** Row data with pending changes applied */
  rowWithChanges: CompanyCustomerManagerItem;
  /** Whether this row is selected */
  isSelected: boolean;
  /** Whether this row is disabled (cannot be selected) */
  isDisabled: boolean;
  /** Dropdown options for all editable fields */
  dropdownOptions: DropdownOptions;
  /** Handler for field value changes */
  onFieldChange: (rowId: number, field: string, value: unknown) => void;
  /** Handler for saving/refreshing changes */
  onRefresh: (rowId: number) => void;
  /** Handler for viewing history */
  onHistory: (rowId: number) => void;
  /** Handler for selection toggle */
  onSelect: (rowId: number, selected: boolean) => void;
  /** Whether save is in progress */
  isSaving?: boolean;
}

// ============================================
// ROW COMPONENT
// ============================================

export const OptimizedTableRow = memo<OptimizedTableRowProps>(
  ({
    row,
    rowWithChanges,
    isSelected,
    isDisabled,
    dropdownOptions,
    onFieldChange,
    onRefresh,
    onHistory,
    onSelect,
    isSaving = false,
  }) => {
    const rowId = row.CompanyCustomerManagerId;

    // Stable callback handlers
    const handleCheckboxChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onSelect(rowId, e.target.checked);
      },
      [rowId, onSelect],
    );

    const handleRowClick = useCallback(() => {
      if (!isDisabled) {
        onSelect(rowId, !isSelected);
      }
    }, [rowId, isDisabled, isSelected, onSelect]);

    const handleManagerChange = useCallback(
      (value: number) => onFieldChange(rowId, 'ManagerUserId', value),
      [rowId, onFieldChange],
    );

    const handleProductTypeChange = useCallback(
      (value: string) => {
        onFieldChange(rowId, 'ProductType', value);
        // If new product type disables financer, clear financer value
        if (value && isFinancerDisabled(value)) {
          onFieldChange(rowId, 'FinancerCompanyId', null);
        }
      },
      [rowId, onFieldChange],
    );

    const handleFinancerChange = useCallback(
      (value: number | null) => onFieldChange(rowId, 'FinancerCompanyId', value),
      [rowId, onFieldChange],
    );

    const handleBuyerChange = useCallback(
      (value: number | null) => onFieldChange(rowId, 'BuyerCompanyId', value),
      [rowId, onFieldChange],
    );

    const handleStartDateChange = useCallback(
      (value: string) => onFieldChange(rowId, 'StartDate', value),
      [rowId, onFieldChange],
    );

    const handleRefresh = useCallback(() => onRefresh(rowId), [rowId, onRefresh]);
    const handleHistory = useCallback(() => onHistory(rowId), [rowId, onHistory]);

    // Helper function to get background color
    const getBackgroundColor = (selected: boolean): string => {
      if (selected) return 'rgba(25, 118, 210, 0.08)';
      return 'transparent';
    };

    // Helper function to get hover background color
    const getHoverBackgroundColor = (selected: boolean): string => {
      if (selected) return 'rgba(25, 118, 210, 0.12)';
      return 'rgba(0, 0, 0, 0.04)';
    };

    // Row styles
    const rowStyles = useMemo(
      () => ({
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: getBackgroundColor(isSelected),
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        '&:hover': {
          backgroundColor: getHoverBackgroundColor(isSelected),
        },
        px: 1,
        minHeight: 56,
      }),
      [isSelected, isDisabled],
    );

    const cellStyles = useMemo(
      () => ({
        flex: '1 1 auto',
        px: 1,
        fontSize: '0.875rem',
        minWidth: 0,
      }),
      [],
    );

    return (
      <Box sx={rowStyles} onClick={handleRowClick}>
        {/* Checkbox Column */}
        <Box sx={{ width: 48, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <Checkbox
            checked={isSelected}
            disabled={isDisabled}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            size="small"
          />
        </Box>

        {/* Company Display - Always read-only */}
        <Box sx={{ ...cellStyles, width: 200, minWidth: 250 }}>
          <CompanyDisplaySlot row={row} />
        </Box>

        {/* Customer Manager */}
        <Box sx={{ ...cellStyles, width: 280, minWidth: 220 }}>
          <CustomerManagerSlot
            row={rowWithChanges}
            options={dropdownOptions.customerManagerList}
            onChange={handleManagerChange}
          />
        </Box>

        {/* Product Type */}
        <Box sx={{ ...cellStyles, width: 250, minWidth: 200 }}>
          <ProductTypeSlot
            row={rowWithChanges}
            options={dropdownOptions.productTypeList}
            onChange={handleProductTypeChange}
          />
        </Box>

        {/* Financer */}
        <Box sx={{ ...cellStyles, width: 250, minWidth: 200 }}>
          <FinancerSlot row={rowWithChanges} options={dropdownOptions.financersList} onChange={handleFinancerChange} />
        </Box>

        {/* Buyer Company */}
        <Box sx={{ ...cellStyles, width: 250, minWidth: 200 }}>
          <BuyerCompanySlot
            row={rowWithChanges}
            options={dropdownOptions.buyerCompaniesList}
            onChange={handleBuyerChange}
          />
        </Box>

        {/* Start Date */}
        <Box sx={{ ...cellStyles, width: 220, minWidth: 180 }}>
          <StartDateSlot row={rowWithChanges} onChange={handleStartDateChange} />
        </Box>

        {/* Actions */}
        <Box sx={{ width: 150, minWidth: 120, flexShrink: 0, px: 1 }}>
          <ActionsSlot onRefresh={handleRefresh} onHistory={handleHistory} isSaving={isSaving} />
        </Box>
      </Box>
    );
  },
  // Custom comparison function for memo
  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.row.CompanyCustomerManagerId === nextProps.row.CompanyCustomerManagerId &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isDisabled === nextProps.isDisabled &&
      prevProps.isSaving === nextProps.isSaving &&
      // For rowWithChanges, do a shallow comparison of key fields
      prevProps.rowWithChanges.ManagerUserId === nextProps.rowWithChanges.ManagerUserId &&
      prevProps.rowWithChanges.ProductType === nextProps.rowWithChanges.ProductType &&
      prevProps.rowWithChanges.FinancerCompanyId === nextProps.rowWithChanges.FinancerCompanyId &&
      prevProps.rowWithChanges.BuyerCompanyId === nextProps.rowWithChanges.BuyerCompanyId &&
      prevProps.rowWithChanges.StartDate === nextProps.rowWithChanges.StartDate &&
      // Dropdown options are stable references from parent
      prevProps.dropdownOptions === nextProps.dropdownOptions
    );
  },
);

OptimizedTableRow.displayName = 'OptimizedTableRow';
