import { Card, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { Badge } from '@components';

const DesignGuideBadge = () => {
  const theme = useTheme();

  const LoadingBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Badge" hideMuiLink>
        Tablolaron içinde kullanılan statü gösterimleri için kullanılan component
      </DesignGuideHeader>
      <LoadingBox sx={{ display: 'flex', gap: 2 }}>
        <Badge desciprition="Primary" color="primary" />
        <Badge desciprition="Success" color="success" />
        <Badge desciprition="Warning" color="warning" />
        <Badge desciprition="Error" color="error" />
      </LoadingBox>
    </Card>
  );
};

export default DesignGuideBadge;
