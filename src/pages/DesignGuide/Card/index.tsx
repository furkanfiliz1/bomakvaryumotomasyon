import { Box, Card, Divider, Grid, Tooltip, Typography, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { Icon } from '@components';
import { formatTurkishCurrency } from '@utils';
import { useResponsive } from '@hooks';

const DesignGuideCard = () => {
  const theme = useTheme();
  const smDown = useResponsive('down', 'sm');

  const IconBox = styled(Box)(({ theme }) => ({
    width: 34,
    height: 34,
    background: theme.palette.primary[700],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  }));

  const LoadingBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const CardTitle = styled(Typography)(() => ({
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  }));

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Kart" hideMuiLink>
        Tüm sayfalarda kullanılan kartlar.
        <br />
      </DesignGuideHeader>

      <LoadingBox>
        <CardTitle>Alıcı& Finansör Dashboard Kart</CardTitle>
        <Divider sx={{ marginBlock: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => {
            return (
              <Grid item md={4} key={i}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h5">Ek Kazanç</Typography>
                    <Tooltip title="Ek kazanç açıklaması" sx={{ mt: 0.35, ml: 0.5 }}>
                      <Box>
                        <Icon icon="info-square" size={21} color={theme.palette.primary[700]} />
                      </Box>
                    </Tooltip>
                  </Box>
                  <Divider />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">{formatTurkishCurrency(100)}</Typography>
                    <Typography variant="body6">Toplam Kazanç</Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </LoadingBox>

      <LoadingBox>
        <CardTitle>Alıcı Dashboard Kart</CardTitle>
        <Divider sx={{ marginBlock: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5].map((i) => {
            return (
              <Grid item lg={2.4} md={3} sm={6} xs={12} key={i}>
                <Card
                  id={`OWERVIEW_REQUESTS_${String(i)}`}
                  sx={{
                    flex: 1,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      cursor: 'pointer',
                      '& .hovered-text': {
                        textDecoration: 'underline',
                      },
                    },
                  }}>
                  <Icon
                    style={{
                      minWidth: 50,
                      minHeight: 50,
                      maxWidth: 50,
                      maxHeight: 50,
                      marginLeft: 2,
                      marginRight: 14,
                      backgroundColor: theme.palette.success[100],
                      padding: 14,
                      borderRadius: 10,
                    }}
                    icon="clipboard-check"
                    color={theme.palette.success[600]}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      className="hovered-text"
                      variant="caption"
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipses' }}>
                      Teklif Sürecinde
                    </Typography>
                    <Typography fontWeight={600} variant="h5">
                      {50 || '0'}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </LoadingBox>

      <LoadingBox>
        <CardTitle>Alıcı& finansör & Taleplerim - Fatura Talepleri Dashboard Kart</CardTitle>
        <Divider sx={{ marginBlock: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => {
            return (
              <Grid key={i} item lg={4} md={4} sm={12} xs={12}>
                <Card sx={{ p: 2.5 }}>
                  <Typography sx={{ mb: 2 }}>Genel Durum</Typography>
                  <Typography fontWeight={700} fontSize={24}>
                    {formatTurkishCurrency(50)}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </LoadingBox>

      <LoadingBox>
        <CardTitle>Çek İşlemler Tablo üstündeki kartlar</CardTitle>
        <Divider sx={{ marginBlock: 2 }} />
        <Card
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: smDown ? 'column' : 'row',
          }}>
          <Typography>Toplam Çek / Tutar</Typography>
          <Typography fontWeight={700}>{`0 Çek / ${formatTurkishCurrency(0)} `}</Typography>
        </Card>
      </LoadingBox>
      <LoadingBox>
        <CardTitle>Genel olarak sayfalarda kullanılan bilgi kartları </CardTitle>
        <Divider sx={{ marginBlock: 2 }} />
        <Card sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center' }}>
          <IconBox>
            <Icon icon="bell-ringing-01" size={20} color={theme.palette.common.white} />
          </IconBox>
          <Typography variant="body1" sx={{ ml: 2 }}>
            Lorem Ipsum is simpunknown printer took a galley of type and scrambled it to make a
          </Typography>
        </Card>
      </LoadingBox>
    </Card>
  );
};

export default DesignGuideCard;
