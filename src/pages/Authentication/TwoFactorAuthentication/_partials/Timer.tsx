import { Ref, forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@components';

export interface TimerMethods {
  resetCountdown: () => void;
}

const Timer = (
  props: {
    onClickSendAgain: () => void;
    type: 'two-factor' | 'reset-password';
    isLoading: boolean;
  },
  ref: Ref<TimerMethods | undefined>,
) => {
  const { onClickSendAgain, type, isLoading } = props;
  const initialCountdown = sessionStorage.getItem('countdown') || 180;
  const [countdown, setCountdown] = useState<number>(Number(initialCountdown));
  const [expired, setExpired] = useState<boolean>(false);
  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    resetCountdown,
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          setExpired(true);
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      sessionStorage.removeItem('countdown');
    };
  }, [countdown]);

  useEffect(() => {
    sessionStorage.setItem('countdown', countdown.toString());
  }, [countdown]);

  const resetCountdown = () => {
    setExpired(false);

    setCountdown(180);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return type === 'two-factor' ? (
    <Box display="flex" alignItems="center">
      {expired ? (
        <LoadingButton
          id="sendAgainCode"
          fullWidth
          size="small"
          variant="text"
          sx={{ marginTop: '24px', textDecoration: 'underline' }}
          loading={isLoading}
          onClick={() => {
            onClickSendAgain();
          }}>
          Tekrar Kod Gönder
        </LoadingButton>
      ) : (
        <Box
          sx={{
            width: '100%',
            justifyContent: 'center',
            display: 'flex',
            marginTop: '16px',
            color: theme.palette.neutral[600],
            textAlign: 'center',
          }}>
          <Typography variant="subtitle3" sx={{ color: theme.palette.neutral[600] }}>
            Tekrar kod almak için kalan süre
            {':'}
          </Typography>
          <Typography variant="subtitle3" sx={{ marginLeft: 1, fontWeight: 600 }}>
            {formatTime(countdown)}
          </Typography>
        </Box>
      )}
    </Box>
  ) : (
    <Box>
      {expired ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          sx={{ marginTop: '48px', textDecoration: 'underline' }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Bağlantıyı almadınız mı?
          </Typography>
          <LoadingButton
            id="sendAgainCode"
            sx={{ marginTop: '24px' }}
            fullWidth
            size="large"
            variant="text"
            loading={isLoading}
            onClick={() => {
              onClickSendAgain();
            }}>
            Tekrar Kod Gönder
          </LoadingButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', marginTop: '24px', color: theme.palette.neutral[600] }}>
          <Typography variant="subtitle3" sx={{ fontWeight: 500 }}>
            Tekrar link almak için kalan süre
            {':'}
          </Typography>
          <Typography variant="subtitle3" sx={{ color: theme.palette.neutral[600], marginLeft: 1, fontWeight: 600 }}>
            {formatTime(countdown)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default forwardRef(Timer);
