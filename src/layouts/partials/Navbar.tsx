import { Breadcrumb, Icon } from '@components';
import { AppBar, Box, IconButton, Stack, Toolbar } from '@mui/material'; //
import { styled } from '@mui/material/styles';
import AccountPopover from './AccountPopover';

interface NavbarProps {
  onOpenSidebar: () => void;
}

const DRAWER_WIDTH = 272;
export const APPBAR_HEIGHT = 64;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: 'white',
  borderBottomWidth: 2,
  borderBottomColor: '#e8edf6',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
  [theme.breakpoints.down('sm')]: {
    position: 'sticky',
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_HEIGHT,
  borderBottom: '1px solid #e8edf6',
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(0, 5),
  },
}));

const NavBar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}
          id="openCloseSidebar">
          <Icon icon="menu-03" size={20} />
        </IconButton>
        <Box>
          <Breadcrumb />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
};

export default NavBar;
