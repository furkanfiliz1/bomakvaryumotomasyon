import { useResponsive } from '@hooks';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

interface AccountPopoverAvatar {
  title: string;
  description: string;
  avatarText: string;
  isShow: boolean | null;
  open: Element | null;
}

const AccountPopoverAvatar: FC<AccountPopoverAvatar> = ({ title, description, avatarText, isShow, open }) => {
  const theme = useTheme();
  const smDown = useResponsive('down', 'sm');

  const sxStyles = {
    p: 0,
    border: 0,
    ...(open
      ? {
          '&:before': {
            zIndex: 1,
            content: "''",
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'absolute',
          },
        }
      : {}),
  };

  const wrapperStyles = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '150px',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: smDown ? 'column' : 'row' }}>
      <Box display="flex">
        <Avatar
          sx={{
            ...sxStyles,
            backgroundColor: '#6D98F5',
            width: 32,
            height: 32,
            fontSize: '12px',
            zIndex: 2,
          }}>
          {avatarText}
        </Avatar>

        {isShow ? null : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: 1.5, pr: 1 }}>
            <Typography
              title={title}
              sx={{
                ...wrapperStyles,
              }}
              color={theme.palette.dark[800]}
              variant="subtitle3"
              fontWeight={500}>
              {title}
            </Typography>
            <Typography
              color={theme.palette.neutral[600]}
              title={description}
              variant="subtitle4"
              sx={{
                ...wrapperStyles,
              }}>
              {description}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AccountPopoverAvatar;
