import { Box, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTableProps } from '../Table';

const RootStyle = styled(Toolbar)(() => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 !important',
}));

interface TableToolbarProps {
  numSelected?: number;
}

function TableToolbar(props: TableToolbarProps) {
  const { toolbar, actions } = useTableProps();
  const { numSelected = 0 } = props;

  if (!toolbar) return null;

  return (
    <Box sx={{ display: 'flex', border: 'none', flexDirection: 'column' }}>
      <RootStyle
        sx={{
          ...(numSelected > 0 && {
            color: 'primary',
          }),
          height: 60,
        }}>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>{toolbar}</Box>

        {actions && <Box>{actions?.map((item, index: number) => <item.Element key={index} />)}</Box>}
      </RootStyle>
    </Box>
  );
}

export default TableToolbar;
