/* eslint-disable @typescript-eslint/no-explicit-any */
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { Checkbox, useNotice } from '@components';
import { Box, Divider, FormControlLabel, IconButton, SxProps, Theme, Typography, useTheme } from '@mui/material';
import { FC, PropsWithChildren, ReactNode, Ref, forwardRef, useImperativeHandle, useState } from 'react';
import Icon from '../Icon';
import { NoticeOptions } from '../NoticeModal';

export interface ModalProps {
  title?: string;
  children?: ReactNode | ReactNode[];
  actions?: { element: (checked?: boolean) => JSX.Element }[] | undefined;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
  subtitle?: string;
  CustomHeader?: FC;
  fullScreen?: boolean;
  dialogContentStyle?: SxProps;
  sx?: SxProps<Theme>;
  onScroll?: (e: unknown) => void;
  checkbox?: string;
  modalHeight?: string;
  actionDivider?: boolean;
  actionPosition?: string;
  initiallyOpen?: boolean;
  disableBackClick?: boolean;
  confirm?: NoticeOptions;
  hideCloseButton?: boolean;
  disabledModalHeader?: boolean;
  fullWidth?: boolean;
}

export interface ModalMethods {
  open: (data?: never) => void;
  close: () => void;
}

const Modal = (props: PropsWithChildren<ModalProps>, ref: Ref<ModalMethods>) => {
  const {
    title,
    children,
    actions,
    maxWidth = 'md',
    subtitle,
    onClose,
    CustomHeader,
    fullScreen,
    dialogContentStyle,
    onScroll,
    checkbox,
    modalHeight,
    sx = {},
    actionDivider = false,
    actionPosition = 'flex-end',
    initiallyOpen = false,
    disableBackClick = false,
    confirm = undefined,
    hideCloseButton = false,
    disabledModalHeader = false,
    fullWidth = true,
  } = props;
  const [open, setOpen] = useState(initiallyOpen);
  const [checked, setChecked] = useState(false);
  const notice = useNotice();

  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    open: () => {
      setChecked(false);
      setOpen(true);
    },
    close: () => setOpen(false),
  }));

  const handleClose = () => {
    const close = () => {
      setOpen(false);
      onClose && onClose();
    };

    if (confirm) {
      notice({
        type: 'confirm',
        variant: 'warning',
        catchOnCancel: true,
        title: 'Uyarı',
        message: 'İşlemi onaylıyor musunuz?',
        buttonTitle: 'Kabul Et',
        icon: 'alert-triangle',
        ...confirm,
      }).then(close);
    } else {
      close();
    }
  };

  console.log('maxWidth', maxWidth);

  return (
    <Dialog
      disableEscapeKeyDown
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={disableBackClick ? undefined : handleClose}
      aria-labelledby="bomakvaryum_base_modal"
      PaperProps={{
        style: {
          height: modalHeight,
          backgroundColor: 'white',
          boxShadow: theme.customShadows.z8,
          maxWidth: '100%',
        },
      }}
      sx={{
        '& .MuiDialog-paperFullScreen': {
          borderRadius: 0,
        },
        ...sx,
      }}
      open={open}>
      {disabledModalHeader ? null : (
        <DialogTitle variant="h5" sx={{ borderRadius: 0 }}>
          {CustomHeader ? <CustomHeader /> : null}
          {title}
          {subtitle && (
            <Typography variant="body2" mt={1}>
              {subtitle}
            </Typography>
          )}
          {!hideCloseButton && (
            <IconButton
              id={'closeModal'}
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 14,
                color: (theme) => theme.palette.grey[500],
              }}>
              <Icon icon="x-close" size={20} />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <Divider />
      <DialogContent sx={dialogContentStyle} onScroll={onScroll}>
        {children}
      </DialogContent>
      {actionDivider && <Divider />}
      {actions && (
        <DialogActions
          sx={{ borderTop: '1px solid #e7e2e2', display: 'flex', justifyContent: 'space-between', pl: 2.5 }}>
          {checkbox && (
            <FormControlLabel
              onChange={(e) => {
                const event = e?.target as any;
                setChecked(event?.checked);
              }}
              control={<Checkbox />}
              label={checkbox}
              id={checkbox}
            />
          )}
          <Box sx={{ flex: 1, whiteSpace: 'nowrap', display: 'flex', justifyContent: actionPosition, pr: 2, pb: 1 }}>
            {actions?.map((item: { element: (checked: any) => JSX.Element }, index: number) => (
              <item.element key={index} checked={checked} />
            ))}
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default forwardRef(Modal);
