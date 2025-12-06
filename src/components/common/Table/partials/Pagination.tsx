import { TablePagination } from '@mui/material';
import React from 'react';
import { useTableProps, useTableState } from '../Table';
import { setToParams } from '@helpers';

const DEFAULT_ROWS_PER_PAGE = [10, 25, 50, 100, 250, 500];

const Pagination = () => {
  const { page, rowsPerPage, setPage, setRowsPerPage } = useTableState();
  const { hidePaging, data, pagingConfig } = useTableProps();
  const { onPageChange, onPageSizeChange, totalCount, rowsPerPageOptions } = pagingConfig || {};

  if (hidePaging) return null;

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    onPageChange && onPageChange(newPage + 1);
    setToParams('page', (newPage + 1).toString());
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(event.target.value, 10);
    setRowsPerPage(newCount);
    setPage(0);
    onPageSizeChange && onPageSizeChange(newCount);
    setToParams('pageSize', newCount.toString());
    setToParams('page', '1');
  };

  return (
    <TablePagination
      labelRowsPerPage="Sayfa başına satır"
      labelDisplayedRows={({ from, to, count }) => {
        return count + ' içinde ' + from + ' - ' + to + ' arası ';
      }}
      rowsPerPageOptions={rowsPerPageOptions || DEFAULT_ROWS_PER_PAGE}
      component="div"
      count={totalCount ?? data.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      slotProps={{
        actions: {
          nextButton: { id: 'next' },
          previousButton: { id: 'back' },
        },
        select: { id: 'selectRowCount' },
      }}
    />
  );
};

export default Pagination;
