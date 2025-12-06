import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Order, TableProps, TableState } from './types';
import DataTable from './partials/DataTable';
import { getComparator, stableSort } from './utils';
import { INITIAL_TABLE_PAGE_SIZE } from '@constant';
import { getFromParams } from '@helpers';

export * from './partials/Slot';

const TablePropsContext = createContext<TableProps<unknown> | null>(null);
const TableStateContext = createContext<TableState | null>(null);

export const useTableProps = <T = unknown,>() => {
  const context = useContext(TablePropsContext);

  if (!context) throw Error('Please use useTableProps inside Table');

  return context as TableProps<T>;
};

export const useTableState = () => {
  const context = useContext(TableStateContext);

  if (!context) throw Error('Please use useTableState inside Table');

  return context;
};

export const Table = <T extends object>(props: TableProps<T>) => {
  const {
    pagingConfig,
    sortingConfig,
    reference,
    data,
    hidePaging,
    initialCheckedIds,
    checkbox,
    stickyRows,
    allCheckboxDisabled,
  } = props;
  const { page: pageProp, rowsPerPage: rowsPerPageProp } = pagingConfig ?? {};
  const getParamsPage = Number(getFromParams('page'));

  const [order, setOrder] = useState<Order | undefined>(sortingConfig?.order);
  const [orderBy, setOrderBy] = useState<string | undefined>(sortingConfig?.orderBy);
  const [page, setPage] = useState<number>(Number(getFromParams('page') ?? pageProp ?? 1) - 1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    Number(getFromParams('pageSize') ?? rowsPerPageProp ?? INITIAL_TABLE_PAGE_SIZE),
  );

  useEffect(() => {
    if (getParamsPage !== 0 && getParamsPage - 1 !== page) setPage(Number(getParamsPage) - 1);
  }, [getParamsPage, page]);

  const [selected, setSelected] = useState<readonly (string | number)[]>(initialCheckedIds ?? []);

  const selectedRowsData = useRef<readonly object[]>([]);

  const visibleRows = useMemo(() => {
    // client-side
    if (data.length > rowsPerPage && !hidePaging) {
      const paginatedData = data.slice(rowsPerPage * page, rowsPerPage * (page + 1));
      return stableSort<T>(paginatedData, getComparator(order, orderBy));
    }

    return stableSort<T>(data, getComparator(order, orderBy));
  }, [data, hidePaging, order, orderBy, page, rowsPerPage]);

  useEffect(() => {
    setSelected([]);
  }, [checkbox]);

  useEffect(() => {
    setSelected(initialCheckedIds || []);
  }, [initialCheckedIds]);

  const state: TableState = useMemo(
    () => ({
      page,
      rowsPerPage,
      order,
      orderBy,
      selected,
      setPage,
      setOrder,
      setOrderBy,
      setRowsPerPage,
      setSelected,
      visibleRows,
      resetCheckboxRow: () => {
        setSelected([]);
      },
      selectedRowsData,
      stickyRows,
      allCheckboxDisabled,
    }),
    [order, orderBy, page, rowsPerPage, selected, visibleRows, stickyRows, allCheckboxDisabled],
  );

  if (reference) {
    reference.current = state;
  }

  return (
    <TablePropsContext.Provider value={props as TableProps<unknown>}>
      <TableStateContext.Provider value={state}>
        <DataTable<T> />
      </TableStateContext.Provider>
    </TablePropsContext.Provider>
  );
};
