import { Button } from '@components';
import Close from '@mui/icons-material/Close';
import { Box, DialogActions, DialogContent, Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import { NoticeOptions } from '..';

const DialogDetail: FC<NoticeOptions> = ({ variant, title, message, onClick, buttonTitle, onClose, hideButton }) => {
  const theme = useTheme();

  const getImage = () => {
    switch (variant) {
      case 'error':
        return '/assets/icons/error.png';
      case 'warning':
        return '/assets/icons/warning.png';
      default:
        return '/assets/icons/success.png';
    }
  };

  return (
    <>
      <DialogContent
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: `${theme.spacing(5)} ${theme.spacing(5)}`,
        }}
        id="dialog_modal_body">
        <Button
          id="closeDialogModalButton"
          color="secondary"
          onClick={() => onClose && onClose()}
          sx={{
            position: 'absolute',
            right: 0,
            top: '13px',
          }}>
          <Close />
        </Button>
        <Box mb={1}>
          <img src={getImage()} alt="Bom Akvaryum Small Logo" width={80} />
        </Box>

        <Typography
          variant="h5"
          sx={{ marginBlock: 2 }}
          color={theme?.palette?.dark?.[900]}
          textAlign="center"
          id="dialog_modal_title">
          {title}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={500}
          color={theme?.palette?.dark?.[700]}
          textAlign="center"
          id="dialog_modal_description">
          {message}
        </Typography>
      </DialogContent>
      {!hideButton && (
        <DialogActions
          sx={{
            display: 'flex',
            padding: `${theme.spacing(0)} ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)}`,
          }}>
          <Box display="flex" width="100%" justifyContent="center">
            <Button size="medium" id="onOkButton" variant="contained" color="primary" onClick={onClick}>
              {buttonTitle || 'Tamam'}
            </Button>
          </Box>
        </DialogActions>
      )}
    </>
  );
};

export default DialogDetail;
