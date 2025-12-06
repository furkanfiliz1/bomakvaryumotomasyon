import { Card, styled, useTheme, Typography, Box } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { Button, Modal, ModalMethods, useNotice } from '@components';
import { useRef } from 'react';
import { useSnackbar } from 'notistack';

const DesignGuideModal = () => {
  const theme = useTheme();
  const notice = useNotice();
  const { enqueueSnackbar } = useSnackbar();

  const basicModalRef = useRef<ModalMethods>(null);

  const ButtonCard = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const ButtonCardTitle = styled(Typography)(() => ({
    marginBottom: theme.spacing(1),
  }));

  const actions = [
    {
      element: () => (
        <Box textAlign="left">
          <Button
            id="x"
            variant="text"
            sx={{ mr: 1 }}
            onClick={() => {
              basicModalRef.current?.close();
            }}>
            Kapat
          </Button>
          <Button
            id="xx"
            variant="contained"
            sx={{ mr: 1 }}
            onClick={() => {
              basicModalRef.current?.close();
            }}>
            Tamam
          </Button>
        </Box>
      ),
    },
  ];

  const openDialog = (
    variant: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | undefined,
    type: 'dialog' | 'confirm' = 'dialog',
  ) => {
    notice({
      variant,
      type,
      title: 'Başlık',
      message: 'Dialog Message',
      buttonTitle: 'Tamam',
    });
  };

  const openSnackbar = (variant: 'success' | 'error' | 'warning' | 'default' | 'info' | undefined) => {
    enqueueSnackbar(variant, { variant });
  };

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader hideFigmaLink title="Button" muiLink="https://mui.com/material-ui/react-modal/" />
      <ButtonCard>
        <ButtonCardTitle>Basic Modal</ButtonCardTitle>
        <Box>
          <Button variant="contained" onClick={() => basicModalRef?.current?.open()} id="">
            Basit Modal
          </Button>
        </Box>
        <Modal ref={basicModalRef} title="Modal Başlık" actions={actions}>
          <Box>Modal İçerik</Box>
        </Modal>
      </ButtonCard>
      <ButtonCard>
        <ButtonCardTitle>Mesaj Modalları </ButtonCardTitle>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" color="success" onClick={() => openDialog('success')} id="">
            Başarılı{' '}
          </Button>
          <Button variant="contained" color="error" onClick={() => openDialog('error')} id="">
            Başarısız{' '}
          </Button>
          <Button variant="contained" color="warning" onClick={() => openDialog('warning')} id="">
            Uyarı{' '}
          </Button>
        </Box>
      </ButtonCard>

      <ButtonCard>
        <ButtonCardTitle>Onaylama Modalları </ButtonCardTitle>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" color="success" onClick={() => openDialog('success', 'confirm')} id="">
            Başarılı{' '}
          </Button>
          <Button variant="contained" color="error" onClick={() => openDialog('error', 'confirm')} id="">
            Başarısız{' '}
          </Button>
          <Button variant="contained" color="warning" onClick={() => openDialog('warning', 'confirm')} id="">
            Uyarı{' '}
          </Button>
        </Box>
      </ButtonCard>
      <ButtonCard>
        <DesignGuideHeader hideFigmaLink title="Snackbar" muiLink="https://mui.com/material-ui/react-snackbar/" />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" color="success" onClick={() => openSnackbar('success')} id="">
            Başarılı{' '}
          </Button>
          <Button variant="contained" color="error" onClick={() => openSnackbar('error')} id="">
            Başarısız{' '}
          </Button>
          <Button variant="contained" color="warning" onClick={() => openSnackbar('warning')} id="">
            Uyarı{' '}
          </Button>
        </Box>
      </ButtonCard>
    </Card>
  );
};

export default DesignGuideModal;
