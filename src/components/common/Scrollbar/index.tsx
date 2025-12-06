import SimpleBarReact from 'simplebar-react';
import { alpha, styled } from '@mui/material/styles';
import { Box, SxProps, Theme } from '@mui/material';
import { PropsWithChildren } from 'react';

const RootStyle = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
}));

const SimpleBarStyle = styled(SimpleBarReact)(({ theme }) => ({
  height: '100%',
  '& .simplebar-wrapper': {
    height: '100%',
  },
  '& .simplebar-offset': {
    height: '100%',
  },
  '& .simplebar-content-wrapper': {
    height: '100% !important',
    overflow: 'hidden !important',
  },

  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha(theme.palette.neutral[600], 0.48),
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    //height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
    height: '100%',
  },
  '& .simplebar-placeholder': {
    display: 'none',
  },
}));

interface Props {
  sx?: SxProps<Theme>;
}

const Scrollbar = (props: PropsWithChildren<Props>) => {
  const { children, sx, ...other } = props;

  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <RootStyle>
      <SimpleBarStyle clickOnTrack={false} sx={sx} {...other}>
        {children}
      </SimpleBarStyle>
    </RootStyle>
  );
};

export default Scrollbar;
