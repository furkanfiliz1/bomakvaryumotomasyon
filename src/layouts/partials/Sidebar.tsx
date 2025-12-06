import { Icon, IconTypes, Logo, Scrollbar } from '@components';
import { useResponsive } from '@hooks';
import { Box, Drawer, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { isActive } from '@utils';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navConfig from '../../nav-config';
import NavSection from './NavSection';

export const DRAWER_WIDTH = 300;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

type Props = {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
};

export default function AppSidebar({ isOpenSidebar, onCloseSidebar }: Props) {
  const { pathname } = useLocation();
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'lg');

  interface SidebarBottomRouter {
    title: string;
    pathname: string;
    icon: keyof typeof IconTypes;
  }

  const sidebarBottomRouter: SidebarBottomRouter[] = [];

  useEffect(() => {
    onCloseSidebar();
  }, [onCloseSidebar, pathname]);

  const activeRootStyle = {
    color: 'white !important',
    bgcolor: '#12163a !important',
    borderLeft: '4px solid #EB5146',
  };

  const renderContent = (
    <Scrollbar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          height: '100%',
        },
        '::-webkit-scrollbar': {
          width: ' 6px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.dark[900],
          borderRadius: '20px',
        },
        '::-webkit-scrollbar-thumb': {
          borderColor: theme.palette.neutral[500],
          borderRadius: '20px',
        },
        '& .simplebar-content::after': {
          content: '""',
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          height: '100%',
          backgroundColor: 'transparent',
          zIndex: 1000,
          position: 'fixed',
          left: DRAWER_WIDTH,
          pointerEvents: 'none',
        },
      }}>
      <Box
        sx={{
          px: 2.5,
          py: 2,
          pl: 4,
          display: 'inline-flex',
          marginBottom: 1,
        }}>
        <Logo />
      </Box>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      {
        <Box mb={2}>
          {sidebarBottomRouter.map((item, index) => {
            const isActiveRoot = isActive(item.pathname, pathname);

            return (
              <Link to={item.pathname} id="referral-and-win" key={index}>
                <Box
                  sx={{
                    paddingInline: 2.2,
                    paddingBlock: 1,
                    ml: 1,
                    borderLeft: '4px solid transparent',
                    borderRadius: 1,
                    color: theme.palette.common.white7,
                    ...(isActiveRoot && activeRootStyle),
                  }}
                  display="flex"
                  alignItems="center"
                  color={theme.palette.common.white7}>
                  <Icon icon={item.icon} size={14} />
                  <Typography
                    variant="subtitle2"
                    color={isActiveRoot ? 'common.white' : 'common.white7'}
                    ml={1}
                    fontWeight="400">
                    {item.title}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>
      }
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH, backgroundColor: 'white' },
          }}>
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              backgroundColor: 'white',
              borderRightStyle: 'dashed',
              backgroundImage: 'url(/assets/backgrounds/sidebar-bg.png)',
              backgroundPosition: 'right bottom',
              backgroundSize: '108%',
              backgroundRepeat: 'no-repeat',
              border: 'none',
              borderRight: '1px solid #D9D9D9',
            },
          }}>
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
