import {
  Box,
  SxProps,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  tableCellClasses,
  tableSortLabelClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTableProps, useTableState } from '../Table';
import { Checkbox, Icon } from '@components';
import { HeadCell, Order } from '../types';
import { FC, useMemo } from 'react';
import { cloneDeep, uniqBy } from 'lodash';

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f8fafc',
    color: '#65748b',
    fontSize: 14,
  },
}));

const StyledTableSortLabel = styled(TableSortLabel)(() => ({
  [`&.${tableSortLabelClasses.active}`]: {
    color: '#65748b',
  },
  [`& .${tableSortLabelClasses.icon}`]: {
    color: '#65748b',
  },
}));

export interface TableHeaderCellProps {
  headCell: HeadCell;
  orderBy?: string;
  order?: Order;
  createSortHandler: (id: string) => void;
  tooltip?: string;
}
export interface TableHeaderProps {
  headerStyle?: SxProps;
}

const TableHeaderCell = (props: TableHeaderCellProps) => {
  const { headCell, orderBy, order, createSortHandler } = props;
  const { disableSorting } = useTableProps();
  const sortDisabled = headCell.isSortDisabled || !!disableSorting;

  return (
    <StyledTableCell
      id={headCell.id}
      key={headCell.id}
      padding={'normal'}
      sortDirection={orderBy === headCell.id ? order : false}
      width={headCell.width}
      {...headCell?.props}>
      <StyledTableSortLabel
        hideSortIcon
        disabled={sortDisabled && !headCell.tooltip}
        IconComponent={() => <Icon icon={order === 'desc' ? 'chevron-down' : 'chevron-up'} size={13} />}
        active={orderBy === headCell.id}
        direction={orderBy === headCell.id ? order : 'asc'}
        onClick={() => (sortDisabled ? void 0 : createSortHandler(headCell.id))}
        sx={{ whiteSpace: 'nowrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography textTransform="uppercase" variant="caption" sx={{ whiteSpace: 'break-spaces' }}>
            {headCell?.label || ''}
          </Typography>
          {headCell.tooltip && (
            <Tooltip title={headCell.tooltip} sx={{ mt: 0.35, ml: 0.5 }}>
              <Box>
                <Icon icon="info-circle" size={15} />
              </Box>
            </Tooltip>
          )}
        </Box>
        {orderBy === headCell.id ? (
          <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
        ) : null}
      </StyledTableSortLabel>
    </StyledTableCell>
  );
};

const TableHeader: FC<TableHeaderProps> = () => {
  const {
    headers,
    checkbox,
    sortingConfig,
    hideHeader,
    rowActions,
    loading,
    data,
    actionHeaderTitle,
    disabledCheckboxes,
    onCheckboxSelect,
    rowId,
    singleSelect,
    headerStyle,
  } = useTableProps();

  const isThereAnyDisabledCheckbox = useMemo(
    () => !!disabledCheckboxes && data.some(disabledCheckboxes),
    [data, disabledCheckboxes],
  );

  const { setOrder, setOrderBy, orderBy, order, visibleRows, setSelected, selected, selectedRowsData } =
    useTableState();
  const { onSort } = sortingConfig || {};

  const handleRequestSort = (field: string) => {
    const newOrder = orderBy === field && order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(field);
    onSort && onSort(field, newOrder);
  };

  const createSortHandler = (field: string) => {
    handleRequestSort(field);
  };

  if (hideHeader) return null;

  const isAllSelected = visibleRows.every((row) => selected.includes(row[rowId]));

  const handleSelectAllClick = () => {
    if (singleSelect) return;
    const visibleIds = visibleRows.map((row) => row[rowId] as string | number);
    let newSelected = cloneDeep(selected);
    if (isAllSelected) {
      newSelected = newSelected.filter((s) => !visibleIds.includes(s));
    } else {
      newSelected = [...newSelected, ...visibleIds];
    }

    newSelected = uniqBy(newSelected, (s) => s);

    const newSelectedRowData: object[] = newSelected
      .map((selectionId) => {
        return (
          visibleRows.find((row) => row[rowId] === selectionId) ||
          selectedRowsData?.current?.find((row) => row[rowId] === selectionId) ||
          {}
        );
      })
      .filter((r) => !!r);

    setSelected(newSelected);
    onCheckboxSelect?.(newSelectedRowData);
    selectedRowsData.current = newSelectedRowData;
  };

  const visibleHeaders = headers.filter((header) => !header?.isHidden);

  return (
    <TableHead sx={headerStyle || undefined}>
      <TableRow>
        {checkbox && !loading && data.length > 0 && (
          <StyledTableCell padding="checkbox">
            {!singleSelect ? (
              <Checkbox
                disabled={isThereAnyDisabledCheckbox}
                className="table-checkbox"
                checked={isAllSelected}
                sx={{ borderRadius: 4, opacity: isThereAnyDisabledCheckbox ? 0.5 : 1 }}
                onChange={() => !isThereAnyDisabledCheckbox && handleSelectAllClick()}
                id="selectAllCheckbox"
              />
            ) : null}
          </StyledTableCell>
        )}
        {visibleHeaders.map((headCell, index) => (
          <TableHeaderCell
            key={index}
            headCell={headCell}
            order={order}
            orderBy={orderBy}
            createSortHandler={createSortHandler}
          />
        ))}
        {rowActions && <StyledTableCell>{actionHeaderTitle ?? ''}</StyledTableCell>}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
