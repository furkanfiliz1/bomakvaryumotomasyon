import { Card, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import Banner from 'src/components/common/Banner';

const DesignGuideMobileBanner = () => {
  const theme = useTheme();

  const BannerBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Mobile Banner" hideMuiLink hideFigmaLink>
        Bu Banner sadece mobilde mobile uygulmayaı indirmek için yönlendirme yapan bir banner.
      </DesignGuideHeader>
      <BannerBox sx={{ marginBlock: 2 }}>
        <Banner />
      </BannerBox>
    </Card>
  );
};

export default DesignGuideMobileBanner;
