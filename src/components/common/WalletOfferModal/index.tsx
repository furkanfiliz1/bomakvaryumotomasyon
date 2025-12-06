import { Checkbox, Modal, ModalMethods, LoadingButton } from '@components';
import { useErrorListener, useUser } from '@hooks';
import { Box, Typography, useTheme, FormControlLabel } from '@mui/material';
import { usePutCompanyWalletShowWalletMessageByIdMutation } from '@store';
import { Ref, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface IProps {
  createWalletAccountLoading: boolean;
  onGeneratePay?: () => void;
  onOpenWalletAccount: () => void;
  type: 'wallet' | 'payment';
}

export interface WalletOfferModalMethods {
  open: () => void;
  close: () => void;
}

const WalletOfferModal = (props: IProps, ref: Ref<WalletOfferModalMethods>) => {
  const { onGeneratePay, createWalletAccountLoading, onOpenWalletAccount, type } = props;
  const theme = useTheme();
  const user = useUser();
  const offerModalRef = useRef<ModalMethods>(null);
  const [isDontShowAgain, setIsDontShowAgain] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      offerModalRef?.current?.open();
    },
    close: () => {
      offerModalRef?.current?.close();
    },
  }));

  const [setShowOfferModal, { error: setShowOfferModalError, isLoading: setShowOfferModalLoading }] =
    usePutCompanyWalletShowWalletMessageByIdMutation();

  useErrorListener([setShowOfferModalError]);

  const onSetShowOfferModal = async () => {
    const payload = {
      id: user?.CompanyId || 0,
      IsActive: !isDontShowAgain,
    };
    const res = await setShowOfferModal({ id: user?.CompanyId || 0, companyShowWalletMessageRequestModel: payload });
    if ('data' in res) {
      offerModalRef?.current?.close();
      setIsDontShowAgain(false);
      onGeneratePay && onGeneratePay();
    }
  };

  const actions = [
    {
      element: () => (
        <Box textAlign="left">
          <LoadingButton
            id="offerModalNo"
            loading={setShowOfferModalLoading}
            variant="text"
            color="error"
            sx={{ mr: 1 }}
            onClick={() => {
              if (isDontShowAgain) {
                onSetShowOfferModal();
              } else {
                offerModalRef.current?.close();
                onGeneratePay && onGeneratePay();
              }
            }}>
            Hayır
          </LoadingButton>
          <LoadingButton
            id="offerModalYes"
            loading={createWalletAccountLoading}
            onClick={() => onOpenWalletAccount()}
            variant="contained">
            Evet
          </LoadingButton>
        </Box>
      ),
    },
  ];

  return (
    <Modal
      maxWidth="sm"
      title="Cüzdan Teklifi"
      ref={offerModalRef}
      actions={actions}
      onClose={() => {
        setIsDontShowAgain(false);
      }}>
      <Typography mb={2} variant="body2">
        Figopara cüzdan hesabı açarak alacak ve ödemelerinizi daha kolay bir şekilde yönetebilirsiniz.
      </Typography>
      <Box sx={{ padding: theme.spacing(1) }} display="flex" alignItems="center">
        <Box>
          <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.dark[800], borderRadius: '100%', mr: 1 }} />
        </Box>
        <Box>
          <Typography variant="body2">
            Hesap açmak için{' '}
            <Link to="/settings/payment-info" target="_blank">
              ödeme bilgilerinizi
            </Link>{' '}
            doldurmanız gerekmektedir.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ padding: theme.spacing(1) }} display="flex" alignItems="center">
        <Box>
          <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.dark[800], borderRadius: '100%', mr: 1 }} />
        </Box>
        <Box>
          <Typography variant="body2">Cüzdanınıza bakiye yükleyerek ödemelerinizi gerçekleştirebilirsiniz.</Typography>
        </Box>
      </Box>
      <Box sx={{ padding: theme.spacing(1) }} display="flex" alignItems="center">
        <Box>
          <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.dark[800], borderRadius: '100%', mr: 1 }} />
        </Box>
        <Box>
          <Typography variant="body2">
            Cüzdan hesabınızla alacaklarınızı faktoring şirketi veya bankaya satabilirsiniz.
          </Typography>
        </Box>
      </Box>
      {type === 'payment' ? (
        <FormControlLabel
          onChange={(__, checked: boolean) => {
            setIsDontShowAgain(checked);
          }}
          checked={isDontShowAgain}
          control={<Checkbox size="small" />}
          label={<Typography variant="body2">Bu mesajı bir daha gösterme</Typography>}
        />
      ) : null}
    </Modal>
  );
};

export default forwardRef(WalletOfferModal);
