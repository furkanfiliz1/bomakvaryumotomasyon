import { useTableProps, useTableState } from '../Table';
import { getRandomNumber } from '@helpers';
import { Box, Button, Skeleton, Typography } from '@mui/material';

const RowCardsList = () => {
  const { loading, CardComponent, data, notFoundConfig } = useTableProps<object>();
  const { title, subTitle, buttonTitle, onClick } = notFoundConfig || {};
  const { visibleRows } = useTableState();

  if (!CardComponent) return null;

  const shallowData = [...Array(data.length > 0 ? data.length : 10)].map(() => getRandomNumber());

  const notFound = !loading && data && data.length === 0;

  if (notFound)
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'rgb(255 255 255 / 65%)',
          zIndex: 12345,
          padding: 5,
          border: '1px solid #E1E6EF',
          borderRadius: '8px',
        }}>
        <img width={100} alt="not-found" src="/assets/icons/search.png" />
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          {title ?? 'Veri Bulunamadı'}
        </Typography>
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
    );

  if (loading)
    return (
      <>
        {shallowData.map((key) => (
          <Skeleton key={key} sx={{ mb: 0.2, borderRadius: 2 }} variant="rectangular" width={'100%'} height={160} />
        ))}
      </>
    );

  return (
    <Box>
      {visibleRows.map((row, index) => {
        return <CardComponent row={row} key={index} />;
      })}
    </Box>
  );
};

export default RowCardsList;
