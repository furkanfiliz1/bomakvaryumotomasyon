import { Form, LoadingButton, fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector, useErrorListener, useResponsive } from '@hooks';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material';
import {
  LoginRequestModel,
  authRedux,
  usePostSessionsAuthenticationCodeMutation,
  usePostSessionsGetSaltMutation,
  usePostSessionsMutation,
  usePostUsersValidateUserEmailMutation,
  usePutUsersUpdatePasswordMutation,
} from '@store';
import yup from '@validation';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { LoginErrorCodes, User } from '@types';

import { SHOULD_PASSWORD_BE_ENCRYPTED } from '@config';
import { encryptPassword, getFromParams } from '@helpers';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';

const initialValues = {
  Identifier: '',
  UserName: '',
  Password: '',
};

export default function Login() {
  const notice = useNotice();
  const theme = useTheme();
  const smDown = useResponsive('down', 'sm');

  const navigate = useNavigate();
  const emailToken = getFromParams('emailToken');
  const returnUrl = getFromParams('returnUrl') ?? '/';

  const [verifyToken, setverifyToken] = useState(emailToken);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordModalCredentials, setPasswordModalCredentials] = useState<LoginRequestModel | null>(null);
  const passwordModalForm = useForm({
    defaultValues: {
      NewPassword: '',
      NewPasswordRepeat: '',
    },
    resolver: yupResolver(
      yup.object({
        NewPassword: fields.password
          .required('Bu alan zorunludur')
          .min(8, 'En az 8 karakterli olmalıdır')
          .max(32, 'En fazla 32 karakterli olmalıdır')
          .label('Yeni Şifre'),
        NewPasswordRepeat: fields.password.required('Bu alan zorunludur').label('Şifre Tekrar'),
      }),
    ),
  });

  const dispatch = useAppDispatch();
  const registeredUser = useAppSelector((state) => state.auth.registeredUser);

  const [loginRequest, { isLoading: loginLoader, error: loginError }] = usePostSessionsMutation();
  const [loginWith2fa, { isLoading: twoFaLoader, error: twoFaError }] = usePostSessionsAuthenticationCodeMutation();
  const [getSalt, { isLoading: isSaltLoader, error: saltError }] = usePostSessionsGetSaltMutation();
  const [emailTokenVerify, { error: emailTokenError, isSuccess: emailTokenIsSuccess }] =
    usePostUsersValidateUserEmailMutation();
  const [resetPassword, { isLoading: isResetPasswordLoading, error: resetPasswordError }] =
    usePutUsersUpdatePasswordMutation();

  useErrorListener(saltError);
  useErrorListener(twoFaError);
  useErrorListener(resetPasswordError);

  useEffect(() => {
    if (loginError && 'data' in loginError) {
      const { data } = loginError;
      notice({
        variant: 'error',
        title: data?.Title,
        message: data?.FriendlyMessage,
        buttonTitle: 'Tamam',
      });
    }
  }, [loginError, notice]);

  const schema = yup.object({
    Identifier: fields.text
      .required('Bu alan zorunludur')
      .label('VKN')
      .meta({ maxLength: 11, autoFocus: true, inputType: 'number' }),
    UserName: fields.text.required('Bu alan zorunludur').label('Kullanıcı Adı / E-Posta'),
    Password: fields.password
      .label('Şifre')
      .min(8, 'En az 8 karakterli olmalıdır')
      .max(32, 'En fazla 32 karakterli olmalıdır'),
  });

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (registeredUser && registeredUser.UserName) {
      form.setValue('UserName', registeredUser.UserName ?? '');
      form.setValue('Identifier', registeredUser.Identifier || '');
    }
  }, [form, registeredUser]);

  const signIn = async (loginObject: LoginRequestModel) => {
    const res = await loginRequest(loginObject);

    if ('error' in res) {
      if ('data' in res.error) {
        switch (res?.error?.data.Code) {
          case LoginErrorCodes.EmailNotVerified:
            navigate('/email-verified', { state: { formValues: loginObject } });
            break;
          default:
            break;
        }
      }
    }
    if ('data' in res) {
      const token = res?.data?.Token || '';
      const user = cloneDeep(res?.data?.User) as User;
      dispatch(authRedux.login({ token, user: { ...user, EncryptPassword: loginObject.Password } }));
      navigate(returnUrl);
    }
  };

  const onSubmit = async (values: LoginRequestModel) => {
    const saltRes = await getSalt({ UserName: values?.UserName, Identifier: values?.Identifier });
    if (!('data' in saltRes)) return;

    const loginObject: LoginRequestModel = {
      ...values,
      Password: encryptPassword(values.Password, saltRes.data),
      IsPasswordEncrypted: SHOULD_PASSWORD_BE_ENCRYPTED,
    };
    const res = await loginWith2fa(loginObject);

    if ('data' in res) {
      if (!res.data?.IsTwoFactorAuthenticationIsActive) {
        signIn(loginObject);
      } else {
        navigate('/two-factor', { state: { values, userPhone: res.data?.UserContact, type: 'login' } });
      }
    } else if ('data' in res.error) {
      switch (res?.error?.data.Code) {
        case LoginErrorCodes.PasswordExpired:
          setPasswordModalCredentials(values);
          setShowPasswordModal(true);
          break;
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (emailTokenIsSuccess) {
      window.history.pushState({}, document.title, '/');
      setverifyToken(null);
      notice({
        variant: 'success',
        title: 'Tebrikler!',
        message: 'Email Adresiniz Doğrulandı.',
        buttonTitle: 'Tamam',
      });
    }
  }, [dispatch, emailTokenIsSuccess, notice]);

  useEffect(() => {
    if (verifyToken) emailTokenVerify({ accessToken: verifyToken });
  }, [emailTokenVerify, verifyToken]);

  useEffect(() => {
    if (emailToken && emailToken !== verifyToken) setverifyToken(emailToken);
  }, [emailToken, verifyToken]);

  useEffect(() => {
    if (emailTokenError && emailToken && verifyToken) {
      window.history.pushState({}, document.title, '/');

      setverifyToken(null);
    }
  }, [emailToken, emailTokenError, verifyToken]);

  const onUpdatePassword = async (values: { NewPassword: string; NewPasswordRepeat: string }) => {
    if (values.NewPassword !== values.NewPasswordRepeat) {
      notice({
        variant: 'error',
        title: 'Başarısız',
        message: 'Şifreler eşleşmiyor',
        buttonTitle: 'Tamam',
      });
      return;
    }

    if (!passwordModalCredentials) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Şifre bilgileri bulunamadı',
        buttonTitle: 'Tamam',
      });
      return;
    }

    const saltRes = await getSalt({
      UserName: passwordModalCredentials.UserName,
      Identifier: passwordModalCredentials.Identifier,
    });

    if (!('data' in saltRes)) return;

    const resetPasswordData = {
      UserName: passwordModalCredentials.UserName,
      Identifier: passwordModalCredentials.Identifier,
      LastPassword: encryptPassword(passwordModalCredentials.Password, saltRes.data),
      NewPassword: encryptPassword(values.NewPassword, saltRes.data),
      IsPasswordEncrypted: SHOULD_PASSWORD_BE_ENCRYPTED,
    };

    const res = await resetPassword(resetPasswordData);

    if ('data' in res) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şifreniz başarıyla güncellenmiştir',
        buttonTitle: 'Tamam',
      });
      setShowPasswordModal(false);
      passwordModalForm.reset();
      setPasswordModalCredentials(null);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          padding: 3,
          pb: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            py: 1,
          }}>
          {/* Logo Container */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1.5,
              borderRadius: 2,
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.palette.grey[100]}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                transform: 'translateY(-1px)',
              },
            }}>
            <img
              src="/assets/logos/logo-dark.svg"
              alt="Figopara | Logo"
              height={32}
              style={{ filter: 'brightness(1.1)' }}
            />
          </Box>

          {/* Portal Title */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.grey[700],
                fontWeight: 500,
                fontSize: '1rem',
                letterSpacing: '0.5px',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, #EB5146, transparent)`,
                  borderRadius: '1px',
                },
              }}>
              Operasyonel Portal
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: smDown ? '90%' : '80%', mt: smDown ? 2 : 0, flex: 1, paddingBlock: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h2" component="div" sx={{ mb: 1 }} color={theme.palette.dark[800]} fontWeight={600}>
            Giriş Yap
          </Typography>
        </Box>
        <Form onSubmit={form.handleSubmit(onSubmit)} form={form} schema={schema}>
          <LoadingButton
            id="LOGIN"
            fullWidth
            size="large"
            type="submit"
            sx={{
              mt: 4,
              background: theme.palette.error[700],
              '&:hover': { background: theme.palette.error[800] },
              '&:disabled': {
                borderColor: theme.palette.error[400],
                backgroundColor: theme.palette.error[400],
                color: '#fff',
              },
            }}
            variant="contained"
            loading={loginLoader || twoFaLoader || isSaltLoader}>
            Giriş Yap
          </LoadingButton>
        </Form>
      </Box>
      <Box></Box>

      {/* Password Update Modal */}
      <Dialog open={showPasswordModal} onClose={() => setShowPasswordModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>Şifre Güncelleme</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, color: theme.palette.grey[600] }}>
            Şifrenizin güncellenmesi gerekmektedir. Lütfen yeni şifrenizi giriniz.
          </Typography>
          <Form
            form={passwordModalForm}
            schema={yup.object({
              NewPassword: fields.password
                .required('Bu alan zorunludur')
                .min(8, 'En az 8 karakterli olmalıdır')
                .max(32, 'En fazla 32 karakterli olmalıdır')
                .label('Yeni Şifre'),
              NewPasswordRepeat: fields.password.required('Bu alan zorunludur').label('Şifre Tekrar'),
            })}
            space={1}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setShowPasswordModal(false);
              passwordModalForm.reset();
              setPasswordModalCredentials(null);
            }}
            variant="outlined">
            İptal
          </Button>
          <LoadingButton
            id="UPDATE_PASSWORD"
            onClick={passwordModalForm.handleSubmit(onUpdatePassword)}
            variant="contained"
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}
            loading={isResetPasswordLoading}>
            Güncelle
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
