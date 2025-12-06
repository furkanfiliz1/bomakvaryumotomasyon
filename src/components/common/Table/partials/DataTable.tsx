import { Card, Table, TableBody, TableContainer } from '@mui/material';
import TableToolbar from './TableToolbar';
import Row from './Row';
import TableSkeletonRows from './TableSkeletonRows';
import TableHeader from './TableHeader';
import NotFound from './NotFound';
import { useTableProps, useTableState } from '../Table';
import Pagination from './Pagination';
import { useResponsive } from '@hooks';
import RowCardsList from './RowCardsList';

const DataTable = <T,>() => {
  const { size = 'small', loading, maxHeight, headerStyle, CardComponent, id } = useTableProps<T>();

  const { visibleRows, selected, stickyRows } = useTableState();

  const mdDown = useResponsive('down', 'md');
  const height = mdDown ? 500 : window.innerHeight - window.innerHeight / 3;

  if (CardComponent) {
    return <RowCardsList />;
  }

  return (
    <>
      <TableToolbar numSelected={selected.length} />

      <Card>
        <TableContainer sx={{ maxHeight: maxHeight || height }}>
          <Table size={size} stickyHeader aria-label="collapsible table" id={id}>
            <TableHeader headerStyle={headerStyle || undefined} />
            <TableBody sx={{ height: '100%', overflowY: 'auto' }}>
              {loading ? (
                <TableSkeletonRows />
              ) : (
                <>
                  {visibleRows?.map((row, index) => {
                    const stickyRow = stickyRows?.find((sr) => sr.id === index);
                    return (
                      <Row
                        key={index}
                        rowIndex={index}
                        row={row}
                        style={{
                          position: stickyRow ? 'sticky' : 'relative',
                          top: stickyRow ? stickyRow.top : 'auto',
                          zIndex: stickyRow ? stickyRow.zIndex : 'auto',
                        }}
                      />
                    );
                  })}
                </>
              )}

              <NotFound />
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination />
      </Card>
    </>
  );
};

export default DataTable;
