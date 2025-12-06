import { Button } from '@components';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { APPBAR_HEIGHT } from 'src/layouts/partials/Navbar';

const ContentStyle = styled('div')(() => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  paddingTop: `${APPBAR_HEIGHT}px`,
}));

function ErrorFallback() {
  return (
    <Container>
      <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
        <Typography variant="h3" paragraph>
          Bir hata oluştu!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>Bir hata oluştu lütfen daha sonra tekrar deneyiniz.</Typography>

        <Box
          component="img"
          src="/assets/error/opss.jpg"
          sx={{ borderRadius: 50, height: 360, mx: 'auto', my: { xs: 5, sm: 10 } }}
        />
        <RouterLink to="/home">
          <Button id="back_to_home" size="large" variant="contained">
            Ana Sayfaya Dön
          </Button>
        </RouterLink>
      </ContentStyle>
    </Container>
  );
}

export default ErrorFallback;
