import { Box } from '@mui/material';
import { RowActions } from '../types';
interface TableItemMoreMenuProps {
  rowActions?: RowActions[];
  row?: unknown;
  rowIndex?: number;
  toggleCollapse?: () => void;
  isCollapseOpen?: boolean;
  id?: string;
}

export default function TableItemMoreMenu(props: TableItemMoreMenuProps) {
  const { rowActions, row, toggleCollapse, isCollapseOpen, rowIndex } = props;

  return (
    <Box sx={{ whiteSpace: 'nowrap', display: 'flex', justifyContent: 'flex-end' }}>
      {rowActions?.map((item, index: number) => (
        <item.Element
          row={row}
          index={rowIndex}
          toggleCollapse={toggleCollapse}
          isCollapseOpen={isCollapseOpen}
          key={index}
        />
      ))}
    </Box>
  );
}
