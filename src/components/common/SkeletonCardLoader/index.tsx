import { Box, Card, Divider, Grid, Skeleton } from '@mui/material';

interface InfoDrawerProps {
  direction: 'row' | 'column';
  cardCount: number;
  columnCount?: number;
}

const SkeletonCardLoader = ({ cardCount, columnCount = 6, direction = 'row' }: InfoDrawerProps) => {
  const arr = new Array<number>(cardCount).fill(Math.random());
  return (
    <Grid container spacing={2} direction={direction}>
      {arr.map((_, index) => (
        <Grid
          item
          lg={direction === 'column' ? 12 : columnCount}
          md={direction === 'column' ? 12 : columnCount}
          sm={direction === 'column' ? 12 : columnCount}
          xs={12}
          key={index}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Skeleton width={'40%'} />
            </Box>
            <Divider />
            <Box sx={{ mt: 2 }}>
              <Skeleton />
              <Skeleton />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonCardLoader;
