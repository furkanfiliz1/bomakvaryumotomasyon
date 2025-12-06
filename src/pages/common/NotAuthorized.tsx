import { Icon, LoadingButton } from '@components';

import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { APPBAR_HEIGHT } from 'src/layouts/partials/Navbar';

const NotAuthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="xl" sx={{ paddingTop: `${APPBAR_HEIGHT}px` }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
        <Typography variant="h4" sx={{ width: 500, textAlign: 'center' }}>
          Sayfayı görüntülemek için yetkiniz bulunmamaktadır.
        </Typography>
        <Typography variant="body1" sx={{ width: 500, textAlign: 'center', marginTop: 2 }}></Typography>

        <LoadingButton
          id="back_to_home"
          size="large"
          type="button"
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={goBack}>
          <Icon icon="arrow-left" color="white" width={20} height={20} />
          Ana Sayfaya Dön
        </LoadingButton>

        <img src="/assets/error/401.png" width={500} />
      </Box>
    </Container>
  );
};

export default NotAuthorized;
