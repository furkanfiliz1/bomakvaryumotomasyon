import { Card, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { Breadcrumb } from '@components';

const DesignGuideBreadcrumb = () => {
  const theme = useTheme();

  const BreadcrumbBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Breadcrumb" muiLink="https://mui.com/material-ui/react-tabs/" />
      <BreadcrumbBox sx={{ marginBlock: 2 }}>
        <Breadcrumb />
      </BreadcrumbBox>
    </Card>
  );
};

export default DesignGuideBreadcrumb;
