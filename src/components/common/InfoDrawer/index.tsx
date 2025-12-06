import { Icon } from '@components';
import { Box, Drawer, IconButton, Typography, styled, useTheme } from '@mui/material';
import { Ref, forwardRef, useImperativeHandle, useState } from 'react';

export interface InfoDrawerMethods {
  open: () => void;
}

export interface InfoDrawerProps {
  title?: string;
  children: JSX.Element;
}

const Container = styled(Box)(({ theme }) => ({
  padding: '140px 46px',
  width: 500,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: '40x 24px',
  },
}));

const StyledDrawer = styled(Drawer)(() => ({
  zIndex: 1999,
  '& .MuiDrawer-paper': {
    borderTopLeftRadius: 42,
    borderBottomLeftRadius: 42,
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 30,
  right: 30,
  [theme.breakpoints.down('md')]: {
    top: 20,
    right: 20,
  },
}));

const InfoDrawer = (props: InfoDrawerProps, ref: Ref<InfoDrawerMethods>) => {
  const { title, children } = props;
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <StyledDrawer
      anchor={'right'}
      open={open}
      onClose={() => {
        setOpen(false);
      }}>
      <Container>
        <CloseButton onClick={handleClose} id="closeInfoDrawerButton">
          <Icon icon="x-close" size={30} color={theme.palette.neutral[500]} />
        </CloseButton>
        <Typography sx={{ fontSize: '20px !important' }} variant="h2">
          {title}
        </Typography>
        <Typography sx={{ mt: 2, fontSize: 13 }}>{children}</Typography>
      </Container>
    </StyledDrawer>
  );
};

export default forwardRef(InfoDrawer);
