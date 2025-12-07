import { useAppSelector, useResponsive } from '@hooks';
import { Box, styled } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

export default function UnauthorizedLayout() {
  const smDown = useResponsive('down', 'sm');
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  const ContentStyle = styled(Box)(({ theme }) => ({
    backgroundColor: '#fff',
    border: `1px solid ${theme.palette.grey.A300}`,
    borderTop: '4px solid ' + theme.palette.error[700],
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: smDown ? 'flex-start' : 'space-between',
    flexDirection: 'column',
    maxWidth: '450px',
  }));

  useEffect(() => {
    if (token) navigate('/home');
  }, [token, navigate]);

  return (
    <RootStyle>
      <Box
        sx={{
          flex: 1,
          p: smDown ? 2 : 4,
          backgroundColor: '#f5f6fa',
          backgroundImage: 'url(/assets/backgrounds/login-pattern.png)',
          backgroundPosition: 'bottom right',
          minHeight: '100vh',
          backgroundRepeat: 'no-repeat',
          backkgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <ContentStyle>
            <Outlet />
          </ContentStyle>
        </Box>
      </Box>
    </RootStyle>
  );
}
