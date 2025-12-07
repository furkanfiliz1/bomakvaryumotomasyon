import { Form, LoadingButton, fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useResponsive } from '@hooks';
import { Box, Typography, useTheme } from '@mui/material';
import { authRedux } from '@store';
import yup from '@validation';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const initialValues = {
  UserName: '',
  Password: '',
};

export default function Login() {
  const notice = useNotice();
  const theme = useTheme();
  const smDown = useResponsive('down', 'sm');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    UserName: fields.text.required('Bu alan zorunludur').label('Kullanıcı Adı'),
    Password: fields.password.required('Bu alan zorunludur').label('Şifre'),
  });

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: { UserName: string; Password: string }) => {
    setIsLoading(true);
    try {
      // Test: hardcoded kullanıcı kontrolü
      if (values.UserName === 'furkan' && values.Password === '123456') {
        // Rastgele token oluştur
        const token = `token_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

        // Redux store'a login işlemi yap
        dispatch(
          authRedux.login({
            token,
            user: {
              userName: values.UserName,
              email: 'furkan@example.com',
            },
          }),
        );

        notice({
          variant: 'success',
          title: 'Başarılı',
          message: `Hoşgeldiniz ${values.UserName}!`,
          buttonTitle: 'Tamam',
        });
        navigate('/dashboard');
      } else {
        notice({
          variant: 'error',
          title: 'Başarısız',
          message: 'Kullanıcı adı veya şifre yanlış',
          buttonTitle: 'Tamam',
        });
      }
    } catch (error) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Giriş işlemi sırasında hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setIsLoading(false);
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
              alt="Bom Akvaryum | Logo"
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
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h2" component="div" sx={{ mb: 1 }} color={theme.palette.dark[800]} fontWeight={600}>
            Giriş Yap
          </Typography>
          <Typography variant="body2" color={theme.palette.grey[600]}>
            Hesabınıza giriş yapın
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
            loading={isLoading}>
            Giriş Yap
          </LoadingButton>
        </Form>
      </Box>
      <Box></Box>
    </>
  );
}
