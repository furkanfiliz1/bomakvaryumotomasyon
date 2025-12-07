import { Card, CircularProgress, Divider, LinearProgress, Typography, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { SkeletonCardLoader } from '@components';

const DesignGuideLoading = () => {
  const theme = useTheme();

  const LoadingBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const LoadingTitle = styled(Typography)(() => ({
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  }));

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Chart" muiLink="https://mui.com/material-ui/react-progress/" />
      <LoadingBox>
        <LoadingTitle>Mui Loading</LoadingTitle>
        <Divider sx={{ marginBlock: 2 }} />
        <CircularProgress sx={{ mb: 2 }} />
        <LinearProgress />
      </LoadingBox>

      <LoadingBox>
        <DesignGuideHeader title="Skelton" muiLink="https://mui.com/material-ui/react-skeleton//" />
        <SkeletonCardLoader cardCount={1} direction="column" />
      </LoadingBox>
      <LoadingBox>
        <LoadingTitle>Custom Loading</LoadingTitle>
        <Divider sx={{ marginBlock: 2 }} />
        <LoadingBox sx={{ height: '150px' }}></LoadingBox>
      </LoadingBox>
    </Card>
  );
};

export default DesignGuideLoading;
