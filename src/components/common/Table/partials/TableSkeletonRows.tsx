import { LinearProgress, Skeleton, TableCell, TableRow } from '@mui/material';
import { useTableProps } from '../Table';
import { getRandomNumber } from '@helpers';

const TableSkeletonRows = () => {
  const { headers, data, checkbox } = useTableProps();

  const shallowData = [...Array(data.length > 0 ? data.length : 10)].map(() => getRandomNumber());

  return (
    <TableRow>
      <TableCell colSpan={headers?.length + (checkbox ? 2 : 1)} sx={{ p: 0 }}>
        <LinearProgress id="linearProgressBar" sx={{ height: 5 }} color="primary" />
        {shallowData.map((key) => (
          <Skeleton key={key} sx={{ mb: 0.2 }} variant="rectangular" width={'100%'} height={60} />
        ))}
      </TableCell>
    </TableRow>
  );
};

export default TableSkeletonRows;
