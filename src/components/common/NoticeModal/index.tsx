import { IconTypes } from '@components';
import { Dialog } from '@mui/material';
import { FC } from 'react';
import DialogDetail from './_partials/dialogDetail';
import ConfirmDetail from './_partials/confirmDetail';
import { useResponsive } from '@hooks';

export interface NoticeOptions {
  catchOnCancel?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | undefined;
  title?: string | undefined | null;
  message?: string | undefined | null | React.ReactNode;
  buttonTitle?: string;
  icon?: keyof typeof IconTypes | undefined;
  type?: 'confirm' | 'dialog';
  hideButton?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  width?: number;
}

interface NoticeModalProps extends NoticeOptions {
  open: boolean;
}

export const NoticeModal: FC<NoticeModalProps> = (props) => {
  const { open, onClose, type, width } = props;

  const smDown = useResponsive('down', 'sm');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        p: smDown ? 0 : 20,
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            maxHeight: 'inherit',
            width: '100%',
            maxWidth: width || 500, // Set your width here
          },
        },
      }}
      transitionDuration={0}>
      {type === 'confirm' ? <ConfirmDetail {...props} /> : <DialogDetail {...props} />}
    </Dialog>
  );
};
