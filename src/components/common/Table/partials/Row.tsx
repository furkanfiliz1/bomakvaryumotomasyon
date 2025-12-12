import { Checkbox } from '@components';
import { HUMAN_READABLE_DATE, HUMAN_READABLE_DATE_TIME } from '@constant';
import { Collapse, Radio, TableCell, TableRow, Typography, styled } from '@mui/material';
import { currencyFormatter, formatTurkishCurrency } from '@utils';
import dayjs from 'dayjs';
import { get, uniqBy } from 'lodash';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTableProps, useTableState } from '../Table';
import { HeadCell, SlotElement } from '../types';
import TableItemMoreMenu from './TableItemMoreMenu';

interface RowProps {
  rowIndex: number;
  row: object;
  style?: object;
}

const StyledTableCell = styled(TableCell)<{ rowIndex: number; striped: boolean }>(({ rowIndex, striped = false }) => ({
  position: 'relative',
  backgroundColor: striped && rowIndex % 2 === 1 ? '#e0e0e0' : '#fff',
}));

const Row = (props: RowProps) => {
  const { row, rowIndex, style } = props;
  const { selected, setSelected, visibleRows, selectedRowsData, allCheckboxDisabled } = useTableState();

  const {
    headers,
    CollapseComponent,
    checkbox,
    rowActions,
    children,
    loading,
    disabledCheckboxes,
    rowId,
    onCheckboxSelect,
    singleSelect,
    striped,
    size,
  } = useTableProps();

  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const rowKey = row[rowId];

  const isChecked = selected.includes(rowKey);
  const isCheckDisabled = useMemo(() => disabledCheckboxes?.(row), [disabledCheckboxes, row]);

  useEffect(() => {
    if (allCheckboxDisabled) {
      setSelected([]);
    }
  }, [allCheckboxDisabled, setSelected]);

  const handleCheckboxClick = useCallback(() => {
    if (isCheckDisabled || !checkbox) return;

    if (singleSelect) {
      if (selected.includes(rowKey)) {
        setSelected([]);
        onCheckboxSelect?.([]);
      } else {
        const newSelectedRowData = [visibleRows.find((row) => row[rowId] === rowKey)];
        setSelected([rowKey]);
        onCheckboxSelect?.(newSelectedRowData);
      }

      return;
    }

    const selectedIndex = selected.indexOf(rowKey);
    let newSelected: readonly (number | string)[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, rowKey);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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
  }, [
    checkbox,
    isCheckDisabled,
    onCheckboxSelect,
    rowId,
    rowKey,
    selected,
    selectedRowsData,
    setSelected,
    visibleRows,
    singleSelect,
  ]);

  const cellPadding = size === 'small' ? 0.5 : 1;

  const getElement = (rowElement: HeadCell, row: unknown, index: number) => {
    if (rowElement?.slot && rowElement.id !== '' && row && children) {
      let SlotElement;

      if (children && Array.isArray(children)) {
        const ChildElement = children.find((s) => s.props.id === rowElement.id);

        if (!ChildElement) throw Error(`Please provide Slot with header id '${rowElement.id}'`);

        SlotElement = ChildElement.props.children;
      } else {
        SlotElement = (children as SlotElement).props.children;
      }

      return (
        <StyledTableCell
          rowIndex={rowIndex}
          striped={!!striped}
          id={`${headers.length}-${rowElement.id}-${rowIndex}`}
          sx={{ py: cellPadding }}
          key={index}
          {...rowElement?.props}>
          {SlotElement(get(row, rowElement?.id), row, rowIndex)}
        </StyledTableCell>
      );
    } else {
      if (rowElement.id !== '') {
        const value = get(row, rowElement.id);
        switch (rowElement.type) {
          case 'date':
            return (
              <StyledTableCell
                striped={!!striped}
                rowIndex={rowIndex}
                id={`${headers.length}-${rowElement.id}-${rowIndex}`}
                sx={{ py: cellPadding }}
                key={index}
                {...rowElement?.props}>
                <Typography variant="cell">
                  {value && value !== '0001-01-01T00:00:00' && dayjs(value).isValid()
                    ? dayjs(value).format(HUMAN_READABLE_DATE)
                    : '-'}
                </Typography>
              </StyledTableCell>
            );
          case 'date-time':
            return (
              <StyledTableCell
                striped={!!striped}
                rowIndex={rowIndex}
                id={`${headers.length}-${rowElement.id}-${rowIndex}`}
                sx={{ py: cellPadding }}
                key={index}
                {...rowElement?.props}>
                <Typography variant="cell">
                  {value && value !== '0001-01-01T00:00:00' && dayjs(value).isValid()
                    ? dayjs(value).format(HUMAN_READABLE_DATE_TIME)
                    : '-'}
                </Typography>
              </StyledTableCell>
            );
          case 'currency':
            return (
              <StyledTableCell
                striped={!!striped}
                rowIndex={rowIndex}
                id={`${headers.length}-${rowElement.id}-${rowIndex}`}
                sx={{ py: cellPadding }}
                key={index}
                {...rowElement?.props}>
                <Typography fontWeight={600} variant="cell">
                  {value
                    ? (() => {
                        const currency = get(row, 'Currency') || get(row, 'PayableAmountCurrency');
                        return currency === 'TRY' || !currency
                          ? formatTurkishCurrency(value)
                          : currencyFormatter(value, currency);
                      })()
                    : '-'}
                </Typography>
              </StyledTableCell>
            );

          case 'percentage':
            return (
              <StyledTableCell
                striped={!!striped}
                rowIndex={rowIndex}
                id={`${headers.length}-${rowElement.id}-${rowIndex}`}
                sx={{ py: cellPadding }}
                key={index}
                {...rowElement?.props}>
                {value ? `%${value}` : '-'}
              </StyledTableCell>
            );

          case 'number':
            return (
              <StyledTableCell
                striped={!!striped}
                rowIndex={rowIndex}
                id={`${headers.length}-${rowElement.id}-${rowIndex}`}
                sx={{ py: 1 }}
                key={index}
                {...rowElement?.props}>
                {value !== null && value !== undefined && value !== '' ? value : '-'}
              </StyledTableCell>
            );

          default:
            return (
              <StyledTableCell
                striped={!!striped}
                rowIndex={rowIndex}
                id={`${headers.length}-${rowElement.id}-${rowIndex}`}
                sx={{ py: cellPadding }}
                key={index}
                {...rowElement?.props}>
                {value ? value : '-'}
              </StyledTableCell>
            );
        }
      }
    }
  };

  return (
    <>
      <TableRow
        onClick={handleCheckboxClick}
        hover={!isCheckDisabled && !striped}
        tabIndex={-1}
        selected={isChecked}
        aria-checked={isChecked}
        style={{ ...style, cursor: checkbox && !isCheckDisabled ? 'pointer' : 'default' }}>
        {checkbox && !loading && (
          <StyledTableCell
            striped={!!striped}
            rowIndex={rowIndex}
            id={`${headers.length}-checkbox-${rowIndex}`}
            padding="checkbox"
            sx={{ position: 'relative' }}>
            {singleSelect ? (
              <Radio disabled={isCheckDisabled} size="medium" checked={isChecked} />
            ) : (
              <Checkbox
                disabled={isCheckDisabled}
                className="table-checkbox"
                checked={isChecked}
                sx={{ borderRadius: 4, opacity: isCheckDisabled ? 0.5 : 1 }}
              />
            )}
          </StyledTableCell>
        )}

        {headers?.map((headerItem: HeadCell, index: number) => getElement(headerItem, row, index)) as ReactNode}

        {(rowActions || CollapseComponent) && (
          <StyledTableCell
            striped={!!striped}
            rowIndex={rowIndex}
            id={`${headers.length}-detail-${rowIndex}`}
            align="right">
            <TableItemMoreMenu
              row={row}
              rowIndex={rowIndex}
              toggleCollapse={() => setIsCollapseOpen(!isCollapseOpen)}
              isCollapseOpen={isCollapseOpen}
              rowActions={rowActions as []}
            />
          </StyledTableCell>
        )}
      </TableRow>

      {CollapseComponent && (
        <StyledTableCell
          rowIndex={rowIndex}
          striped={!!striped}
          id={`${headers.length}-collapse${rowIndex}`}
          colSpan={headers?.length + 1}
          sx={{ p: 0 }}>
          <Collapse in={isCollapseOpen} timeout="auto" unmountOnExit>
            {CollapseComponent({ row })}
          </Collapse>
        </StyledTableCell>
      )}
    </>
  );
};

export default Row;
