/**
 * Company Representative Settings V2 Types
 * Optimized version with performance enhancements
 * Re-exports base types and adds V2-specific types
 */

// Re-export all base types from V1
export * from '../CompanyRepresentativeSettings/company-representative-settings.types';

// V2-specific types for optimized rendering

/**
 * Edit state for a single row - tracks which row is being edited
 */
export interface RowEditState {
  rowId: number;
  isEditing: boolean;
}

/**
 * Pending changes for a row before save
 */
export interface RowPendingChanges {
  ManagerUserId?: number;
  ProductType?: number | string;
  FinancerCompanyId?: number | null;
  BuyerCompanyId?: number | null;
  StartDate?: string;
}

/**
 * Map of row ID to pending changes
 */
export type RowChangesMap = Record<number, RowPendingChanges>;

/**
 * Dropdown options bundle for passing to row components
 */
export interface DropdownOptionsBundle {
  customerManagerList: Array<{ Id: number; FullName: string }>;
  productTypeList: Array<{ Value: string; Description: string }>;
  financersList: Array<{ Id: number; CompanyName: string }>;
  buyerCompaniesList: Array<{ Id: number; CompanyName: string }>;
}

/**
 * Row action handlers bundle
 */
export interface RowActionHandlers {
  onFieldChange: (rowId: number, field: string, value: unknown) => void;
  onSave: (rowId: number) => void;
  onEdit: (rowId: number) => void;
  onCancel: (rowId: number) => void;
  onHistory: (rowId: number) => void;
}

/**
 * Props for optimized table row
 */
export interface OptimizedRowProps {
  rowId: number;
  isEditing: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  pendingChanges?: RowPendingChanges;
  dropdownOptions: DropdownOptionsBundle;
  actionHandlers: RowActionHandlers;
  onSelect: (rowId: number, selected: boolean) => void;
}
