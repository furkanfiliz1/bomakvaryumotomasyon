import { useTableProps } from '../Table';
import { Box, TableRow, Typography } from '@mui/material';
import { Button } from '@components';

const NotFound = () => {
  const { loading, data, notFoundConfig } = useTableProps();
  const { title, subTitle, buttonTitle, onClick } = notFoundConfig || {};

  const notFound = data && data.length === 0;

  if (loading || !notFound) return null;

  return (
    <TableRow sx={{ position: 'relative', height: '250px' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'rgb(255 255 255 / 65%)',
          zIndex: 12345,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
        <img width={100} alt="not-found" src="/assets/icons/search.png" />
        <Typography variant="h5">{title || 'Veri Bulunamadı'}</Typography>
        {subTitle && (
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {subTitle}
          </Typography>
        )}
        {buttonTitle && (
          <Button id={buttonTitle} onClick={onClick} sx={{ mt: 2 }} variant="contained">
            {buttonTitle}
          </Button>
        )}
      </Box>
    </TableRow>
  );
};

export default NotFound;
