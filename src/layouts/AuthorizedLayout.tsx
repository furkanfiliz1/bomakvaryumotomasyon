import { useAppSelector, useResponsive } from '@hooks';
import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar, { APPBAR_HEIGHT } from './partials/Navbar';
import Sidebar, { DRAWER_WIDTH } from './partials/Sidebar';

export default function AuthorizedLayout() {
  const [open, setOpen] = useState(false);
  const isDesktop = useResponsive('up', 'lg');
  const isMobile = useResponsive('down', 'md');

  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const onCloseSideBar = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!token) {
      const haveReturnUrl = () => {
        switch (location.pathname) {
          case '/':
          case '/404':
            return false;
          case '/error-page':
            return false;

          default:
            return true;
        }
      };

      navigate({
        pathname: `/login`,
        search: haveReturnUrl() ? `?returnUrl=${location.pathname}` : location.search,
      });
    }
  }, [location, navigate, token]);

  return (
    <>
      <Sidebar isOpenSidebar={open} onCloseSidebar={onCloseSideBar} />

      <Navbar
        onOpenSidebar={() => {
          setOpen(true);
        }}
      />

      <Box
        sx={{
          ml: open ? `${DRAWER_WIDTH}px` : isDesktop ? `${DRAWER_WIDTH}px` : 0,
          mt: `${isMobile ? 0 : APPBAR_HEIGHT}px`,
          pb: 2,
          backgroundColor: '#f5f6fa',
        }}>
        <Outlet />
      </Box>
    </>
  );
}
