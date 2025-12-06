import { Button, Icon } from '@components';
import { Box, DialogActions, DialogContent, Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import { NoticeOptions } from '..';

const ConfirmDetail: FC<NoticeOptions> = ({
  variant,
  title,
  message,
  icon,
  onClick,
  onClose,
  buttonTitle,
  hideButton,
}) => {
  const theme = useTheme();

  const getIconColor = () => {
    switch (variant) {
      case 'error':
        return theme.palette.error[700];
      case 'primary':
        return theme.palette.primary[900];
      case 'success':
        return theme.palette.success[700];
      case 'warning':
        return theme.palette.warning[700];
      case 'secondary':
        return theme.palette.secondary.dark;
      default:
        return theme.palette.dark[800];
    }
  };
  return (
    <>
      <DialogContent sx={{ display: 'flex', padding: `${theme.spacing(3)} ${theme.spacing(3)}` }}>
        <Box sx={{ mr: 2, mt: 1 }}>
          <Icon icon={icon || 'annotation-info'} fontWeight={700} color={getIconColor()} size={32} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }} color={theme?.palette?.dark?.[900]}>
            {title}
          </Typography>
          <Typography variant="body2" fontWeight={500} color={theme?.palette?.dark?.[700]}>
            {message}
          </Typography>
        </Box>
      </DialogContent>
      {!hideButton && (
        <DialogActions
          sx={{
            display: 'flex',
            padding: `${theme.spacing(0)} ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)}`,
          }}>
          <>
            <Button
              size="small"
              id="onCancelButton"
              color="secondary"
              onClick={onClose}
              autoFocus
              sx={{ mr: 1, fontWeight: 600 }}>
              İptal
            </Button>
            <Button size="medium" id="onOkButton" variant="contained" color={variant} onClick={onClick}>
              {buttonTitle || 'Tamam'}
            </Button>
          </>
        </DialogActions>
      )}
    </>
  );
};

export default ConfirmDetail;
