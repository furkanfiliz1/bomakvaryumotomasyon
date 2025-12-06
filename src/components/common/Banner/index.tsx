import { Button } from '@components';
import { useResponsive } from '@hooks';
import { Box, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

export const BannerHeight = 76;

const Banner = () => {
  const theme = useTheme();
  const smDown = useResponsive('down', 'sm');

  const appUrl =
    'https://figopara.onelink.me/W0pX?pid=Mobile_App&c=webportal&af_web_dp=https%3A%2F%2Fportal.figopara.com%2Flogin%3Futm_source%3DMobile_App%26utm_medium%3Dwebportal%26utm_campaign%3D%26channel_code%3DMobile_App|https://figopara.onelink.me/W0pX?pid=Mobile_App&c=webportal&af_web_dp=https%3A%2F%2Fportal.figopara.com%2Flogin%3Futm_source%3DMobile_App%26utm_medium%3Dwebportal%26utm_campaign%3D%26channel_code%3DMobile_App';

  if (!smDown) return null;
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      height={BannerHeight}
      sx={{ backgroundColor: theme.palette.dark[900] }}
      px={theme.spacing(2)}
      py={theme.spacing(1)}
      justifyContent={'space-between'}>
      <Box display={'flex'} alignItems={'center'} gap={theme.spacing(1)}>
        <img src="/assets/logos/figoparaSmallLogo.png" alt="Figopara Small Logo" width={'auto'} height={40} />
        <Box display={'flex'} flexDirection={'column'}>
          <Typography color="white" variant="button">
            Figopara
          </Typography>
          <Typography color="white" sx={{ whiteSpace: 'pre-wrap' }} variant="caption">
            Hızlı ve güvenli ödeme çözümleri
          </Typography>
        </Box>
      </Box>

      <Button
        id="navigateToApp"
        variant="contained"
        size={'small'}
        sx={{ backgroundColor: theme.palette.smallLogo.main, height: 40, fontSize: '12px' }}>
        <Link to={appUrl} style={{ color: 'white', lineHeight: 1.5 }}>
          Uygulamayı Aç
        </Link>
      </Button>
    </Box>
  );
};
export default Banner;
