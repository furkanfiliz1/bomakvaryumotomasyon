import { Button, Icon, InputVerificationCode, LoadingButton, useNotice } from '@components';
import { useAppDispatch, useErrorListener, useResponsive } from '@hooks';
import { Box, Link, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  authRedux,
  usePostSessionsAuthenticationCodeMutation,
  usePostSessionsGetSaltMutation,
  usePostSessionsMutation,
  usePostUsersVerifyMutation,
  usePutUsersResetPasswordMutation,
} from '@store';

import { SHOULD_PASSWORD_BE_ENCRYPTED } from '@config';
import { encryptPassword, getFromParams } from '@helpers';
import { LoginErrorCodes } from '@types';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer, { TimerMethods } from './_partials/Timer';

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  position: 'relative',
  padding: `${theme.spacing(4)} ${theme.spacing(0)}`,
  alignItems: 'center',
  borderRadius: '42px 0 0 42px',
  width: '100%',
}));

declare global {
  interface Window {
    clipboardData: DataTransfer;
  }
}

export default function TwoFactorAuthentication() {
  const smDown = useResponsive('down', 'sm');

  const notice = useNotice();
  const theme = useTheme();
  const { state } = useLocation();
  const { userPhone, type } = state || {};
  const returnUrl = getFromParams('returnUrl') ?? '/';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [verificationCodeValue, setVerificationCodeValue] = useState('');
  const [inputTextColor, setInputTextColor] = useState(theme.palette.neutral[800]);
  const inputErrorColor = theme.palette.error[700];

  const timerRef = useRef<TimerMethods>();

  const [getSalt, { isLoading: isSaltLoader, error: saltError }] = usePostSessionsGetSaltMutation();
  const [loginRequest, { isLoading: loginLoader, error: loginReqError }] = usePostSessionsMutation();
  const [loginWith2Fa, { error: login2FaError, isLoading: loginWith2FaLoading }] =
    usePostSessionsAuthenticationCodeMutation();
  const [verifyRequest, { isLoading: verifyLoader }] = usePostUsersVerifyMutation();
  // Yeniden doğrulama kodu göndermek için kullanıldı
  const [resetPassword, { error: resetPasswordError, isLoading: resetPasswordLoading }] =
    usePutUsersResetPasswordMutation();
  console.log('login2FaError', login2FaError);
  useErrorListener([login2FaError, resetPasswordError, saltError, loginReqError]);

  const onSubmit = async (contractAgreement = {}, AuthenticationCode = '') => {
    const { values: formValues, type } = state;
    if (type === 'login' && contractAgreement) {
      const saltRes = await getSalt({ UserName: formValues?.UserName, Identifier: formValues?.Identifier });
      if (!('data' in saltRes)) return;
      const body = {
        ...formValues,
        ...contractAgreement,
        AuthenticationCode,
        IsPasswordEncrypted: SHOULD_PASSWORD_BE_ENCRYPTED,
        Password: encryptPassword(formValues?.Password, saltRes.data),
      };
      const res = await loginRequest(body);

      if ('data' in res) {
        setInputTextColor(theme.palette.success[700]);
        setTimeout(() => {
          const token = res.data?.Token;
          const user = res.data?.User;
          dispatch(
            authRedux.login({
              token,
              user: { ...user, EncryptPassword: encryptPassword(formValues?.Password, saltRes.data) || '' },
            }),
          );
          navigate(returnUrl);
        }, 1);
      }

      if ('error' in res) {
        setInputTextColor(inputErrorColor);
        if ('data' in res.error) {
          switch (res.error?.data.Code) {
            case LoginErrorCodes.EmailNotVerified:
              navigate('/email-verified', {
                state: {
                  formValues: {
                    ...formValues,
                    Password: encryptPassword(formValues?.Password, saltRes.data),
                  },
                },
              });
              break;

            default:
              break;
          }
        }
      }
    } else {
      const res = await verifyRequest({
        ...formValues,
        VerificationCode: AuthenticationCode,
      });

      if ('data' in res) {
        setInputTextColor(theme.palette.success[700]);
        setTimeout(() => {
          const url = new URL(res.data?.SiteUrl || '');
          const accessToken = url.searchParams.get('accessToken');
          dispatch(authRedux.setAccessToken(accessToken || ''));
          navigate('/renew-password', { state: { formValues } });
        }, 1);
      }
      if ('error' in res) {
        setInputTextColor(theme.palette.error[700]);
      }
    }
  };

  const handleSendAgainCode = async () => {
    const { values: formValues, type } = state;
    if (type === 'login') {
      const saltRes = await getSalt({ UserName: formValues?.UserName, Identifier: formValues?.Identifier });
      if (!('data' in saltRes)) return;
      const loginReqBody = {
        ...formValues,
        IsPasswordEncrypted: SHOULD_PASSWORD_BE_ENCRYPTED,
        Password: encryptPassword(formValues?.Password, saltRes.data),
      };

      const res = await loginWith2Fa(loginReqBody);
      if ('data' in res) {
        timerRef.current?.resetCountdown();
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Doğrulama kodunuz yeniden gönderildi.',
          buttonTitle: 'Tamam',
        });
      }
    } else {
      const loginReqBody = {
        ...formValues,
        IsPasswordEncrypted: false,
        Password: formValues?.Password,
      };
      const res = await resetPassword(loginReqBody);
      if ('data' in res) {
        timerRef.current?.resetCountdown();
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Doğrulama kodunuz yeniden gönderildi.',
          buttonTitle: 'Tamam',
        });
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          padding: 2,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Box width="64px">
          <Button
            id="backButton"
            size="small"
            sx={{ p: 0 }}
            onClick={() => {
              if (type === 'login') {
                navigate('/');
              } else {
                navigate('/forgot-password');
              }
            }}>
            {' '}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Icon icon="chevron-left" size={16} color={theme.palette.neutral[600]} />
              <Typography variant="subtitle2" sx={{ ml: 0.2 }} color={theme.palette.neutral[600]}>
                Geri
              </Typography>
            </Box>
          </Button>
        </Box>
        <img src="/assets/logos/logo-dark.svg" alt="Figopara | Logo" height={27} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ ml: 0.2 }} fontWeight={600} color={theme.palette.neutral[600]}>
            2
          </Typography>
          <Typography variant="subtitle2" sx={{ ml: 0.2 }} fontWeight={500} color={theme.palette.neutral[500]}>
            / {type === 'login' ? '2' : '3'}
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '4px',
            background: theme.palette.grey.A300,
          }}>
          <Box
            sx={{
              width: `${type === 'login' ? '100' : '66'}%`,
              height: '100%',
              background: theme.palette.primary[700],
              transition: '1s',
            }}></Box>
        </Box>
      </Box>
      <ContentStyle>
        <Box sx={{ maxWidth: smDown ? '90%' : '85%' }}>
          <Typography variant="h4">
            {type === 'forgot-password' ? 'Doğrulama Kodunu Gir' : 'Figopara Giriş Yap'}
          </Typography>
          <Typography variant="subtitle3" style={{ marginBottom: '48px', color: theme.palette.dark[700] }}>
            Altı haneli doğrulama kodunu <b>{userPhone}</b> numaralı telefonunuza gönderdik.
            {type === 'forgot-password' && (
              <Link style={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/forgot-password')}>
                Telefonu düzenle.
              </Link>
            )}
          </Typography>
          <Box mt={6}>
            <InputVerificationCode
              color={inputTextColor}
              onChange={(text) => {
                setVerificationCodeValue(text);

                setInputTextColor(theme.palette.neutral[800]);

                if (text.length === 6) {
                  onSubmit({}, text);
                }
              }}
            />

            <LoadingButton
              id="sendCode"
              onClick={() => inputTextColor !== inputErrorColor && onSubmit({}, verificationCodeValue)}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ mt: 8 }}
              disabled={verificationCodeValue.length !== 6}
              loading={loginLoader || verifyLoader || isSaltLoader}>
              Doğrula
            </LoadingButton>
            <Timer
              ref={timerRef}
              onClickSendAgain={handleSendAgainCode}
              type="two-factor"
              isLoading={loginWith2FaLoading || resetPasswordLoading || isSaltLoader}
            />
          </Box>
        </Box>
      </ContentStyle>
    </>
  );
}
