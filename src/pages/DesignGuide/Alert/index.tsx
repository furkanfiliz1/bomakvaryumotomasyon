import { Alert, Card, styled, useTheme, Typography } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';

const DesignGuideAlert = () => {
  const theme = useTheme();

  const AlertBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const AlertBoxTitle = styled(Typography)(() => ({
    marginBottom: theme.spacing(1),
  }));

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Alert" muiLink="https://mui.com/material-ui/react-alert/" />

      <AlertBox>
        <AlertBoxTitle>Filled</AlertBoxTitle>
        <Alert sx={{ mb: 1 }} variant="filled" color="error" severity="error">
          Error Alert Box
        </Alert>
        <Alert sx={{ mb: 1 }} variant="filled" color="info" severity="info">
          Info Alert Box
        </Alert>
        <Alert sx={{ mb: 1 }} variant="filled" color="warning" severity="warning">
          Warning Alert Box
        </Alert>
        <Alert sx={{ mb: 1 }} variant="filled" color="success" severity="success">
          success Alert Box
        </Alert>
      </AlertBox>

      <AlertBox>
        <AlertBoxTitle>Outlined</AlertBoxTitle>
        <Alert sx={{ mb: 1 }} variant="outlined" color="error" severity="error">
          Error Alert Box
        </Alert>
        <Alert sx={{ mb: 1 }} variant="outlined" color="info" severity="info">
          Info Alert Box
        </Alert>
        <Alert sx={{ mb: 1 }} variant="outlined" color="warning" severity="warning">
          Warning Alert Box
        </Alert>
        <Alert sx={{ mb: 1 }} variant="outlined" color="success" severity="success">
          success Alert Box
        </Alert>
      </AlertBox>
      <AlertBox>
        <AlertBoxTitle>Standart</AlertBoxTitle>
        <Alert sx={{ mb: 1 }} variant="standard" color="error" severity="error">
          Error Alert Box
        </Alert>
        <Alert sx={{ mb: 1 }} variant="standard" color="info" severity="info">
          Info Alert Box
        </Alert>
        <Alert sx={{ mb: 1 }} variant="standard" color="warning" severity="warning">
          Warning Alert Box
        </Alert>
        <Alert sx={{ mb: 1 }} variant="standard" color="success" severity="success">
          success Alert Box
        </Alert>
      </AlertBox>
    </Card>
  );
};

export default DesignGuideAlert;
