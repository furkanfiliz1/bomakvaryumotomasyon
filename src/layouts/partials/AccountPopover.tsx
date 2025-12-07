import { MouseEventHandler, useMemo, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Divider, IconButton, MenuItem, Stack, Typography, useTheme } from '@mui/material';

import { Icon, MenuPopover } from '@components';

import { useAppDispatch, useResponsive } from '@hooks';
import { authRedux } from '@store';
import { IconTypes } from 'src/components/common/Icon/types';
import AccountPopoverAvatar from './AccountPopoverAvatar';

type Icon = keyof typeof IconTypes;
interface MenuOption {
  icon: Icon;
  label: string;
  linkTo: string;
  hidden?: boolean;
}

export default function AccountPopover() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const smDown = useResponsive('down', 'sm');
  const theme = useTheme();

  const MENU_OPTIONS: MenuOption[] = useMemo(
    () => [
      {
        label: 'Kullanıcı Ayarları',
        icon: 'user-circle',
        linkTo: 'users-settings',
      },
      {
        label: 'Entegrasyonlar',
        icon: 'intersect-circle',
        linkTo: '/integrations',
      },
      {
        label: 'Belgeler',
        icon: 'folder',
        linkTo: 'documents',
      },
      {
        label: 'Duyurular',
        icon: 'announcement-01',
        linkTo: 'announcements',
      },
      {
        label: 'Ayarlar',
        icon: 'settings-01',
        linkTo: 'settings',
      },
    ],
    [],
  );

  const anchorRef = useRef(null);

  const [open, setOpen] = useState<Element | null>(null);

  const handleOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
    setOpen(e.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const logout = async () => {
    navigate({
      pathname: '/login',
    });
    dispatch(authRedux.logout());
  };

  const FirstName = 'bom';
  const LastName = '';
  const userFullName = `${FirstName} ${LastName}`;
  const avatarText = `${FirstName[0] ?? ''}${LastName[0] ?? ''}`;

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleOpen} id={'account'} sx={{ ':hover': { background: 'transparent' } }}>
        <AccountPopoverAvatar
          title={userFullName}
          description={''}
          avatarText={avatarText}
          isShow={smDown}
          open={open}
        />
        {!smDown ? <Icon icon="chevron-down" size={24} /> : null}
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,

          '& .MuiPaper-root': {
            borderRadius: 2,
          },
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}>
        {/* <Box sx={{ my: 1.5, px: 2.5 }}>
          <LanguagePopover />
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <Stack sx={{ p: 2, pb: 1 }}>
          <AccountPopoverAvatar
            title={userFullName}
            description={''}
            avatarText={avatarText}
            isShow={false}
            open={open}
          />

          <Divider sx={{ pt: 1 }} />

          {MENU_OPTIONS.map((option) => {
            if (option.hidden) return null;
            return (
              <MenuItem
                sx={{ p: 1 }}
                key={option.label}
                to={option.linkTo}
                component={RouterLink}
                onClick={handleClose}
                id={option.linkTo}>
                <Icon style={{ width: 20, marginRight: 8 }} color={theme.palette.neutral[500]} icon={option.icon} />
                <Typography variant="body2" fontWeight={500} color={theme.palette.dark[800]}>
                  {option.label}
                </Typography>
              </MenuItem>
            );
          })}

          <Divider />
          <MenuItem sx={{ p: 1 }} onClick={logout} id={'exit'}>
            <Icon style={{ width: 20, marginRight: 8 }} color={theme.palette.neutral[500]} icon="log-out-01" />
            <Typography variant="body2" fontWeight={500} color={theme.palette.dark[800]}>
              Çıkış
            </Typography>
          </MenuItem>
        </Stack>
      </MenuPopover>
    </>
  );
}
