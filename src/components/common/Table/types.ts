import { Dispatch, FC, MutableRefObject, PropsWithChildren, ReactNode, SetStateAction } from 'react';
import { SlotProps } from './Table';
import { SxProps, TableCellProps } from '@mui/material';

interface NotFoundConfig {
  title?: string;
  subTitle?: string;
  buttonTitle?: string;
  onClick?: () => void;
}

export interface HeadCell {
  id: string;
  width?: number;
  label?: string;
  slot?: boolean;
  type?: string;
  props?: TableCellProps;
  isSortDisabled?: boolean;
  tooltip?: string;
  isHidden?: boolean;
}

export interface TableState {
  page: number;
  rowsPerPage: number;
  order: Order | undefined;
  orderBy: string | undefined;
  selected: readonly (string | number)[];
  setSelected: Dispatch<SetStateAction<readonly (string | number)[]>>;
  setPage: Dispatch<SetStateAction<number>>;
  setOrder: Dispatch<SetStateAction<Order | undefined>>;
  setOrderBy: Dispatch<SetStateAction<string | undefined>>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  resetCheckboxRow: () => void;
  visibleRows: object[];
  selectedRowsData: MutableRefObject<readonly object[]>;
  stickyRows?: { id: number; top: number; zIndex: number }[];
  allCheckboxDisabled?: boolean;
}

export type Order = 'asc' | 'desc';
export interface RowActions<T = unknown> {
  toggleCollapse?: () => void;
  Element: FC<{ row?: T; isCollapseOpen?: boolean; toggleCollapse?: () => void; index?: number }>;
  isCollapseButton?: boolean;
}
export interface CustomChildrenProps extends PropsWithChildren {
  id: string;
}
export interface RowChildElementType {
  props?: CustomChildrenProps;
}
export interface RowElement {
  slot?: ReactNode | (() => JSX.Element);
  id: number | string;
  props?: { id: string };
  type?: 'date' | 'currency' | 'percentage';
}
export type SlotElement = React.ReactElement<SlotProps<unknown>>;

export interface PagingConfig {
  /**The zero-based index of the current page. Default = 0 */
  page?: number;
  /**Default = 100 */
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  totalCount?: number;
  rowsPerPageOptions?: number[];
}

export interface SortingConfig {
  order?: Order;
  orderBy?: string;
  onSort?: (field: string, order: Order) => void;
}
export interface TableProps<T> {
  id: string;
  rowId: keyof T;
  reference?: MutableRefObject<TableState | null>;
  className?: string;
  size?: 'small' | 'medium';
  headers: HeadCell[];
  actions?: RowActions[];
  children?: SlotElement | SlotElement[] | ReactNode;
  rowActions?: RowActions<T>[];
  actionHeaderTitle?: string;
  data: readonly T[];
  loading?: boolean;
  error?: Error | string;
  disabled?: boolean;
  total?: number;
  checkbox?: boolean;
  initialCheckedIds?: (string | number)[];
  onCheckboxSelect?: (row: T[]) => void;
  disabledCheckboxes?: (row: T) => boolean | boolean;
  toolbar?: ReactNode | ReactNode[];
  CollapseComponent?: (item: { row: T }) => JSX.Element;
  hidePaging?: boolean;
  hideHeader?: boolean;
  pagingConfig?: PagingConfig;
  sortingConfig?: SortingConfig;
  maxHeight?: string;
  rowHeight?: 'sm' | 'md' | 'lg';
  notFoundConfig?: NotFoundConfig;
  headerStyle?: SxProps;
  disableSorting?: boolean;
  singleSelect?: boolean;
  striped?: boolean;
  stickyRows?: { id: number; top: number; zIndex: number }[];
  CardComponent?: FC<{ row: T }>;
  allCheckboxDisabled?: boolean;
}
